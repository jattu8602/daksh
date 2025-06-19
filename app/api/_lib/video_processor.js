const { exec } = require('child_process')
const fs = require('fs-extra')
const path = require('path')
const util = require('util')
const execPromise = util.promisify(exec)

async function downloadYouTubeVideo(url) {
  let tempDir
  let outputPath

  try {
    console.log('Starting video download for URL:', url)

    // Create temp directory in project root
    tempDir = path.join(process.cwd(), 'temp')
    await fs.ensureDir(tempDir)
    console.log('Temp directory:', tempDir)

    // Generate unique filename using timestamp
    const timestamp = Date.now()
    outputPath = path.join(tempDir, `${timestamp}.mp4`)
    console.log('Output path:', outputPath)

    // First get video info
    console.log('Getting video info...')
    const { stdout: infoJson } = await execPromise(
      `yt-dlp "${url}" --dump-json`
    )
    const info = JSON.parse(infoJson)

    console.log('Video info retrieved:', {
      title: info.title,
      duration: info.duration,
      formats: info.formats.map((f) => ({
        format: f.format,
        ext: f.ext,
        quality: f.quality,
      })),
    })

    // Try a single, optimized download approach
    let downloadSuccess = false
    const outputTemplate = path.join(tempDir, `${timestamp}.%(ext)s`)

    // This format string prefers pre-merged mp4 files, falling back to other pre-merged formats.
    // This is faster and avoids requiring ffmpeg.
    const downloadCommand = `yt-dlp "${url}" -o "${outputTemplate}" -f "best[ext=mp4]/best"`

    try {
      console.log(`Download attempt with command:`, downloadCommand)
      const { stdout, stderr } = await execPromise(downloadCommand, {
        timeout: 300000,
      }) // 5 minute timeout
      console.log(`Download stdout:`, stdout)
      if (stderr) console.log(`Download stderr:`, stderr)

      // Find the actual file downloaded by yt-dlp, as the extension is determined dynamically.
      const files = await fs.readdir(tempDir)
      const downloadedFile = files.find((file) =>
        file.startsWith(timestamp.toString())
      )

      if (downloadedFile) {
        outputPath = path.join(tempDir, downloadedFile)
        const stats = await fs.stat(outputPath)
        console.log('File stats:', {
          size: stats.size,
          created: stats.birthtime,
          modified: stats.mtime,
        })
        if (stats.size > 0) {
          downloadSuccess = true
        } else {
          // The file was created but is empty.
          await fs.remove(outputPath)
        }
      }
    } catch (error) {
      console.error(`Error in download attempt:`, error)
    }

    if (!downloadSuccess) {
      // Cleanup any files from the failed attempt
      const files = await fs.readdir(tempDir)
      for (const file of files) {
        if (file.startsWith(timestamp.toString())) {
          await fs.remove(path.join(tempDir, file))
          console.log(`Cleaned up partial/failed download: ${file}`)
        }
      }
      throw new Error('Download failed after optimized attempt.')
    }

    return {
      title: info.title,
      description: info.description,
      localPath: outputPath,
    }
  } catch (error) {
    console.error('Error downloading video:', error)
    // Clean up any partial downloads
    try {
      if (outputPath) {
        await fs.remove(outputPath)
      }
    } catch (cleanupError) {
      console.error('Error cleaning up:', cleanupError)
    }
    throw new Error(`Failed to download video: ${error.message}`)
  }
}

module.exports = {
  downloadYouTubeVideo,
}
