## 🌎 [Website](https://pishangujeniya.github.io/instagram-helper/)

# Instagram Helper Script
> Instagram Scripts for various tasks automation

![Instagram Helper](./images/90143326-1e862a80-dd9b-11ea-9d6f-9365617c8ea1.png)

This JavaScript has helper methods to perform various tasks automation.

### Requirements

1. Windows 7/8/10 (Are you MacOS or Linux user? [Help](https://github.com/pishangujeniya/instagram-helper/issues/22#issuecomment-774589015))
2. Chrome Browser

### Initial Steps
- Install [Chrome Browser](https://www.google.com/intl/en_in/chrome/)
- Open [https://github.com/pishangujeniya/instagram-helper/releases/](https://github.com/pishangujeniya/instagram-helper/releases/)
- Download latest release version (Source Code zip) and extract to desktop.
- Create an empty temporary folder somewhere.
- Double click [InstagramHelperChrome.vbs](./InstagramHelperChrome.vbs) from the extracted folder.
- Select that temporary created folder.
- That will then generate a Chrome Shortcut on your Desktop with name `InstagramHelperChrome`
- Open that Special Chrome Browser using that shortcut. (Ignore the flag that says _You are using an unsupported comman-line flag: --disable-web-security. Stability and security will suffer_) (This flag is shown because we will be mimicking the automation process of Sending Request to Instagram using Chrome).
- Open [Instagram.com](https://instagram.com)
- Press `F12` (Developer Tools) or `Ctrl+Shift+I`


### ⁉ How to delete/unsend all messages? 📃📷🎥
- Follow the initial steps
- Open any chat and then see the link should be such as (https://www.instagram.com/direct/t/xxxx)
- Note and copy the last long numerical digits from link to some notepad.
- Those digits is your chat thread Id.
- Now Copy the [InstagramHelper.js](./InstagramHelper.js) file contents and paste it in `Console` tab
- Copy Paste the following code in Console and Hit Enter (the number 10 after chat thread id is in the code after comma is for skipping recently sent 10 messages from unsending, you can change it to whatever number you want to skip those number of recently you send messages from unsending).
- ```javascript
    var ig  = new InstagramHelper();
    ig.startUnsending("your_chat_thread_Id",10);
    ```
- After that you will see **getting messages...** displayed in the console window and **Deleting...** will be displayed whenever it starts deleting.
- At the end it will show **All messages deleted.**, So you have unsended every message that you sent.

- Deleting messages is kept intentionally slow because Instagram has limit to delete number of messages in per second.
> If we delete fastly then Instagram servers detects it as bot and then unsending is not allowed with the session temporarily, until you logout and relogin. So to avoid getting detected, we have kept a delay in the code to delete messages with specific interval of time.
> It is very tedious and time consuming process, but efficient and better than doing it manually. One can simply open a new chrome browser window and follow the simple steps and minimise it.

### ⁉ How to delete/unsend all media content (other than text)?📷🎥
- Follow the initial steps
- Open any chat and then see the link should be such as (https://www.instagram.com/direct/t/xxxx)
- Note and copy the last long numerical digits from link to some notepad.
- Those digits is your chat thread Id.
- Now Copy the [InstagramHelper.js](./InstagramHelper.js) file contents and paste it in `Console` tab
- Copy Paste the following code in Console and Hit Enter
- ```javascript
    var ig  = new InstagramHelper();
    ig.startUnsendingMedia("your_chat_thread_Id");
    ```
- After that you will see **getting media...** displayed in the console window and **Deleting...** will be displayed whenever it starts deleting.
- At the end it will show **All media deleted.**, So you have unsended every message that you sent.

### ⁉ How to get exported all messages?💾
- Follow the initial steps
- Open any chat and then see the link should be such as (https://www.instagram.com/direct/t/xxxx)
- Note and copy the last long numerical digits from link to some notepad.
- Those digits is your chat thread Id.
- Now Copy the [InstagramHelper.js](./InstagramHelper.js) file contents and paste it in `Console` tab
- Copy Paste the following code in Console and Hit Enter
- ```javascript
    var ig  = new InstagramHelper();
    ig.getAllMessagesData("your_chat_thread_Id");
    ```
- Then run the following command to get the JSON extracted file.
- ```javascript
    ig.downloadMessagesDetails();
    ```

- Open the link [InstagramHelperDataViewer](./InstagramHelperDataViewer.html) to view the data.

### ⁉ FAQ

#### 😖 Getting errors displayed in console while running the code
- There might be some errors related to Instagram site, not every error displayed on console are from our script.
- If error persists and repeats everytime, then close browser logout and relogin and then try running the code.

#### 😵 Getting too often "Try again tomorrow" Error or 429 Response Code?
- Try to close the browser re-open Instagram and logout then login.
- Instead of running this `ig.startUnsending("your_chat_thread_Id");` run with more higher number of delay by default it is 3500 milliseconds, try other values like 4500, 5500, 6500 `ig.startUnsending("your_chat_thread_Id",5500);`

#### 😒 Any more questions?
- Check [Issues Page](https://github.com/pishangujeniya/instagram-helper/issues?q=)
- If your question is not existing in issues do create a new Issue [here](https://github.com/pishangujeniya/instagram-helper/issues/new/choose) instead of messaging on social media or emailing me.


#### 🛑 How to stop unsending process?
- Refresh the browser or Close the browser or Restart the computer.

#### 😕 How to confirm how many messages are there in chat?
- Follow the steps mentioned in 'How to get exported all messages?'


### ⚠ Warning
> The script or the creator is in any ways not reponsibile for any of your actions. Do at your own risk.

> For education purpose only.

> The script in any way is not doing anything different other than just computer programmatically automation to the task which a user would do manually.

> We do not collect any data or information.

> The network request is send to server whenever a user does some task on using Instagram Normally, that requests are automatically programmatically sent using this script.

> We do not have any connection to the user who is using this script.

> The script is totally the similar execution of code to the task which Instagram Website does.

> The script does the task on the site of Instagram.com and so the requests are also sent on the Instagram server for the task.

> The code of script is totally opensource and is very simple and easy to understand which can confirm the above statements.

## 💪 Script created & Maintained by

[Pishang Ujeniya](https://github.com/pishangujeniya)

> If you are happy to use this project and found this project helpful for you as well as others or you learned something from the source code of this project and want to thank me, 

- Be a [Stargazer](https://github.com/pishangujeniya/instagram-helper) to this repository.
- Share with your friends and colleagues.
- Follow and Endorse me on [linkedin](https://www.linkedin.com/in/pishangujeniya).

## 💰 Donations
*Star it!* ⭐ If it worked for you.
- [PayPal](https://paypal.me/Pishang)

### 😍 Donors
1. Laila Gates
2. Nikita Rvachev
3. Mark Utnehmer

<a href="https://paypal.me/Pishang"><img src="./images/9218.jpg"></a>

