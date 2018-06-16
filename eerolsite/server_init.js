const jsdom = require("jsdom");
const fs = require("fs");
const jquery = require("jquery");

init();

function init() {
    var timestamps = JSON.parse(fs.readFileSync(__dirname + "/private/project-timestamps.json", 'utf8'));

    lkp_init(timestamps["Lentokonepeli-X"]);
    applyTimeStampsToSites(timestamps);
}

function lkp_init(lkp_timestamps) {
    var lkp_platforms = ["pc"]; // add mac and linux in the future
    var lkp_dlArchive = {
        name: "Lentokonepeli-X",
        homePageLink: "../../lentokonepeli-x.html",
        homePageLinkAlt: "Lentokonepeli project",
        files: []
    };

    var files = fs.readdirSync(__dirname + "/public/downloads/lentokonepeli-x");
    var index = files.indexOf("archive.html");
    if (index > -1) {
        files.splice(index, 1);
    }
    files.reverse();
    lkp_dlArchive.files = files;

    createDlArchive(lkp_dlArchive, lkp_timestamps);

    // Setup labels and download links to reflect current version

    var dom = new jsdom.JSDOM(fs.readFileSync(__dirname + "/public/lentokonepeli-x.html"));
    var $ = jquery(dom.window);
    lkp_platforms.forEach(platform => {
        $("#dl-" + platform).attr("href", "downloads/v" + lkp_timestamps[Object.keys(lkp_timestamps)[0]] + "-" + platform + "-lkp.zip");
    });
    fs.writeFileSync(__dirname + "/public/lentokonepeli-x.html", dom.serialize());
}

function applyTimeStampsToSites(timestamps) {
    for (var project in timestamps) {
        var dom = new jsdom.JSDOM(fs.readFileSync(__dirname + "/public/" + project.toLowerCase() + ".html"), {runScripts: "dangerously"});    
        var $ = jquery(dom.window);
        var latest_version = Object.keys(timestamps[project])[0];

        $(".latest_version").text(latest_version);
        $(".date").text(timestamps[project][latest_version]);

        fs.writeFileSync(__dirname + "/public/" + project.toLowerCase() + ".html", dom.serialize());
    }
}

function createDlArchive(archive, timestamps) {
    var dom = new jsdom.JSDOM(fs.readFileSync(__dirname + "/private/dl_archive.html"), {runScripts: "dangerously"});    
    var $ = jquery(dom.window);
    $("#backLink").attr({href: archive.homePageLink, alt: archive.homePageLinkAlt});
    $("title").html("Download archive - " + archive.name);
    $("#title").html($("title").html());
    archive.files.forEach(file => {
        var fileInfo = fs.statSync(__dirname + "/public/downloads/" + archive.name.toLowerCase() + "/" + file);
        var a = $("<a>").text(file).attr({href: file, download: "", class: "fileItem"});
        var span = $("<span>").append(parseInt(fileInfo.size/1024).toLocaleString() + " KB");
        var span2 = $("<span>");
        for (var version in timestamps) {
            if (file.indexOf(version) != -1)
                span2.append(timestamps[version]);
        }
        if (span.text() == "") {
            console.error("A version hasn't been added to project-timestamps.json");
        }

        a.append(span).append(span2);
        var li = $("<li>").append(a);
         $("ul").append(li);
    });
    
    fs.writeFileSync(__dirname + "/public/downloads/" + archive.name.toLowerCase() + "/archive.html", dom.serialize());
}