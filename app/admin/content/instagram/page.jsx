'use client';

import React, { useEffect, useState } from 'react';

const InstagramContentPage = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchVideos();
  }, []);

  async function fetchVideos() {
    setLoading(true);
    const res = await fetch('/api/admin/content');
    const data = await res.json();
    setVideos((data.videos || []).filter(v => v.source === 'instagram'));
    setLoading(false);
  }

  const filteredVideos = videos.filter(v =>
    v.title.toLowerCase().includes(search.toLowerCase())
  );

  async function handleUpload(e) {
    e.preventDefault();
    setUploading(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch('/api/admin/create/video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, type: 'instagram', title }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess('Video uploaded successfully!');
        setUrl('');
        setTitle('');
        fetchVideos();
      } else {
        setError(data.message || 'Upload failed');
      }
    } catch (err) {
      setError('Upload failed');
    }
    setUploading(false);
  }

  return (
    <div className="instagram-content-page">
      <h1>Instagram Content</h1>
      <form onSubmit={handleUpload} className="mb-4">
        <input
          type="text"
          placeholder="Instagram Reel URL"
          value={url}
          onChange={e => setUrl(e.target.value)}
          className="border p-2 mr-2"
          required
        />
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="border p-2 mr-2"
          required
        />
        <button type="submit" className="bg-pink-500 text-white px-4 py-2 rounded" disabled={uploading}>
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </form>
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-600">{success}</p>}
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
        <p>No Instagram videos found.</p>
      ) : (
        <div className="video-list">
          {filteredVideos.map((video) => (
            <div key={video.id} className="video-item mb-6">
              <h3>{video.title}</h3>
              <video width="320" height="180" controls>
                <source src={video.url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InstagramContentPage;