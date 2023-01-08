class InstagramHelper {
    private UserId: string;

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

        this.getConsumerLibCommonsJs().then(() => {
            console.info('Read you can now continue');
        });
    }

    private syncWait(ms: number) {
        var start = Date.now(),
            now = start;
        while (now - start < ms) {
            now = Date.now();
        }
    }

    private async waitTimeout(ms: number) {
        console.log("Waiting for " + ms.toString() + " milliseconds");
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                console.log("Done waiting");
                resolve(ms)
            }, ms)
        })
    }

    /**
     * generates random integer between 1 and provided
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

        return await fetch(
            deleteMessageAPIUrl,
            deleteMessageRequestInit
        ).then((response) => {
            if (response.status >= 200 && response.status < 300) {
                console.info("Deleting...");
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
     * @param {string} threadId Chat Thread Id
     * @param {number} skipRecentXMessagesCount Number of messages to skip
     * @param {number} delay Delay in milliseconds
     * @returns 
     */
    public async startUnsending(threadId: string = '', skipRecentXMessagesCount: number = 10, delay: number = 3500) {
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

            var getMessagesResponse = await this.getMessagesHttpRequest(threadId, oldestCursor);

            let itemIdsToDelete: Array<string> = new Array<string>();

            getMessagesResponse?.thread?.items.forEach(element => {
                if (element?.user_id?.toString() == this.UserId.toString()) {
                    if (element?.item_type != 'video_call_event') {
                        // Avoiding video call events in the chat to be deleted

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

                if (toSkippMessagesCount < skipRecentXMessagesCount) {
                    toSkippMessagesCount = toSkippMessagesCount + 1;
                    continue;
                }

                await this.deleteMessageHttpRequest(threadId, messageItemId);

                await this.waitTimeout(this.getRandomIntegerBetween(delay));
            }

            //#endregion Deleting Messages

            oldestCursor = getMessagesResponse?.thread?.oldest_cursor ?? '';
            prevCursor = getMessagesResponse?.thread?.prev_cursor ?? '';

        }

        console.warn("All messages deleted.");
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
}

class Item {
    item_id?: string
    user_id?: string
    item_type?: string
}