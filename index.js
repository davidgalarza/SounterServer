#!/usr/bin/env nodejs
var express = require("express");
var app = express();
const ytdl = require("ytdl-core");
const translate = require("google-translate-api");
var youtubedl = require("youtube-dl");

app.get("/youtube", function(req, res) {
  const { url } = req.query;
  var options = ['-o -'];
  youtubedl.getInfo(url, options, function(err, info) {
    if (err) throw err;

    console.log("url:", info);
    res.header("Content-Type", "application/json");
    res.send(JSON.stringify({ downloadUrl: info }, null, 4));
  });
});

app.get("/youtubeDirect", function(req, res) {
  const { url } = req.query;
  ytdl.getInfo(url, { debub: true, downloadURL: true }, (err, info) => {
    if (err) {
      console.error(err.message);
      process.exit(1);
      return;
    }
    let format = ytdl.chooseFormat(info.formats, { filter: "audioonly" });
    if (format instanceof Error) {
      console.error(format.message);
      process.exit(1);
      return;
    }
    res.header("Content-Type", "application/json");
    res.send(JSON.stringify({ downloadUrl: format.url }, null, 4));
  });
});

app.get("/translate", (req, res) => {
  const { text, from, to } = req.query;
  // console.log(text, to, from);

  if (text && to) {
    translate(text, { from, to })
      .then(data => {
        res.header("Content-Type", "application/json");
        res.send(JSON.stringify({ text: data.text }, null, 4));
      })
      .catch(error => {
        console.error(error);
        res.status(500).send(error);
      });
  } else {
    res.status(403).send({
      error: 'Please provide a "text" and "to" in the request body'
    });
  }
});

app.listen(80, function() {
  console.log("Example app listening on port 3000!");
});
