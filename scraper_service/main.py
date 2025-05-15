from fastapi import FastAPI
from fastapi.responses import FileResponse
from pydantic import BaseModel
import os
from pytube import YouTube
import instaloader

app = FastAPI()

DOWNLOAD_DIR = "downloads"
os.makedirs(DOWNLOAD_DIR, exist_ok=True)

class VideoURL(BaseModel):
    url: str

@app.post("/download/youtube")
def download_youtube(data: VideoURL):
    try:
        yt = YouTube(data.url)
        stream = yt.streams.filter(progressive=True, file_extension='mp4').first()
        if not stream:
            return {"error": "No downloadable video stream found."}
        filename = stream.default_filename
        filepath = os.path.join(DOWNLOAD_DIR, filename)
        stream.download(output_path=DOWNLOAD_DIR)
        return FileResponse(filepath, media_type="video/mp4", filename=filename)
    except Exception as e:
        return {"error": str(e)}

@app.post("/download/instagram")
def download_instagram(data: VideoURL):
    L = instaloader.Instaloader(dirname_pattern=DOWNLOAD_DIR)
    shortcode = data.url.rstrip('/').split('/')[-1]
    post = instaloader.Post.from_shortcode(L.context, shortcode)
    L.download_post(post, target=DOWNLOAD_DIR)
    # Find the downloaded mp4 file
    for file in os.listdir(DOWNLOAD_DIR):
        if file.endswith(".mp4"):
            return FileResponse(os.path.join(DOWNLOAD_DIR, file), media_type="video/mp4", filename=file)
    return {"error": "Video not found"}