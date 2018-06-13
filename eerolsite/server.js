#!/usr/bin/env node
var express = require("express");
var app = express();
app.disable("trust proxy");

var jsdom = require("jsdom");
var fs = require("fs");

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

app.get("/*", function (req, res) {
    var dom = new jsdom.JSDOM(fs.readFileSync(__dirname + "/private/page_not_found.html"), {runScripts: "dangerously"});    
    dom.window.document.getElementById("path").innerHTML = req.path;
    res.status(404).send(dom.serialize());
});

/*---lentokonepeli---*/
var lkp_latestVersion = "";

lkp_init();

function lkp_init() {
    versionRegex = new RegExp("(^.*)-\\w*-lkp.zip$");

    fs.readdirSync(__dirname + "/public/downloads").forEach(file => {
        var res = versionRegex.exec(file);
        if (res != null) {
            lkp_latestVersion = res[1];
        }
    });
}

app.get("/lkp/latest_version", function(req, res) {
    res.status(200).send(lkp_latestVersion);
});

/*------*/