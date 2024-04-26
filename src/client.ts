import { AuthorizationData } from "./globals";
import { RESTful } from "./RESTful";

type UserSettings = ("GameDisplayPicRaw" | "Gamerscore" | "Gamertag" | "AccountTier" | "XboxOneRep" | "PreferredColor" | "RealName" | "Bio" | "Location" | "ModernGamertag" | "ModernGamertagSuffix" | "UniqueModernGamertag" | "RealNameOverride" | "TenureLevel" | "Watermarks" | "IsQuarantined" | "DisplayedLinkedAccounts")
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

    public profiles = {
        getUserSettings: async (XUIDs: string[], settings: UserSettings[]) => {
            const response = await RESTful.post('https://profile.xboxlive.com/users/batch/profile/settings', {
                body: JSON.stringify({
                    "userIds": XUIDs,
                    "settings": settings
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
    }
}
