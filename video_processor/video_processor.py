import os
import asyncio
import logging
from typing import List, Dict, Optional
from dataclasses import dataclass
from pathlib import Path
from urllib.parse import urlparse
from dotenv import load_dotenv
from tenacity import retry, stop_after_attempt, wait_exponential
import yt_dlp
import instaloader
import boto3
from botocore.config import Config

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@dataclass
class VideoMetadata:
    title: str
    description: str
    thumbnail_url: str
    source_platform: str
    original_url: str
    local_path: Optional[str] = None
    upload_url: Optional[str] = None

class VideoProcessor:
    def __init__(self):
        load_dotenv()
        self.temp_dir = Path("temp_videos")
        self.temp_dir.mkdir(exist_ok=True)

        # Initialize Cloudflare R2 client
        self.r2 = boto3.client(
            's3',
            endpoint_url=os.getenv('CLOUDFLARE_R2_ENDPOINT'),
            aws_access_key_id=os.getenv('CLOUDFLARE_R2_ACCESS_KEY_ID'),
            aws_secret_access_key=os.getenv('CLOUDFLARE_R2_SECRET_ACCESS_KEY'),
            config=Config(signature_version='s3v4'),
            region_name='auto'
        )
        self.bucket_name = os.getenv('CLOUDFLARE_R2_BUCKET_NAME')

        # Initialize Instagram loader
        self.instagram = instaloader.Instaloader()
        if session_id := os.getenv("INSTAGRAM_SESSIONID"):
            self.instagram.load_session_from_file("instagram_session", session_id)

    @retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=4, max=10))
    async def download_youtube_video(self, url: str) -> VideoMetadata:
        try:
            ydl_opts = {
                'outtmpl': str(self.temp_dir / '%(id)s.%(ext)s'),
                'format': 'bestvideo+bestaudio/best',
                'merge_output_format': 'mp4',
                'quiet': True,
                'noplaylist': True,
            }
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                info = ydl.extract_info(url, download=True)
                file_path = self.temp_dir / f"{info['id']}.mp4"
                # If file doesn't exist as .mp4, try the original extension
                if not file_path.exists():
                    file_path = self.temp_dir / f"{info['id']}.{info['ext']}"

            return VideoMetadata(
                title=info.get('title', ''),
                description=info.get('description', ''),
                thumbnail_url=info.get('thumbnail', ''),
                source_platform="youtube",
                original_url=url,
                local_path=str(file_path)
            )
        except Exception as e:
            logger.error(f"Error downloading YouTube video {url}: {str(e)}")
            raise

    @retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=4, max=10))
    async def download_instagram_video(self, url: str) -> VideoMetadata:
        try:
            # Extract post shortcode from URL
            shortcode = url.split("/p/")[1].split("/")[0]
            post = instaloader.Post.from_shortcode(self.instagram.context, shortcode)

            if not post.is_video:
                raise ValueError("URL does not point to an Instagram video")

            file_path = self.temp_dir / f"{shortcode}.mp4"
            self.instagram.download_post(post, target=str(self.temp_dir))

            return VideoMetadata(
                title=post.caption if post.caption else shortcode,
                description=post.caption or "",
                thumbnail_url=post.url,
                source_platform="instagram",
                original_url=url,
                local_path=str(file_path)
            )
        except Exception as e:
            logger.error(f"Error downloading Instagram video {url}: {str(e)}")
            raise

    @retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=4, max=10))
    async def upload_to_r2(self, metadata: VideoMetadata) -> str:
        try:
            if not metadata.local_path:
                raise ValueError("No local file path provided")

            file_name = Path(metadata.local_path).name
            object_key = f"videos/{metadata.source_platform}/{file_name}"

            with open(metadata.local_path, 'rb') as f:
                self.r2.upload_fileobj(
                    f,
                    self.bucket_name,
                    object_key,
                    ExtraArgs={'ContentType': 'video/mp4'}
                )

            # Generate a presigned URL that expires in 7 days
            upload_url = self.r2.generate_presigned_url(
                'get_object',
                Params={
                    'Bucket': self.bucket_name,
                    'Key': object_key
                },
                ExpiresIn=604800  # 7 days in seconds
            )

            metadata.upload_url = upload_url
            return upload_url
        except Exception as e:
            logger.error(f"Error uploading to R2: {str(e)}")
            raise

    async def process_video(self, url: str) -> Dict:
        try:
            # Determine platform and download video
            if "youtube.com" in url or "youtu.be" in url:
                metadata = await self.download_youtube_video(url)
            elif "instagram.com" in url:
                metadata = await self.download_instagram_video(url)
            else:
                raise ValueError(f"Unsupported video platform for URL: {url}")

            # Upload to R2
            upload_url = await self.upload_to_r2(metadata)

            # Clean up local file
            if metadata.local_path and os.path.exists(metadata.local_path):
                os.remove(metadata.local_path)

            return {
                "status": "success",
                "metadata": {
                    "title": metadata.title,
                    "description": metadata.description,
                    "thumbnail_url": metadata.thumbnail_url,
                    "source_platform": metadata.source_platform,
                    "original_url": metadata.original_url,
                    "upload_url": upload_url
                }
            }
        except Exception as e:
            logger.error(f"Error processing video {url}: {str(e)}")
            return {
                "status": "error",
                "error": str(e),
                "url": url
            }

    async def process_videos(self, urls: List[str]) -> List[Dict]:
        tasks = [self.process_video(url) for url in urls]
        return await asyncio.gather(*tasks)

def main():
    import sys

    if len(sys.argv) < 2:
        print("Usage: python video_processor.py <url1> [url2 url3 ...]")
        sys.exit(1)

    urls = sys.argv[1:]
    processor = VideoProcessor()

    results = asyncio.run(processor.process_videos(urls))
    print(results)

if __name__ == "__main__":
    main()