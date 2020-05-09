from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support.expected_conditions import presence_of_element_located
import time
import requests
import json
import csv
from os import path, makedirs
import pandas as pd


def current_milli_time(): return int(round(time.time() * 1000))


class InstagramHelper:

    def __init__(self):
        self.CUSTOM_JS_LINK = "https://test.pishangujeniya.com/InstagramHelper.js"
        self.INSTAGRAM_USERNAME = ""
        self.INSTAGRAM_PASSWORD = ""
        self.CHROME_DRIVER_PATH = "C:/Program Files (x86)/chrome_driver/chromedriver.exe"
        self.CHROME_TEMP_USER_DIRECTORY = "C:\chrome_user_data"
        self.PAGE_LOAD_WAIT_TIME = 30000
        self.MESSAGES_ID_CSV_DIRECTORY_PATH = "./CSV/"
        self.MESSAGES_ID_CSV_FILE_NAME = "messages_ids.csv"
        self.DELETED_MESSAGES_ID_CSV_FILE_NAME = "deleted_messages_ids.csv"
        self.THREAD_ID = "340282366841710300949128118779027450720"
        from selenium.webdriver.chrome.options import Options
        chrome_options = Options()
        chrome_options.add_argument("--user-data-dir=" + self.CHROME_TEMP_USER_DIRECTORY)
        chrome_options.add_argument("--disable-web-security")
        self.driver = webdriver.Chrome(self.CHROME_DRIVER_PATH, options=chrome_options)
        self.driver.implicitly_wait(self.PAGE_LOAD_WAIT_TIME)
        self.DEFAULT_APP_ID_NAME = "instagramWebFBAppId"
        self.APP_ID_VARIABLE_NAMES = {
            "instagramFBAppId": "",
            "instagramWebFBAppId": "",
            "instagramWebDesktopFBAppId": "",
            "igLiteAppId": ""
        }
        self.MESSAGES_ID = []
        makedirs(path.join(self.MESSAGES_ID_CSV_DIRECTORY_PATH), exist_ok=True)
        self.driver.get("https://instagram.com")
        self.get_instagram_app_ids()

    def login(self, username: str, password: str):
        self.driver.get("https://instagram.com")
        self.driver.find_element_by_name("username").send_keys(username)
        self.driver.find_element_by_name("password").send_keys(password + Keys.RETURN)
        time.sleep(5)

    def logout(self):
        self.driver.execute_script("sessionStorage.clear();")
        self.driver.delete_all_cookies()
        time.sleep(1)
        self.driver.get("https://instagram.com")

    def get_cookie_string(self):
        return self.driver.execute_script("return document.cookie")

    def get_cookie_value(self, key_name: str):
        cookies = self.driver.get_cookies()
        # print(cookies)
        for cookie in cookies:
            if cookie['name'] == key_name:
                return cookie['value']

    def get_session_storage(self, key_name: str):
        return self.driver.execute_script("return sessionStorage.getItem('" + key_name + "')")

    def get_local_storage(self, key_name: str):
        return self.driver.execute_script("return localStorage.getItem('" + key_name + "')")

    def get_instagram_app_ids(self):
        headers = {
            'authority': 'www.instagram.com',
            'pragma': 'no-cache',
            'cache-control': 'no-cache',
            'origin': 'https://www.instagram.com',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36 Edg/81.0.416.72',
            'accept': '*/*',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'script',
            'referer': 'https://www.instagram.com/',
            'accept-language': 'en-US,en;q=0.9',
            'cookie': self.get_cookie_string(),
        }

        response = requests.get('https://www.instagram.com/static/bundles/es6/ConsumerLibCommons.js/759be62fac48.js',
                                headers=headers)

        for key in self.APP_ID_VARIABLE_NAMES.keys():
            response_body = str(response.content)
            search_string = (key + r"=\'")
            index_of_searched_string_variable_name = response_body.find(search_string)
            value_data = response_body[(index_of_searched_string_variable_name + len(search_string)):]
            single_app_id_value = value_data[: value_data.find(r"\'")]
            self.APP_ID_VARIABLE_NAMES[key] = single_app_id_value

        return self.APP_ID_VARIABLE_NAMES

    def load_remote_js(self, js_file_link: str):
        custom_script = 'var my_awesome_script = document.createElement("script");my_awesome_script.setAttribute("src","' + js_file_link + "?" + str(
            current_milli_time()) + '");document.head.appendChild(my_awesome_script);'
        self.driver.execute_script(custom_script)
        time.sleep(1)

    def load_custom_js(self, js_file_path: str):
        f = open(js_file_path, "r")
        if f.mode == 'r':
            contents = f.read()
            js_file_contents = str(contents)
            custom_script = "var my_awesome_script=document.createElement('script');my_awesome_script.setAttribute('type','text/javascript');my_awesome_script.innerHTML=\"" + js_file_contents + "\";document.head.appendChild(my_awesome_script);"
            self.driver.execute_script(custom_script)
        time.sleep(1)

    def get_messages_js(self, thread_id: str):
        custom_script = "var ig=new InstagramHelper();ig.stopGettingMessages=false;var getMessages=await ig.getAllMessageIds('" + str(
            thread_id) + "');return getMessages;"
        return self.driver.execute_script(custom_script)

    def export_messages_ids_js(self):
        custom_script = "var ig=new InstagramHelper();return ig.exportMessagesIds();"
        return self.driver.execute_script(custom_script)

    def export_messages_ids_js_csv(self):
        messages_ids = self.export_messages_ids_js()
        output_path_final = path.join(
            self.MESSAGES_ID_CSV_DIRECTORY_PATH,
            self.THREAD_ID + '_' + str(current_milli_time()) + '.csv')
        df = pd.DataFrame({"messages_id": messages_ids})
        df.to_csv(output_path_final)

    def delete_messages_js(self, thread_id: str):
        custom_script = "var ig=new InstagramHelper();ig.stopDeletingMessages=false;var deleteMessages=await ig.deleteAllMessages('" + str(
            thread_id) + "');return deleteMessages;"
        return self.driver.execute_script(custom_script)

    def export_deleted_messages_ids_js(self):
        custom_script = "var ig=new InstagramHelper();return ig.exportDeletedMessagesIds();"
        return self.driver.execute_script(custom_script)

    def export_deleted_messages_ids_js_csv(self):
        deleted_messages_ids = self.export_deleted_messages_ids_js()
        output_path_final = path.join(
            self.MESSAGES_ID_CSV_DIRECTORY_PATH,
            self.THREAD_ID + '_' + str(current_milli_time()) + '_deleted.csv')
        df = pd.DataFrame({"deleted_messages_id": deleted_messages_ids})
        df.to_csv(output_path_final)


