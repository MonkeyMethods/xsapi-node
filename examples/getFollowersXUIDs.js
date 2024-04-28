const API = require("../dist/index");
const prismarineAuth = require("prismarine-auth");

const authflow = new prismarineAuth.Authflow("asd", "./profiles", {
    "authTitle": prismarineAuth.Titles.MinecraftNintendoSwitch,
    "flow": "live"
});
authflow.getXboxToken().then(async (token) => {
    const client = new API.Client(token);
    client.social.getFollowersXUIDs((await authflow.getXboxToken()).userXUID, ["2533274811375291"]).then(console.log).catch(console.error);
})