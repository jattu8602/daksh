'use client';

import React, { useEffect, useState } from 'react';
import MetaDescriptionGenerator from '../../../components/admin/MetaDescriptionGenerator';

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

          // Update progress and stage
          if (statusData.progress !== undefined) setCurrentProgress(statusData.progress);
          if (statusData.currentStage) setCurrentStage(statusData.currentStage);

          if (statusData.status === 'success' && statusData.result?.metadata) {
            const metadata = statusData.result.metadata;
            setTitle(metadata.title || '');
            setDescription(metadata.description || '');
            setFetched(true);
            setFetching(false);
            setSuccess('Fetched video info! You can now edit and upload.');
            // Optionally auto-generate meta/hashtags
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
    <div className="youtube-content-page p-6">
      <h1 className="text-2xl font-bold mb-6">YouTube Content</h1>
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <form className="mb-4 space-y-4">
          <input
            type="text"
            placeholder="YouTube Video URL"
            value={url}
            onChange={e => setUrl(e.target.value)}
            className="border p-2 rounded-lg w-full"
            required
            disabled={fetching || fetched}
          />
          <button
            type="button"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors w-full"
            onClick={handleFetch}
            disabled={fetching || fetched || !url}
          >
            {fetching ? 'Fetching...' : 'Fetch'}
          </button>
          {fetched && (
            <>
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
                rows={3}
              />
              <div className="bg-gray-50 rounded-lg p-4 mb-2">
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
                  className="border p-2 rounded-lg w-full mb-2"
                  rows={3}
                  placeholder="AI-generated meta description will appear here"
                />
                <div className="mb-2">
                  <label className="font-semibold">Hashtags</label>
                  <input
                    type="text"
                    value={hashtags.join(' ')}
                    onChange={e => setHashtags(e.target.value.split(/\s+/).filter(Boolean))}
                    className="border p-2 rounded-lg w-full mt-1"
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
                {uploading ? 'Uploading...' : 'Upload'}
              </button>
            </>
          )}
        </form>
        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-600">{success}</p>}
        {fetching && (
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
          <p>No YouTube videos found.</p>
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

export default YoutubeContentPage;