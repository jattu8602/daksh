'use client';

import React, { useEffect, useState } from 'react';

const YoutubeContentPage = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [url, setUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [currentProgress, setCurrentProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState('');

  useEffect(() => {
    fetchVideos();
  }, []);

  async function fetchVideos() {
    setLoading(true);
    const res = await fetch('/api/admin/content');
    const data = await res.json();
    setVideos((data.videos || []).filter(v => v.sourcePlatform === 'youtube'));
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
        fetchVideos();
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
    <div className="youtube-content-page">
      <h1>YouTube Content</h1>
      <form onSubmit={handleUpload} className="mb-4">
        <input
          type="text"
          placeholder="YouTube Video URL"
          value={url}
          onChange={e => setUrl(e.target.value)}
          className="border p-2 mr-2"
          required
        />
        <button type="submit" className="bg-red-500 text-white px-4 py-2 rounded" disabled={uploading}>
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
              className="bg-red-500 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${currentProgress}%` }}
            ></div>
          </div>
        </div>
      )}

      <input
        type="text"
        placeholder="Search by title..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="border p-2 mb-4 w-full"
      />
      {loading ? (
        <p>Loading...</p>
      ) : filteredVideos.length === 0 ? (
        <p>No YouTube videos found.</p>
      ) : (
        <div className="video-list">
          {filteredVideos.map((video) => (
            <div key={video.id} className="video-item mb-6">
              <h3>{video.title}</h3>
              <video width="320" height="180" controls>
                <source src={video.uploadUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default YoutubeContentPage;