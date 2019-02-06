#!/usr/bin/env node
const express = require("express");
const app = express();

const jsdom = require("jsdom");
const fs = require("fs-extra");
const jquery = require("jquery");
const path = require("path");
const os = require("os");

app.listen(8080, function () {});

/** Monitor the amount of downloads from this server
 * eg. downloading /downloads/lentokonepeli-x/pc-lkp.zip increments json
 * => 
 * { "lentokonepeli-x": { "pc-lkp.zip": 1 } }
 * */
app.get("/downloads/*", (req, res, next) => {
    fs.exists(__dirname + "/public" + req.url, exists => {
        if (exists) incrementDlCountJson(req.url);
    });
    next()
});

app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "../images")));
app.use("/downloads", express.static(path.join(__dirname, "../downloads")));

app.get("/", function (req, res) {
    res.sendFile( __dirname + "/public/index.html" );
});

/*---lentokonepeli---*/
var lkp_latestVersion = "";
lkp_setLatestVersion();
function lkp_setLatestVersion() {
    var lkp_stamps = JSON.parse(fs.readFileSync(__dirname + "/private/project-timestamps.json", 'utf8'))["Lentokonepeli-X"];
    lkp_latestVersion = Object.keys(lkp_stamps)[0];
}

app.get("/lkp/latest_version", function(req, res) {
    res.status(200).send(lkp_latestVersion);
});

app.get("/lkp/*", function(req, res) {
    res.sendStatus(400);
});
/*------*/

// requested path not in public folder or /lkp
app.get("/*", function (req, res) {
    var dom = new jsdom.JSDOM(fs.readFileSync(__dirname + "/private/page_not_found.html"), {runScripts: "dangerously"});    
    var $ = jquery(dom.window);
    $("#path").html(req.path);
    res.status(404).send(dom.serialize());
});


var dlCountCache = {};

/** Increment cache and update local json file
 * @param {String} reqUrl
 */
function incrementDlCountJson(reqUrl) {
    if (dlCountCache = {}) { // Cache is empty => fetch saved file
        var dlCountCache = fs.readJsonSync(os.homedir() + "/siteDlCount.json", {throws: false});

        if (dlCountCache == undefined) { // File is empty => leave cache to empty
            dlCountCache = {};
        }
    }

    var path = reqUrl.slice(11).split("/"); // remove "/downloads/" and split the remainder 

    for (var i = 0; i < path.length; i++) {
        if (i == path.length - 1) {
            if (!Object.keys(dlCountCache).includes(path[i])) {
                dlCountCache[path[i]] = 0; // if key doesn't exist, create it 
            }
            dlCountCache[path[i]] = ++dlCountCache[path[i]]; // Increment value when reaching last part of path
        }
        else {
            if (!Object.keys(dlCountCache).includes(path[i])) {
                dlCountCache[path[i]] = {}; // if key doesn't exist, create it 
            }
            dlCountCache = dlCountCache[path[i]]; // Traslate through path if not in destination
        }
    }

    fs.writeJson(os.homedir() + "/siteDlCount.json", dlCountCache, err => {
        if (err) console.err("Couldn't save dlCount json: " + err.message);
    });
}

