const { google } = require("googleapis");
const { authenticate } = require("@google-cloud/local-auth");
const path = require("path");

async function youtube() {
  const youtube = google.youtube("v3");

  const auth = await authenticate({
    keyfilePath: path.join(__dirname, "../oauth2.keys.json"),
    scopes: [
      "https://www.googleapis.com/auth/youtube.upload",
      "https://www.googleapis.com/auth/youtube",
    ],
  });

  google.options({ auth });

  return youtube;
}

module.exports = youtube();