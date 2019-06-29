# version 1.1

import time
import cv2
import pyautogui
from PIL import Image
from PIL import ImageGrab
from pytesseract import image_to_string, Output
import pytesseract

# pyautogui.alert('This displays some text with an OK button.')
# pyautogui.confirm('This displays text and has an OK and Cancel button.')
# snapshot = ImageGrab.grab()

LOOPER = 100

INITIAL_WAIT_TIME = 1

POINTER_MOVEMENT_DURATION = 0.3

PREVIOUS_CHAT_POSITION_X, PREVIOUS_CHAT_POSITION_Y = 0, 0

CHAT_BOTTOM_X, CHAT_BOTTOM_Y = 0, 0
CHAT_TOP_X, CHAT_TOP_Y = 0, 0

WIDTH = pyautogui.size().width
HEIGHT = pyautogui.size().height

NOX_WIDTH = 570
NOX_HEIGHT = 1027
NOX_SCREEN_TOP_LEFT_X = 675
NOX_SCREEN_TOP_LEFT_Y = 10

UNSEND_COPY_TOP_LEFT_X = 734
UNSEND_COPY_TOP_LEFT_Y = 498
UNSEND_COPY_TOP_WIDTH = 451
UNSEND_COPY_TOP_HEIGHT = 97

UNSEND_PNG_PATH = "./unsend.png"
SENDER_CHAT_AREA_PNG_PATH = "./sender_chat_area.png"

CENTER_X = WIDTH / 2
CENTER_Y = HEIGHT / 2

SENDER_CHAT_AREA_TOP_LEFT_X = NOX_SCREEN_TOP_LEFT_X + 460
SENDER_CHAT_AREA_TOP_LEFT_Y = 125
SENDER_CHAT_AREA_WIDTH = 85
SENDER_CHAT_AREA_HEIGHT = 830


def move_to_nox_top_left():
    pyautogui.moveTo(NOX_SCREEN_TOP_LEFT_X,
                     NOX_SCREEN_TOP_LEFT_Y,
                     duration=POINTER_MOVEMENT_DURATION)


def move_to_nox_top_right():
    pyautogui.moveTo(NOX_SCREEN_TOP_LEFT_X + NOX_WIDTH,
                     NOX_SCREEN_TOP_LEFT_Y,
                     duration=POINTER_MOVEMENT_DURATION)


def move_to_nox_bottom_right():
    pyautogui.moveTo(NOX_SCREEN_TOP_LEFT_X + NOX_WIDTH,
                     NOX_SCREEN_TOP_LEFT_Y + NOX_HEIGHT,
                     duration=POINTER_MOVEMENT_DURATION)


def move_to_nox_bottom_left():
    pyautogui.moveTo(NOX_SCREEN_TOP_LEFT_X,
                     NOX_SCREEN_TOP_LEFT_Y + NOX_HEIGHT,
                     duration=POINTER_MOVEMENT_DURATION)


def rotate_around_nox_screen():
    move_to_nox_top_left()
    move_to_nox_top_right()
    move_to_nox_bottom_right()
    move_to_nox_bottom_left()
    move_to_nox_top_left()


def rotate_around_sender_chat_area():
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


def bounding_box_around_text(image_path):
    img = cv2.imread(image_path)
    d = pytesseract.image_to_data(img, output_type=Output.DICT)
    n_boxes = len(d['level'])

    print("Number of messages found : " + str(n_boxes))

    for i in range(n_boxes):
        (x, y, w, h) = (d['left'][i], d['top'][i], d['width'][i], d['height'][i])
        cv2.rectangle(img, (x, y), (x + w, y + h), (0, 255, 0), 2)

    cv2.imshow('img', img)
    cv2.waitKey(0)


def scroll_chat():
    global CHAT_BOTTOM_X
    global CHAT_BOTTOM_Y
    global CHAT_TOP_X
    global CHAT_TOP_Y

    last_message_bottom()
    last_bottom_x, last_bottom_y = pyautogui.position()
    CHAT_BOTTOM_X = last_bottom_x
    CHAT_BOTTOM_Y = last_bottom_y
    pyautogui.moveTo(last_bottom_x, last_bottom_y - 750, duration=0)
    CHAT_TOP_X, CHAT_TOP_Y = pyautogui.position()
    pyautogui.dragTo(last_bottom_x, last_bottom_y, duration=2, button='left')


def jump_message():
    pyautogui.moveRel(0, -50, duration=POINTER_MOVEMENT_DURATION)


def touch_hold_at_current():
    pyautogui.mouseDown(button='left')
    time.sleep(1)
    pyautogui.mouseUp(button='left')


def move_to_unsend():
    pyautogui.moveTo(CENTER_X, CENTER_Y, duration=0)
    pyautogui.moveRel(0, -16, duration=0)
    pyautogui.moveRel(210, 0, duration=0)


def move_to_prev_chat():
    pyautogui.moveTo(PREVIOUS_CHAT_POSITION_X, PREVIOUS_CHAT_POSITION_Y, duration=POINTER_MOVEMENT_DURATION)


