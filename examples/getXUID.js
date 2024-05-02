const API = require("../dist/index");
const prismarineAuth = require("prismarine-auth");
const fs = require("fs");

const authflow = new prismarineAuth.Authflow("asd", "./profiles", {
    "authTitle": prismarineAuth.Titles.MinecraftNintendoSwitch,
    "flow": "live"
});
authflow.getXboxToken().then(async (token) => {
    const client = new API.Client(token);

    // Get the club by club ID
    client.users.getXUID("asd").then((data) => {
        console.log(data);
    }).catch(console.error);
})