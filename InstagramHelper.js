"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class InstagramHelper {
    constructor() {
        this.LocalStorageKeys = {
            instagramWebFBAppId: "instagramWebFBAppId",
            instagramFBAppId: "instagramFBAppId",
            instagramWebDesktopFBAppId: "instagramWebDesktopFBAppId",
            igLiteAppId: "igLiteAppId"
        };
        this.SessionStorageKeys = {
            www_claim_v2: "www-claim-v2"
        };
        this.UserId = this.getCookie("ds_user_id");
        this.getConsumerLibCommonsJs().then(() => {
            console.info('Read you can now continue');
        });
    }
    syncWait(ms) {
        var start = Date.now(), now = start;
        while (now - start < ms) {
            now = Date.now();
        }
    }
    waitTimeout(ms) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Waiting for " + ms.toString() + " milliseconds");
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    console.log("Done waiting");
                    resolve(ms);
                }, ms);
            });
        });
    }
    /**
     * generates random integer between 1 and provided
     * @param {number} maxNumber max number between which to generate random integer (default value is 10)
     */
    getRandomIntegerBetween(maxNumber = 10) {
        if (maxNumber != undefined && maxNumber != null && maxNumber > 0) {
            // its provided
        }
        else {
            maxNumber = 10;
        }
        return Math.floor((Math.random() * maxNumber) + 1);
    }
    /**
   * provides cookie value if exists else provides empty string
   * @param {string} c_name cookie key name
   */
    getCookie(c_name) {
        if (document.cookie.length > 0) {
            var c_start = document.cookie.indexOf(c_name + "=");
            if (c_start != -1) {
                c_start = c_start + c_name.length + 1;
                var c_end = document.cookie.indexOf(";", c_start);
                if (c_end == -1) {
                    var c_end = document.cookie.length;
                }
                return unescape(document.cookie.substring(c_start, c_end));
            }
        }
        return "";
    }
    /**
     * provides the ConsumerLibCommon Js File
     * @param {string} jsFileName default is 4f7f1faf9a94.js
     */
    getConsumerLibCommonsJs(jsFileName = "4f7f1faf9a94.js") {
        return __awaiter(this, void 0, void 0, function* () {
            let consumerLibCommonsJsRequestUrl = "https://www.instagram.com/static/bundles/es6/ConsumerLibCommons.js/" + jsFileName;
            let consumerLibCommonsJsRequestInit = {
                "headers": {
                    "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                    "accept-language": "en-US,en;q=0.9",
                    "cache-control": "no-cache",
                    "pragma": "no-cache",
                    "sec-fetch-dest": "document",
                    "sec-fetch-mode": "navigate",
                    "sec-fetch-site": "none",
                    "sec-fetch-user": "?1",
                    "upgrade-insecure-requests": "1"
                },
                "referrerPolicy": "no-referrer-when-downgrade",
                "body": null,
                "method": "GET",
                mode: "cors",
                credentials: "include"
            };
            yield fetch(consumerLibCommonsJsRequestUrl, consumerLibCommonsJsRequestInit)
                .then((response) => {
                if (response.status != 200) {
                    throw new Error("Try again tomorrow");
                }
                else {
                    return response.text();
                }
            })
                .then((data) => {
                if (data) {
                    let appIdVariableNames = [
                        this.LocalStorageKeys.instagramFBAppId,
                        this.LocalStorageKeys.instagramWebFBAppId,
                        this.LocalStorageKeys.instagramWebDesktopFBAppId,
                        this.LocalStorageKeys.igLiteAppId
                    ];
                    appIdVariableNames.forEach(singleppIdVariableName => {
                        let searchString = singleppIdVariableName + "='";
                        let indexOfSearchedStringVariableName = data.indexOf(searchString);
                        let valueData = data.substring(indexOfSearchedStringVariableName + searchString.length);
                        let singleAppIdValue = valueData.substring(0, valueData.indexOf("'"));
                        // console.warn(singleppIdVariableName + " = " + singleAppIdValue);
                        localStorage.setItem(singleppIdVariableName, singleAppIdValue);
                    });
                }
                else {
                    throw new Error("getConsumerLibCommonsJs not found");
                }
            });
        });
    }
    getMessagesHttpRequest(threadId, oldestCursor = '') {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            var threadLink = "https://www.instagram.com/direct/t/" + threadId.toString();
            var getMessageAPIUrl = "https://i.instagram.com/api/v1/direct_v2/threads/" + threadId.toString() + "/";
            if (oldestCursor != undefined && oldestCursor != null && oldestCursor.length > 0) {
                getMessageAPIUrl = getMessageAPIUrl + "?cursor=" + oldestCursor + "";
            }
            var getMessagesRequestInit = {
                "headers": {
                    "accept": "*/*",
                    "accept-language": "en-US,en;q=0.9",
                    "cache-control": "no-cache",
                    "pragma": "no-cache",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-origin",
                    "x-requested-with": "XMLHttpRequest",
                    "x-ig-app-id": (_b = (_a = localStorage.getItem(this.LocalStorageKeys.instagramWebFBAppId)) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : '',
                    "x-ig-www-claim": (_d = (_c = sessionStorage.getItem(this.SessionStorageKeys.www_claim_v2)) === null || _c === void 0 ? void 0 : _c.toString()) !== null && _d !== void 0 ? _d : '',
                },
                "referrer": threadLink,
                "referrerPolicy": "no-referrer-when-downgrade",
                "body": null,
                "method": "GET",
                "mode": "cors",
                "credentials": "include",
            };
            return yield fetch(getMessageAPIUrl, getMessagesRequestInit).then((value) => __awaiter(this, void 0, void 0, function* () {
                if (value.status != 200) {
                    throw new Error("Try again tomorrow");
                }
                else {
                    return yield value.json().then(response => {
                        if (response) {
                            return response;
                        }
                        else {
                            throw new Error("Failed to get messages response");
                        }
                    });
                }
            }));
        });
    }
    deleteMessageHttpRequest(threadId, messageItemId) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            var threadLink = "https://www.instagram.com/direct/t/" + threadId.toString();
            var deleteMessageAPIUrl = "https://i.instagram.com/api/v1/direct_v2/threads/" + threadId.toString() + "/items/" + messageItemId + "/delete/";
            var deleteMessageRequestInit = {
                "credentials": "include",
                "headers": {
                    "accept": "*/*",
                    "accept-language": "en-US,en;q=0.9",
                    "cache-control": "no-cache",
                    "content-type": "application/x-www-form-urlencoded",
                    "pragma": "no-cache",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-origin",
                    "x-csrftoken": this.getCookie("csrftoken"),
                    "x-ig-app-id": (_b = (_a = localStorage.getItem(this.LocalStorageKeys.instagramWebFBAppId)) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : '',
                    "x-ig-www-claim": (_d = (_c = sessionStorage.getItem(this.SessionStorageKeys.www_claim_v2)) === null || _c === void 0 ? void 0 : _c.toString()) !== null && _d !== void 0 ? _d : '',
                    "x-requested-with": "XMLHttpRequest"
                },
                "referrer": threadLink,
                "referrerPolicy": "no-referrer-when-downgrade",
                "body": null,
                "method": "POST",
                "mode": "cors"
            };
            return yield fetch(deleteMessageAPIUrl, deleteMessageRequestInit).then((response) => {
                if (response.status >= 200 && response.status < 300) {
                    console.info("Deleting...");
                    return response;
                }
                else {
                    throw new Error("Some messages skipped deleting");
                }
            }).catch((error) => {
                throw new Error(error);
            });
        });
    }
    /**
     * Start Unsending messages
     * @param {string} threadId Chat Thread Id
     * @param {number} skipRecentXMessagesCount Number of messages to skip
     * @param {number} delay Delay in milliseconds
     * @returns
     */
    startUnsending(threadId = '', skipRecentXMessagesCount = 10, delay = 3500) {
        var _a, _b, _c, _d, _e;
        return __awaiter(this, void 0, void 0, function* () {
            if (threadId == null || threadId == undefined) {
                threadId = window.location.href.split('/')[5]; // Get the chat id automatically from the url, make sure a chat is currently active
                console.warn("Starting deleting from thread Id : " + threadId.toString());
            }
            if (skipRecentXMessagesCount < 2) {
                throw new Error("skipRecentXMessagesCount must be greater than 2");
            }
            var toSkippMessagesCount = 0;
            console.warn("Inevitable");
            var oldestCursor = "";
            var prevCursor = "";
            // if its first message ever sent then stop else continue
            while (prevCursor != "MINCURSOR") {
                var getMessagesResponse = yield this.getMessagesHttpRequest(threadId, oldestCursor);
                let itemIdsToDelete = new Array();
                (_a = getMessagesResponse === null || getMessagesResponse === void 0 ? void 0 : getMessagesResponse.thread) === null || _a === void 0 ? void 0 : _a.items.forEach(element => {
                    var _a, _b, _c, _d;
                    if (((_a = element === null || element === void 0 ? void 0 : element.user_id) === null || _a === void 0 ? void 0 : _a.toString()) == this.UserId.toString()) {
                        if ((element === null || element === void 0 ? void 0 : element.item_type) != 'video_call_event') {
                            // Avoiding video call events in the chat to be deleted
                            if ((_b = element === null || element === void 0 ? void 0 : element.item_id) === null || _b === void 0 ? void 0 : _b.toString()) {
                                if (!itemIdsToDelete.includes((_c = element === null || element === void 0 ? void 0 : element.item_id) === null || _c === void 0 ? void 0 : _c.toString())) {
                                    itemIdsToDelete.push((_d = element === null || element === void 0 ? void 0 : element.item_id) === null || _d === void 0 ? void 0 : _d.toString());
                                }
                            }
                        }
                    }
                });
                //#region  Deleting Messages
                for (let itemIdIndex = 0; itemIdIndex < itemIdsToDelete.length; itemIdIndex++) {
                    const messageItemId = itemIdsToDelete[itemIdIndex];
                    if (toSkippMessagesCount < skipRecentXMessagesCount) {
                        toSkippMessagesCount = toSkippMessagesCount + 1;
                        continue;
                    }
                    yield this.deleteMessageHttpRequest(threadId, messageItemId);
                    yield this.waitTimeout(this.getRandomIntegerBetween(delay));
                }
                //#endregion Deleting Messages
                oldestCursor = (_c = (_b = getMessagesResponse === null || getMessagesResponse === void 0 ? void 0 : getMessagesResponse.thread) === null || _b === void 0 ? void 0 : _b.oldest_cursor) !== null && _c !== void 0 ? _c : '';
                prevCursor = (_e = (_d = getMessagesResponse === null || getMessagesResponse === void 0 ? void 0 : getMessagesResponse.thread) === null || _d === void 0 ? void 0 : _d.prev_cursor) !== null && _e !== void 0 ? _e : '';
            }
            console.warn("All messages deleted.");
        });
    }
}
class GetMessagesResponseModel {
}
class Thread {
    constructor() {
        this.items = [];
    }
}
class Item {
}
