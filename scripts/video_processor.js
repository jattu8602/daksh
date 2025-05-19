const ytdl = require('ytdl-core');
const tmp = require('tmp');
const fs = require('fs-extra');

async function downloadYouTubeVideo(url) {
  if (!ytdl.validateURL(url)) {
    throw new Error('Invalid YouTube URL');
  }
  const info = await ytdl.getInfo(url);
  const title = info.videoDetails.title;
  const description = info.videoDetails.description;

  // Create a temp file
  const tmpFile = tmp.fileSync({ postfix: '.mp4' });
  const localPath = tmpFile.name;

  // Download video
  await new Promise((resolve, reject) => {
    const stream = ytdl(url, { quality: 'highestvideo' })
      .pipe(fs.createWriteStream(localPath));
    stream.on('finish', resolve);
    stream.on('error', reject);
  });

  return { title, description, localPath };
}

// For CLI usage/testing
if (require.main === module) {
  const url = process.argv[2];
  if (!url) {
    console.error('Usage: node video_processor.js <YouTube URL>');
    process.exit(1);
  }
  downloadYouTubeVideo(url)
    .then(({ title, description, localPath }) => {
      console.log(JSON.stringify({ title, description, localPath }));
    })
    .catch(err => {
      console.error('Error:', err);
      process.exit(1);
    });
}

module.exports = { downloadYouTubeVideo };