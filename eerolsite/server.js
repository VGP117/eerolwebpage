#!/usr/bin/env node
var express = require('express');
var app = express();

app.use(express.static("public"));

app.get('/', function (req, res) {
    res.sendFile( __dirname + "/" + "index.html" );
});

app.get('/*', function (req, res) {
    res.send(404, req.path + "not found");
});

var server = app.listen(8080, function () {});