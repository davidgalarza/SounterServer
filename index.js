#!/usr/bin/env nodejs
var express = require("express");
var app = express();
const ytdl = require("ytdl-core");
const translate = require("google-translate-api");

app.get("/youtubeDirect", function(req, res) {
  var url = req.param("url");
  ytdl.getInfo(url, (err, info) => {
    if (err) throw err;
    var audioFormats = ytdl.filterFormats(info.formats, "audioonly");
    console.log("Formats with only audio: " + audioFormats.length);

    var format = ytdl.chooseFormat(info.formats, { filter: "video" });
    if (format instanceof Error) {
      console.error(format.message);
      process.exit(1);
      return;
    }
    console.log(format.url);

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
