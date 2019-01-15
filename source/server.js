#!/usr/bin/env node
const express = require("express");
const app = express();

const jsdom = require("jsdom");
const fs = require("fs");
const jquery = require("jquery");
const path = require("path");

app.listen(8080, function () {});

app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "../images")));

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