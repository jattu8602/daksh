'use client'
import React, { useState } from 'react'

function urlToFile(url, filename, mimeType) {
  return fetch(url)
    .then((res) => res.blob())
    .then((blob) => new File([blob], filename, { type: mimeType }))
}

const PinterestScrapperPage = () => {
  const [description, setDescription] = useState('')
  const [count, setCount] = useState(5)
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState([])
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState([])
  const [logs, setLogs] = useState([])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setResults([])
    try {
      const res = await fetch('/api/admin/content/pinterest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description, count }),
      })
      const data = await res.json()
      if (data.success) {
        setResults(data.items)
        setLogs(data.logs || [])
      } else {
        setError(data.error || 'Failed to generate content')
      }
    } catch (err) {
      setError('Failed to generate content')
    }
    setLoading(false)
  }

  const handleUploadAll = async () => {
    setUploading(true)
    setUploadStatus([])
    const statuses = []
    for (let i = 0; i < results.length; i++) {
      const item = results[i]
      try {
        const file = await urlToFile(
          item.url,
          `${item.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.jpg`,
          'image/jpeg'
        )
        const formData = new FormData()
        formData.append('file', file)
        formData.append('title', item.title)
        formData.append('description', item.description)
        formData.append('metaDescription', item.metaDescription || '')
        formData.append('hashtags', JSON.stringify(item.hashtags || []))
        // mediaType is always image for Pinterest
        formData.append('mediaType', 'image')
        const res = await fetch('/api/admin/upload/manual', {
          method: 'POST',
          body: formData,
        })
        const data = await res.json()
        if (data.success) {
          statuses.push({ success: true, title: item.title })
        } else {
          statuses.push({
            success: false,
            title: item.title,
            error: data.error || 'Upload failed',
          })
        }
      } catch (err) {
        statuses.push({ success: false, title: item.title, error: err.message })
      }
      setUploadStatus([...statuses])
    }
    setUploading(false)
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Pinterest Scrapper</h1>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white p-4 rounded-lg shadow"
      >
        <div>
          <label className="block font-medium mb-1">
            Describe the type of content you want
          </label>
          <input
            type="text"
            className="border p-2 rounded w-full"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            placeholder="e.g. Geography class 10 notes"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Number of images</label>
          <input
            type="number"
            className="border p-2 rounded w-24"
            value={count}
            min={1}
            max={10}
            onChange={(e) => setCount(Number(e.target.value))}
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? 'Generating...' : 'Generate'}
        </button>
      </form>
      {error && <p className="text-red-500 mt-4">{error}</p>}
      {logs.length > 0 && (
        <div className="bg-gray-100 p-4 my-4 rounded-lg max-h-64 overflow-auto text-xs whitespace-pre-wrap font-mono">
          {logs.join('\n')}
        </div>
      )}
      {results.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">
            Preview Scrapped Content
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {results.map((item, idx) => (
              <div key={idx} className="border rounded-lg p-4 bg-gray-50">
                <img
                  src={item.url}
                  alt={item.title}
                  className="w-full h-48 object-cover rounded mb-2"
                />
                <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                <p className="text-sm text-gray-700 mb-1">{item.description}</p>
                <p className="text-xs text-gray-500 mb-1">
                  {item.metaDescription}
                </p>
                <div className="text-xs text-blue-600 mb-1">
                  {item.hashtags?.join(' ')}
                </div>
                <div className="text-xs text-gray-400">Source: Pinterest</div>
              </div>
            ))}
          </div>
          <button
            className="mt-6 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-50"
            onClick={handleUploadAll}
            disabled={uploading}
          >
            {uploading ? 'Uploading...' : 'Upload All to Cloudflare'}
          </button>
          {uploadStatus.length > 0 && (
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Upload Status</h3>
              <ul className="space-y-1">
                {uploadStatus.map((s, i) => (
                  <li
                    key={i}
                    className={s.success ? 'text-green-600' : 'text-red-500'}
                  >
                    {s.success ? '✅' : '❌'} {s.title}{' '}
                    {s.error && `- ${s.error}`}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default PinterestScrapperPage
