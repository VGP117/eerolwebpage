var express = require("express");
var app = express();

var jsdom = require("jsdom");
var fs = require("fs");

app.listen(8081, function () {});

app.get("/", function (req, res) {
    res.sendStatus(400);
});

app.get("/*", function (req, res) {
    res.sendStatus(400);
});

var lkp = {
    version: "0.0",

    init: function () {
        // find version
    }

}