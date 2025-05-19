'use client';

import React, { useEffect, useState } from 'react';
import MetaDescriptionGenerator from '../../../components/admin/MetaDescriptionGenerator';
import Image from 'next/image';

const YoutubeContentPage = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [hashtags, setHashtags] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [currentProgress, setCurrentProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState('');
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [regenLoading, setRegenLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [fetched, setFetched] = useState(false);
  const [jobId, setJobId] = useState(null);
  const [thumbnailUrl, setThumbnailUrl] = useState('');

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

  async function handleFetch(e) {
    e.preventDefault();
    setFetching(true);
    setError('');
    setSuccess('');
    setFetched(false);
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
        setJobId(data.jobId);
        // Poll for job status and fetch video info
        let attempts = 0;
        while (attempts < 60) {
          const statusRes = await fetch(`/api/admin/job-status?id=${data.jobId}`);
          const statusData = await statusRes.json();

          if (statusData.progress !== undefined) setCurrentProgress(statusData.progress);
          if (statusData.currentStage) setCurrentStage(statusData.currentStage);

          if (statusData.status === 'success' && statusData.result?.metadata) {
            const metadata = statusData.result.metadata;
            setTitle(metadata.title || '');
            setDescription(metadata.description || '');
            // Extract thumbnail URL from video ID
            const videoId = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1];
            if (videoId) {
              setThumbnailUrl(`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`);
            }
            setFetched(true);
            setFetching(false);
            setSuccess('Fetched video info! You can now edit and upload.');
            handleGenerateMeta(metadata.title || '', metadata.description || '');
            break;
          } else if (statusData.status === 'error') {
            setError(statusData.error || 'Fetch failed');
            setFetching(false);
            break;
          }
          await new Promise(r => setTimeout(r, 2000));
          attempts++;
        }
        if (!fetched) {
          setFetching(false);
          setError('Fetch timed out');
        }
      } else {
        setError(data.error || 'Fetch failed');
        setFetching(false);
      }
    } catch (err) {
      setError('Fetch failed');
      setFetching(false);
    }
  }

  async function handleUpload(e) {
    e.preventDefault();
    setUploading(true);
    setError('');
    setSuccess('');
    try {
      // Call your upload-to-Cloudflare endpoint here, passing edited fields
      const res = await fetch('/api/admin/upload/video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, title, description, metaDescription, hashtags, jobId }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess('Video uploaded to Cloudflare!');
        setUrl('');
        setTitle('');
        setDescription('');
        setMetaDescription('');
        setHashtags([]);
        setFetched(false);
        setJobId(null);
        fetchVideos();
      } else {
        setError(data.error || 'Upload failed');
      }
    } catch (err) {
      setError('Upload failed');
    }
    setUploading(false);
  }

  // Modified meta generator to accept params
  const handleGenerateMeta = async (t = title, d = description) => {
    setRegenLoading(true);
    try {
      const response = await fetch('/api/ai/generate-meta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: t, originalDesc: d }),
      });
      if (!response.ok) throw new Error('Failed to generate description');
      const data = await response.json();
      setMetaDescription(data.description || '');
      setHashtags(data.hashtags || []);
    } catch (error) {
      setError('Failed to generate description');
    } finally {
      setRegenLoading(false);
    }
  };

  const handleRegenerate = (e) => {
    e.preventDefault();
    handleGenerateMeta();
  };

  return (
    <div className="youtube-content-page p-4 md:p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">YouTube Content</h1>

      {/* Video Fetch Form */}
      <div className="bg-white rounded-lg shadow p-4 md:p-6 mb-6">
        <form className="mb-4 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="YouTube Video URL"
            value={url}
            onChange={e => setUrl(e.target.value)}
              className="border p-2 rounded-lg flex-grow"
            required
            disabled={fetching || fetched}
          />
          <button
            type="button"
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors whitespace-nowrap"
            onClick={handleFetch}
            disabled={fetching || fetched || !url}
          >
              {fetching ? 'Fetching...' : 'Fetch Video'}
          </button>
          </div>

          {fetched && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {/* Video Preview Section */}
              <div className="space-y-4">
                {thumbnailUrl && (
                  <div className="relative aspect-video rounded-lg overflow-hidden">
                    <Image
                      src={thumbnailUrl}
                      alt={title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
              <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="border p-2 rounded-lg w-full"
                required
              />
              <textarea
                placeholder="Original Description"
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="border p-2 rounded-lg w-full"
                  rows={4}
              />
              </div>

              {/* AI Generation Section */}
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="font-semibold">AI Meta Description</label>
                  <button
                    type="button"
                    className="text-blue-600 hover:underline text-sm"
                    onClick={handleRegenerate}
                    disabled={regenLoading}
                  >
                    {regenLoading ? 'Regenerating...' : 'Regenerate'}
                  </button>
                </div>
                <textarea
                  value={metaDescription}
                  onChange={e => setMetaDescription(e.target.value)}
                    className="border p-2 rounded-lg w-full mb-4"
                    rows={4}
                  placeholder="AI-generated meta description will appear here"
                />
                  <div>
                    <label className="font-semibold block mb-2">Hashtags</label>
                  <input
                    type="text"
                    value={hashtags.join(' ')}
                    onChange={e => setHashtags(e.target.value.split(/\s+/).filter(Boolean))}
                      className="border p-2 rounded-lg w-full"
                    placeholder="#hashtag1 #hashtag2"
                  />
                </div>
              </div>
              <button
                type="button"
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors w-full"
                onClick={handleUpload}
                disabled={uploading}
              >
                  {uploading ? 'Uploading...' : 'Upload to Cloudflare'}
              </button>
              </div>
            </div>
          )}
        </form>

        {/* Progress and Status Messages */}
        {error && <p className="text-red-500 mt-4">{error}</p>}
        {success && <p className="text-green-600 mt-4">{success}</p>}
        {fetching && (
          <div className="mt-4">
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
      </div>

      {/* Video List */}
      <div className="bg-white rounded-lg shadow p-4 md:p-6">
        <div className="mb-6">
        <input
          type="text"
          placeholder="Search by title..."
          value={search}
          onChange={e => setSearch(e.target.value)}
            className="border p-2 w-full rounded-lg"
        />
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : filteredVideos.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No YouTube videos found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideos.map((video) => (
              <div
                key={video.id}
                className="video-item bg-gray-50 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                onClick={() => setSelectedVideo(video)}
              >
                <div className="relative aspect-video">
                  <video className="w-full h-full object-cover" controls>
                  <source src={video.url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold mb-2 line-clamp-2">{video.title}</h3>
                {video.metaDescription && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                    {video.metaDescription}
                  </p>
                )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default YoutubeContentPage;