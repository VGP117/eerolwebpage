const jsdom = require("jsdom");
const fs = require("fs-extra");
const jquery = require("jquery");
const crypto = require("crypto");
const path = require("path").posix;

init();

function init() {

    // Change folder name to save the files for comparison
    fs.ensureDirSync(__dirname + "/build/public");
    fs.ensureDirSync(__dirname + "/build/private");
    fs.moveSync(__dirname + "/build", __dirname + "/temp");

    fs.copySync(__dirname + "/source/server.js", __dirname + "/build/server.js");

    // First copy HTML files
    for (var filePath of walkSync(__dirname + "/source")) {
        if (filePath.endsWith(".html")) {
            var fileDest = filePath.replace("source", "build");
            fs.copySync(filePath, fileDest);
        }
    }

    var timestamps = fs.readJsonSync(__dirname + "/source/private/project-timestamps.json", 'utf8');
    lkp_init(timestamps["Lentokonepeli-X"]);

    applyTimeStampsToSites(timestamps);

    // Then modify html files and copy js and css (applying cache busting when applicable)
    var usedResources = {sourcePaths: [], newPaths: []};
    for (var filePath of walkSync(__dirname + "/build")) {
        // only html files and not google verification file
        if (filePath.endsWith(".html") && !path.basename(filePath).startsWith("google")) {
            var content = fs.readFileSync(filePath);
            var dom = new jsdom.JSDOM(content); 

            insertInlineJS(dom);
            updateUsedResourcePaths(dom, usedResources); // this also copies used js and css resources

            fs.writeFileSync(filePath, dom.serialize());
        }
    }

    // We are done, remove useless temp
    fs.removeSync(__dirname + "/temp");
}

/**
 * Setup lentokonepeli downloads
 * @param {Object} lkp_timestamps
 */
function lkp_init(lkp_timestamps) {
    var lkp_platforms = ["pc"]; // add mac and linux in the future
    var lkp_dlArchive = {
        name: "Lentokonepeli-X",
        homePageLink: "../lentokonepeli-x.html",
        homePageLinkAlt: "Lentokonepeli project",
        files: []
    };

    var files = fs.readdirSync(__dirname + "/downloads/lentokonepeli-x");
    files.reverse();
    lkp_dlArchive.files = files;

    createDlArchive(lkp_dlArchive, lkp_timestamps);

    // Setup labels and download links to reflect current version

    var dom = new jsdom.JSDOM(fs.readFileSync(__dirname + "/source/public/lentokonepeli-x.html"));
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
    $("title").html("Archive - " + archive.name);
    $("#title").html($("title").html());
    archive.files.forEach(file => {
        var fileInfo = fs.statSync(__dirname + "/downloads/" + archive.name.toLowerCase() + "/" + file);
        var a = $("<a>").attr({href: `../downloads/${archive.name.toLowerCase()}/${file}`, download: "", class: "fileItem"});
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

    fs.ensureDir(`${__dirname}/build/public/archives/`);
    fs.writeFileSync(`${__dirname}/build/public/archives/${archive.name.toLowerCase()}_archive.html`, dom.serialize());
}

// Create finnish-style number strings
function numberWithSpaces(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

/**
 * replace script links in html with inline js if the file size is small enough,
 * to reduce unnesessary http requests
 * @param {JSDOM} dom html dom
 *  */ 
function insertInlineJS(dom) {
    var $ = jquery(dom.window);

    var scripts = $("script");
    scripts.each(function(index) {
        var src = $(this).attr("src");

        if (src != undefined) {             
            if (src.startsWith("https://eerolehtinen.net") || !src.startsWith("http")) { // if js file is from my site
                var jsFileName = src.split("/").slice(-1).pop(); // get stuff after last "/", is js filename

                // if filesize of js file smaller than 600 bytes, change from external to inline
                if (fs.statSync(__dirname + "/source/public/js/" + jsFileName).size < 600) {
                    $(this).remove();
                    var js = fs.readFileSync(__dirname + "/source/public/js/" + jsFileName);
                    $("<script>").html(js.toString()).appendTo($("body"));
                }
            }
        }
    });
}

/** Get js and css used by this html file and create cache busting names for them
 * @param {JSDOM} dom 
 * @param {Object} usedResources already used resources
 */
function updateUsedResourcePaths (dom, usedResources) {
    var $ = jquery(dom.window);

    var scripts = $("script");
    scripts.each(function(index) {
        editDomAttrResource($(this), "src", "js", usedResources);     
    });

    var links = $("link");
    links.each(function(index) {
        editDomAttrResource($(this), "href", "css", usedResources);
    });
}

// List all files in a directory recursively in a synchronous fashion
function walkSync(dir, filelist) {
    var files = fs.readdirSync(dir);
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

function addFingerprint(fileName) {
    var splitFileName = fileName.split(".");
    splitFileName[0] += "-" + crypto.randomBytes(4).toString("hex");
    fileName = splitFileName.join(".");
    return fileName;
}

function removeFingerprint(fileName) {
    return fileName.replace("-" + getFingerprint(fileName), "");
}

function getFingerprint(fileName) {
    var baseName = path.basename(fileName, path.extname(fileName)).replace(".min", "");

    var nameSplit = baseName.split("-");

    if (nameSplit.length == 2)
        return nameSplit[1];
    return "";
}

/** Finds filename with fingerprint
 * @param {String} folder 
 * @param {String} fileName file that needs to be found, can have fingerprint (gets ignored)
 * @returns {String} relative path to fingerprinted file
 */
function getFingerprintedVersionPath (folder, fileName) {
    var noFPFileName = removeFingerprint(fileName);
    var targetFiles = walkSync(folder);
    for (targetFile of targetFiles) {
        var noFPTargetFile = removeFingerprint(targetFile).replace(folder + "/", "");
        if (noFPFileName == noFPTargetFile) {
           return targetFile;
        }
    }
    return "";
}

/** Replace resources with fingerprinted versions, if they have been changed since last time
 * @param {*} domNode 
 * @param {String} attr 
 * @param {String} resType
 * @param {Object} usedResources
 */
function editDomAttrResource(domNode, attr, resType, usedResources) {
    var attrString = domNode.attr(attr);

    if (attrString != undefined) {

        // if the file is from my site and right type
        if ((attrString.startsWith("https://eerolehtinen.net") || !attrString.startsWith("http")) && attrString.endsWith(resType)) { 

            var sourcePath = resType + "/" + attrString.split("/").pop();

            var newPath = "";

            // If fingerprint hasn't been chosen for this file
            if(!usedResources.sourcePaths.includes(sourcePath)) {

                var tempFilePath = getFingerprintedVersionPath(`${__dirname}/temp/public`, sourcePath);
                var tempFile = Buffer("");
                if (tempFilePath != "") {
                    tempFile = fs.readFileSync(tempFilePath);
                }
                var newFile = fs.readFileSync(__dirname + "/source/public/" + sourcePath);

                // If file has changed since last build, make new fingerprint
                if (tempFile.equals(newFile)) {
                    newPath = resType + "/" + path.basename(tempFilePath);
                }
                else {
                    newPath = addFingerprint(sourcePath);
                }

                usedResources.newPaths.push(newPath);
                usedResources.sourcePaths.push(sourcePath);

                fs.copySync(__dirname + "/source/public/" + sourcePath, __dirname + "/build/public/" + newPath);
            }
            else {
                newPath = usedResources.newPaths[usedResources.sourcePaths.indexOf(sourcePath)]; // get already saved new path
            }

            domNode.attr(attr, attrString.replace(sourcePath, newPath));
        }
    }
}