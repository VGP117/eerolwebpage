#!/usr/bin/env node
var express = require('express');
var app = express();
app.disable("trust proxy");

app.use(express.static("public"));

app.get('/', function (req, res) {
    res.sendFile( __dirname + "/" + "index.html" );
});

app.get('/*', function (req, res) {
    res.send(404, "<p style=\"line-height: 200%\">page " + req.path + " not found on lehtineneero.com <br> <a href=\"https://lehtineneero.com\">Go to home page</a></p>");
});

var server = app.listen(8080, function () {});