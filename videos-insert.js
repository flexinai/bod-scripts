const fs = require("fs");
const path = require("path");
const readline = require("readline");
const { google } = require("googleapis");
const { authenticate } = require("@google-cloud/local-auth");

// initialize the Youtube API library
const youtube = google.youtube("v3");

uploadDirectory("/Users/upstateinteractive/Desktop/videos/july-4-2020");

// very basic example of uploading a video to youtube
async function uploadDirectory(dir) {
  const auth = await authenticate({
    keyfilePath: path.join(__dirname, "../oauth2.keys.json"),
    scopes: [
      "https://www.googleapis.com/auth/youtube.upload",
      "https://www.googleapis.com/auth/youtube",
    ],
  });

  google.options({ auth });
  const promises = fs.readdirSync(dir).map((fileName) => {
    const fileSize = fs.statSync(`${dir}/${fileName}`).size;
    return youtube.videos.insert(
      {
        part: "id,snippet,status",
        notifySubscribers: false,
        requestBody: {
          snippet: {
            title: fileName,
            description: `${fileName} video`,
          },
          status: {
            privacyStatus: "unlisted",
            selfDeclaredMadeForKids: false,
          },
        },
        media: {
          body: fs.createReadStream(`${dir}/${fileName}`),
        },
      },
      {
        // Use the `onUploadProgress` event from Axios to track the
        // number of bytes uploaded to this point.
        onUploadProgress: (evt) => {
          const progress = (evt.bytesRead / fileSize) * 100;
          readline.clearLine(process.stdout, 0);
          readline.cursorTo(process.stdout, 0, null);
          process.stdout.write(`${Math.round(progress)}% complete`);
        },
      }
    );
  });
  await Promise.all(promises);
  console.dir("playlist url");
  return;
}
