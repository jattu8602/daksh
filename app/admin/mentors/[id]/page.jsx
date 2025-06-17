'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'

export default function MentorProfilePage() {
  const { id } = useParams()
  const [mentor, setMentor] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('videos')

  useEffect(() => {
    async function fetchMentor() {
      setLoading(true)
      setError('')
      try {
        const res = await fetch(`/api/mentor/${id}`)
        const data = await res.json()
        if (!res.ok) throw new Error(data.message || 'Failed to fetch mentor')
        setMentor(data.mentor)
      } catch (err) {
        setError(err.message || 'Failed to fetch mentor')
      } finally {
        setLoading(false)
      }
    }
    if (id) fetchMentor()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    )
  }
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        {error}
      </div>
    )
  }
  if (!mentor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Mentor not found
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative h-32 w-32">
              <Image
                src={mentor.profilePhoto}
                alt={mentor.user?.name || mentor.name}
                fill
                className="object-cover rounded-full border"
              />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                {mentor.user?.name || mentor.name}
              </h1>
              <p className="text-gray-600 mb-1">
                @{mentor.user?.username || mentor.username}
              </p>
              {mentor.email && (
                <p className="text-gray-600 mb-1">{mentor.email}</p>
              )}
              {mentor.bio && <p className="text-gray-700 mb-2">{mentor.bio}</p>}
              <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                {mentor.tag ||
                  (mentor.isOrganic ? 'Organic Mentor' : 'Inorganic Mentor')}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
            <span className="text-lg font-semibold">
              {mentor.contentCounts?.videos || 0}
            </span>
            <span className="text-xs text-gray-500 mt-1">Videos</span>
          </div>
          <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
            <span className="text-lg font-semibold">
              {mentor.contentCounts?.shorts || 0}
            </span>
            <span className="text-xs text-gray-500 mt-1">Shorts</span>
          </div>
          <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
            <span className="text-lg font-semibold">
              {mentor.contentCounts?.highlights || 0}
            </span>
            <span className="text-xs text-gray-500 mt-1">Highlights</span>
          </div>
          <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
            <span className="text-lg font-semibold">
              {mentor.contentCounts?.post || 0}
            </span>
            <span className="text-xs text-gray-500 mt-1">Posts</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex space-x-6 border-b mb-4">
            <button
              onClick={() => setActiveTab('videos')}
              className={`pb-2 ${
                activeTab === 'videos'
                  ? 'border-b-2 border-blue-600 font-medium text-blue-700'
                  : 'text-gray-500'
              }`}
            >
              Videos ({mentor.contentCounts?.videos || 0})
            </button>
            <button
              onClick={() => setActiveTab('shorts')}
              className={`pb-2 ${
                activeTab === 'shorts'
                  ? 'border-b-2 border-blue-600 font-medium text-blue-700'
                  : 'text-gray-500'
              }`}
            >
              Shorts ({mentor.contentCounts?.shorts || 0})
            </button>
            <button
              onClick={() => setActiveTab('highlights')}
              className={`pb-2 ${
                activeTab === 'highlights'
                  ? 'border-b-2 border-blue-600 font-medium text-blue-700'
                  : 'text-gray-500'
              }`}
            >
              Highlights ({mentor.contentCounts?.highlights || 0})
            </button>
            <button
              onClick={() => setActiveTab('post')}
              className={`pb-2 ${
                activeTab === 'post'
                  ? 'border-b-2 border-blue-600 font-medium text-blue-700'
                  : 'text-gray-500'
              }`}
            >
              Posts ({mentor.contentCounts?.post || 0})
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mentor.contentByType?.[activeTab]?.length > 0 ? (
              mentor.contentByType[activeTab].map((video) => (
                <div
                  key={video.id}
                  className="bg-gray-50 rounded-lg overflow-hidden"
                >
                  <div className="relative aspect-video">
                    {video.mediaType === 'image' ? (
                      <Image
                        src={video.url}
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
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold mb-2 line-clamp-2">
                      {video.title}
                    </h3>
                    {video.metaDescription && (
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {video.metaDescription}
                      </p>
                    )}
                    {video.hashtags && video.hashtags.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {video.hashtags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center text-gray-400 py-8">
                No {activeTab} available
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
