# Instagram bulk Unsend message automating
*v1.5*
*Pishang Ujeniya*

This python script automates un send message task for all messages sent on instagram dm.
The script uses OpenCV image processing for getting mask of chat messages and using pyautogui windows supported library
mimics mouse pointer action of deleting messages.

## Requirements and Tested on:
- Windows 10
- Python 3.7.3
- [Nox Player Android Emulator](https://www.bignox.com/) version 6.3.0
- [Tesseract](https://github.com/tesseract-ocr/tesseract/releases) needed by [pytesseract](https://github.com/madmaze/pytesseract)
- [Follow this guide for installing in Windows](https://github.com/UB-Mannheim/tesseract/wiki)
- [Nox Player Android Emulator](https://www.bignox.com/) version 6.3.0
- Screen resolution of 1920 x 1080
- After starting Nox player change the screen mode to portrait and
from *Nox player* > *Advanced Settings* > *Resolution Settings* > click on *Restore Window Size*
so that the Nox Player screen sets to center of your screen
- Open the chat DM and run the script and switch to chat screen and press Start on prompt.
- Change the value of `LOOPER` variable to the large number to delete more messages.