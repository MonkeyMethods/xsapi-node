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
    client.clubs.getClub("3379864863692748").then((data) => {
        fs.writeFileSync(__dirname + "/club.json", JSON.stringify(data, null, 4));
        console.log("Club data saved to club.json");
    }).catch(console.error);
})