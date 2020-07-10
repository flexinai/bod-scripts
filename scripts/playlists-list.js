const fs = require("fs");
const path = require("path");
const readline = require("readline");
const { google } = require("googleapis");
const { authenticate } = require("@google-cloud/local-auth");

// initialize the Youtube API library
const youtube = google.youtube("v3");

uploadDirectory("/Users/upstateinteractive/Desktop/videos/july-4-2020");

// very basic example of getting playlists for a logged in user
async function uploadDirectory(dir) {
  const auth = await authenticate({
    keyfilePath: path.join(__dirname, "../oauth2.keys.json"),
    scopes: [
      "https://www.googleapis.com/auth/youtube.upload",
      "https://www.googleapis.com/auth/youtube",
    ],
  });

  google.options({ auth });
  const playlists = await youtube.playlists.list({
    part: "id,snippet",
    mine: true
  })
  console.dir(playlists.data.items)
  console.dir(playlists.data.items[0].snippet.thumbnails)
  return;
}
