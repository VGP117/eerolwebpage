#!/usr/bin/env node
var express = require("express");
var app = express();

var jsdom = require("jsdom");
var fs = require("fs");
var jquery = require("jquery");

app.listen(8080, function () {});

app.use(express.static("public"));

app.get("/", function (req, res) {
    res.sendFile( __dirname + "/index.html" );
});

app.get("/downloads/lentokonepeli_latest", function (req, res) {
    if (req.query.platform != "pc") {
        res.sendStatus(400);
        return;
    }

    var fileNameRegex = new RegExp("^.*" + req.query.platform + "-lkp.zip$");
    
    fs.readdirSync(__dirname + "/public/downloads").forEach(file => {
        if (fileNameRegex.test(file) === true) {
            res.download(__dirname + "/public/downloads/" + file);
        }
    });
});

/*---lentokonepeli---*/
var lkp_platforms = ["pc"]; // add mac and linux in the future
var lkp_latestVersion = "";

lkp_init();

function lkp_init() {
    versionRegex = new RegExp("^v(.*)-\\w*-lkp.zip$");

    fs.readdirSync(__dirname + "/public/downloads").forEach(file => {
        var res = versionRegex.exec(file);
        if (res != null) {
            lkp_latestVersion = res[1];
        }
    });

    // Setup labels and download links to reflect current version
    var dom = new jsdom.JSDOM(fs.readFileSync(__dirname + "/public/lentokonepeli.html"));
    var $ = jquery(dom.window);
    $("#latestVersion").text("Current version: " + lkp_latestVersion);
    lkp_platforms.forEach(platform => {
        $("#dl-" + platform).attr("href", "downloads/v" + lkp_latestVersion + "-" + platform + "-lkp.zip");
    });
    fs.writeFileSync(__dirname + "/public/lentokonepeli.html", dom.serialize());
}

app.get("/lkp/latest_version", function(req, res) {
    res.status(200).send(lkp_latestVersion);
});

app.get("/lkp/*", function(res, req) {
    res.sendStatus(400);
});

/*------*/

app.get("/*", function (req, res) {
    var dom = new jsdom.JSDOM(fs.readFileSync(__dirname + "/private/page_not_found.html"), {runScripts: "dangerously"});    
    var $ = jquery(dom.window);
    $("#path").html(req.path);
    res.send(dom.serialize());
});