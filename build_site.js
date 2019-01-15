const jsdom = require("jsdom");
const fs = require("fs-extra");
const jquery = require("jquery");

init();

function init() {
    fs.emptyDir(__dirname + "/build")
    .catch(err => console.error(err)).then(() => {
        fs.copy(__dirname + "/source", __dirname + "/build", {filter: sourceCopyTest})
        .catch(err => console.error(err)).then(() => {
            var timestamps = JSON.parse(fs.readFileSync(__dirname + "/build/private/project-timestamps.json", 'utf8'));
        
            lkp_init(timestamps["Lentokonepeli-X"]);
            applyTimeStampsToSites(timestamps);
            insertInlineJS();
        });
    });
}

function sourceCopyTest(file) {
    if (/js[\\\/]|css[\\\/]/.test(file) && !/\.min\./.test(file)) return false; // we only want minified files from folders "js" and "css"
    return true;
};

/**
 * Setup lentokonepeli downloads
 * @param {Object} lkp_timestamps
 */
function lkp_init(lkp_timestamps) {
    var lkp_platforms = ["pc"]; // add mac and linux in the future
    var lkp_dlArchive = {
        name: "Lentokonepeli-X",
        homePageLink: "../../lentokonepeli-x.html",
        homePageLinkAlt: "Lentokonepeli project",
        files: []
    };

    var files = fs.readdirSync(__dirname + "/build/public/downloads/lentokonepeli-x");
    var index = files.indexOf("archive.html");
    if (index > -1) {
        files.splice(index, 1);
    }
    files.reverse();
    lkp_dlArchive.files = files;

    createDlArchive(lkp_dlArchive, lkp_timestamps);

    // Setup labels and download links to reflect current version

    var dom = new jsdom.JSDOM(fs.readFileSync(__dirname + "/build/public/lentokonepeli-x.html"));
    var $ = jquery(dom.window);
    lkp_platforms.forEach(platform => {
        $("#dl-" + platform).attr("href", "downloads/lentokonepeli-x/v" + Object.keys(lkp_timestamps)[0] + "-" + platform + "-lkp.zip");
    });
    fs.writeFileSync(__dirname + "/build/public/lentokonepeli-x.html", dom.serialize());
}

/**
 * Change date-fields in html of pages to match current status
 * @param {Object} timestamps 
 */
function applyTimeStampsToSites(timestamps) {
    for (var project in timestamps) {
        var dom = new jsdom.JSDOM(fs.readFileSync(__dirname + "/build/public/" + project.toLowerCase() + ".html"));
        var $ = jquery(dom.window);
        var latest_version = Object.keys(timestamps[project])[0];

        $(".latest_version").text(latest_version);
        $(".date").text(timestamps[project][latest_version]);

        fs.writeFileSync(__dirname + "/build/public/" + project.toLowerCase() + ".html", dom.serialize());
    }
}

// Create dowloads folder page for archive object
function createDlArchive(archive, timestamps) {
    var dom = new jsdom.JSDOM(fs.readFileSync(__dirname + "/build/private/dl_archive.html"));    
    var $ = jquery(dom.window);
    $("#backLink").attr({href: archive.homePageLink, alt: archive.homePageLinkAlt});
    $("title").html("Download archive - " + archive.name);
    $("#title").html($("title").html());
    archive.files.forEach(file => {
        var fileInfo = fs.statSync(__dirname + "/build/public/downloads/" + archive.name.toLowerCase() + "/" + file);
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
    
    fs.writeFileSync(__dirname + "/build/public/downloads/" + archive.name.toLowerCase() + "/archive.html", dom.serialize());
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
    var allFiles = walkSync(__dirname + "/build/public");
    for (var i = 0; i < allFiles.length; i++) {
        if (allFiles[i].endsWith(".html")) {
            var file = fs.readFileSync(allFiles[i]);
            var dom = new jsdom.JSDOM(file);    
            var $ = jquery(dom.window);

            var scripts = $("script");
            scripts.each(function(index) {
                var src = $(this).attr("src");

                if (src != undefined) {             
                    if (src.startsWith("https://eerolehtinen.net") || !src.startsWith("http")) { // if js file is from my site
                        var jsFileName = src.split("/").slice(-1).pop(); // get stuff after last "/", is js filename

                        // if filesize of js file smaller than 500 bytes, change from external to inline
                        if (fs.statSync(__dirname + "/source/public/js/" + jsFileName).size < 500) {
                            $(this).remove();
                            var js = fs.readFileSync(__dirname + "/source/public/js/" + jsFileName);
                            $("<script>").html(js.toString()).appendTo($("body"));
                        }
                    }
                }
            });

            fs.writeFileSync(allFiles[i], dom.serialize());
        }
    }
}

// List all files in a directory recursively in a synchronous fashion
function walkSync(dir, filelist) {
    var path = path || require('path');
    var fs = fs || require('fs-extra'),
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