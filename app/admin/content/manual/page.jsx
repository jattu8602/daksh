'use client';

import React, { useState } from 'react';
import MetaDescriptionGenerator from '../../../components/admin/MetaDescriptionGenerator';

const ManualUploadPage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [hashtags, setHashtags] = useState([]);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [currentProgress, setCurrentProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState('');
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [regenLoading, setRegenLoading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type.startsWith('video/')) {
      setFile(selectedFile);
      setError('');
    } else {
      setError('Please select a valid video file');
      setFile(null);
    }
  };

  const handleGenerateMeta = async () => {
    setRegenLoading(true);
    try {
      const response = await fetch('/api/ai/generate-meta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, originalDesc: description }),
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

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a video file');
      return;
    }

    setUploading(true);
    setError('');
    setSuccess('');
    setCurrentProgress(0);
    setCurrentStage('uploading');

    try {
      // Create form data
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', title);
      formData.append('description', description);
      formData.append('metaDescription', metaDescription);
      formData.append('hashtags', JSON.stringify(hashtags));

      // Upload the file
      const res = await fetch('/api/admin/upload/manual', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        setSuccess('Video uploaded successfully!');
        setFile(null);
        setTitle('');
        setDescription('');
        setMetaDescription('');
        setHashtags([]);
        setCurrentProgress(100);
        setCurrentStage('completed');
      } else {
        setError(data.error || 'Upload failed');
      }
    } catch (err) {
      setError('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="manual-upload-page p-4 md:p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Manual Video Upload</h1>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <form onSubmit={handleUpload} className="space-y-4">
          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Video File
            </label>
            <input
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-lg file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border p-2 rounded-lg w-full"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border p-2 rounded-lg w-full"
              rows={3}
              required
            />
          </div>

          {/* Meta Description */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <label className="font-semibold">AI Meta Description</label>
              <button
                type="button"
                className="text-blue-600 hover:underline text-sm"
                onClick={handleGenerateMeta}
                disabled={regenLoading || !title || !description}
              >
                {regenLoading ? 'Generating...' : 'Generate'}
              </button>
            </div>
            <textarea
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              className="border p-2 rounded-lg w-full mb-2"
              rows={3}
              placeholder="AI-generated meta description will appear here"
            />
          </div>

          {/* Hashtags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hashtags
            </label>
            <input
              type="text"
              value={hashtags.join(' ')}
              onChange={(e) => setHashtags(e.target.value.split(/\s+/).filter(Boolean))}
              className="border p-2 rounded-lg w-full"
              placeholder="#hashtag1 #hashtag2"
            />
          </div>

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
                  className="bg-blue-500 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${currentProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Error and Success Messages */}
          {error && <p className="text-red-500">{error}</p>}
          {success && <p className="text-green-600">{success}</p>}

          {/* Upload Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            disabled={uploading || !file}
          >
            {uploading ? 'Uploading...' : 'Upload Video'}
          </button>
        </form>
      </div>

      {/* Meta Description Generator for Selected Video */}
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
    </div>
  );
};

export default ManualUploadPage;