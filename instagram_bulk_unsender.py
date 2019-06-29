"""

# Instagram bulk Unsend message automating
*v1.3*
*Pishang Ujeniya*

This python script automates un send message task for all messages sent on instagram dm.
The script uses OpenCV image processing for getting mask of chat messages and using pyautogui windows supported library
mimics mouse pointer action of deleting messages.

## Requirements and Tested on:
- Windows 10
- Python 3.7.3
- [Tesseract](https://github.com/tesseract-ocr/tesseract/releases) needed by [pytesseract](https://github.com/madmaze/pytesseract)
- [Follow this guide for installing in Windows](https://github.com/UB-Mannheim/tesseract/wiki)
- [Nox Player Android Emulator](https://www.bignox.com/) version 6.3.0
- Screen resolution of 1920 x 1080
- After starting Nox player change the screen mode to portrait and
from *Nox player* > *Advanced Settings* > *Resolution Settings* > click on *Restore Window Size*
so that the Nox Player screen sets to center of your screen
- Open the chat DM and run the script and switch to chat screen and press Start on prompt.
- Change the value of `LOOPER` variable to the large number to delete more messages.

"""

import time
import cv2
import numpy as np
import pyautogui
from PIL import Image
from PIL import ImageGrab

from pytesseract import image_to_string

LOOPER = 100

UN_SEND_PNG_PATH = "./unsend.png"
SENDER_CHAT_AREA_PNG_PATH = "./sender_chat_area.png"

POINTER_MOVEMENT_DURATION = 0.3

WIDTH = pyautogui.size().width
HEIGHT = pyautogui.size().height

NOX_WIDTH = 570
NOX_HEIGHT = 1027
NOX_SCREEN_TOP_LEFT_X = 675
NOX_SCREEN_TOP_LEFT_Y = 10

UN_SEND_COPY_TOP_LEFT_X = 735
UN_SEND_COPY_TOP_LEFT_Y = 475
UN_SEND_COPY_TOP_WIDTH = 450
UN_SEND_COPY_TOP_HEIGHT = 150

CENTER_X = WIDTH / 2
CENTER_Y = HEIGHT / 2

SENDER_CHAT_AREA_TOP_LEFT_X = NOX_SCREEN_TOP_LEFT_X + 465
SENDER_CHAT_AREA_TOP_LEFT_Y = 125
SENDER_CHAT_AREA_WIDTH = 85
SENDER_CHAT_AREA_HEIGHT = 826


def move_to_nox_top_left():
    """
Move to the top left of nox screen
    """
    pyautogui.moveTo(NOX_SCREEN_TOP_LEFT_X,
                     NOX_SCREEN_TOP_LEFT_Y,
                     duration=POINTER_MOVEMENT_DURATION)


def move_to_nox_top_right():
    """
Move to the top right of nox screen
    """
    pyautogui.moveTo(NOX_SCREEN_TOP_LEFT_X + NOX_WIDTH,
                     NOX_SCREEN_TOP_LEFT_Y,
                     duration=POINTER_MOVEMENT_DURATION)


def move_to_nox_bottom_right():
    """
Move to the bottom right of nox screen
    """
    pyautogui.moveTo(NOX_SCREEN_TOP_LEFT_X + NOX_WIDTH,
                     NOX_SCREEN_TOP_LEFT_Y + NOX_HEIGHT,
                     duration=POINTER_MOVEMENT_DURATION)


def move_to_nox_bottom_left():
    """
Move to the bottom left of nox screen
    """
    pyautogui.moveTo(NOX_SCREEN_TOP_LEFT_X,
                     NOX_SCREEN_TOP_LEFT_Y + NOX_HEIGHT,
                     duration=POINTER_MOVEMENT_DURATION)


def rotate_around_nox_screen():
    """
Moves cursor surrounding the nox screen area
    """
    move_to_nox_top_left()
    move_to_nox_top_right()
    move_to_nox_bottom_right()
    move_to_nox_bottom_left()
    move_to_nox_top_left()


def rotate_around_sender_chat_area():
    """
Moves cursor surrounding sender chat area
    """
    pyautogui.moveTo(SENDER_CHAT_AREA_TOP_LEFT_X,
                     SENDER_CHAT_AREA_TOP_LEFT_Y,
                     duration=1)
    pyautogui.moveTo(SENDER_CHAT_AREA_TOP_LEFT_X + SENDER_CHAT_AREA_WIDTH,
                     SENDER_CHAT_AREA_TOP_LEFT_Y,
                     duration=1)
    pyautogui.moveTo(SENDER_CHAT_AREA_TOP_LEFT_X + SENDER_CHAT_AREA_WIDTH,
                     SENDER_CHAT_AREA_TOP_LEFT_Y + SENDER_CHAT_AREA_HEIGHT,
                     duration=1)
    pyautogui.moveTo(SENDER_CHAT_AREA_TOP_LEFT_X,
                     SENDER_CHAT_AREA_TOP_LEFT_Y + SENDER_CHAT_AREA_HEIGHT,
                     duration=1)
    pyautogui.moveTo(SENDER_CHAT_AREA_TOP_LEFT_X,
                     SENDER_CHAT_AREA_TOP_LEFT_Y,
                     duration=1)


