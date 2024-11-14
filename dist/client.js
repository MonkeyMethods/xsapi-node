"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = void 0;
const RESTful_1 = require("./RESTful");
class Client {
    authorizationData;
    restful;
    XBL;
    constructor(authorizationData) {
        this.authorizationData = authorizationData;
        this.XBL = `XBL3.0 x=${authorizationData.userHash};${authorizationData.XSTSToken}`;
        this.restful = new RESTful_1.RESTful({
            headers: {
                "x-xbl-contract-version": 2,
                "content-type": "application/json",
                "accept-language": "en-US",
                "accept": "application/json",
                "Authorization": this.XBL,
                'host': 'userpresence.xboxlive.com',
            }
        });
    }
    get users() {
        const restful = this.restful;
        return {
            async getSettings(XUIDs, options) {
                const response = await restful.post('https://profile.xboxlive.com/users/batch/profile/settings', {
                    body: JSON.stringify({
                        "userIds": XUIDs,
                        "settings": options
                    })
                });
                if (!response.ok) {
                    let errorDisplayed = {};
                    try {
                        errorDisplayed.json = await response.json();
                    }
                    catch { }
                    ;
                    errorDisplayed.statusText = response.statusText;
                    errorDisplayed.status = response.status;
                    errorDisplayed.url = response.url;
                    errorDisplayed.headers = response.headers;
                    errorDisplayed.ok = response.ok;
                    try {
                        errorDisplayed.text = await response.text();
                    }
                    catch { }
                    ;
                    throw new Error(`Failed to fetch user settings ${JSON.stringify(errorDisplayed, null, 4)}:`);
                }
                const data = await response.json();
                const userSettings = {};
                for (const user of data.profileUsers) {
                    const settingsMap = {};
                    for (const setting of user.settings) {
                        settingsMap[setting.id] = setting.value;
                    }
                    userSettings[user.id] = settingsMap;
                }
                return userSettings;
            },
            async getAchievements(XUID, options = {}) {
                // convert options to url string params;
                const params = new URLSearchParams();
                for (const key in options) {
                    params.append(key, String(options[key]));
                }
                const response = await restful.get(`https://achievements.xboxlive.com/users/xuid(${XUID})/achievements${params.toString()}`, {});
                if (!response.ok) {
                    let errorDisplayed = {};
                    try {
                        errorDisplayed.json = await response.json();
                    }
                    catch { }
                    ;
                    errorDisplayed.statusText = response.statusText;
                    errorDisplayed.status = response.status;
                    errorDisplayed.url = response.url;
                    errorDisplayed.headers = response.headers;
                    errorDisplayed.ok = response.ok;
                    try {
                        errorDisplayed.text = await response.text();
                    }
                    catch { }
                    ;
                    throw new Error(`Failed to fetch user achievements ${JSON.stringify(errorDisplayed, null, 4)}:`);
                }
                return (await response.json());
            },
            async getXUID(username) {
                const response = await restful.get(`https://profile.xboxlive.com/users/gt(${encodeURIComponent(username)})/settings`);
                if (!response.ok) {
                    let errorDisplayed = {};
                    try {
                        errorDisplayed.json = await response.json();
                    }
                    catch { }
                    ;
                    errorDisplayed.statusText = response.statusText;
                    errorDisplayed.status = response.status;
                    errorDisplayed.url = response.url;
                    errorDisplayed.headers = response.headers;
                    errorDisplayed.ok = response.ok;
                    try {
                        errorDisplayed.text = await response.text();
                    }
                    catch { }
                    ;
                    throw new Error(`Failed to fetch xuid ${JSON.stringify(errorDisplayed, null, 4)}:`);
                }
                return (await response.json()).profileUsers[0].id;
            },
            // Achievement Title History URIs <achievements.xboxlive.com> | <https://learn.microsoft.com/en-us/gaming/gdk/_content/gc/reference/live/rest/uri/titlehistory/atoc-reference-titlehistoryv2>
            async getAchievementTitleHistory(XUID, options) {
                const params = new URLSearchParams();
                for (const key in options) {
                    params.append(key, String(options[key]));
                }
                const response = await restful.get(`https://achievements.xboxlive.com/users/xuid(${XUID})/history/titles${params.size > 0 ? `?${params.toString()}` : ''}`);
                if (!response.ok) {
                    let errorDisplayed = {};
                    try {
                        errorDisplayed.json = await response.json();
                    }
                    catch { }
                    ;
                    errorDisplayed.statusText = response.statusText;
                    errorDisplayed.status = response.status;
                    errorDisplayed.url = response.url;
                    errorDisplayed.headers = response.headers;
                    errorDisplayed.ok = response.ok;
                    try {
                        errorDisplayed.text = await response.text();
                    }
                    catch { }
                    ;
                    throw new Error(`Failed to fetch achievement title history: ${JSON.stringify(errorDisplayed, null, 4)} `);
                }
                return await response.json();
            }
        };
    }
    get presence() {
        const restful = this.restful;
        const XBL = this.XBL;
        return {
            async getCurrentPresence() {
                const response = await restful.get('https://userpresence.xboxlive.com/users/me', {});
                if (!response.ok) {
                    let errorDisplayed = {};
                    try {
                        errorDisplayed.json = await response.json();
                    }
                    catch { }
                    ;
                    errorDisplayed.statusText = response.statusText;
                    errorDisplayed.status = response.status;
                    errorDisplayed.url = response.url;
                    errorDisplayed.headers = response.headers;
                    errorDisplayed.ok = response.ok;
                    try {
                        errorDisplayed.text = await response.text();
                    }
                    catch { }
                    ;
                    throw new Error(`Failed to fetch user presence ${JSON.stringify(errorDisplayed, null, 4)}:`);
                }
                return (await response.json());
            },
            async getBatchUserPresence(XUIDs) {
                if (!Array.isArray(XUIDs) || XUIDs.length === 0) {
                    throw new Error("XUIDs must be an array with at least one xuid of a user.");
                }
                const response = await restful.post('https://userpresence.xboxlive.com/users/batch', {
                    body: JSON.stringify({
                        users: XUIDs,
                    })
                });
                if (!response.ok) {
                    let errorDisplayed = {};
                    try {
                        errorDisplayed.json = await response.json();
                    }
                    catch { }
                    ;
                    errorDisplayed.statusText = response.statusText;
                    errorDisplayed.status = response.status;
                    errorDisplayed.url = response.url;
                    errorDisplayed.headers = response.headers;
                    errorDisplayed.ok = response.ok;
                    try {
                        errorDisplayed.text = await response.text();
                    }
                    catch { }
                    ;
                    throw new Error(`Failed to fetch user presence ${JSON.stringify(errorDisplayed, null, 4)}:`);
                }
                return (await response.json());
            },
            async getCurrentGroupPresence(level) {
                const response = await restful.get(`https://userpresence.xboxlive.com/users/me/groups/people?level=${level}`, {});
                if (!response.ok) {
                    let errorDisplayed = {};
                    try {
                        errorDisplayed.json = await response.json();
                    }
                    catch { }
                    ;
                    errorDisplayed.statusText = response.statusText;
                    errorDisplayed.status = response.status;
                    errorDisplayed.url = response.url;
                    errorDisplayed.headers = response.headers;
                    errorDisplayed.ok = response.ok;
                    try {
                        errorDisplayed.text = await response.text();
                    }
                    catch { }
                    ;
                    throw new Error(`Failed to fetch user presence ${JSON.stringify(errorDisplayed, null, 4)}:`);
                }
                return (await response.json());
            },
            async updateTitlePresence(xuid, id, placement, state) {
                const response = await restful.post(`https://userpresence.xboxlive.com/users/xuid(${xuid})/devices/current/titles/current`, {
                    body: JSON.stringify({ id, placement, state })
                });
                if (!response.ok) {
                    let errorDisplayed = {};
                    try {
                        errorDisplayed.json = await response.json();
                    }
                    catch { }
                    ;
                    errorDisplayed.statusText = response.statusText;
                    errorDisplayed.status = response.status;
                    errorDisplayed.url = response.url;
                    errorDisplayed.headers = response.headers;
                    errorDisplayed.ok = response.ok;
                    try {
                        errorDisplayed.text = await response.text();
                    }
                    catch { }
                    ;
                    throw new Error(`Failed to fetch user presence ${JSON.stringify(errorDisplayed, null, 4)}:`);
                }
                return await response.json();
            },
            async removeTitlePresence(xuid, titleId, deviceId, deviceType) {
                const response = await restful.delete(`https://userpresence.xboxlive.com/users/xuid(${xuid})/devices/current/titles/${titleId}`, {
                    headers: {
                        "Authorization": XBL,
                        "x-xbl-contract-version": 3,
                        "Host": "userpresence.xboxlive.com",
                        ...(deviceId && { "deviceId": deviceId }),
                        ...(deviceType && { "deviceType": deviceType }),
                    }
                });
                if (!response.ok) {
                    let errorDisplayed = {};
                    try {
                        errorDisplayed.json = await response.json();
                    }
                    catch { }
                    ;
                    errorDisplayed.statusText = response.statusText;
                    errorDisplayed.status = response.status;
                    errorDisplayed.url = response.url;
                    errorDisplayed.headers = response.headers;
                    errorDisplayed.ok = response.ok;
                    try {
                        errorDisplayed.text = await response.text();
                    }
                    catch { }
                    ;
                    throw new Error(`Failed to fetch user presence ${JSON.stringify(errorDisplayed, null, 4)}:`);
                }
                return await response.json();
            },
            async getGroupPresence(xuid, level) {
                const response = await restful.get(`https://userpresence.xboxlive.com/users/xuid(${xuid})/groups/People?level=${level}`, {
                    headers: {
                        "Authorization": XBL,
                        "x-xbl-contract-version": 3,
                        "Host": "userpresence.xboxlive.com",
                        "Accept-Language": "en-US",
                        "Accept": "application/json",
                    }
                });
                if (!response.ok) {
                    let errorDisplayed = {};
                    try {
                        errorDisplayed.json = await response.json();
                    }
                    catch { }
                    ;
                    errorDisplayed.statusText = response.statusText;
                    errorDisplayed.status = response.status;
                    errorDisplayed.url = response.url;
                    errorDisplayed.headers = response.headers;
                    errorDisplayed.ok = response.ok;
                    try {
                        errorDisplayed.text = await response.text();
                    }
                    catch { }
                    ;
                    throw new Error(`Failed to fetch user presence ${JSON.stringify(errorDisplayed, null, 4)}:`);
                }
                return (await response.json());
            },
            async getGroupBroadcastingPresence(xuid, level) {
                const response = await restful.get(`https://userpresence.xboxlive.com/users/xuid(${xuid})/groups/People/broadcasting?level=${level}`, {
                    headers: {
                        "Authorization": XBL,
                        "x-xbl-contract-version": 3,
                        "Host": "userpresence.xboxlive.com",
                        "Accept-Language": "en-US",
                        "Accept": "application/json",
                    }
                });
                if (!response.ok) {
                    let errorDisplayed = {};
                    try {
                        errorDisplayed.json = await response.json();
                    }
                    catch { }
                    ;
                    errorDisplayed.statusText = response.statusText;
                    errorDisplayed.status = response.status;
                    errorDisplayed.url = response.url;
                    errorDisplayed.headers = response.headers;
                    errorDisplayed.ok = response.ok;
                    try {
                        errorDisplayed.text = await response.text();
                    }
                    catch { }
                    ;
                    throw new Error(`Failed to fetch user presence ${JSON.stringify(errorDisplayed, null, 4)}:`);
                }
                return (await response.json());
            },
            async getGroupBroadcastingCount(xuid, level = 'title') {
                const response = await restful.get(`https://userpresence.xboxlive.com/users/xuid(${xuid})/groups/People/broadcasting/count?level=${level}`, {
                    headers: {
                        "Authorization": XBL,
                        "x-xbl-contract-version": 3,
                        "Host": "userpresence.xboxlive.com",
                        "Accept-Language": "en-US",
                        "Accept": "application/json",
                    }
                });
                if (!response.ok) {
                    let errorDisplayed = {};
                    try {
                        errorDisplayed.json = await response.json();
                    }
                    catch { }
                    ;
                    errorDisplayed.statusText = response.statusText;
                    errorDisplayed.status = response.status;
                    errorDisplayed.url = response.url;
                    errorDisplayed.headers = response.headers;
                    errorDisplayed.ok = response.ok;
                    try {
                        errorDisplayed.text = await response.text();
                    }
                    catch { }
                    ;
                    throw new Error(`Failed to fetch user presence ${JSON.stringify(errorDisplayed, null, 4)}:`);
                }
                return (await response.json());
            }
        };
    }
    get multiplayer() {
        const restful = this.restful;
        return {
            async getMultiplayerActivity(titleId, XUID) {
                const response = await restful.get(`https://multiplayeractivity.xboxlive.com/titles/${titleId}/users/${XUID}/activities`);
                if (!response.ok) {
                    let errorDisplayed = {};
                    try {
                        errorDisplayed.json = await response.json();
                    }
                    catch { }
                    ;
                    errorDisplayed.statusText = response.statusText;
                    errorDisplayed.status = response.status;
                    errorDisplayed.url = response.url;
                    errorDisplayed.headers = response.headers;
                    errorDisplayed.ok = response.ok;
                    try {
                        errorDisplayed.text = await response.text();
                    }
                    catch { }
                    ;
                    throw new Error(`Failed to fetch multiplayer activity ${JSON.stringify(errorDisplayed, null, 4)}:`);
                }
                return await response.json();
            },
            async updateMultiplayerActivity(titleId, XUID, activity) {
                const response = await restful.put(`https://multiplayeractivity.xboxlive.com/titles/${titleId}/users/${XUID}/activities`, {
                    body: JSON.stringify(activity)
                });
                if (!response.ok) {
                    throw new Error(`Failed to update multiplayer activity:`);
                }
                return (await response.json());
            },
            async deleteMultiplayerActivity(titleId, XUID, sequenceNumber) {
                const response = await restful.delete(`https://multiplayeractivity.xboxlive.com/titles/${titleId}/users/${XUID}/activities`, {
                    body: JSON.stringify({ sequenceNumber })
                });
                if (!response.ok) {
                    throw new Error(`Failed to delete multiplayer activity:`);
                }
                return;
            }
        };
    }
    get social() {
        // People URIs <social.xboxlive.com> | <https://learn.microsoft.com/en-us/gaming/gdk/_content/gc/reference/live/rest/uri/people/atoc-reference-people>
        const restful = this.restful;
        const XBL = this.XBL;
        return {
            async getFollowers(XUID, options) {
                const params = new URLSearchParams();
                for (const key in options) {
                    params.append(key, String(options[key]));
                }
                const response = await restful.get(`https://social.xboxlive.com/users/xuid(${XUID})/people${params.size > 0 ? `?${params.toString()}` : ''}`);
                if (!response.ok) {
                    let errorDisplayed = {};
                    try {
                        errorDisplayed.json = await response.json();
                    }
                    catch { }
                    ;
                    errorDisplayed.statusText = response.statusText;
                    errorDisplayed.status = response.status;
                    errorDisplayed.url = response.url;
                    errorDisplayed.headers = response.headers;
                    errorDisplayed.ok = response.ok;
                    try {
                        errorDisplayed.text = await response.text();
                    }
                    catch { }
                    ;
                    throw new Error(`Failed to fetch followers: ${JSON.stringify(errorDisplayed, null, 4)}`);
                }
                return await response.json();
            },
            async getFollowersAsUser(userXUID, targetXUID) {
                const response = await restful.post(`https://social.xboxlive.com/users/${userXUID}/people/${targetXUID}`, {
                    "headers": {
                        "XUID": userXUID,
                    }
                });
                if (!response.ok) {
                    let errorDisplayed = {};
                    try {
                        errorDisplayed.json = await response.json();
                    }
                    catch { }
                    ;
                    errorDisplayed.statusText = response.statusText;
                    errorDisplayed.status = response.status;
                    errorDisplayed.url = response.url;
                    errorDisplayed.headers = response.headers;
                    errorDisplayed.ok = response.ok;
                    try {
                        errorDisplayed.text = await response.text();
                    }
                    catch { }
                    ;
                    throw new Error(`Failed to fetch following: ${JSON.stringify(errorDisplayed, null, 4)}`);
                }
                return await response.json();
            },
            async getFollowersXUIDs(XUID, XUIDS) {
                const response = await restful.post(`https://social.xboxlive.com/users/xuid(${XUID})/people/xuids`, {
                    headers: {
                        "Authorization": XBL,
                        "Content-Type": "application/json",
                        "Content-Length": JSON.stringify({
                            "xuids": XUIDS
                        }).length.toString()
                    },
                    body: JSON.stringify({
                        "xuids": XUIDS
                    })
                });
                if (!response.ok) {
                    let errorDisplayed = {};
                    try {
                        errorDisplayed.json = await response.json();
                    }
                    catch { }
                    ;
                    errorDisplayed.statusText = response.statusText;
                    errorDisplayed.status = response.status;
                    errorDisplayed.url = response.url;
                    errorDisplayed.headers = response.headers;
                    errorDisplayed.ok = response.ok;
                    try {
                        errorDisplayed.text = await response.text();
                    }
                    catch { }
                    ;
                    throw new Error(`Failed to fetch friends: ${JSON.stringify(errorDisplayed, null, 4)}`);
                }
                return (await response.json());
            },
            async getFriends(XUID, options) {
                const params = new URLSearchParams();
                for (const key in options) {
                    params.append(key, String(options[key]));
                }
                const response = await restful.get(`https://social.xboxlive.com/users/xuid(${XUID})/people${params.size > 0 ? `?${params.toString()}` : ''}`);
                if (!response.ok) {
                    let errorDisplayed = {};
                    try {
                        errorDisplayed.json = await response.json();
                    }
                    catch { }
                    ;
                    errorDisplayed.statusText = response.statusText;
                    errorDisplayed.status = response.status;
                    errorDisplayed.url = response.url;
                    errorDisplayed.headers = response.headers;
                    errorDisplayed.ok = response.ok;
                    try {
                        errorDisplayed.text = await response.text();
                    }
                    catch { }
                    ;
                    throw new Error(`Failed to fetch friends: ${JSON.stringify(errorDisplayed, null, 4)}`);
                }
                return await response.json();
            },
            async getViewAsUser(viewingXUID) {
                const response = await restful.get(`https://social.xboxlive.com/users/xuid(${viewingXUID})/summary`, {});
                if (!response.ok) {
                    let errorDisplayed = {};
                    try {
                        errorDisplayed.json = await response.json();
                    }
                    catch { }
                    ;
                    errorDisplayed.statusText = response.statusText;
                    errorDisplayed.status = response.status;
                    errorDisplayed.url = response.url;
                    errorDisplayed.headers = response.headers;
                    errorDisplayed.ok = response.ok;
                    try {
                        errorDisplayed.text = await response.text();
                    }
                    catch { }
                    ;
                    throw new Error(`Failed to fetch view: ${JSON.stringify(errorDisplayed, null, 4)} `);
                }
                return await response.json();
            }
        };
    }
    get clubs() {
        return {
            getChat: async (clubId, amount) => {
                const response = await this.restful.get(`https://chatfd.xboxlive.com:443/channels/Club/${clubId}/messages/history?maxItems=${amount}`);
                if (!response.ok) {
                    let errorDisplayed = {};
                    try {
                        errorDisplayed.json = await response.json();
                    }
                    catch { }
                    ;
                    errorDisplayed.statusText = response.statusText;
                    errorDisplayed.status = response.status;
                    errorDisplayed.url = response.url;
                    errorDisplayed.headers = response.headers;
                    errorDisplayed.ok = response.ok;
                    try {
                        errorDisplayed.text = await response.text();
                    }
                    catch { }
                    ;
                    throw new Error(`Failed to fetch chat: ${JSON.stringify(errorDisplayed, null, 4)} `);
                }
                return await response.json();
            },
            getClub: async (clubId) => {
                const response = await this.restful.get(`https://clubhub.xboxlive.com:443/clubs/ids(${clubId})/decoration/ClubPresence,Roster,Settings`);
                if (!response.ok) {
                    let errorDisplayed = {};
                    try {
                        errorDisplayed.json = await response.json();
                    }
                    catch { }
                    ;
                    errorDisplayed.statusText = response.statusText;
                    errorDisplayed.status = response.status;
                    errorDisplayed.url = response.url;
                    errorDisplayed.headers = response.headers;
                    errorDisplayed.ok = response.ok;
                    try {
                        errorDisplayed.text = await response.text();
                    }
                    catch { }
                    ;
                    throw new Error(`Failed to fetch club: ${JSON.stringify(errorDisplayed, null, 4)} `);
                }
                return (await response.json());
            },
            getFeed: async (clubId, amount) => {
                const response = await this.restful.get(`https://avty.xboxlive.com:443/clubs/clubId(${clubId})/activity/feed?numItems=${amount}`);
                if (!response.ok) {
                    let errorDisplayed = {};
                    try {
                        errorDisplayed.json = await response.json();
                    }
                    catch { }
                    ;
                    errorDisplayed.statusText = response.statusText;
                    errorDisplayed.status = response.status;
                    errorDisplayed.url = response.url;
                    errorDisplayed.headers = response.headers;
                    errorDisplayed.ok = response.ok;
                    try {
                        errorDisplayed.text = await response.text();
                    }
                    catch { }
                    ;
                    throw new Error(`Failed to fetch club feed: ${JSON.stringify(errorDisplayed, null, 4)} `);
                }
                return await response.json();
            },
            findClub: async (xuid) => {
                const response = await this.restful.get(`https://clubhub.xboxlive.com:443/clubs/search/decoration/detail?count=30&q=${xuid}&tags=&titles=`);
                if (!response.ok) {
                    let errorDisplayed = {};
                    try {
                        errorDisplayed.json = await response.json();
                    }
                    catch { }
                    ;
                    errorDisplayed.statusText = response.statusText;
                    errorDisplayed.status = response.status;
                    errorDisplayed.url = response.url;
                    errorDisplayed.headers = response.headers;
                    errorDisplayed.ok = response.ok;
                    try {
                        errorDisplayed.text = await response.text();
                    }
                    catch { }
                    ;
                    throw new Error(`Failed to fetch club: ${JSON.stringify(errorDisplayed, null, 4)} `);
                }
                return await response.json();
            },
            sendFeed: async (message, titleId, target, type) => {
                const response = await this.restful.post(`https://userposts.xboxlive.com:443/users/me/posts`, {
                    body: JSON.stringify({
                        message,
                        titleId,
                        target,
                        type
                    })
                });
                if (!response.ok) {
                    let errorDisplayed = {};
                    try {
                        errorDisplayed.json = await response.json();
                    }
                    catch { }
                    ;
                    errorDisplayed.statusText = response.statusText;
                    errorDisplayed.status = response.status;
                    errorDisplayed.url = response.url;
                    errorDisplayed.headers = response.headers;
                    errorDisplayed.ok = response.ok;
                    try {
                        errorDisplayed.text = await response.text();
                    }
                    catch { }
                    ;
                    throw new Error(`Failed to send feed: ${JSON.stringify(errorDisplayed, null, 4)} `);
                }
                return await response.json();
            }
        };
    }
}
exports.Client = Client;
