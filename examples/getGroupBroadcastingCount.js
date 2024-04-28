const API = require("../dist/index");
const prismarineAuth = require("prismarine-auth");

const authflow = new prismarineAuth.Authflow("asd", "./profiles", {
    "authTitle": prismarineAuth.Titles.MinecraftNintendoSwitch,
    "flow": "live"
});
authflow.getXboxToken().then(async (token) => {
    const client = new API.Client(token);
    client.presence.getGroupBroadcastingCount((await authflow.getXboxToken()).userXUID, "People", "user").then(console.log).catch(console.error);
})