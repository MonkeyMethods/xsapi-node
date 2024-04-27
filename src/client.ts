import { types } from "util";
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
            throw new Error(`Failed to fetch user settings: ${response.statusText}`);
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
            throw new Error(`Failed to fetch user achievements: ${response.statusText}`);
        }
        return (await response.json())
    }

    // Multiplayer Activity URIs <multiplayeractivity.xboxlive.com> | <https://learn.microsoft.com/en-us/gaming/gdk/_content/gc/reference/live/rest/uri/multiplayeractivity/atoc-reference-multiplayer-activity>
    public async getMultiplayerActivity(titleId: number, XUID: XUID): Promise<GetActivityResponse> {
        const response = await this.restful.get(`https://multiplayeractivity.xboxlive.com/titles/${titleId}/users/${XUID}/activities`);
        if (!response.ok) {
            throw new Error(`Failed to fetch multiplayer activity: ${response.statusText}`);
        }
        return await response.json();
    }

    public async updateMultiplayerActivity(titleId: number, XUID: XUID, activity: UpdateMultiplayerActivity): Promise<UpdateMultiplayerActivityResponse> {
        const response = await this.restful.put(`https://multiplayeractivity.xboxlive.com/titles/${titleId}/users/${XUID}/activities`, {
            body: JSON.stringify(activity)
        });
        if (!response.ok) {
            throw new Error(`Failed to update multiplayer activity: ${response.statusText}`);
        }
        return (await response.json());
    }

    public async deleteMultiplayerActivity(titleId: number, XUID: XUID, sequenceNumber: string): Promise<void> {
        const response = await this.restful.delete(`https://multiplayeractivity.xboxlive.com/titles/${titleId}/users/${XUID}/activities`, {
            body: JSON.stringify({ sequenceNumber })
        });
        if (!response.ok) {
            throw new Error(`Failed to delete multiplayer activity: ${response.statusText}`);
        }
        return;
    }
}

