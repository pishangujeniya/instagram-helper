class InstagramHelper {
    private UserId: string;
    private UserCharParticipants: Array<ChatParticipant> = new Array<ChatParticipant>();
    private AllMessagesItemsArray: Array<Item> = new Array<Item>();
    private PurposePromptText: string = "What you want to do with the messages? \nA: Unsend \nB: Download \nC: Exit";
    private ThreadIdPromptText: string = "Please enter your chat Thread ID.";
    private SkipRecentXMessagesCountPromptText: string = "Please enter number of recent messages you want to skip. Default is 10.";
    private DelayPromptText: string = "Please enter number of seconds to randomly wait between each message to delete. Default is 3 seconds";
    private SkipTextMessagesPromptText: string = "Do you want to skip unsending text messages - yes/no? It means it will unsend media contents. Default is no.";

    private LocalStorageKeys = {
        instagramWebFBAppId: "instagramWebFBAppId",
        instagramFBAppId: "instagramFBAppId",
        instagramWebDesktopFBAppId: "instagramWebDesktopFBAppId",
        igLiteAppId: "igLiteAppId"
    };

    private SessionStorageKeys = {
        www_claim_v2: "www-claim-v2"
    }

    constructor() {

        this.UserId = this.getCookie("ds_user_id");

        this.getConsumerLibCommonsJs().then(async () => {
            console.info('Ready you can now continue');
            await this.askPrompts()
        });
    }

    private async askPrompts() {
        var purposePromptValue = prompt(this.PurposePromptText);
        switch (purposePromptValue) {
            case 'A' || 'a':
                // Unsend
                await this.startUnsending();
                break;
            case 'B' || 'b':
                // Download
                await this.downloadMessagesDetails();
                break;
            case 'C' || 'c':
                return;
            default:
                alert("Please enter a valid Input. Bye");
                throw new Error("Please enter a valid Input.");
        }
    }

    private async waitTimeout(ms: number) {
        console.warn("Waiting for " + ms.toString() + " milliseconds");
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                console.warn("Done waiting");
                resolve(ms)
            }, ms)
        })
    }

    /**
     * generates random integer between 1 and provided (maxNumber including)
     * @param {number} maxNumber max number between which to generate random integer (default value is 10)
     */
    private getRandomIntegerBetween(maxNumber: number = 10) {
        if (maxNumber != undefined && maxNumber != null && maxNumber > 0) {
            // its provided
        } else {
            maxNumber = 10;
        }
        return Math.floor((Math.random() * maxNumber) + 1);

    }

    /**
   * provides cookie value if exists else provides empty string
   * @param {string} c_name cookie key name
   */
    private getCookie(c_name: string): string {
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
    private async getConsumerLibCommonsJs(jsFileName: string = "4f7f1faf9a94.js") {

        let consumerLibCommonsJsRequestUrl = "https://www.instagram.com/static/bundles/es6/ConsumerLibCommons.js/" + jsFileName;
        let consumerLibCommonsJsRequestInit: RequestInit = {
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

        await fetch(
            consumerLibCommonsJsRequestUrl,
            consumerLibCommonsJsRequestInit
        )
            .then((response) => {
                if (response.status != 200) {
                    throw new Error("Try again tomorrow");
                } else {
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
                } else {
                    throw new Error("getConsumerLibCommonsJs not found");
                }
            });
    }

    /**
     * Sends HTTP Request to Get Messages
     */
    private async getMessagesHttpRequest(threadId: string, oldestCursor: string = ''): Promise<GetMessagesResponseModel> {

        var threadLink = "https://www.instagram.com/direct/t/" + threadId.toString();
        var getMessageAPIUrl = "https://i.instagram.com/api/v1/direct_v2/threads/" + threadId.toString() + "/";

        if (oldestCursor != undefined && oldestCursor != null && oldestCursor.length > 0) {
            getMessageAPIUrl = getMessageAPIUrl + "?cursor=" + oldestCursor + "";
        }

        var getMessagesRequestInit: RequestInit = {
            "headers": {
                "accept": "*/*",
                "accept-language": "en-US,en;q=0.9",
                "cache-control": "no-cache",
                "pragma": "no-cache",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "x-requested-with": "XMLHttpRequest",
                "x-ig-app-id": localStorage.getItem(this.LocalStorageKeys.instagramWebFBAppId)?.toString() ?? '',
                "x-ig-www-claim": sessionStorage.getItem(this.SessionStorageKeys.www_claim_v2)?.toString() ?? '',
            },
            "referrer": threadLink,
            "referrerPolicy": "no-referrer-when-downgrade",
            "body": null,
            "method": "GET",
            "mode": "cors",
            "credentials": "include",
        };

        console.info("Getting Messages...");
        return await fetch(
            getMessageAPIUrl,
            getMessagesRequestInit
        ).then(async (value: Response) => {
            if (value.status != 200) {
                throw new Error("Try again tomorrow");
            } else {
                return await value.json().then(response => {
                    if (response) {
                        return response as GetMessagesResponseModel;
                    } else {
                        throw new Error("Failed to get messages response");
                    }
                });
            }
        });
    }

    /**
     * Sends a delete message HTTP Request for a single message from a thread
     * @param threadId string
     * @param messageItemId string
     * @returns void
     */
    private async deleteMessageHttpRequest(threadId: string, messageItemId: string): Promise<Response> {

        var threadLink = "https://www.instagram.com/direct/t/" + threadId.toString();

        var deleteMessageAPIUrl = "https://i.instagram.com/api/v1/direct_v2/threads/" + threadId.toString() + "/items/" + messageItemId + "/delete/";
        var deleteMessageRequestInit: RequestInit = {
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
                "x-ig-app-id": localStorage.getItem(this.LocalStorageKeys.instagramWebFBAppId)?.toString() ?? '',
                "x-ig-www-claim": sessionStorage.getItem(this.SessionStorageKeys.www_claim_v2)?.toString() ?? '',
                "x-requested-with": "XMLHttpRequest"
            },
            "referrer": threadLink,
            "referrerPolicy": "no-referrer-when-downgrade",
            "body": null,
            "method": "POST",
            "mode": "cors"
        };

        console.info("Unsending Message...");
        return await fetch(
            deleteMessageAPIUrl,
            deleteMessageRequestInit
        ).then((response) => {
            if (response.status >= 200 && response.status < 300) {
                console.info("Deleted Message");
                return response;
            } else {
                throw new Error("Try again tomorrow");
            }
        }).catch((error) => {
            throw new Error(error);
        });
    }

    /**
     * Start Unsending messages
     * @param startUnsendingRequest request model
     */
    private async unsend(startUnsendingRequest: StartUnsendingRequest) {
        if (startUnsendingRequest.thread_id == null || startUnsendingRequest.thread_id == undefined || startUnsendingRequest.thread_id.length < 1) {
            startUnsendingRequest.thread_id = window.location.href.split('/')[5]; // Get the chat id automatically from the url, make sure a chat is currently active
            console.warn("Starting deleting from thread Id : " + startUnsendingRequest.thread_id.toString());
        }

        if (startUnsendingRequest.skip_recent_x_messages_count < 2) {
            throw new Error("skipRecentXMessagesCount must be greater than 2");
        }

        var skipItemTypesList = new Array<string>();
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

            var getMessagesResponse = await this.getMessagesHttpRequest(startUnsendingRequest.thread_id, oldestCursor);

            let itemIdsToDelete: Array<string> = new Array<string>();

            getMessagesResponse?.thread?.items.forEach(element => {
                if (element?.user_id?.toString() == this.UserId.toString()) {
                    // Skipping those types of messages
                    if (element?.item_type && !skipItemTypesList.includes(element?.item_type?.toString())) {
                        if (element?.item_id?.toString()) {
                            if (!itemIdsToDelete.includes(element?.item_id?.toString())) {
                                itemIdsToDelete.push(element?.item_id?.toString());
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

                await this.deleteMessageHttpRequest(startUnsendingRequest.thread_id, messageItemId);

                await this.waitTimeout(this.getRandomIntegerBetween(startUnsendingRequest.delay));
            }

            //#endregion Deleting Messages

            oldestCursor = getMessagesResponse?.thread?.oldest_cursor ?? '';
            prevCursor = getMessagesResponse?.thread?.prev_cursor ?? '';

        }

        console.warn("All messages deleted.");
    }

    /**
     * Start Unsending messages with prompt
     */
    public async startUnsending() {
        // Asking Prompts
        var thread_id = '';
        var threadIdPromptValue = prompt(this.ThreadIdPromptText);
        if (threadIdPromptValue != null && threadIdPromptValue != undefined && threadIdPromptValue.length > 0) {
            thread_id = threadIdPromptValue;
        } else {
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
        var startUnsendingRequest: StartUnsendingRequest = {
            thread_id: thread_id,
            skip_recent_x_messages_count: skip_recent_x_messages_count,
            skip_text_messages: skip_text_messages,
            delay: delay * 1000,
        }

        // Starting Unsending
        await this.unsend(startUnsendingRequest);
    }

    /**
     * Gets all the messsages and stores into a global array.
     */
    private async getAllMessagesData(threadId: string) {
        if (threadId == null || threadId == undefined) {
            threadId = window.location.href.split('/')[5]; // Get the chat id automatically from the url, make sure a chat is currently active
            console.warn("Starting getting messages from thread Id : " + threadId.toString());
        }

        var oldestCursor = "";
        var prevCursor = "";

        // if its first message ever sent then stop else continue
        while (prevCursor != "MINCURSOR") {

            var getMessagesResponse = await this.getMessagesHttpRequest(threadId, oldestCursor);

            //#region Own Inviter Adding to Participants
            let isChatParticipantAlreadyExists = false;
            for (let index = 0; index < this.UserCharParticipants.length; index++) {
                const singleUserChatParticipant = this.UserCharParticipants[index];
                if (singleUserChatParticipant.pk == getMessagesResponse?.thread?.inviter?.pk) {
                    isChatParticipantAlreadyExists = true;
                    break;
                }
            }
            if (!isChatParticipantAlreadyExists) {
                if (getMessagesResponse?.thread?.inviter?.pk
                    &&
                    getMessagesResponse?.thread?.inviter?.username
                    &&
                    getMessagesResponse?.thread?.inviter?.full_name
                    &&
                    getMessagesResponse?.thread?.inviter?.profile_pic_url
                )
                    this.UserCharParticipants.push(
                        new ChatParticipant(
                            getMessagesResponse.thread.inviter.pk,
                            getMessagesResponse.thread.inviter.username,
                            getMessagesResponse.thread.inviter.profile_pic_url,
                            getMessagesResponse.thread.inviter.full_name
                        )
                    );
            }
            //#endregion

            //#region Thread Participants adding
            getMessagesResponse?.thread?.users?.forEach(element => {
                let isChatParticipantAlreadyExists = false;
                for (let index = 0; index < this.UserCharParticipants.length; index++) {
                    const singleUserChatParticipant = this.UserCharParticipants[index];
                    if (singleUserChatParticipant.pk == element?.pk) {
                        isChatParticipantAlreadyExists = true;
                        break;
                    }
                }
                if (!isChatParticipantAlreadyExists) {
                    this.UserCharParticipants.push(
                        new ChatParticipant(
                            element.pk,
                            element.username,
                            element.profile_pic_url,
                            element.full_name
                        )
                    );
                }
            });
            //#endregion

            //#region Adding Messages
            getMessagesResponse?.thread?.items?.forEach(element => {

                var isExists = false;

                for (let index = 0; index < this.AllMessagesItemsArray.length; index++) {
                    const existingElement = this.AllMessagesItemsArray[index];
                    if (existingElement?.item_id?.toString() == element?.item_id?.toString()) {
                        isExists = true;
                        break;
                    }
                }
                if (!isExists) {
                    this.AllMessagesItemsArray.push(element);
                }
            });
            //#endregion

            oldestCursor = getMessagesResponse?.thread?.oldest_cursor ?? '';
            prevCursor = getMessagesResponse?.thread?.prev_cursor ?? '';

        }

        console.warn("All Messages fetched, No More messages to fetch");
    }

    /**
     * Download All Messages Details JSON
     */
    public async downloadMessagesDetails() {

        // Asking Prompts
        var thread_id = '';
        var threadIdPromptValue = prompt(this.ThreadIdPromptText);
        if (threadIdPromptValue != null && threadIdPromptValue != undefined && threadIdPromptValue.length > 0) {
            thread_id = threadIdPromptValue;
        } else {
            alert("Please enter a valid chat Thread ID. Bye");
            throw new Error("Please enter a valid chat Thread ID");
        }

        await this.getAllMessagesData(thread_id);

        await this.downloadJsonFile(
            {
                "myUserId": this.UserId,
                "allMessagesItemsArray": this.AllMessagesItemsArray,
                "usersChatParticipants": this.UserCharParticipants,
            },
            "InstaGramHelperChatMessagesData"
        );
    }

    /**
     * Downloads JSON file from Object in Browser
     * @param {*} jsonDataObject Json Object
     * @param {string} fileNameExcludingExtension 
     */
    private async downloadJsonFile(jsonDataObject: any, fileNameExcludingExtension: string = 'data') {
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
    }

    /**
     * Deletes all the follow requests for private account
     * @param {string} deleteButtonCSSClassName | provide the css class name of Delete button by Inspect Element
     */
    public async deleteAllFollowRequests(deleteButtonCSSClassName: string) {
        let t = document.getElementsByClassName(deleteButtonCSSClassName);

        for (let index = 0; index < t.length; index++) {
            const element = t[index];
            await this.waitTimeout(1000)
            if (element instanceof HTMLElement) {
                element.click();
            }
        }
    }

}

class GetMessagesResponseModel {
    thread?: Thread
    status?: string
}

class Thread {
    items: Item[] = [];
    oldest_cursor?: string
    newest_cursor?: string
    next_cursor?: string
    prev_cursor?: string
    thread_title?: string
    inviter?: {
        full_name: string
        pk: string;
        username: string;
        profile_pic_url: string;
    }
    users?: Array<{
        full_name: string
        pk: string;
        username: string;
        profile_pic_url: string;
    }>
}

class Item {
    item_id?: string
    user_id?: string
    item_type?: string
}

class StartUnsendingRequest {
    thread_id: string;
    skip_recent_x_messages_count: number = 10;
    delay: number = 3500;
    skip_text_messages: boolean = false;

    constructor(thread_id: string, skip_recent_x_messages_count: number, delay: number, skip_text_messages: boolean) {
        this.thread_id = thread_id;
        this.skip_recent_x_messages_count = skip_recent_x_messages_count;
        this.delay = delay;
        this.skip_text_messages = skip_text_messages;
    }
}

class ChatParticipant {
    pk: string;
    username: string;
    profile_pic_url: string;
    full_name: string;

    constructor(pk: string, username: string, profile_pic_url: string, full_name: string) {
        this.pk = pk;
        this.username = username;
        this.profile_pic_url = profile_pic_url;
        this.full_name = full_name;
    }

}