# Instagram Helper Script
> Instagram Scripts for various tasks automation


This JavaScript has helper methods to perform various tasks automation.

### How to use this script?

1. Run the following command in *Chrome Browser Dev Console* by pressing *F12*
2. Change the browser mode to phone mode (icon between the Elements Tab and Arrow)

```javascript

var igHelper  = new InstagramHelper();
igHelper.METHOD_NAME();

```

### Pre-Requisites for each method

1. `getMessagesItemsArray`

- this works only on this page https://www.instagram.com/direct/t/THREAD_ID
- check the output by ```console.log(igHelper.p_itemsIdArray);```

<hr>

2. `deleteAllMessages` 

- this works only on this page https://www.instagram.com/direct/t/THREAD_ID

<hr>

> ### Terms
> - This script or the developer or anyone other than you(user), are not responsible to any type of damage or loss happens to you(user) or anyone(user) with the usage of it.
> - You(user) are the only one responsible for your actions.
> - Run with your own risk.
> - This script does not provide any type of guarantee to the user.

<hr>
<hr>
<hr>
<hr>

### ~~Android App Instagram Unsender Bot~~

- ~~If you wish older version of app automation bot then follow the below instructions~~
> ~~Note: This following code for android bot is not maintained.~~

## ~~Instagram bulk Unsend message automating~~
~~*v1.5*~~
~~*Pishang Ujeniya*~~

~~This python script automates un send message task for all messages sent on instagram dm.
The script uses OpenCV image processing for getting mask of chat messages and using pyautogui windows supported library
mimics mouse pointer action of deleting messages.~~

## ~~Requirements and Tested on:~~
- ~~Windows 10~~
- ~~Python 3.7.3~~
- ~~[Nox Player Android Emulator](https://www.bignox.com/) version 6.3.0~~
- ~~[Tesseract](https://github.com/tesseract-ocr/tesseract/releases) needed by [pytesseract](https://github.com/madmaze/pytesseract)~~
- ~~[Follow this guide for installing in Windows](https://github.com/UB-Mannheim/tesseract/wiki)~~
- ~~[Nox Player Android Emulator](https://www.bignox.com/) version 6.3.0~~
- ~~Screen resolution of 1920 x 1080~~
- ~~After starting Nox player change the screen mode to portrait and~~
~~from *Nox player* > *Advanced Settings* > *Resolution Settings* > click on *Restore Window Size*
so that the Nox Player screen sets to center of your screen~~
- ~~Open the chat DM and run the script and switch to chat screen and press Start on prompt.~~
- ~~Change the value of `LOOPER` variable to the large number to delete more messages.~~
