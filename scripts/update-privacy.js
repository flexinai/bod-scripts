/**
 * Get the playlistId from the command line
 */
const [ playlistId ] = process.argv.slice(2);


async function updatePrivacy() {
  const fullVideos = [];

  /**
   * getVideos - recursive function to get all of the videos in a playlist from multiple pages
   * @param {*} playlistId
   * @param {*} pageToken
   */
  async function getVideos(playlistId, pageToken) {
    const playlistItems = await youtube.playlistItems.list({
      part: "id,snippet",
      maxResults: 50,
      playlistId,
      pageToken
    })
    const { nextPageToken, items } = playlistItems.data
    if (nextPageToken) {
      await getVideos(playlistId, nextPageToken)
    }

    const videoIds = items.map(item => item.snippet.resourceId.videoId);
    /**
     * List all of the videos, necessary to get the titles for the "update" API request
     */
    const videos = await youtube.videos.list({
      part: "id,snippet",
      id: videoIds
    })

    fullVideos.push(...videos.data.items)
    return fullVideos
  }

  /**
   * Authenticate to YouTube
   */
  const youtube = await require('./youtube');
  
  /**
   * Get the video data including title and categoryId
   */
  await getVideos(playlistId)

  /**
   * Update all videos to be unlisted with privacy status of unlisted
   */
  const promises = fullVideos.map(item => {
    return youtube.videos.update(
      {
        part: "id,snippet,status",
        requestBody: {
          id: item.id,
          kind: 'youtube#video',
          status: {
            privacyStatus: 'unlisted',
            selfDeclaredMadeForKids: false
          },
          snippet: {
            title: item.snippet.title,
            categoryId: item.snippet.categoryId || '21'
          },
        }
      }
    );
  })

  await Promise.all(promises)
  return;
}

updatePrivacy();