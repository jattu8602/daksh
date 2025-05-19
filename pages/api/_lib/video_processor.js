const { exec } = require('child_process');
const fs = require('fs-extra');
const path = require('path');
const util = require('util');
const execPromise = util.promisify(exec);

async function downloadYouTubeVideo(url) {
  try {
    console.log('Starting video download for URL:', url);

    // Create temp directory in project root
    const tempDir = path.join(process.cwd(), 'temp');
    await fs.ensureDir(tempDir);
    console.log('Temp directory:', tempDir);

    // Generate unique filename using timestamp
    const timestamp = Date.now();
    const outputPath = path.join(tempDir, `${timestamp}.mp4`);
    console.log('Output path:', outputPath);

    // First get video info
    console.log('Getting video info...');
    const { stdout: infoJson } = await execPromise(`yt-dlp "${url}" --dump-json`);
    const info = JSON.parse(infoJson);

    console.log('Video info retrieved:', {
      title: info.title,
      duration: info.duration,
      formats: info.formats.map(f => ({
        format: f.format,
        ext: f.ext,
        quality: f.quality
      }))
    });

    // Download the video
    console.log('Downloading video...');
    await execPromise(`yt-dlp "${url}" -o "${outputPath}" -f "bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best" --merge-output-format mp4`);

    // Wait a moment to ensure file is written
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Check if file exists
    const exists = await fs.pathExists(outputPath);
    console.log('File exists:', exists);

    if (!exists) {
      throw new Error('Downloaded file not found');
    }

    // Verify the file exists and has content
    const stats = await fs.stat(outputPath);
    console.log('File stats:', {
      size: stats.size,
      created: stats.birthtime,
      modified: stats.mtime
    });

    if (stats.size === 0) {
      throw new Error('Downloaded file is empty');
    }

    return {
      title: info.title,
      description: info.description,
      localPath: outputPath
    };
  } catch (error) {
    console.error('Error downloading video:', error);
    // Clean up any partial downloads
    try {
      if (error.path) {
        await fs.remove(error.path);
      }
    } catch (cleanupError) {
      console.error('Error cleaning up:', cleanupError);
    }
    throw new Error(`Failed to download video: ${error.message}`);
  }
}

module.exports = {
  downloadYouTubeVideo
};