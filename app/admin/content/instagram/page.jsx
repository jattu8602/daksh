'use client';

import React, { useEffect, useState } from 'react';
import MetaDescriptionGenerator from '../../../components/admin/MetaDescriptionGenerator';

const InstagramContentPage = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [url, setUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [currentProgress, setCurrentProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState('');
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    fetchVideos();
  }, []);

  async function fetchVideos() {
    setLoading(true);
    const res = await fetch('/api/admin/content');
    const data = await res.json();
    setVideos((data.videos || []).filter(v => v.sourcePlatform === 'instagram'));
    setLoading(false);
  }

  const filteredVideos = videos.filter(v =>
    v.title.toLowerCase().includes(search.toLowerCase())
  );

  async function pollJobStatus(jobId) {
    let attempts = 0;
    while (attempts < 60) { // poll for up to 5 minutes
      const res = await fetch(`/api/admin/job-status?id=${jobId}`);
      const data = await res.json();

      // Update progress if available
      if (data.progress !== undefined) {
        setCurrentProgress(data.progress);
      }
      if (data.currentStage) {
        setCurrentStage(data.currentStage);
      }

      if (data.status === 'success') {
        setSuccess('Video uploaded successfully!');
        setUrl('');
        await fetchVideos();
        // Set the newly uploaded video as selected
        if (data.videoId) {
          const newVideo = videos.find(v => v.id === data.videoId);
          if (newVideo) {
            setSelectedVideo(newVideo);
          }
        }
        setUploading(false);
        setCurrentProgress(0);
        setCurrentStage('');
        return;
      } else if (data.status === 'error') {
        setError(data.error || 'Upload failed');
        setUploading(false);
        setCurrentProgress(0);
        setCurrentStage('');
        return;
      }
      await new Promise(r => setTimeout(r, 2000)); // poll every 2 seconds
      attempts++;
    }
    setError('Upload timed out.');
    setUploading(false);
    setCurrentProgress(0);
    setCurrentStage('');
  }

  async function handleUpload(e) {
    e.preventDefault();
    setUploading(true);
    setError('');
    setSuccess('');
    setCurrentProgress(0);
    setCurrentStage('starting');
    try {
      const res = await fetch('/api/admin/create/video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (data.jobId) {
        pollJobStatus(data.jobId);
      } else {
        setError(data.error || 'Upload failed');
        setUploading(false);
      }
    } catch (err) {
      setError('Upload failed');
      setUploading(false);
    }
  }

  return (
    <div className="instagram-content-page p-6">
      <h1 className="text-2xl font-bold mb-6">Instagram Content</h1>

      {/* Upload Form */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
      <form onSubmit={handleUpload} className="mb-4">
        <input
          type="text"
          placeholder="Instagram Reel URL"
          value={url}
          onChange={e => setUrl(e.target.value)}
            className="border p-2 mr-2 rounded-lg w-full md:w-auto"
          required
        />
          <button
            type="submit"
            className="bg-pink-500 text-white px-4 py-2 rounded-lg mt-2 md:mt-0 md:ml-2 hover:bg-pink-600 transition-colors"
            disabled={uploading}
          >
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </form>
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-600">{success}</p>}

      {/* Progress Display */}
      {uploading && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              {currentStage ? `${currentStage.charAt(0).toUpperCase() + currentStage.slice(1)}...` : 'Processing...'}
            </span>
            <span className="text-sm font-medium text-gray-700">{currentProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-pink-500 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${currentProgress}%` }}
            ></div>
          </div>
          </div>
        )}
      </div>

      {/* Meta Description Generator */}
      {selectedVideo && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Generate Meta Description</h2>
          <MetaDescriptionGenerator
            videoId={selectedVideo.id}
            initialTitle={selectedVideo.title}
            initialDescription={selectedVideo.description}
          />
        </div>
      )}

      {/* Video List */}
      <div className="bg-white rounded-lg shadow p-6">
      <input
        type="text"
        placeholder="Search by title..."
        value={search}
        onChange={e => setSearch(e.target.value)}
          className="border p-2 mb-4 w-full rounded-lg"
      />
      {loading ? (
        <p>Loading...</p>
      ) : filteredVideos.length === 0 ? (
        <p>No Instagram videos found.</p>
      ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video) => (
              <div
                key={video.id}
                className="video-item bg-gray-50 rounded-lg p-4 cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => setSelectedVideo(video)}
              >
                <h3 className="font-semibold mb-2">{video.title}</h3>
                <video width="100%" height="auto" controls className="rounded-lg">
                  <source src={video.url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                {video.metaDescription && (
                  <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                    {video.metaDescription}
                  </p>
                )}
            </div>
          ))}
        </div>
      )}
      </div>
    </div>
  );
};

export default InstagramContentPage;