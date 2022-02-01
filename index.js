#!/usr/bin/env node
const express = require("express")
const app = express()

const fs = require("fs-extra")
const cheerio = require("cheerio")
const path = require("path").posix

app.listen(8080, function () {})

app.use(express.static(path.join(__dirname, "public"), { extensions: ["html"] }))

// Empty path (home page)
app.get("/", function (req, res) {
	res.sendFile(__dirname + "/public/index.html")
})

// Page not found path
app.get("/*", function (req, res) {
	var $ = cheerio.load(fs.readFileSync(__dirname + "/private/page_not_found.html"), {
		decodeEntities: false,
	})
	$("#path").html(req.path)
	res.status(404).send($.html())
})