def main():
    ig = InstagramHelper()

    if False:
        # region GET MESSAGES
        ig.logout()
        ig.login(ig.INSTAGRAM_USERNAME, ig.INSTAGRAM_PASSWORD)
        ig.load_remote_js(js_file_link=ig.CUSTOM_JS_LINK)
        get_messages = ig.get_messages_js(thread_id=ig.THREAD_ID)
        if get_messages:
            print("All messages got")
        else:
            print("Some messages failed to get")

        print("Exporting Messages to CSV")
        ig.export_messages_ids_js_csv()
        # endregion

    if True:
        # region DELETE MESSAGES
        ig.logout()
        ig.login(ig.INSTAGRAM_USERNAME, ig.INSTAGRAM_PASSWORD)
        ig.load_remote_js(js_file_link=ig.CUSTOM_JS_LINK)
        delete_messages = ig.delete_messages_js(thread_id=ig.THREAD_ID)
        if delete_messages:
            print("All messages deleted")
        else:
            print("Some messages failed to delete")
            print("Exporting deleted messages to CSV")
            ig.export_deleted_messages_ids_js_csv()
        while delete_messages is not True:
            ig.logout()
            ig.login(ig.INSTAGRAM_USERNAME, ig.INSTAGRAM_PASSWORD)
            ig.load_remote_js(js_file_link=ig.CUSTOM_JS_LINK)
            delete_messages = ig.delete_messages_js(thread_id=ig.THREAD_ID)
            if delete_messages:
                print("All messages deleted")
            else:
                print("Some messages failed to delete")
                print("Exporting deleted messages to CSV")
                ig.export_deleted_messages_ids_js_csv()
        # endregion


if __name__ == '__main__':
    main()
    input("Press Enter to Exit...")
