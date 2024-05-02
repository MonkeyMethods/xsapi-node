import { AuthorizationData } from "./globals";
/** A type representing an Xbox User ID */
type XUID = string;
type UserSettings = ("GameDisplayPicRaw" | "Gamerscore" | "Gamertag" | "AccountTier" | "XboxOneRep" | "PreferredColor" | "RealName" | "Bio" | "Location" | "ModernGamertag" | "ModernGamertagSuffix" | "UniqueModernGamertag" | "RealNameOverride" | "TenureLevel" | "Watermarks" | "IsQuarantined" | "DisplayedLinkedAccounts");
type AchievementOptions = {
    skipItems?: boolean;
    continuationToken?: string;
    maxItems?: number;
    titleId?: number;
    unlockedOnly?: boolean;
    possibleOnly?: boolean;
    types?: "Persistent" | "Challenge";
    orderBy?: "Default" | "UnlockTime" | "Gamerscore";
    order?: "Ascending" | "Descending";
};
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
                broadcast: {
                    id: string;
                    session: string;
                    provider: string;
                    started: string;
                    viewers: number;
                };
            };
        }[];
    }[];
}[];
type GetActivityResponse = {
    "connectionString": string;
    "currentPlayers": number;
    "groupId": string;
    "joinRestriction": {
        "Followed": string;
        "InviteOnly": string;
        "Public": string;
    };
    "maxPlayers": number;
    "platform": {
        "Android": string;
        "IOS": string;
        "Nintendo": string;
        "PlayStation": string;
    };
    "sequenceNumber": string;
    "titleId": number;
};
type UpdateMultiplayerActivity = {
    "connectionString": string;
    "joinRestriction": {
        "Followed": string;
        "InviteOnly": string;
        "Public": string;
    };
    "sequenceNumber": string;
    "currentPlayers": number;
    "groupId": string;
    "maxPlayers": number;
    "platform": {
        "Android": string;
        "IOS": string;
        "Nintendo": string;
        "PlayStation": string;
        "Scarlett": string;
        "Win32": string;
        "WindowsOneCore": string;
        "XboxOne": string;
    };
    "titleId": number;
};
type UpdateMultiplayerActivityResponse = {
    "connectionString": string;
    "currentPlayers": number;
    "groupId": string;
    "joinRestriction": {
        "Followed": string;
        "InviteOnly": string;
        "Public": string;
    };
    "maxPlayers": number;
    "platform": {
        "Android": string;
        "IOS": string;
        "Nintendo": string;
        "PlayStation": string;
    };
    "sequenceNumber": string;
};
type levels = 'user' | 'device' | 'title' | 'all';
export declare class Client {
    private authorizationData;
    private restful;
    private XBL;
    constructor(authorizationData: AuthorizationData);
    get users(): {
        getSettings(XUIDs: XUID[], options: UserSettings[]): Promise<Record<XUID, Record<string, any>>>;
        getAchievements(XUID: XUID, options?: AchievementOptions): Promise<AchievementsResponse>;
        getXUID(username: string): Promise<XUID>;
        getAchievementTitleHistory(XUID: XUID, options?: {
            skipItems?: number;
            continuationToken?: string;
            maxItems?: number;
        }): Promise<any>;
    };
    get presence(): {
        getCurrentPresence(): Promise<PresenceRecord>;
        getBatchUserPresence(XUIDs: string[]): Promise<PresenceRecord[]>;
        getCurrentGroupPresence(level: levels): Promise<PresenceRecord[]>;
        updateTitlePresence(xuid: string, id: string, placement: string, state: string): Promise<any>;
        removeTitlePresence(xuid: string, titleId: string, deviceId?: string, deviceType?: string): Promise<void>;
        getGroupPresence(xuid: string, level: levels): Promise<PresenceRecord[]>;
        getGroupBroadcastingPresence(xuid: string, level: levels): Promise<BroadCastingPresenceRecord>;
        getGroupBroadcastingCount(xuid: string, level?: string): Promise<any>;
    };
    get multiplayer(): {
        getMultiplayerActivity(titleId: number, XUID: XUID): Promise<GetActivityResponse>;
        updateMultiplayerActivity(titleId: number, XUID: XUID, activity: UpdateMultiplayerActivity): Promise<UpdateMultiplayerActivityResponse>;
        deleteMultiplayerActivity(titleId: number, XUID: XUID, sequenceNumber: string): Promise<void>;
    };
    get social(): {
        getFollowers(XUID: XUID, options: {
            view: ("All" | "Favorite" | "LegacyXboxLiveFriends");
            maxItems: number;
            startIndex: number;
        }): Promise<{
            "people": {
                "xuid": XUID;
                "isFavorite": boolean;
                "isFollowingCaller": boolean;
                "socialNetworks"?: string[];
            };
            "totalCount": number;
        }>;
        getFollowersAsUser(userXUID: XUID, targetXUID: XUID): Promise<{
            "xuid": XUID;
            "isFavorite": boolean;
            "isFollowingCaller": boolean;
            "socialNetworks"?: string[];
        }>;
        getFollowersXUIDs(XUID: XUID, XUIDS: string[]): Promise<XUID[]>;
        getFriends(XUID: XUID, options: {
            view: ("All" | "Favorite" | "LegacyXboxLiveFriends");
            maxItems: number;
            startIndex: number;
        }): Promise<{
            "people": {
                "xuid": XUID;
                "isFavorite": boolean;
                "isFollowingCaller": boolean;
                "socialNetworks"?: string[];
            };
            "totalCount": number;
        }>;
        getViewAsUser(viewingXUID: XUID): Promise<{
            "targetFollowingCount": number;
            "targetFollowerCount": number;
            "isCallerFollowingTarget": boolean;
            "isTargetFollowingCaller": boolean;
            "hasCallerMarkedTargetAsFavorite": boolean;
            "hasCallerMarkedTargetAsKnown": boolean;
            "legacyFriendStatus": string;
            "recentChangeCount": number;
            "watermark": string;
        }>;
    };
    get clubs(): {
        getChat: (clubId: string, amount: number) => Promise<any>;
        getClub: (clubId: string) => Promise<{
            clubs: {
                id: string;
                name: string;
                type: "secret" | "public";
                shortName: null | string;
                description: string;
                ownerXuid: string;
                founderXuid: string;
                creationDateUtc: string;
                displayImageUrl: string;
                backgroundImageUrl: string;
                preferredLocale: string;
                associatedTitles: string[];
                tags: string[];
                settings: any;
                preferredColor: {
                    "primaryColor": string;
                    "secondaryColor": string;
                    "tertiaryColor": string;
                };
                followersCount: number;
                membersCount: number;
                moderatorsCount: number;
                recommendedCount: number;
                requestedCount: number;
                clubPresenceCount: number;
                clubPresenceTodayCount: number;
                roster: {
                    moderator: {
                        "actorXuid": string;
                        "xuid": string;
                        "createdDate": string;
                    }[];
                };
                targetRoles: null | any;
                clubPresence: {
                    "xuid": string;
                    "lastSeenTimestamp": string;
                    "lastSeenState": "NotInClub" | string;
                }[];
                state: "None" | string;
                suspendedUntilUtc: null | string;
                reportCount: number;
                reportedItemsCount: number;
            }[];
            searchFacetResults: null | any;
            recommendationCounts: null | number;
        }>;
        getFeed: (clubId: string, amount: number) => Promise<any>;
        findClub: (xuid: string) => Promise<any>;
        sendFeed: (message: string, titleId: number, target: "all" | "club", type: "text" | "image" | "video") => Promise<any>;
    };
}
export {};
