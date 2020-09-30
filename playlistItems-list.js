const path = require("path");
const { google } = require("googleapis");
const { authenticate } = require("@google-cloud/local-auth");

// initialize the Youtube API library
const youtube = google.youtube("v3");

uploadDirectory("/Users/upstateinteractive/Desktop/videos/july-4-2020");

// very basic example of getting playlistItems for a logged in user
async function uploadDirectory() {
  const auth = await authenticate({
    keyfilePath: path.join(__dirname, "../oauth2.keys.json"),
    scopes: [
      "https://www.googleapis.com/auth/youtube.upload",
      "https://www.googleapis.com/auth/youtube",
    ],
  });

  google.options({ auth });
  const playlistItems = await youtube.playlistItems.list({
    part: "id,snippet",
    playlistId: 'PL9YIpGWg8O0tVCDuohYe5wyQbV_b0wVsP'
  })
  console.dir(playlistItems.data.items)
  console.dir(playlistItems.data.items[0].snippet.resourceId)
  return;
}
