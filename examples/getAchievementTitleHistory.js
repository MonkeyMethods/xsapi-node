const API = require("../dist/index");
const prismarineAuth = require("prismarine-auth");

const authflow = new prismarineAuth.Authflow("asd", "./profiles", {
    "authTitle": prismarineAuth.Titles.MinecraftNintendoSwitch,
    "flow": "live"
});
authflow.getXboxToken().then(async (token) => {
    const client = new API.Client(token);
    client.users.getAchievementTitleHistory("2535420857947267").then(console.log).catch(console.error);
})