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

/*---lentokonepeli---*/
var lkp_platforms = ["pc"]; // add mac and linux in the future
var lkp_latestVersion = "";
var lkp_dlArchive = {
    name: "Lentokonepeli-X",
    files: []
};

lkp_init();

function lkp_init() {
    var files = fs.readdirSync(__dirname + "/public/downloads/Lentokonepeli-X");
    var index = files.indexOf("archive.html");
    if (index > -1) {
        files.splice(index, 1);
    }
    files.reverse();
    lkp_dlArchive.files = files;
    var res = /^v(.*)-\w*-lkp.zip$/.exec(lkp_dlArchive.files[0]);
    lkp_latestVersion = res[1];

    createDlArchive(lkp_dlArchive);

    // Setup labels and download links to reflect current version
    var dom = new jsdom.JSDOM(fs.readFileSync(__dirname + "/public/lentokonepeli.html"));
    var $ = jquery(dom.window);
    $("#latestVersion").text("Current version: " + lkp_latestVersion);
    lkp_platforms.forEach(platform => {
        $("#dl-" + platform).attr("href", "downloads/v" + lkp_latestVersion + "-" + platform + "-lkp.zip");
    });
    fs.writeFileSync(__dirname + "/public/lentokonepeli.html", dom.serialize());
}

app.get("/downloads/lentokonepeli-x/archive", function (req, res) {
    sendDlArchive(lkp_dlArchive, res);
});

app.get("/lkp/latest_version", function(req, res) {
    res.status(200).send(lkp_latestVersion);
});

app.get("/lkp/*", function(req, res) {
    res.sendStatus(400);
});


/*------*/

app.get("/*", function (req, res) {
    var dom = new jsdom.JSDOM(fs.readFileSync(__dirname + "/private/page_not_found.html"), {runScripts: "dangerously"});    
    var $ = jquery(dom.window);
    $("#path").html(req.path);
    res.send(dom.serialize());
});

function createDlArchive(archive) {
    var dom = new jsdom.JSDOM(fs.readFileSync(__dirname + "/private/dl_archive.html"), {runScripts: "dangerously"});    
    var $ = jquery(dom.window);
    $("title").html("Download archive - " + archive.name);
    $("#pageTitle").html($("title").html());
    archive.files.forEach(file => {
         var li = $("<li>").append( $("<a>").text(file).attr({href: file, download: ""}));
         $("ul").append(li);
    });
    
    fs.writeFileSync(__dirname + "/public/downloads/" + archive.name.toLowerCase() + "/archive.html", dom.serialize());
}