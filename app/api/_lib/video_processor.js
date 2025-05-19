const { exec } = require('child_process');
const fs = require('fs-extra');
const path = require('path');
const util = require('util');
const execPromise = util.promisify(exec);

async function downloadYouTubeVideo(url) {
  let tempDir;
  let outputPath;

  try {
    console.log('Starting video download for URL:', url);

    // Create temp directory in project root
    tempDir = path.join(process.cwd(), 'temp');
    await fs.ensureDir(tempDir);
    console.log('Temp directory:', tempDir);

    // Generate unique filename using timestamp
    const timestamp = Date.now();
    outputPath = path.join(tempDir, `${timestamp}.mp4`);
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

    // Try multiple download approaches
    let downloadSuccess = false;
    const downloadAttempts = [
      // First attempt: Best quality with format selection
      `yt-dlp "${url}" -o "${outputPath}" -f "bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best" --merge-output-format mp4`,
      // Second attempt: Simple best quality
      `yt-dlp "${url}" -o "${outputPath}" -f "best"`,
      // Third attempt: Most compatible format
      `yt-dlp "${url}" -o "${outputPath}" -f "worst[ext=mp4]"`
    ];

    for (const [index, command] of downloadAttempts.entries()) {
      try {
        console.log(`Download attempt ${index + 1} with command:`, command);
        const { stdout, stderr } = await execPromise(command);
        console.log(`Download attempt ${index + 1} stdout:`, stdout);
        if (stderr) console.log(`Download attempt ${index + 1} stderr:`, stderr);

        // Check if file exists
        const exists = await fs.pathExists(outputPath);
        console.log(`File exists after attempt ${index + 1}:`, exists);

        if (exists) {
          // Verify the file exists and has content
          const stats = await fs.stat(outputPath);
          console.log('File stats:', {
            size: stats.size,
            created: stats.birthtime,
            modified: stats.mtime
          });

          if (stats.size > 0) {
            downloadSuccess = true;
            break;
          } else {
            console.log(`File is empty after attempt ${index + 1}, trying next attempt...`);
            await fs.remove(outputPath);
          }
        } else {
          console.log(`File not found after attempt ${index + 1}, trying next attempt...`);
        }
      } catch (error) {
        console.error(`Error in download attempt ${index + 1}:`, error);
        // Continue to next attempt
      }
    }

    if (!downloadSuccess) {
      // List directory contents for debugging
      const files = await fs.readdir(tempDir);
      console.log('Contents of temp directory:', files);
      throw new Error('All download attempts failed');
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
      if (outputPath) {
        await fs.remove(outputPath);
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