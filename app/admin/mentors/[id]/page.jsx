'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

const VideoIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6 text-red-500"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 10l4.55a1 1 0 011.45.89V15a1 1 0 01-1.45.89L15 14M5 9v6a2 2 0 002 2h4a2 2 0 002-2V9a2 2 0 00-2-2H7a2 2 0 00-2 2z"
    />
  </svg>
)

const ShortsIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6 text-purple-500"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M13 10V3L4 14h7v7l9-11h-7z"
    />
  </svg>
)

const HighlightsIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6 text-yellow-500"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.539 1.118l-3.975-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.539-1.118l1.518-4.674a1 1 0 00-.363-1.118L2.05 10.1c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
    />
  </svg>
)

const PostIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6 text-green-500"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  </svg>
)

const StatCard = ({ icon, label, value }) => (
  <div className="bg-white dark:bg-gray-800/50 rounded-xl shadow p-4 flex items-center space-x-4 transition-all duration-300 hover:shadow-md hover:scale-105">
    <div className="p-3 rounded-full bg-gray-100 dark:bg-gray-700/50">
      {icon}
    </div>
    <div>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">
        {value}
      </p>
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
    </div>
  </div>
)

export default function MentorProfilePage() {
  const { id } = useParams()
  const [mentor, setMentor] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('videos')
  const [editingItem, setEditingItem] = useState(null)
  const [itemToDelete, setItemToDelete] = useState(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const [hoverInfo, setHoverInfo] = useState({ id: null, placement: 'right' })

  const handleEditClick = (item) => {
    setEditingItem({
      ...item,
      description: item.description || '',
      metaDescription: item.metaDescription || '',
      hashtags: Array.isArray(item.hashtags) ? item.hashtags.join(', ') : '',
    })
  }

  const handleUpdateItem = async () => {
    if (!editingItem) return
    setIsUpdating(true)
    try {
      const res = await fetch(`/api/videos/update-metadata`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          videoId: editingItem.id,
          title: editingItem.title,
          metaDescription: editingItem.metaDescription,
          description: editingItem.description,
          hashtags: editingItem.hashtags
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean),
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Failed to update item')

      setMentor((prevMentor) => {
        const newContentByType = { ...prevMentor.contentByType }
        const updatedItems = newContentByType[activeTab].map((item) =>
          item.id === editingItem.id ? { ...item, ...data.video } : item
        )
        newContentByType[activeTab] = updatedItems
        return { ...prevMentor, contentByType: newContentByType }
      })

      setEditingItem(null)
    } catch (error) {
      console.error('Update failed:', error)
      alert(`Error: ${error.message}`)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDeleteClick = (item) => {
    setItemToDelete(item)
  }

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return
    try {
      const res = await fetch(`/api/videos/${itemToDelete.id}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Failed to delete item')

      setMentor((prevMentor) => {
        const newContentByType = { ...prevMentor.contentByType }
        const filteredItems = newContentByType[activeTab].filter(
          (item) => item.id !== itemToDelete.id
        )
        newContentByType[activeTab] = filteredItems

        const newContentCounts = { ...prevMentor.contentCounts }
        newContentCounts[activeTab] = (newContentCounts[activeTab] || 1) - 1

        return {
          ...prevMentor,
          contentByType: newContentByType,
          contentCounts: newContentCounts,
        }
      })

      setItemToDelete(null)
    } catch (error) {
      console.error('Delete failed:', error)
      alert(`Error: ${error.message}`)
    }
  }

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
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-lg font-semibold text-gray-700 dark:text-gray-300">
          Loading profile...
        </div>
      </div>
    )
  }
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 text-red-500">
        <div className="bg-red-100 dark:bg-red-900/50 border border-red-400 dark:border-red-600 rounded-lg p-6 text-center">
          <h2 className="text-xl font-bold mb-2">Error</h2>
          <p>{error}</p>
        </div>
      </div>
    )
  }
  if (!mentor) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-lg font-medium text-gray-500 dark:text-gray-400">
          Mentor not found.
        </div>
      </div>
    )
  }

  const contentTabs = [
    { id: 'videos', label: 'Videos' },
    { id: 'shorts', label: 'Shorts' },
    { id: 'highlights', label: 'Highlights' },
    { id: 'post', label: 'Posts' },
  ]

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="bg-white dark:bg-gray-800/50 rounded-2xl shadow-lg p-6 md:p-8 mb-8 backdrop-blur-sm border border-gray-200 dark:border-gray-700/50">
          <div className="flex flex-col md:flex-row items-start gap-6 md:gap-8">
            <div className="relative h-36 w-36 rounded-full border-4 border-white dark:border-gray-700 shadow-md flex-shrink-0 mx-auto md:mx-0">
              <Image
                src={mentor.profilePhoto}
                alt={mentor.user?.name || mentor.name}
                fill
                className="object-cover rounded-full"
              />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                {mentor.user?.name || mentor.name}
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mb-3">
                @{mentor.user?.username || mentor.username}
              </p>
              {mentor.email && (
                <p className="text-gray-600 dark:text-gray-300 mb-3 text-sm flex items-center justify-center md:justify-start gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  {mentor.email}
                </p>
              )}
              {mentor.bio && (
                <p className="text-gray-700 dark:text-gray-200 mb-4">
                  {mentor.bio}
                </p>
              )}

              <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
                {mentor.language && (
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-semibold dark:bg-indigo-900 dark:text-indigo-200">
                    {mentor.language}
                  </span>
                )}
                {mentor.subject &&
                  mentor.subject.split(',').map((subj) => (
                    <span
                      key={subj.trim()}
                      className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold dark:bg-green-900 dark:text-green-200"
                    >
                      {subj.trim()}
                    </span>
                  ))}
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold dark:bg-blue-900 dark:text-blue-200">
                  {mentor.tag ||
                    (mentor.isOrganic ? 'Organic Mentor' : 'Inorganic Mentor')}
                </span>
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<ShortsIcon />}
            label="Videos"
            value={mentor.contentCounts?.videos || 0}
          />
          <StatCard
            icon={<ShortsIcon />}
            label="Shorts"
            value={mentor.contentCounts?.shorts || 0}
          />
          <StatCard
            icon={<HighlightsIcon />}
            label="Highlights"
            value={mentor.contentCounts?.highlights || 0}
          />
          <StatCard
            icon={<PostIcon />}
            label="Posts"
            value={mentor.contentCounts?.post || 0}
          />
        </div>

        <main className="bg-white dark:bg-gray-800/50 rounded-2xl shadow-lg p-6 md:p-8 backdrop-blur-sm border border-gray-200 dark:border-gray-700/50">
          <div className="flex items-center border-b border-gray-200 dark:border-gray-700 mb-6">
            {contentTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 px-4 sm:px-6 text-sm font-medium transition-colors duration-300 ${
                  activeTab === tab.id
                    ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                }`}
              >
                {tab.label} ({mentor.contentCounts?.[tab.id] || 0})
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mentor.contentByType?.[activeTab]?.length > 0 ? (
              mentor.contentByType[activeTab].map((item) => (
                <div
                  key={item.id}
                  className="relative bg-gray-50 dark:bg-gray-800 rounded-lg overflow-visible group shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:z-50"
                  onMouseEnter={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect()
                    const tooltipWidth = 320 // px
                    const tooltipHeight = 180 // px (approx)
                    let placement = 'right'
                    if (window.innerWidth - rect.right > tooltipWidth) {
                      placement = 'right'
                    } else if (rect.left > tooltipWidth) {
                      placement = 'left'
                    } else if (rect.top > tooltipHeight) {
                      placement = 'top'
                    } else {
                      placement = 'bottom'
                    }
                    setHoverInfo({ id: item.id, placement })
                  }}
                  onMouseLeave={() =>
                    setHoverInfo({ id: null, placement: 'right' })
                  }
                >
                  <div className="absolute top-2 right-2 z-30 flex items-center space-x-2">
                    <button
                      onClick={() => handleEditClick(item)}
                      className="p-1.5 bg-white/80 dark:bg-gray-900/80 rounded-full text-gray-700 dark:text-gray-200 hover:bg-white dark:hover:bg-gray-900 hover:scale-110 transition-transform"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536L16.732 3.732z"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDeleteClick(item)}
                      className="p-1.5 bg-white/80 dark:bg-gray-900/80 rounded-full text-red-500 hover:bg-white dark:hover:bg-gray-900 hover:scale-110 transition-transform"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                  {hoverInfo.id === item.id && (
                    <div
                      className={`absolute z-[9999] w-90 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-xl rounded-lg p-4 transition-opacity duration-200 max-h-110 overflow-y-auto
                        ${
                          hoverInfo.placement === 'right'
                            ? 'top-0 left-full ml-2'
                            : ''
                        }
                        ${
                          hoverInfo.placement === 'left'
                            ? 'top-0 right-full mr-2'
                            : ''
                        }
                        ${
                          hoverInfo.placement === 'top'
                            ? 'bottom-full mb-2 left-1/2 -translate-x-1/2'
                            : ''
                        }
                        ${
                          hoverInfo.placement === 'bottom'
                            ? 'top-full mt-2 left-1/2 -translate-x-1/2'
                            : ''
                        }
                      `}
                    >
                      <h3 className="font-semibold text-base mb-1 line-clamp-2">
                        {item.title}
                      </h3>
                      {item.description && (
                        <p className="text-xs mb-1 whitespace-pre-line text-gray-700 dark:text-gray-300">
                          {item.description}
                        </p>
                      )}
                      {item.metaDescription && (
                        <p className="text-xs mb-2 whitespace-pre-line text-gray-500 dark:text-gray-400">
                          {item.metaDescription}
                        </p>
                      )}
                      {Array.isArray(item.hashtags) &&
                        item.hashtags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {item.hashtags.map((tag, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 bg-gray-200 dark:bg-gray-700 rounded-full text-[10px] text-gray-700 dark:text-gray-300"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                    </div>
                  )}
                  <div className="relative aspect-video bg-gray-200 dark:bg-gray-700">
                    {item.mediaType === 'image' ? (
                      <Image
                        src={item.url}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <video
                        className="w-full h-full object-cover"
                        controls
                        poster={item.thumbnailUrl}
                      >
                        <source src={item.url} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 dark:text-white mb-2 line-clamp-2">
                      {item.title}
                    </h3>
                    {item.metaDescription && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                        {item.metaDescription}
                      </p>
                    )}
                    {Array.isArray(item.hashtags) &&
                      item.hashtags.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1">
                          {item.hashtags.slice(0, 3).map((tag, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded-full text-xs"
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
              <div className="col-span-full text-center text-gray-400 dark:text-gray-500 py-16">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-200">
                  No content found
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  There is no {activeTab} available for this mentor yet.
                </p>
              </div>
            )}
          </div>
        </main>

        {editingItem && (
          <Dialog
            open={!!editingItem}
            onOpenChange={(isOpen) => !isOpen && setEditingItem(null)}
          >
            <DialogContent className="sm:max-w-[480px] bg-white dark:bg-gray-800">
              <DialogHeader>
                <DialogTitle>Edit Content</DialogTitle>
                <DialogDescription>
                  Make changes to the content details. Click save when you're
                  done.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <label
                    htmlFor="title"
                    className="text-right text-sm font-medium"
                  >
                    Title
                  </label>
                  <Input
                    id="title"
                    value={editingItem.title}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, title: e.target.value })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <label
                    htmlFor="description"
                    className="text-right text-sm font-medium pt-2"
                  >
                    Description
                  </label>
                  <Textarea
                    id="description"
                    value={editingItem.description || ''}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        description: e.target.value,
                      })
                    }
                    className="col-span-3 min-h-[100px]"
                  />
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <label
                    htmlFor="metaDescription"
                    className="text-right text-sm font-medium pt-2"
                  >
                    Meta Description
                  </label>
                  <Textarea
                    id="metaDescription"
                    value={editingItem.metaDescription || ''}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        metaDescription: e.target.value,
                      })
                    }
                    className="col-span-3 min-h-[100px]"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label
                    htmlFor="hashtags"
                    className="text-right text-sm font-medium"
                  >
                    Hashtags
                  </label>
                  <Input
                    id="hashtags"
                    value={editingItem.hashtags}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        hashtags: e.target.value,
                      })
                    }
                    className="col-span-3"
                    placeholder="comma, separated, tags"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setEditingItem(null)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateItem} disabled={isUpdating}>
                  {isUpdating ? 'Saving...' : 'Save changes'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {itemToDelete && (
          <Dialog
            open={!!itemToDelete}
            onOpenChange={(isOpen) => !isOpen && setItemToDelete(null)}
          >
            <DialogContent className="sm:max-w-md bg-white dark:bg-gray-800">
              <DialogHeader>
                <DialogTitle>Are you sure?</DialogTitle>
                <DialogDescription>
                  This will permanently delete "{itemToDelete.title}". This
                  action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="sm:justify-end">
                <Button variant="outline" onClick={() => setItemToDelete(null)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleConfirmDelete}>
                  Yes, delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  )
}
