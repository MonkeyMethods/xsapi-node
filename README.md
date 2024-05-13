# xsapi-node
`xsapi-node` is a TypeScript wrapper for the Xbox Services RESTful API, this package includes methods for interacting with user settings, achievements, presence, multiplayer activity, social interactions, and club activities.

### Example
```js
const { Client } = require("xsapi-node");
const prismarineAuth = require("prismarine-auth");

const authflow = new prismarineAuth.Authflow("asd", "./profiles", {
    "authTitle": prismarineAuth.Titles.MinecraftNintendoSwitch,
    "flow": "live"
});
authflow.getXboxToken().then(async (token) => {
    const client = new Client(token);
    client.users.getSettings([token.userXUID], ["ModernGamertag", "Gamerscore", "Bio"]).then(i => console.log(i)).catch(console.error);
})
```


### Users
- `getSettings(XUIDs: XUID[], options: UserSettings[])`: Fetches settings for multiple users specified by their XUIDs.
- `getAchievements(XUID: XUID, options: AchievementOptions = {})` Fetches achievements for a specific user.
- `getXUID(username: string)` Fetches the xuid of the for the specified user.
- `getAchievementTitleHistory(XUID: XUID, options?: { skipItems?: number, continuationToken?: string, maxItems?: number })` Fetches the achivement title history for the specified user.
### Presence
- `getCurrentPresence()`: Fetches the current presence of the user.
- `getBatchUserPresence(XUIDs: string[])`: Fetches the presence of multiple users.
- `getCurrentGroupPresence(level: levels)`: Fetches the presence of groups at different levels.
- `updateTitlePresence(xuid: string, id: string, placement: string, state: string)`: Updates the presence of a title.
- `removeTitlePresence(xuid: string, titleId: string, deviceId?: string, deviceType?: string)`: Removes the presence of a title.
- `getGroupPresence(xuid: string, level: levels)`: Fetches the presence of a group.
- `getGroupBroadcastingPresence(xuid: string, level: levels)`: Fetches the broadcasting presence of a group.
- `getGroupBroadcastingCount(xuid: string, level: string = 'title')`: Fetches the count of broadcasting in a group.

### Multiplayer
- `getMultiplayerActivity(titleId: number, XUID: XUID)`: Fetches multiplayer activity for a specific user and title.
- `updateMultiplayerActivity(titleId: number, XUID: XUID, activity: UpdateMultiplayerActivity)`: Updates multiplayer activity for a specific user and title.
- `deleteMultiplayerActivity(titleId: number, XUID: XUID, sequenceNumber: string)`: Deletes multiplayer activity for a specific user and title.

### Social
- `getFollowers(XUID: XUID, options: { view: ("All" | "Favorite" | "LegacyXboxLiveFriends"), maxItems: number, startIndex: number })`: Fetches followers of a user.
- `getFollowersAsUser(userXUID: XUID, targetXUID: XUID)`: Fetches followers as a user.
- `getFollowersXUIDs(XUID: XUID, XUIDS: string[])`: Fetches XUIDs of followers.
- `getFriends(XUID: XUID, options: { view: ("All" | "Favorite" | "LegacyXboxLiveFriends"), maxItems: number, startIndex: number })`: Fetches friends of a user.
- `getViewAsUser(viewingXUID: XUID)`: Fetches the view as a user.

### Clubs
- `getChat(clubId: string, amount: number)`: Fetches chat messages from a club.
- `getClub(clubId: string)`: Fetches club details.
- `getFeed(clubId: string, amount: number)`: Fetches the feed of a club.
- `findClub(xuid: string)`: Finds a club by XUID.
- `sendFeed(message: string, titleId: number, target: "all" | "club", type: "text" | "image" | "video")`: Sends a feed message.