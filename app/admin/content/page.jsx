'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import VideoAssignmentModal from '../../components/admin/VideoAssignmentModal'

const ContentPage = () => {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState('videos')
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [selectedVideos, setSelectedVideos] = useState(new Set())
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false)
  const videosPerPage = 12

  useEffect(() => {
    fetchVideos()
  }, [page])

  async function fetchVideos() {
    setLoading(true)
    try {
      const res = await fetch(
        `/api/admin/content?page=${page}&limit=${videosPerPage}`
      )
      const data = await res.json()
      if (page === 1) {
        setVideos(data.videos || [])
      } else {
        setVideos((prev) => [...prev, ...(data.videos || [])])
      }
      setHasMore((data.videos || []).length === videosPerPage)
    } catch (error) {
      console.error('Error fetching videos:', error)
    }
    setLoading(false)
  }

  const filteredVideos = videos.filter((v) => {
    const matchesSearch = v.title.toLowerCase().includes(search.toLowerCase())
    const isReel = v.duration < 60
    return matchesSearch && (activeTab === 'reels' ? isReel : !isReel)
  })

  const loadMore = () => {
    if (!loading && hasMore) {
      setPage((prev) => prev + 1)
    }
  }

  const handleAssign = async (assignments) => {
    // assignments is an array of assignment objects (with mentor and user info)
    setVideos((prev) =>
      prev.map((video) => {
        const assignmentForThisVideo = assignments.find(
          (a) => a.videoId === video.id
        )
        if (assignmentForThisVideo) {
          return {
            ...video,
            assignments: [...(video.assignments || []), assignmentForThisVideo],
          }
        }
        return video
      })
    )
    setSelectedVideos(new Set())
  }

  const toggleVideoSelection = (videoId) => {
    setSelectedVideos((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(videoId)) {
        newSet.delete(videoId)
      } else {
        newSet.add(videoId)
      }
      return newSet
    })
  }

  const handleBulkAssign = () => {
    if (selectedVideos.size === 0) return
    setIsAssignmentModalOpen(true)
  }

  return (
    <div className="content-page  md:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col space-y-4 mb-6">
        <h1 className="text-xl sm:text-2xl font-bold">Content Library</h1>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
          <Link href="/admin/content/youtube" className="flex-1 sm:flex-none">
            <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-red-600 text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg hover:bg-red-700 transition-colors text-sm sm:text-base">
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
              <span className="hidden sm:inline">YouTube Content</span>
              <span className="sm:hidden">YouTube</span>
            </button>
          </Link>
          <Link href="/admin/content/instagram" className="flex-1 sm:flex-none">
            <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg hover:opacity-90 transition-opacity text-sm sm:text-base">
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
              <span className="hidden sm:inline">Instagram Content</span>
              <span className="sm:hidden">Instagram</span>
            </button>
          </Link>
          <Link href="/admin/content/manual" className="flex-1 sm:flex-none">
            <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base">
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z" />
              </svg>
              <span className="hidden sm:inline">Manual Upload</span>
              <span className="sm:hidden">Upload</span>
            </button>
          </Link>
        </div>
      </div>

      {/* Search and Tabs */}
      <div className="bg-white rounded-lg shadow p-3 sm:p-4 md:p-6 mb-6">
        <div className="flex flex-col gap-3 sm:gap-4 mb-4 sm:mb-6">
          <input
            type="text"
            placeholder="Search by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-2 sm:p-3 rounded-lg w-full text-sm sm:text-base"
          />
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('videos')}
              className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm sm:text-base ${
                activeTab === 'videos'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Videos
            </button>
            <button
              onClick={() => setActiveTab('reels')}
              className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm sm:text-base ${
                activeTab === 'reels'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Reels
            </button>
          </div>
        </div>

        {/* Bulk Actions */}
        <div className="mb-4 space-y-3">
          {/* Master Selection Checkbox + Controls */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 sm:items-center">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={
                  selectedVideos.size === filteredVideos.length &&
                  filteredVideos.length > 0
                }
                ref={(el) => {
                  if (el) {
                    el.indeterminate =
                      selectedVideos.size > 0 &&
                      selectedVideos.size < filteredVideos.length
                  }
                }}
                onChange={(e) => {
                  if (e.target.checked) {
                    const allVisibleIds = new Set(
                      filteredVideos.map((v) => v.id)
                    )
                    setSelectedVideos(allVisibleIds)
                  } else {
                    setSelectedVideos(new Set())
                  }
                }}
                className="w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
              />
              <span className="text-xs sm:text-sm font-medium">
                {selectedVideos.size === 0
                  ? 'Select All'
                  : selectedVideos.size === filteredVideos.length
                  ? 'Deselect All'
                  : `${selectedVideos.size} of ${filteredVideos.length} selected`}
              </span>
            </div>

            <div className="flex flex-wrap gap-1 sm:gap-2">
              <button
                onClick={() => {
                  const allVisibleIds = new Set(filteredVideos.map((v) => v.id))
                  setSelectedVideos(allVisibleIds)
                }}
                className="px-2 sm:px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-xs sm:text-sm"
                disabled={selectedVideos.size === filteredVideos.length}
              >
                All ({filteredVideos.length})
              </button>
              <button
                onClick={() => {
                  const currentPageVideos = filteredVideos.slice(
                    0,
                    page * videosPerPage
                  )
                  const currentPageIds = new Set(
                    currentPageVideos.map((v) => v.id)
                  )
                  setSelectedVideos(currentPageIds)
                }}
                className="px-2 sm:px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-xs sm:text-sm"
                disabled={page === 1}
              >
                Loaded ({Math.min(filteredVideos.length, page * videosPerPage)})
              </button>
              <button
                onClick={() => setSelectedVideos(new Set())}
                className="px-2 sm:px-3 py-1 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-xs sm:text-sm"
                disabled={selectedVideos.size === 0}
              >
                Clear
              </button>
            </div>
          </div>

          {/* Selection Status & Actions */}
          {selectedVideos.size > 0 && (
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 sm:items-center justify-between bg-blue-50 p-3 rounded-lg">
              <span className="text-blue-700 font-medium text-sm">
                {selectedVideos.size} video
                {selectedVideos.size !== 1 ? 's' : ''} selected
              </span>
              <button
                onClick={handleBulkAssign}
                className="px-3 sm:px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium text-sm sm:text-base"
              >
                Assign Selected ({selectedVideos.size})
              </button>
            </div>
          )}
        </div>

        {/* Video Grid */}
        {loading && page === 1 ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : filteredVideos.length === 0 ? (
          <p className="text-center text-gray-500 py-8 text-sm sm:text-base">
            No {activeTab} found.
          </p>
        ) : (
          <>
            {/* Mobile: 2 columns, Tablet: 3 columns, Desktop: 4 columns */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              {filteredVideos.map((video) => (
                <div
                  key={video.id}
                  className={`video-item bg-gray-50 rounded-lg overflow-hidden hover:shadow-lg transition-shadow ${
                    selectedVideos.has(video.id) ? 'ring-2 ring-blue-500' : ''
                  }`}
                >
                  <div className="relative">
                    <div className="absolute top-1.5 sm:top-2 left-1.5 sm:left-2 z-10">
                      <input
                        type="checkbox"
                        checked={selectedVideos.has(video.id)}
                        onChange={() => toggleVideoSelection(video.id)}
                        className="w-4 h-4 sm:w-5 sm:h-5 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div className="relative aspect-video">
                      {video.mediaType === 'image' ? (
                        <Image
                          src={video.url || video.thumbnailUrl}
                          alt={video.title}
                          fill
                          className="object-cover"
                        />
                      ) : video.thumbnailUrl ? (
                        <Image
                          src={video.thumbnailUrl}
                          alt={video.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <video className="w-full h-full object-cover" controls>
                          <source src={video.url} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      )}
                      {video.duration && video.mediaType !== 'image' && (
                        <div className="absolute bottom-1.5 sm:bottom-2 right-1.5 sm:right-2 bg-black bg-opacity-75 text-white px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-xs sm:text-sm">
                          {Math.floor(video.duration / 60)}:
                          {(video.duration % 60).toString().padStart(2, '0')}
                        </div>
                      )}
                      
                    </div>
                  </div>
                  <div className="p-2 sm:p-3 md:p-4">
                    <h3 className="font-semibold mb-1 sm:mb-2 line-clamp-2 text-xs sm:text-sm md:text-base">
                      {video.title}
                    </h3>
                    {video.metaDescription && (
                      <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 mb-1 sm:mb-2">
                        {video.metaDescription}
                      </p>
                    )}
                    {video.assignments && video.assignments.length > 0 && (
                      <div className="text-xs text-gray-500">
                        <span className="hidden sm:inline">Assigned to: </span>
                        <span className="sm:hidden">Assigned: </span>
                        {video.assignments
                          .map((a) => a.mentor?.user?.name || 'Unknown')
                          .filter((name) => name)
                          .join(', ')}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div className="mt-6 sm:mt-8 text-center">
                <button
                  onClick={loadMore}
                  disabled={loading}
                  className="bg-blue-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 text-sm sm:text-base"
                >
                  {loading ? 'Loading...' : 'Load More'}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Assignment Modal */}
      {selectedVideos.size > 0 && (
        <VideoAssignmentModal
          isOpen={isAssignmentModalOpen}
          onClose={() => {
            setIsAssignmentModalOpen(false)
            setSelectedVideos(new Set())
          }}
          videoIds={Array.from(selectedVideos)}
          onAssign={handleAssign}
        />
      )}
    </div>
  )
}

export default ContentPage
