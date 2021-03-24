# Instagram Helper Script
> Instagram Scripts for various tasks automation

![Instagram Helper](./images/90143326-1e862a80-dd9b-11ea-9d6f-9365617c8ea1.png)

This JavaScript has helper methods to perform various tasks automation.

### Requirements

1. Windows 7/8/10 (Are you MacOS or Linux user? [Help](https://github.com/pishangujeniya/instagram-helper/issues/22#issuecomment-774589015))
2. Chrome Browser

### How to delete/unsend all messages? ⁉
1. Install [Chrome Browser](https://www.google.com/intl/en_in/chrome/)
2. Open Notepad
3. Copy everything from inside the [InstagramHelperChrome.js](./InstagramHelperChrome.js) file and paste in the notepad. (Note: Not to paste in browser)
4. Save the notepad file with `InstagramHelperChrome.js` name on Desktop (".js" at the end of file extension is needed)
5. Double Click the file `InstagramHelperChrome.js` _(This js file is not to be run into browser or browser console)_
6. This file will then generate a Chrome Shortcut on your Desktop with name `InstagramHelperChrome`
7. Open that Special Chrome Browser using that shortcut.
8. Open [Instagram.com](https://instagram.com)
9. Press `F12` (Developer Tools) or `Ctrl+Shift+I`
10. Open any chat and then see the link should be such as (https://www.instagram.com/direct/t/xxxx)
11. Note and copy the last long numerical digits from link to some notepad.
12. Those digits is your chat thread Id.
13. Now Copy the [InstagramHelper.js](./InstagramHelper.js) file contents and paste it in `Console` tab
14. Copy Paste the following code in Console and Hit Enter
15. ```javascript
    var ig  = new InstagramHelper();
    ig.startUnsending("your_chat_thread_Id");
    ```
16. After that you will see **getting messages...** displayed in the console window and **Deleting...** will be displayed whenever it starts deleting.
17. At the end it will show **All messages deleted.**, So you have unsended every message that you sent.
18. If you want to confirm if any of the messages are skipped or left to delete then you can run the following to get the number of messages that you send which are not yet deleted. 
19. ```javascript
    var ig  = new InstagramHelper();
    ig.getAllMessageIds("your_chat_thread_Id");
    ```
20. After it says **All Messages fetched, No More messages to fetch**, run the following code to get the number of messages which are yet to delete.
21. ```javascript
    console.log(ig.p_itemsIdArray.length);
    ```
22. Deleting messages is kept intentionally slow because Instagram has limit to delete number of messages in per second.
23. > If we delete fastly then Instagram servers detects it as bot and then unsending is not allowed with the session temporarily, until you logout and relogin. So to avoid getting detected, we have kept a delay in the code to delete messages with specific interval of time.
24. As and when it says **All Messages Deleted** it has deleted all the messages in the chat.
25. > It is very tedious and time consuming process, but efficient and better than doing it manually. One can simply open a new chrome browser window and follow the simple steps and minimise it.

### FAQ

#### Getting errors displayed in console while running the code 😖
- There might be some errors related to Instagram site, not every error displayed on console are from our script.
- If error persists and repeats everytime, then close browser logout and relogin and then try running the code.

#### Getting too often "Try again tomorrow" Error or 429 Response Code? 😵
- Try to close the browser re-open Instagram and logout then login.
- Instead of running this `ig.startUnsending("your_chat_thread_Id");` run with more higher number of delay by default it is 3500 milliseconds, try other values like 4500, 5500, 6500 `ig.startUnsending("your_chat_thread_Id",5500);`

#### How to stop unsending process? 🛑
- Refresh the browser or Close the browser or Restart the computer.


### Upcoming features !!! 🆕

1. Get list of media sent, and unsend selected medias only. (such as video, photos).

### Warning ⚠
> The script or the creator is in any ways not reponsibile for any of your actions. Do at your own risk.

## Script created & Maintained by 💪

[Pishang Ujeniya](https://github.com/pishangujeniya)

<a href="https://www.linkedin.com/in/pishangujeniya"><img src="https://github.com/aritraroy/social-icons/blob/master/linkedin-icon.png?raw=true" width="60"></a> <a href="https://twitter.com/pishangujeniya"><img src="https://github.com/aritraroy/social-icons/blob/master/twitter-icon.png?raw=true" width="60"></a> <a href="https://www.instagram.com/pishang.ujeniya"><img src="https://github.com/aritraroy/social-icons/blob/master/instagram-icon.png?raw=true" width="60"></a>

> If you are happy to use this project and found this project helpful for you as well as others or you learned something from the source code of this project and want to thank me, 

- Be a [Stargazer](https://github.com/pishangujeniya/instagram-helper) to this repository.
- Share with your friends and colleagues.
- Follow and Endorse me on [linkedin](https://www.linkedin.com/in/pishangujeniya).

## Donations 💰
*Star it!* ⭐ If it worked for you.
- [PayPal](https://paypal.me/Pishang)

### Donors 😍
1. Laila Gates
2. Nikita Rvachev

<a href="https://paypal.me/Pishang"><img src="./images/9218.jpg"></a>

