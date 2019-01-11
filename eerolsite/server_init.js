const jsdom = require("jsdom");
const fs = require("fs");
const jquery = require("jquery");

init();

function init() {
    var timestamps = JSON.parse(fs.readFileSync(__dirname + "/private/project-timestamps.json", 'utf8'));

    lkp_init(timestamps["Lentokonepeli-X"]);
    applyTimeStampsToSites(timestamps);
    //insertInlineJS();
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
        $("#dl-" + platform).attr("href", "downloads/lentokonepeli-x/v" + Object.keys(lkp_timestamps)[0] + "-" + platform + "-lkp.zip");
    });
    fs.writeFileSync(__dirname + "/public/lentokonepeli-x.html", dom.serialize());
}

function applyTimeStampsToSites(timestamps) {
    for (var project in timestamps) {
        var dom = new jsdom.JSDOM(fs.readFileSync(__dirname + "/public/" + project.toLowerCase() + ".html"));
        var $ = jquery(dom.window);
        var latest_version = Object.keys(timestamps[project])[0];

        $(".latest_version").text(latest_version);
        $(".date").text(timestamps[project][latest_version]);

        fs.writeFileSync(__dirname + "/public/" + project.toLowerCase() + ".html", dom.serialize());
    }
}

function createDlArchive(archive, timestamps) {
    var dom = new jsdom.JSDOM(fs.readFileSync(__dirname + "/private/dl_archive.html"));    
    var $ = jquery(dom.window);
    $("#backLink").attr({href: archive.homePageLink, alt: archive.homePageLinkAlt});
    $("title").html("Download archive - " + archive.name);
    $("#title").html($("title").html());
    archive.files.forEach(file => {
        var fileInfo = fs.statSync(__dirname + "/public/downloads/" + archive.name.toLowerCase() + "/" + file);
        var a = $("<a>").attr({href: file, download: "", class: "fileItem"});
        $("<div class='hasIcon'></div>").text(file).appendTo(a);
        var span = $("<span>").append(numberWithSpaces(parseInt(fileInfo.size/1024)) + " KB");
        var span2 = $("<span>");
        for (var version in timestamps) {
            if (file.indexOf(version) != -1)
                span2.text(timestamps[version]);
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

// Create finnish-style number strings
function numberWithSpaces(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

/**
 * replace script links in html with inline js if the file size is small enough,
 * to reduce unnesessary http requests
 *  */ 
function insertInlineJS() {
    var allFiles = walkSync(__dirname + "/public");
    for (var i = 0; i < allFiles.length; i++) {
        if (allFiles[i].endsWith(".html")) {
            var file = fs.readFileSync(allFiles[i]);
            var dom = new jsdom.JSDOM(file);    
            var $ = jquery(dom.window);

            var inlineScripts = $("script[id]");
            inlineScripts.each(function(index) {
                var src = $(this).attr("id");
                var jsFileName = src.split("/").slice(-1).pop(); // get stuff after last "/", is js filename
                
                // if filesize of js file larger than 500 bytes, change from inline to external
                if (fs.statSync(__dirname + "/public/js/" + jsFileName).size > 0) {
                    var newScriptTag = $("<script>").attr({defer: "", src: src});
                    $(this).replaceWith(newScriptTag); 
                }
            });
            var externalScripts = $("script:not([id])");
            externalScripts.each(function(index) {
                var src = $(this).attr("src");
                    var jsFileName = src.split("/").slice(-1).pop(); // get stuff after last "/", is js filename
                    
                    // if filesize of js file smaller than 500 bytes, change from external to inline
                    if (fs.statSync(__dirname + "/public/js/" + jsFileName).size < 100000) {
                        var newScriptTag = $("<script>").attr({id: src}); // Save src as id if we later want to change
                        newScriptTag.html(fs.readFileSync(__dirname + "/public/js/" + jsFileName)); // move js file to tag content
                        $(this).replaceWith(newScriptTag);
                    }
            });

            fs.writeFileSync(allFiles[i]+ "1", dom.serialize());
        }
    }
}

// List all files in a directory recursively in a synchronous fashion
function walkSync(dir, filelist) {
    var path = path || require('path');
    var fs = fs || require('fs'),
        files = fs.readdirSync(dir);
    filelist = filelist || [];
    files.forEach(function(file) {
        if (fs.statSync(path.join(dir, file)).isDirectory()) {
            filelist = walkSync(path.join(dir, file), filelist);
        }
        else {
            filelist.push(path.join(dir, file));
        }
    });
    return filelist;
};