def scroll_chat():
    """
Scrolls chat screen from top to bottom
    """
    pyautogui.moveTo(SENDER_CHAT_AREA_TOP_LEFT_X,
                     SENDER_CHAT_AREA_TOP_LEFT_Y,
                     duration=0)
    pyautogui.dragTo(SENDER_CHAT_AREA_TOP_LEFT_X,
                     SENDER_CHAT_AREA_TOP_LEFT_Y + SENDER_CHAT_AREA_HEIGHT,
                     duration=2,
                     button='left')


def touch_hold_at_current():
    """
Touch and hold at current cursor position
    """
    pyautogui.mouseDown(button='left')
    time.sleep(1)
    pyautogui.mouseUp(button='left')


def move_to_un_send(total_buttons=3):
    """
Moves the cursor to un send button.
    :param total_buttons: total number of buttons on the dialogue box having un send button
    """
    if total_buttons == 1 or total_buttons == 2:
        pyautogui.moveTo(CENTER_X + 210, CENTER_Y - 16, duration=0)
    else:
        pyautogui.moveTo(CENTER_X + 210, CENTER_Y - 16 - 16, duration=0)


print("Screen Resolution :  Width : " + str(WIDTH) + " Height  : " + str(HEIGHT))
print(str(WIDTH) + " x " + str(HEIGHT))
print("Center point " + str(CENTER_X) + " x " + str(CENTER_Y))

pyautogui.alert('Start ? ')

print("NoxPlayer found : ")
print("NoxPlayer" in pyautogui.getAllTitles())

for x in range(LOOPER):
    print("Current LOOPER : " + str(x))

    sender_chat_area_snap = ImageGrab.grab(bbox=(
        SENDER_CHAT_AREA_TOP_LEFT_X,
        SENDER_CHAT_AREA_TOP_LEFT_Y,
        SENDER_CHAT_AREA_TOP_LEFT_X + SENDER_CHAT_AREA_WIDTH,
        SENDER_CHAT_AREA_TOP_LEFT_Y + SENDER_CHAT_AREA_HEIGHT))

    sender_chat_area_snap.save(SENDER_CHAT_AREA_PNG_PATH)

    image = cv2.imread(SENDER_CHAT_AREA_PNG_PATH)

    # Making mask of chat messages and content from background
    lower = np.array([0, 0, 0], dtype="uint8")
    upper = np.array([254, 254, 254], dtype="uint8")

    mask = cv2.inRange(image, lower, upper)
    output = cv2.bitwise_and(image, image, mask=mask)

    # show the images
    # cv2.imshow("images", np.hstack([image, output]))
    # cv2.waitKey(0)

    # Finding Black color
    color = (0, 0, 0)
    indices = np.where(output != color)
    # print(indices)
    coordinates = zip(indices[0], indices[1])
    # now unique_coordinates has only non black coordinates
    unique_coordinates = list(set(list(coordinates)))

    if len(unique_coordinates) > 0:
        print("Yes")
        py, px = unique_coordinates[0]
        pyautogui.moveTo(SENDER_CHAT_AREA_TOP_LEFT_X + px,
                         SENDER_CHAT_AREA_TOP_LEFT_Y + py,
                         duration=POINTER_MOVEMENT_DURATION)

        temppx, tempy = pyautogui.position()
        if not pyautogui.pixelMatchesColor(temppx, tempy, (255, 255, 255)):

            touch_hold_at_current()

            # PYTESSERACT STARTS
            # pytesseract.pytesseract.tesseract_cmd = r'C:/Program Files (x86)/Tesseract-OCR'
            unsend_screen_snap = ImageGrab.grab(bbox=(
                UN_SEND_COPY_TOP_LEFT_X, UN_SEND_COPY_TOP_LEFT_Y, UN_SEND_COPY_TOP_LEFT_X + UN_SEND_COPY_TOP_WIDTH,
                UN_SEND_COPY_TOP_LEFT_Y + UN_SEND_COPY_TOP_HEIGHT))
            unsend_screen_snap.save(UN_SEND_PNG_PATH)
            unsend_value = image_to_string(Image.open(UN_SEND_PNG_PATH))
            # PYTESSERACT ENDS

            if "unsend" in unsend_value.lower():
                if "unlike" in unsend_value.lower():
                    print("Moving to un send out of 3 buttons")
                    move_to_un_send(total_buttons=3)
                else:
                    print("Moving to un send out of 2 buttons")
                    move_to_un_send(total_buttons=2)
                print("Clicking on un send")
                exit()
                pyautogui.leftClick()


    else:
        print("No. So scrolling...")
        scroll_chat()
