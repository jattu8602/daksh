'use client';

import Link from 'next/link';
import React, { useEffect, useState } from 'react';

const ContentPage = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVideos() {
      const res = await fetch('/api/admin/content');
      const data = await res.json();
      setVideos(data.videos || []);
      setLoading(false);
    }
    fetchVideos();
  }, []);

  return (
    <div className="content-page">
      <h1>Content Library</h1>
      <div className="flex gap-4 mb-6">
        <Link href="/admin/content/youtube">
          <button className="bg-blue-500 text-white px-4 py-2 rounded">YouTube Content</button>
        </Link>
        <Link href="/admin/content/instagram">
          <button className="bg-pink-500 text-white px-4 py-2 rounded">Instagram Content</button>
        </Link>
      </div>
      <h2 className="text-lg font-semibold mb-2">All Videos</h2>
      {loading ? (
        <p>Loading...</p>
      ) : videos.length === 0 ? (
        <p>No videos found.</p>
      ) : (
        <div className="video-list">
          {videos.map((video) => (
            <div key={video.id} className="video-item mb-6">
              <h3>{video.title}</h3>
              <p>Source: {video.source}</p>
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

export default ContentPage;