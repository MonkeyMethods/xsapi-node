import { AuthorizationData } from "./globals";
import { RESTful } from "./RESTful";
/** A type representing an Xbox User ID */
type XUID = string;

type UserSettings = ("GameDisplayPicRaw" | "Gamerscore" | "Gamertag" | "AccountTier" | "XboxOneRep" | "PreferredColor" | "RealName" | "Bio" | "Location" | "ModernGamertag" | "ModernGamertagSuffix" | "UniqueModernGamertag" | "RealNameOverride" | "TenureLevel" | "Watermarks" | "IsQuarantined" | "DisplayedLinkedAccounts")

type AchievementOptions = { skipItems?: boolean, continuationToken?: string, maxItems?: number, titleId?: number, unlockedOnly?: boolean, possibleOnly?: boolean, types?: "Persistent" | "Challenge", orderBy?: "Default" | "UnlockTime" | "Gamerscore", order?: "Ascending" | "Descending" }
type AchievementsResponse = {
    achievements: {
        id: string;
        serviceConfigId: string;
        name: string;
        titleAssociations: {
            name: string;
            id: number;
            version: string;
        }[];
        progressState: string;
        progression: {
            achievementState: string;
            requirements: null;
            timeUnlocked: string;
        };
        mediaAssets: {
            name: string;
            type: string;
            url: string;
        }[];
        platform: string;
        isSecret: boolean;
        description: string;
        lockedDescription: string;
        productId: string;
        achievementType: string;
        participationType: string;
        timeWindow: {
            startDate: string;
            endDate: string;
        };
        rewards: {
            name: string | null;
            description: string | null;
            value: string;
            type: string;
            valueType: string;
        }[];
        estimatedTime: string;
        deeplink: string;
        isRevoked: boolean;
    }[];
    pagingInfo: {
        continuationToken: string | null;
        totalRecords: number;
    };
};

type PresenceRecord = {
    xuid: string;
    state: string;
    lastSeen?: {
        deviceType: string;
        titleId: string;
        titleName: string;
        timestamp: string;
    };
    devices?: {
        type: string;
        titles: {
            id: string;
            name: string;
            state: string;
            placement: string;
            timestamp: string;
            activity?: {
                richPresence: string;
            };
        }[];
    }[];
};

type BroadCastingPresenceRecord = {
    xuid: string;
    state: string;
    lastSeen?: {
        deviceType: string;
        titleId: string;
        titleName: string;
        timestamp: string;
    };
    devices?: {
        type: string;
        titles: {
            id: string;
            name: string;
            state: string;
            placement: string;
            timestamp: string;
            activity?: {
                richPresence: string;
                broadcast:
                {
                    id: string,
                    session: string,
                    provider: string,
                    started: string,
                    viewers: number,
                }
            };
        }[];
    }[];
}[];


type GetActivityResponse = {
    "connectionString": string,
    "currentPlayers": number,
    "groupId": string,
    "joinRestriction": {
        "Followed": string,
        "InviteOnly": string,
        "Public": string
    },
    "maxPlayers": number,
    "platform": {
        "Android": string,
        "IOS": string,
        "Nintendo": string,
        "PlayStation": string
    },
    "sequenceNumber": string,
    "titleId": number
}

type UpdateMultiplayerActivity = {
    "connectionString": string,
    "joinRestriction": {
        "Followed": string,
        "InviteOnly": string,
        "Public": string
    },
    "sequenceNumber": string,
    "currentPlayers": number,
    "groupId": string,
    "maxPlayers": number,
    "platform": {
        "Android": string,
        "IOS": string,
        "Nintendo": string,
        "PlayStation": string,
        "Scarlett": string,
        "Win32": string,
        "WindowsOneCore": string,
        "XboxOne": string
    },
    "titleId": number
}

type UpdateMultiplayerActivityResponse = {
    "connectionString": string,
    "currentPlayers": number,
    "groupId": string,
    "joinRestriction": {
        "Followed": string,
        "InviteOnly": string,
        "Public": string
    },
    "maxPlayers": number,
    "platform": {
        "Android": string,
        "IOS": string,
        "Nintendo": string,
        "PlayStation": string
    },
    "sequenceNumber": string
}

