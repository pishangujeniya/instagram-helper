/**
 * Instagram Helper
 */
class InstagramHelper {

    /**
     * default constructor
     */
    constructor() {
        this.p_userId = this.getCookie("ds_user_id");
        this.p_threadLink = window.location.pathname;
        this.p_threadId = this.p_threadLink.replace("/direct/t/", "");
        this.p_itemsIdArray = [];
        this.p_oldestCursor = "";
        this.p_prevCursor = "";
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
     * generates random integer between 1 and provided
     * @param {number} maxNumber max number between which to generate random integer (default value is 10)
     */
    getRandomIntegerBetween(maxNumber) {
        if (maxNumber != undefined && maxNumber != null && maxNumber > 0) {
            // its provided
        } else {
            maxNumber = 10;
        }
        return Math.floor((Math.random() * maxNumber) + 1);

    }

    /**
     * Fetch the messages and its itemIds for fetching from currentPageIndex to maxPageIndex
     * @param {number} currentPageIndex starting page index to start fetching (default 0)
     * @param {number} maxPageIndex last page till which all the messages will be fetched (default 5)
     * @param {boolean} isAllMessages (default false) if true ignores currentPageIndex and maxPageIndex
     */
    getMessagesItemsArray(currentPageIndex, maxPageIndex, isAllMessages) {

        if (currentPageIndex == undefined || currentPageIndex == null) {
            currentPageIndex = 0;
        }

        if (maxPageIndex == undefined || maxPageIndex == null) {
            maxPageIndex = 5;
        }

        if (isAllMessages == undefined || isAllMessages == null) {
            isAllMessages = false;
        }

        // if its first message ever sent then stop else continue
        if (this.p_prevCursor != "MINCURSOR") {

            var isContinue = false;

            if (currentPageIndex < maxPageIndex && !isAllMessages) {
                isContinue = true;
            } else if (isAllMessages) {
                isContinue = true;
            } else {
                isContinue = false;
            }

            if (isContinue) {

                var getMessageAPIUrl = "https://www.instagram.com/direct_v2/web/threads/" + this.p_threadId + "/";
                if (this.p_oldestCursor != undefined && this.p_oldestCursor != null && this.p_oldestCursor.length > 0) {
                    getMessageAPIUrl = getMessageAPIUrl + "?cursor=" + this.p_oldestCursor + "";
                }

                var getMessagesRequestInit = {
                    "credentials": "include",
                    "headers": {
                        "accept": "*/*",
                        "accept-language": "en-US,en;q=0.9",
                        "cache-control": "no-cache",
                        "pragma": "no-cache",
                        "sec-fetch-dest": "empty",
                        "sec-fetch-mode": "cors",
                        "sec-fetch-site": "same-origin",
                        "x-ig-www-claim": sessionStorage.getItem("www-claim-v2"),
                        "x-requested-with": "XMLHttpRequest"
                    },
                    "referrer": this.p_threadLink,
                    "referrerPolicy": "no-referrer-when-downgrade",
                    "body": null,
                    "method": "GET",
                    "mode": "cors"
                };


                fetch(
                    getMessageAPIUrl,
                    getMessagesRequestInit
                )
                    .then((response) => {
                        if (response.status != 200) {
                            console.error("Try again tomorrow");
                        } else {
                            return response.json();
                        }
                    })
                    .then((data) => {
                        // console.log(data);
                        console.log("getting messages...");
                        data.thread.items.forEach(element => {
                            if (element.user_id.toString() == this.p_userId.toString()) {
                                if (!this.p_itemsIdArray.includes(element.item_id)) {
                                    this.p_itemsIdArray.push(element.item_id);
                                }
                            }
                        });

                        this.p_oldestCursor = data.thread.oldest_cursor;
                        this.p_prevCursor = data.thread.prev_cursor;

                        setTimeout(this.getMessagesItemsArray(currentPageIndex + 1, maxPageIndex, isAllMessages), this.getRandomIntegerBetween(5) * 1000);

                    }).catch((error) => {
                        console.error(error);
                    });

            } else {
                console.warn("All Messages fetched, as per requested");
            }

        } else {
            console.warn("All Messages fetched, No More messages to fetch");
        }
    }


    /**
     * unsends all messages
     * @param {number} itemIndex starting index from itemsIdArray to delete till array end
     */
    deleteAllMessages(itemIndex) {
        if (itemIndex < this.p_itemsIdArray.length) {
            var p_unsendRequestInitObj = {
                "credentials": "include",
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
                    "x-ig-www-claim": sessionStorage.getItem("www-claim-v2"),
                    "x-requested-with": "XMLHttpRequest"
                },
                "referrer": this.p_threadLink,
                "referrerPolicy": "no-referrer-when-downgrade",
                "body": null,
                "method": "POST",
                "mode": "cors"
            };

            fetch(
                "https://www.instagram.com/direct_v2/web/threads/" + this.p_threadId + "/items/" + this.p_itemsIdArray[itemIndex] + "/delete/",
                p_unsendRequestInitObj
            ).then((response) => {
                // console.log(response);
                if (response.status != 200) {
                    console.error("Try again tomorrow");
                } else {
                    console.info("Deleting...");
                    setTimeout(this.deleteAllMessages(itemIndex + 1), this.getRandomIntegerBetween(5) * 1000);
                }
            }).catch((error) => {
                console.error(error);
            });

        } else {
            console.warn("All Messages Deleted");
        }
    }

}
