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
        this.UserCharParticipants = new Array();
        this.AllMessagesItemsArray = new Array();
        this.PurposePromptText = "What you want to do with the messages? \nA: Unsend \nB: Download \nC: Exit";
        this.ThreadIdPromptText = "Please enter your chat Thread ID.";
        this.SkipRecentXMessagesCountPromptText = "Please enter number of recent messages you want to skip. Default is 10.";
        this.DelayPromptText = "Please enter number of seconds to randomly wait between each message to delete. Default is 3 seconds";
        this.SkipTextMessagesPromptText = "Do you want to skip unsending text messages - yes/no? It means it will unsend media contents. Default is no.";
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
        this.getConsumerLibCommonsJs().then(() => __awaiter(this, void 0, void 0, function* () {
            console.info('Ready you can now continue');
            yield this.askPrompts();
        }));
    }
    askPrompts() {
        return __awaiter(this, void 0, void 0, function* () {
            var purposePromptValue = prompt(this.PurposePromptText);
            switch (purposePromptValue) {
                case 'A' || 'a':
                    // Unsend
                    yield this.startUnsending();
                    break;
                case 'B' || 'b':
                    // Download
                    yield this.downloadMessagesDetails();
                    break;
                case 'C' || 'c':
                    return;
                default:
                    alert("Please enter a valid Input. Bye");
                    throw new Error("Please enter a valid Input.");
            }
        });
    }
    waitTimeout(ms) {
        return __awaiter(this, void 0, void 0, function* () {
            console.warn("Waiting for " + ms.toString() + " milliseconds");
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    console.warn("Done waiting");
                    resolve(ms);
                }, ms);
            });
        });
    }
    /**
     * generates random integer between 1 and provided (maxNumber including)
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
    /**
     * Sends HTTP Request to Get Messages
     */
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
            console.info("Getting Messages...");
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
    /**
     * Sends a delete message HTTP Request for a single message from a thread
     * @param threadId string
     * @param messageItemId string
     * @returns void
     */
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
            console.info("Unsending Message...");
            return yield fetch(deleteMessageAPIUrl, deleteMessageRequestInit).then((response) => {
                if (response.status >= 200 && response.status < 300) {
                    console.info("Deleted Message");
                    return response;
                }
                else {
                    throw new Error("Try again tomorrow");
                }
            }).catch((error) => {
                throw new Error(error);
            });
        });
    }
    /**
     * Start Unsending messages
     * @param startUnsendingRequest request model
     */
    unsend(startUnsendingRequest) {
        var _a, _b, _c, _d, _e;
        return __awaiter(this, void 0, void 0, function* () {
            if (startUnsendingRequest.thread_id == null || startUnsendingRequest.thread_id == undefined || startUnsendingRequest.thread_id.length < 1) {
                startUnsendingRequest.thread_id = window.location.href.split('/')[5]; // Get the chat id automatically from the url, make sure a chat is currently active
                console.warn("Starting deleting from thread Id : " + startUnsendingRequest.thread_id.toString());
            }
            if (startUnsendingRequest.skip_recent_x_messages_count < 2) {
                throw new Error("skipRecentXMessagesCount must be greater than 2");
            }
            var skipItemTypesList = new Array();
            skipItemTypesList.push("video_call_event"); // Default Items which need to be skipped
            if (startUnsendingRequest.skip_text_messages) {
                skipItemTypesList.push("text");
            }
            var toSkippMessagesCount = 0;
            console.warn("Inevitable");
            var oldestCursor = "";
            var prevCursor = "";
            // if its first message ever sent then stop else continue
            while (prevCursor != "MINCURSOR") {
                var getMessagesResponse = yield this.getMessagesHttpRequest(startUnsendingRequest.thread_id, oldestCursor);
                let itemIdsToDelete = new Array();
                (_a = getMessagesResponse === null || getMessagesResponse === void 0 ? void 0 : getMessagesResponse.thread) === null || _a === void 0 ? void 0 : _a.items.forEach(element => {
                    var _a, _b, _c, _d, _e;
                    if (((_a = element === null || element === void 0 ? void 0 : element.user_id) === null || _a === void 0 ? void 0 : _a.toString()) == this.UserId.toString()) {
                        // Skipping those types of messages
                        if ((element === null || element === void 0 ? void 0 : element.item_type) && !skipItemTypesList.includes((_b = element === null || element === void 0 ? void 0 : element.item_type) === null || _b === void 0 ? void 0 : _b.toString())) {
                            if ((_c = element === null || element === void 0 ? void 0 : element.item_id) === null || _c === void 0 ? void 0 : _c.toString()) {
                                if (!itemIdsToDelete.includes((_d = element === null || element === void 0 ? void 0 : element.item_id) === null || _d === void 0 ? void 0 : _d.toString())) {
                                    itemIdsToDelete.push((_e = element === null || element === void 0 ? void 0 : element.item_id) === null || _e === void 0 ? void 0 : _e.toString());
                                }
                            }
                        }
                    }
                });
                //#region  Deleting Messages
                for (let itemIdIndex = 0; itemIdIndex < itemIdsToDelete.length; itemIdIndex++) {
                    const messageItemId = itemIdsToDelete[itemIdIndex];
                    if (toSkippMessagesCount < startUnsendingRequest.skip_recent_x_messages_count) {
                        toSkippMessagesCount = toSkippMessagesCount + 1;
                        continue;
                    }
                    yield this.deleteMessageHttpRequest(startUnsendingRequest.thread_id, messageItemId);
                    yield this.waitTimeout(this.getRandomIntegerBetween(startUnsendingRequest.delay));
                }
                //#endregion Deleting Messages
                oldestCursor = (_c = (_b = getMessagesResponse === null || getMessagesResponse === void 0 ? void 0 : getMessagesResponse.thread) === null || _b === void 0 ? void 0 : _b.oldest_cursor) !== null && _c !== void 0 ? _c : '';
                prevCursor = (_e = (_d = getMessagesResponse === null || getMessagesResponse === void 0 ? void 0 : getMessagesResponse.thread) === null || _d === void 0 ? void 0 : _d.prev_cursor) !== null && _e !== void 0 ? _e : '';
            }
            console.warn("All messages deleted.");
        });
    }
    /**
     * Start Unsending messages with prompt
     */
    startUnsending() {
        return __awaiter(this, void 0, void 0, function* () {
            // Asking Prompts
            var thread_id = '';
            var threadIdPromptValue = prompt(this.ThreadIdPromptText);
            if (threadIdPromptValue != null && threadIdPromptValue != undefined && threadIdPromptValue.length > 0) {
                thread_id = threadIdPromptValue;
            }
            else {
                alert("Please enter a valid chat Thread ID. Bye");
                throw new Error("Please enter a valid chat Thread ID");
            }
            var skip_recent_x_messages_count = 10;
            var skipXMessagesPromptValue = prompt(this.SkipRecentXMessagesCountPromptText);
            if (skipXMessagesPromptValue != null && skipXMessagesPromptValue != undefined && parseInt(skipXMessagesPromptValue)) {
                skip_recent_x_messages_count = parseInt(skipXMessagesPromptValue);
            }
            var delay = 3;
            var delayPromptValue = prompt(this.DelayPromptText);
            if (delayPromptValue != null && delayPromptValue != undefined && parseInt(delayPromptValue)) {
                delay = parseInt(delayPromptValue);
            }
            var skip_text_messages = false;
            var skipTextMessagesPromptValue = prompt(this.SkipTextMessagesPromptText);
            if (skipTextMessagesPromptValue != null && skipTextMessagesPromptValue != undefined && skipTextMessagesPromptValue.toLowerCase()[0] == "y") {
                skip_text_messages = true;
            }
            // Building Request
            var startUnsendingRequest = {
                thread_id: thread_id,
                skip_recent_x_messages_count: skip_recent_x_messages_count,
                skip_text_messages: skip_text_messages,
                delay: delay * 1000,
            };
            // Starting Unsending
            yield this.unsend(startUnsendingRequest);
        });
    }
    /**
     * Gets all the messsages and stores into a global array.
     */
    getAllMessagesData(threadId) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t;
        return __awaiter(this, void 0, void 0, function* () {
            if (threadId == null || threadId == undefined) {
                threadId = window.location.href.split('/')[5]; // Get the chat id automatically from the url, make sure a chat is currently active
                console.warn("Starting getting messages from thread Id : " + threadId.toString());
            }
            var oldestCursor = "";
            var prevCursor = "";
            // if its first message ever sent then stop else continue
            while (prevCursor != "MINCURSOR") {
                var getMessagesResponse = yield this.getMessagesHttpRequest(threadId, oldestCursor);
                //#region Own Inviter Adding to Participants
                let isChatParticipantAlreadyExists = false;
                for (let index = 0; index < this.UserCharParticipants.length; index++) {
                    const singleUserChatParticipant = this.UserCharParticipants[index];
                    if (singleUserChatParticipant.pk == ((_b = (_a = getMessagesResponse === null || getMessagesResponse === void 0 ? void 0 : getMessagesResponse.thread) === null || _a === void 0 ? void 0 : _a.inviter) === null || _b === void 0 ? void 0 : _b.pk)) {
                        isChatParticipantAlreadyExists = true;
                        break;
                    }
                }
                if (!isChatParticipantAlreadyExists) {
                    if (((_d = (_c = getMessagesResponse === null || getMessagesResponse === void 0 ? void 0 : getMessagesResponse.thread) === null || _c === void 0 ? void 0 : _c.inviter) === null || _d === void 0 ? void 0 : _d.pk)
                        &&
                            ((_f = (_e = getMessagesResponse === null || getMessagesResponse === void 0 ? void 0 : getMessagesResponse.thread) === null || _e === void 0 ? void 0 : _e.inviter) === null || _f === void 0 ? void 0 : _f.username)
                        &&
                            ((_h = (_g = getMessagesResponse === null || getMessagesResponse === void 0 ? void 0 : getMessagesResponse.thread) === null || _g === void 0 ? void 0 : _g.inviter) === null || _h === void 0 ? void 0 : _h.full_name)
                        &&
                            ((_k = (_j = getMessagesResponse === null || getMessagesResponse === void 0 ? void 0 : getMessagesResponse.thread) === null || _j === void 0 ? void 0 : _j.inviter) === null || _k === void 0 ? void 0 : _k.profile_pic_url))
                        this.UserCharParticipants.push(new ChatParticipant(getMessagesResponse.thread.inviter.pk, getMessagesResponse.thread.inviter.username, getMessagesResponse.thread.inviter.profile_pic_url, getMessagesResponse.thread.inviter.full_name));
                }
                //#endregion
                //#region Thread Participants adding
                (_m = (_l = getMessagesResponse === null || getMessagesResponse === void 0 ? void 0 : getMessagesResponse.thread) === null || _l === void 0 ? void 0 : _l.users) === null || _m === void 0 ? void 0 : _m.forEach(element => {
                    let isChatParticipantAlreadyExists = false;
                    for (let index = 0; index < this.UserCharParticipants.length; index++) {
                        const singleUserChatParticipant = this.UserCharParticipants[index];
                        if (singleUserChatParticipant.pk == (element === null || element === void 0 ? void 0 : element.pk)) {
                            isChatParticipantAlreadyExists = true;
                            break;
                        }
                    }
                    if (!isChatParticipantAlreadyExists) {
                        this.UserCharParticipants.push(new ChatParticipant(element.pk, element.username, element.profile_pic_url, element.full_name));
                    }
                });
                //#endregion
                //#region Adding Messages
                (_p = (_o = getMessagesResponse === null || getMessagesResponse === void 0 ? void 0 : getMessagesResponse.thread) === null || _o === void 0 ? void 0 : _o.items) === null || _p === void 0 ? void 0 : _p.forEach(element => {
                    var _a, _b;
                    var isExists = false;
                    for (let index = 0; index < this.AllMessagesItemsArray.length; index++) {
                        const existingElement = this.AllMessagesItemsArray[index];
                        if (((_a = existingElement === null || existingElement === void 0 ? void 0 : existingElement.item_id) === null || _a === void 0 ? void 0 : _a.toString()) == ((_b = element === null || element === void 0 ? void 0 : element.item_id) === null || _b === void 0 ? void 0 : _b.toString())) {
                            isExists = true;
                            break;
                        }
                    }
                    if (!isExists) {
                        this.AllMessagesItemsArray.push(element);
                    }
                });
                //#endregion
                oldestCursor = (_r = (_q = getMessagesResponse === null || getMessagesResponse === void 0 ? void 0 : getMessagesResponse.thread) === null || _q === void 0 ? void 0 : _q.oldest_cursor) !== null && _r !== void 0 ? _r : '';
                prevCursor = (_t = (_s = getMessagesResponse === null || getMessagesResponse === void 0 ? void 0 : getMessagesResponse.thread) === null || _s === void 0 ? void 0 : _s.prev_cursor) !== null && _t !== void 0 ? _t : '';
            }
            console.warn("All Messages fetched, No More messages to fetch");
        });
    }
    /**
     * Download All Messages Details JSON
     */
    downloadMessagesDetails() {
        return __awaiter(this, void 0, void 0, function* () {
            // Asking Prompts
            var thread_id = '';
            var threadIdPromptValue = prompt(this.ThreadIdPromptText);
            if (threadIdPromptValue != null && threadIdPromptValue != undefined && threadIdPromptValue.length > 0) {
                thread_id = threadIdPromptValue;
            }
            else {
                alert("Please enter a valid chat Thread ID. Bye");
                throw new Error("Please enter a valid chat Thread ID");
            }
            yield this.getAllMessagesData(thread_id);
            yield this.downloadJsonFile({
                "myUserId": this.UserId,
                "allMessagesItemsArray": this.AllMessagesItemsArray,
                "usersChatParticipants": this.UserCharParticipants,
            }, "InstaGramHelperChatMessagesData");
        });
    }
    /**
     * Downloads JSON file from Object in Browser
     * @param {*} jsonDataObject Json Object
     * @param {string} fileNameExcludingExtension
     */
    downloadJsonFile(jsonDataObject, fileNameExcludingExtension = 'data') {
        return __awaiter(this, void 0, void 0, function* () {
            const blob = new Blob(['\ufeff' + JSON.stringify(jsonDataObject)], {
                type: 'text/json;charset=utf-8;'
            });
            const dwldLink = document.createElement('a');
            const url = URL.createObjectURL(blob);
            const isSafariBrowser = navigator.userAgent.indexOf('Safari') !== -1 &&
                navigator.userAgent.indexOf('Chrome') === -1;
            if (isSafariBrowser) {
                // for safari
                dwldLink.setAttribute('target', '_blank');
            }
            dwldLink.setAttribute('href', url);
            dwldLink.setAttribute('download', fileNameExcludingExtension + '.json');
            dwldLink.style.visibility = 'hidden';
            document.body.appendChild(dwldLink);
            dwldLink.click();
            document.body.removeChild(dwldLink);
        });
    }
    /**
     * Deletes all the follow requests for private account
     * @param {string} deleteButtonCSSClassName | provide the css class name of Delete button by Inspect Element
     */
    deleteAllFollowRequests(deleteButtonCSSClassName) {
        return __awaiter(this, void 0, void 0, function* () {
            let t = document.getElementsByClassName(deleteButtonCSSClassName);
            for (let index = 0; index < t.length; index++) {
                const element = t[index];
                yield this.waitTimeout(1000);
                if (element instanceof HTMLElement) {
                    element.click();
                }
            }
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
class StartUnsendingRequest {
    constructor(thread_id, skip_recent_x_messages_count, delay, skip_text_messages) {
        this.skip_recent_x_messages_count = 10;
        this.delay = 3500;
        this.skip_text_messages = false;
        this.thread_id = thread_id;
        this.skip_recent_x_messages_count = skip_recent_x_messages_count;
        this.delay = delay;
        this.skip_text_messages = skip_text_messages;
    }
}
class ChatParticipant {
    constructor(pk, username, profile_pic_url, full_name) {
        this.pk = pk;
        this.username = username;
        this.profile_pic_url = profile_pic_url;
        this.full_name = full_name;
    }
}