export class Client {
    private authorizationData: AuthorizationData;
    private restful: RESTful;
    private XBL: string;
    constructor(authorizationData: AuthorizationData) {
        this.authorizationData = authorizationData;
        this.XBL = `XBL3.0 x=${authorizationData.userHash};${authorizationData.XSTSToken}`;

        this.restful = new RESTful({
            headers: {
                "x-xbl-contract-version": 2 as unknown as string,
                "content-type": "application/json",
                "Authorization": this.XBL,
                'host': 'userpresence.xboxlive.com',
            }
        })
    }

    public async getUserSettings(XUIDs: XUID[], options: UserSettings[]): Promise<Record<XUID, Record<string, any>>> {
        const response = await this.restful.post('https://profile.xboxlive.com/users/batch/profile/settings', {
            body: JSON.stringify({
                "userIds": XUIDs,
                "settings": options
            })
        });

        if (!response.ok) {

            let errorDisplayed = {} as any;
            try {
                errorDisplayed.json = await response.json();
            } catch { };
            errorDisplayed.statusText = response.statusText;
            errorDisplayed.status = response.status;
            errorDisplayed.url = response.url;
            errorDisplayed.headers = response.headers;
            errorDisplayed.ok = response.ok;
            try {
                errorDisplayed.text = await response.text();
            } catch { };
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
    }
    public async getUserAchievements(XUID: XUID, options: AchievementOptions = {}): Promise<AchievementsResponse> {
        // convert options to url string params;
        const params = new URLSearchParams();
        for (const key in options) {
            params.append(key, String(options[key]));
        }
        const response = await this.restful.get(`https://achievements.xboxlive.com/users/xuid(${XUID})/achievements${params.toString()}`, {});

        if (!response.ok) {

            let errorDisplayed = {} as any;
            try {
                errorDisplayed.json = await response.json();
            } catch { };
            errorDisplayed.statusText = response.statusText;
            errorDisplayed.status = response.status;
            errorDisplayed.url = response.url;
            errorDisplayed.headers = response.headers;
            errorDisplayed.ok = response.ok;
            try {
                errorDisplayed.text = await response.text();
            } catch { };
            throw new Error(`Failed to fetch user achievements ${JSON.stringify(errorDisplayed, null, 4)}:`);
        }
        return (await response.json())
    }

    public async getCurrentPresence(): Promise<PresenceRecord> {
        const response = await this.restful.get('https://userpresence.xboxlive.com/users/me', {});

        if (!response.ok) {
            throw new Error(`Failed to fetch current user presence: ${response.statusText}`);
        }
        return (await response.json()) as PresenceRecord;
    }

    public async getBatchUserPresence(XUIDs: string[]): Promise<PresenceRecord[]> {
        if (!Array.isArray(XUIDs) || XUIDs.length === 0) {
            throw new Error("XUIDs must be an array with at least one xuid of a user.");
        }

        const response = await this.restful.post('https://userpresence.xboxlive.com/users/batch', {
            body: JSON.stringify({
                users: XUIDs,
            })
        })

        if (!response.ok) {
            throw new Error(`Failed to fetch batch user presence: ${response.statusText}`);
        }

        return (await response.json()) as PresenceRecord[];
    }

    public async getCurrentGroupPresence(): Promise<PresenceRecord[]> {
        const response = await this.restful.get('https://userpresence.xboxlive.com/users/me/people', {});

        if (!response.ok) {
            throw new Error(`Failed to fetch current user group presence: ${response.statusText}`);
        }

        return (await response.json()) as PresenceRecord[];
    }

    public async updateTitlePresence(xuid: string, id: string, placement: string, state: string): Promise<any> {
        const response = await this.restful.post(`https://userpresence.xboxlive.com/users/xuid(${xuid})/devices/current/titles/current`, {
            body: JSON.stringify({ id, placement, state })
        });

        if (!response.ok) {
            throw new Error(`Failed to update title presence: ${response.statusText}`);
        }

        return await response.json();
    }

    public async removeTitlePresence(xuid: string, titleId: string, deviceId?: string, deviceType?: string): Promise<void> {
        const response = await this.restful.delete(`https://userpresence.xboxlive.com/users/xuid(${xuid})/devices/current/titles/${titleId}`, {
            headers: {
                "Authorization": this.XBL,
                "x-xbl-contract-version": "2",
                "Host": "userpresence.xboxlive.com",
                ...(deviceId && { "deviceId": deviceId }),
                ...(deviceType && { "deviceType": deviceType }),
            }
        });
        if (!response.ok) {
            throw new Error(`Failed to remove title presence: ${response.statusText}`);
        }
        return await response.json();
    }

    public async getGroupPresence(xuid: string, moniker: string, level: string = 'title'): Promise<PresenceRecord[]> {
        const response = await this.restful.get(`https://userpresence.xboxlive.com/users/xuid(${xuid})/groups/${moniker}?level=${level}`, {});

        if (!response.ok) {
            throw new Error(`Failed to fetch group presence: ${response.statusText}`);
        }

        return (await response.json()) as PresenceRecord[];
    }

    public async getGroupBroadcastingPresence(xuid: string, moniker: string = 'People', level: string = 'title'): Promise<BroadCastingPresenceRecord> {
        const response = await this.restful.get(`https://userpresence.xboxlive.com/users/xuid(${xuid})/groups/${moniker}/broadcasting?level=${level}`, {});

        if (!response.ok) {
            throw new Error(`Failed to fetch group broadcasting presence: ${response.statusText}`);
        }

        return (await response.json()) as BroadCastingPresenceRecord;
    }

    public async getGroupBroadcastingCount(xuid: string, moniker: string = 'People', level: string = 'title'): Promise<any> {
        const response = await this.restful.get(`https://userpresence.xboxlive.com/users/xuid(${xuid})/groups/${moniker}/broadcasting/count?level=${level}`, {});
        console.log(response)
        if (!response.ok) {
            throw new Error(`Failed to fetch group broadcasting count: ${response.statusText}`);
        }

        return (await response.json()) as { count: number };
    }


    // Multiplayer Activity URIs <multiplayeractivity.xboxlive.com> | <https://learn.microsoft.com/en-us/gaming/gdk/_content/gc/reference/live/rest/uri/multiplayeractivity/atoc-reference-multiplayer-activity>
    public async getMultiplayerActivity(titleId: number, XUID: XUID): Promise<GetActivityResponse> {
        const response = await this.restful.get(`https://multiplayeractivity.xboxlive.com/titles/${titleId}/users/${XUID}/activities`);
        if (!response.ok) {

            let errorDisplayed = {} as any;
            try {
                errorDisplayed.json = await response.json();
            } catch { };
            errorDisplayed.statusText = response.statusText;
            errorDisplayed.status = response.status;
            errorDisplayed.url = response.url;
            errorDisplayed.headers = response.headers;
            errorDisplayed.ok = response.ok;
            try {
                errorDisplayed.text = await response.text();
            } catch { };
            throw new Error(`Failed to fetch multiplayer activity ${JSON.stringify(errorDisplayed, null, 4)}:`);
        }
        return await response.json();
    }

    public async updateMultiplayerActivity(titleId: number, XUID: XUID, activity: UpdateMultiplayerActivity): Promise<UpdateMultiplayerActivityResponse> {
        const response = await this.restful.put(`https://multiplayeractivity.xboxlive.com/titles/${titleId}/users/${XUID}/activities`, {
            body: JSON.stringify(activity)
        });
        if (!response.ok) {

            throw new Error(`Failed to update multiplayer activity:`);
        }
        return (await response.json());
    }

    public async deleteMultiplayerActivity(titleId: number, XUID: XUID, sequenceNumber: string): Promise<void> {
        const response = await this.restful.delete(`https://multiplayeractivity.xboxlive.com/titles/${titleId}/users/${XUID}/activities`, {
            body: JSON.stringify({ sequenceNumber })
        });
        if (!response.ok) {

            throw new Error(`Failed to delete multiplayer activity:`);
        }
        return;
    }

    // People URIs <social.xboxlive.com> | <https://learn.microsoft.com/en-us/gaming/gdk/_content/gc/reference/live/rest/uri/people/atoc-reference-people>

    public async getFollowers(XUID: XUID, options: { view: ("All" | "Favorite" | "LegacyXboxLiveFriends"), maxItems: number, startIndex: number }): Promise<{ "people": { "xuid": XUID, "isFavorite": boolean, "isFollowingCaller": boolean, "socialNetworks"?: string[] }, "totalCount": number }> {
        const params = new URLSearchParams();
        for (const key in options) {
            params.append(key, String(options[key]));
        }

        const response = await this.restful.get(`https://social.xboxlive.com/users/xuid(${XUID})/people?${params.toString()}`, {
            "headers": {
                "XUID": XUID,
            }
        });
        if (!response.ok) {

            let errorDisplayed = {} as any;
            try {
                errorDisplayed.json = await response.json();
            } catch { };
            errorDisplayed.statusText = response.statusText;
            errorDisplayed.status = response.status;
            errorDisplayed.url = response.url;
            errorDisplayed.headers = response.headers;
            errorDisplayed.ok = response.ok;
            try {
                errorDisplayed.text = await response.text();
            } catch { };
            throw new Error(`Failed to fetch followers: ${JSON.stringify(errorDisplayed, null, 4)}`);
        }
        return await response.json();
    }

    public async getFollowersAsUser(userXUID: XUID, targetXUID: XUID): Promise<{ "xuid": XUID, "isFavorite": boolean, "isFollowingCaller": boolean, "socialNetworks"?: string[] }> {
        const response = await this.restful.post(`https://social.xboxlive.com/users/${userXUID}/people/${targetXUID}`, {
            "headers": {
                "XUID": userXUID,
            }
        });
        if (!response.ok) {

            let errorDisplayed = {} as any;
            try {
                errorDisplayed.json = await response.json();
            } catch { };
            errorDisplayed.statusText = response.statusText;
            errorDisplayed.status = response.status;
            errorDisplayed.url = response.url;
            errorDisplayed.headers = response.headers;
            errorDisplayed.ok = response.ok;
            try {
                errorDisplayed.text = await response.text();
            } catch { };
            throw new Error(`Failed to fetch following: ${JSON.stringify(errorDisplayed, null, 4)}`);
        }
        return await response.json();
    }

    public async getFollowersXUIDs(XUID: XUID): Promise<XUID[]> {
        const response = await this.restful.get(`https://social.xboxlive.com/users/xuid(${XUID})/people/xuids`, {
            "headers": {
                "XUID": XUID,
            }
        });
        if (!response.ok) {

            let errorDisplayed = {} as any;
            try {
                errorDisplayed.json = await response.json();
            } catch { };
            errorDisplayed.statusText = response.statusText;
            errorDisplayed.status = response.status;
            errorDisplayed.url = response.url;
            errorDisplayed.headers = response.headers;
            errorDisplayed.ok = response.ok;
            try {
                errorDisplayed.text = await response.text();
            } catch { };
            throw new Error(`Failed to fetch friends: ${JSON.stringify(errorDisplayed, null, 4)}`);
        }
        return (await response.json()).xuids
    }

    public async getViewAsUser(viewerXUID: XUID, viewingXUID: XUID): Promise<{ "targetFollowingCount": number, "targetFollowerCount": number, "isCallerFollowingTarget": boolean, "isTargetFollowingCaller": boolean, "hasCallerMarkedTargetAsFavorite": boolean, "hasCallerMarkedTargetAsKnown": boolean, "legacyFriendStatus": string, "recentChangeCount": number, "watermark": string }> {
        const response = await this.restful.get(`https://social.xboxlive.com/users/${viewingXUID}/summary`, {
            "headers": {
                "XUID": viewerXUID,
            }
        });
        if (!response.ok) {
            let errorDisplayed = {} as any;
            try {
                errorDisplayed.json = await response.json();
            } catch { };
            errorDisplayed.statusText = response.statusText;
            errorDisplayed.status = response.status;
            errorDisplayed.url = response.url;
            errorDisplayed.headers = response.headers;
            errorDisplayed.ok = response.ok;
            try {
                errorDisplayed.text = await response.text();
            } catch { };
            throw new Error(`Failed to fetch view: ${JSON.stringify(errorDisplayed, null, 4)} `);
        }
        return await response.json();
    }
}