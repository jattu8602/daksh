# Video Processor

A Python automation script for downloading videos from YouTube and Instagram, and uploading them to Cloudflare R2.

## Features

- Download videos from YouTube using pytube
- Download public Instagram videos using instaloader
- Extract and save video metadata
- Upload videos to Cloudflare R2
- Process multiple videos asynchronously
- Robust error handling and retry logic
- Next.js API integration

## Setup

1. Install Python dependencies:
```bash
pip install -r requirements.txt
```

2. Create a `.env` file with the following variables:
```env
# Cloudflare R2 Configuration
CLOUDFLARE_R2_ENDPOINT=https://<account_id>.r2.cloudflarestorage.com
CLOUDFLARE_R2_ACCESS_KEY_ID=your_access_key_id
CLOUDFLARE_R2_SECRET_ACCESS_KEY=your_secret_access_key
CLOUDFLARE_R2_BUCKET_NAME=your_bucket_name

# Instagram Configuration (Optional)
INSTAGRAM_SESSIONID=your_session_id_here
```

## Usage

### Command Line

```bash
python video_processor.py "https://youtube.com/watch?v=..." "https://instagram.com/p/..."
```

### Next.js API

Send a POST request to `/api/process-videos` with a JSON body:

```json
{
  "urls": [
    "https://youtube.com/watch?v=...",
    "https://instagram.com/p/..."
  ]
}
```

The API will return a JSON response with the processing results:

```json
{
  "results": [
    {
      "status": "success",
      "metadata": {
        "title": "Video Title",
        "description": "Video Description",
        "thumbnail_url": "https://...",
        "source_platform": "youtube",
        "original_url": "https://...",
        "upload_url": "https://..."  // Presigned URL valid for 7 days
      }
    }
  ]
}
```

## Error Handling

The script includes:
- Automatic retries for failed downloads and uploads
- Detailed error logging
- Cleanup of temporary files
- Validation of input URLs

## Notes

- For Instagram private content or to avoid rate limits, set the `INSTAGRAM_SESSIONID` environment variable
- Temporary files are stored in the `temp_videos` directory and automatically cleaned up
- The script supports both YouTube and Instagram video URLs
- Videos are stored in R2 with a 7-day presigned URL for access
- Videos are organized in R2 by platform (youtube/instagram) and filename