'use client'
import React, { useState } from 'react'

async function urlToFile(url, filename, mimeType) {
  try {
    console.log('Fetching image from:', url)

    // Use a proxy for external images to avoid CORS issues
    const proxyUrl = `/api/admin/fetch-image?url=${encodeURIComponent(url)}`

    const response = await fetch(proxyUrl, {
      method: 'GET',
      headers: {
        Accept: 'image/*',
      },
    })

    if (!response.ok) {
      throw new Error(
        `Failed to fetch image: ${response.status} ${response.statusText}`
      )
    }

    const blob = await response.blob()
    console.log('Successfully converted to blob:', blob.size, 'bytes')

    return new File([blob], filename, { type: mimeType || blob.type })
  } catch (error) {
    console.error('Error in urlToFile:', error)
    throw new Error(`Failed to download image: ${error.message}`)
  }
}

const PinterestScrapperPage = () => {
  const [description, setDescription] = useState('')
  const [count, setCount] = useState(10)
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState([])
  const [error, setError] = useState('')

  const [uploadStatus, setUploadStatus] = useState({})
  const [logs, setLogs] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setResults([])
    setCurrentIndex(0)
    setUploadStatus({})
    setLogs([])
    try {
      const res = await fetch('/api/admin/content/pinterest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description, count: 1 }),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate content')
      }
      if (data.success && data.items.length > 0) {
        setResults([data.items[0]])
        setLogs(data.logs || [])
        // Start fetching next images sequentially
        for (let i = 1; i < count; i++) {
          const nextRes = await fetch('/api/admin/content/pinterest', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ description, count: 1 }),
          })
          const nextData = await nextRes.json()
          if (!nextRes.ok) {
            throw new Error(nextData.error || 'Failed to generate content')
          }
          if (nextData.success && nextData.items.length > 0) {
            setResults((prev) => [...prev, nextData.items[0]])
            setLogs((prev) => [...prev, ...(nextData.logs || [])])
            setCurrentIndex(i)
          }
        }
      } else {
        throw new Error(data.error || 'Failed to generate content')
      }
    } catch (err) {
      console.error('Content generation error:', err)
      setError(err.message || 'Failed to generate content')
      setLogs((prev) => [...prev, `Error: ${err.message}`])
    }
    setLoading(false)
  }

  const handleUpload = async (item) => {
    if (uploadStatus[item.url]?.uploading || uploadStatus[item.url]?.success)
      return

    console.log('Starting upload for:', item.title)

    // Set uploading status for this specific item
    setUploadStatus((prev) => ({
      ...prev,
      [item.url]: { success: false, error: null, uploading: true },
    }))

    try {
      console.log('Step 1: Downloading image...')

      // Download and convert image to file
      const file = await urlToFile(
        item.url,
        `${item.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.jpg`,
        'image/jpeg'
      )

      console.log('Step 2: Preparing upload data...')

      // Prepare form data
      const formData = new FormData()
      formData.append('file', file)
      formData.append('title', item.title)
      formData.append('description', item.description)
      formData.append(
        'metaDescription',
        item.metaDescription || item.description || ''
      )
      formData.append(
        'hashtags',
        JSON.stringify(item.hashtags || ['#StudyNotes', '#Education'])
      )

      console.log('Step 3: Uploading to server...')

      // Upload to server
      const res = await fetch('/api/admin/upload/manual', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        const errorText = await res.text()
        throw new Error(`Server error ${res.status}: ${errorText}`)
      }

      const data = await res.json()
      console.log('Upload response:', data)

      if (!data.success) {
        throw new Error(data.error || data.details || 'Upload failed')
      }

      // Update status to success
      setUploadStatus((prev) => ({
        ...prev,
        [item.url]: {
          success: true,
          error: null,
          uploading: false,
          videoId: data.video?.id,
        },
      }))

      console.log('Upload completed successfully!')
    } catch (err) {
      console.error('Upload error:', err)

      // Update status to error
      setUploadStatus((prev) => ({
        ...prev,
        [item.url]: {
          success: false,
          error: err.message || 'Upload failed',
          uploading: false,
        },
      }))
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Pinterest Scrapper</h1>
      <div className="mb-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-blue-700 text-sm">
        <p>
          <strong>ℹ️ How it works:</strong> We search for images from Pinterest,
          Unsplash, and other educational sources. If no suitable images are
          found, we'll provide placeholder images to ensure content generation
          always succeeds.
        </p>
      </div>
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
          <select
            className="border p-2 rounded w-24"
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            required
          >
            {[5, 10, 15, 20].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
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
      {loading && (
        <div className="mt-6 text-center">
          <div className="animate-pulse text-lg text-blue-600">
            🔍 Searching for images... {currentIndex + 1} of {count}
          </div>
          <div className="text-sm text-gray-500 mt-1">
            This may take a few minutes as we search multiple sources
          </div>
          <div className="mt-2 h-2 bg-gray-200 rounded">
            <div
              className="h-full bg-blue-600 rounded transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / count) * 100}%` }}
            />
          </div>
        </div>
      )}
      {results.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">
            Preview Scrapped Content
          </h2>
          <div className="space-y-6">
            {results.map((item, idx) => {
              const status = uploadStatus[item.url]
              return (
                <div key={idx} className="border rounded-lg p-6 bg-gray-50">
                  <div>
                    <img
                      src={item.url}
                      alt={item.title}
                      className="w-full h-[500px] object-contain rounded mb-4"
                      onError={(e) => {
                        e.target.onerror = null
                        e.target.src = '/placeholder.png'
                        console.error('Failed to load image:', item.url)
                        setError(`Failed to load image: ${item.url}`)
                      }}
                      loading="lazy"
                    />
                  </div>
                  <h3 className="font-bold text-xl mb-2">{item.title}</h3>
                  <p className="text-gray-700 mb-2">{item.description}</p>
                  <p className="text-sm text-gray-500 mb-2">
                    {item.metaDescription}
                  </p>
                  <div className="text-sm text-blue-600 mb-4 flex flex-wrap gap-1">
                    {item.hashtags?.map((tag, i) => (
                      <span key={i} className="bg-blue-100 px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-400">
                      Source:{' '}
                      {item.sourcePlatform === 'fallback'
                        ? 'Placeholder'
                        : item.sourcePlatform === 'pinterest'
                        ? 'Pinterest'
                        : item.sourcePlatform || 'Unknown'}
                    </div>
                    <button
                      className={`px-6 py-2 rounded text-white transition ${
                        status?.success
                          ? 'bg-green-500 cursor-default'
                          : status?.uploading
                          ? 'bg-yellow-500 cursor-default'
                          : status?.error
                          ? 'bg-red-500 hover:bg-red-600'
                          : 'bg-blue-500 hover:bg-blue-600'
                      } disabled:opacity-50`}
                      onClick={() => handleUpload(item)}
                      disabled={status?.uploading || status?.success}
                    >
                      {status?.success
                        ? '✅ Uploaded Successfully'
                        : status?.uploading
                        ? '⏳ Uploading...'
                        : status?.error
                        ? '❌ Retry Upload'
                        : 'Upload to Database'}
                    </button>
                  </div>
                  {status?.uploading && (
                    <div className="mt-2">
                      <div className="flex items-center gap-2 text-sm text-yellow-600">
                        <div className="animate-spin h-4 w-4 border-2 border-yellow-600 border-t-transparent rounded-full"></div>
                        Processing upload...
                      </div>
                      <div className="mt-1 h-1 bg-gray-200 rounded">
                        <div className="h-full bg-yellow-500 rounded animate-pulse"></div>
                      </div>
                    </div>
                  )}
                  {status?.error && (
                    <p className="mt-2 text-sm text-red-500">{status.error}</p>
                  )}
                  {status?.success && (
                    <p className="mt-2 text-sm text-green-600">
                      ✅ Successfully uploaded to database!
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default PinterestScrapperPage