def last_message_bottom():
    pyautogui.moveTo(CENTER_X, CENTER_Y, duration=POINTER_MOVEMENT_DURATION)
    pyautogui.moveRel(225, 380, duration=POINTER_MOVEMENT_DURATION)
    pX, pY = pyautogui.position()
    global PREVIOUS_CHAT_POSITION_X
    PREVIOUS_CHAT_POSITION_X = pX
    global PREVIOUS_CHAT_POSITION_Y
    PREVIOUS_CHAT_POSITION_Y = pY


print("Sleeping for " + str(INITIAL_WAIT_TIME))
time.sleep(INITIAL_WAIT_TIME)
print("In Action")

print(" Width : " + str(WIDTH) + "Height  : " + str(HEIGHT))
print(str(WIDTH) + " x " + str(HEIGHT))
print("Center point " + str(CENTER_X) + " x " + str(CENTER_Y))

pyautogui.alert('Start ? ')

print("NoxPlayer found : ")
print("NoxPlayer" in pyautogui.getAllTitles())

init_ime = round(time.time())
end_time = round(time.time())

prevX, prevY = 0, 0

for x in range(LOOPER):
    print(" x : " + str(x))

    # init_ime = round(time.time())
    # print("init_ime : " + str(init_ime))

    sender_chat_area_snap = ImageGrab.grab(bbox=(
        SENDER_CHAT_AREA_TOP_LEFT_X,
        SENDER_CHAT_AREA_TOP_LEFT_Y,
        SENDER_CHAT_AREA_TOP_LEFT_X + SENDER_CHAT_AREA_WIDTH,
        SENDER_CHAT_AREA_TOP_LEFT_Y + SENDER_CHAT_AREA_HEIGHT))

    sender_chat_area_snap.save(SENDER_CHAT_AREA_PNG_PATH)

    # Bounding Box around text
    img = cv2.imread(SENDER_CHAT_AREA_PNG_PATH)
    d = pytesseract.image_to_data(img, output_type=Output.DICT)
    n_boxes = len(d['level'])

    print("Number of messages found : " + str(n_boxes))

    if n_boxes > 1:
        (x, y, w, h) = (d['left'][1], d['top'][1], d['width'][1], d['height'][1])
        chat_pos_x = x + SENDER_CHAT_AREA_TOP_LEFT_X
        chat_pos_y = y + SENDER_CHAT_AREA_TOP_LEFT_Y

        if prevX == x and prevY == y:
            scroll_chat()
            continue

        prevX, prevY = x, y

        print("Message at : " + str(x) + " x " + str(y))

        pyautogui.moveTo(chat_pos_x, chat_pos_y, duration=POINTER_MOVEMENT_DURATION)

        temppx, tempy = pyautogui.position()
        if not pyautogui.pixelMatchesColor(temppx, tempy, (255, 255, 255)):
            touch_hold_at_current()
            # pytesseract.pytesseract.tesseract_cmd = r'C:/Program Files (x86)/Tesseract-OCR'
            unsend_screen_snap = ImageGrab.grab(bbox=(
                UNSEND_COPY_TOP_LEFT_X, UNSEND_COPY_TOP_LEFT_Y, UNSEND_COPY_TOP_LEFT_X + UNSEND_COPY_TOP_WIDTH,
                UNSEND_COPY_TOP_LEFT_Y + UNSEND_COPY_TOP_HEIGHT))
            unsend_screen_snap.save(UNSEND_PNG_PATH)
            unsend_value = image_to_string(Image.open(UNSEND_PNG_PATH))

            if "unsend" in unsend_value.lower():
                print("unsend exists")
                move_to_unsend()
                pyautogui.leftClick()
    else:
        scroll_chat()

    # end_time = round(time.time())
    # print("end_time : " + str(end_time))

#
# last_message_bottom()
#
# scroll_chat()
#
# for x in range(LOOPER):
#
#     print(" X : " + str(x))
#
#     PREVIOUS_CHAT_POSITION_X, PREVIOUS_CHAT_POSITION_Y = pyautogui.position()
#
#     temppx, tempy = pyautogui.position()
#
#     # im = pyautogui.screenshot()
#     # print(im.getpixel((temppx, tempy)))
#
#     if pyautogui.pixelMatchesColor(temppx, tempy, (255, 255, 255)):
#         move_to_prev_chat()
#         jump_message()
#     else:
#         touch_hold_at_current()
#
#         # pytesseract.pytesseract.tesseract_cmd = r'C:/Program Files (x86)/Tesseract-OCR'
#         unsend_screen_snap = ImageGrab.grab(bbox=(
#             UNSEND_COPY_TOP_LEFT_X, UNSEND_COPY_TOP_LEFT_Y, UNSEND_COPY_TOP_LEFT_X + UNSEND_COPY_TOP_WIDTH,
#             UNSEND_COPY_TOP_LEFT_Y + UNSEND_COPY_TOP_HEIGHT))
#         unsend_screen_snap.save(UNSEND_PNG_PATH)
#         unsend_value = image_to_string(Image.open(UNSEND_PNG_PATH))
#
#         if "unsend" in unsend_value.lower():
#             print("unsend exists")
#             move_to_unsend()
#             pyautogui.leftClick()
#             # last_message_bottom()
#
#         move_to_prev_chat()
#         jump_message()
#
#     px, py = pyautogui.position()
#
#     if py <= CHAT_TOP_Y:
#         scroll_chat()
