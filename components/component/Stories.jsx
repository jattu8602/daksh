'use client'

import StoryViewer from '../story-viewer'
import { useEffect, useState } from 'react'

const LOCAL_STORIES_KEY = 'feed_stories_cache'

export default function Stories({ onStoryClick, activeModal, closeModal }) {
  const [stories, setStories] = useState([])
  const [groups, setGroups] = useState([])
  const [viewerIndex, setViewerIndex] = useState(0)
  const [storyStart, setStoryStart] = useState(0)

  // Fetch stories with caching
  useEffect(() => {
    const cachedRaw = JSON.parse(
      localStorage.getItem(LOCAL_STORIES_KEY) || '[]'
    )
    if (cachedRaw.length > 0) {
      setStories(cachedRaw)
      setGroups(groupByMentor(cachedRaw))
    }

    fetch('/api/stories?limit=15')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStories(data.data)
          setGroups(groupByMentor(data.data))
          localStorage.setItem(LOCAL_STORIES_KEY, JSON.stringify(data.data))
        }
      })
      .catch(console.error)
  }, [])

  // Helper to group highlights per mentor
  const groupByMentor = (items) => {
    const map = new Map()
    items.forEach((item) => {
      const key = item.mentorId || item.mentorUsername
      if (!map.has(key)) {
        map.set(key, {
          mentorId: key,
          mentorUsername: item.mentorUsername,
          mentorAvatar: item.mentorAvatar,
          stories: [],
        })
      }
      map.get(key).stories.push(item)
    })

    // Determine watched status per group (if all stories watched -> true)
    return Array.from(map.values()).map((g) => ({
      ...g,
      isWatched: g.stories.every((s) => s.isWatched),
    }))
  }

  const handleStoryClick = (story) => {
    const idx = groups.findIndex(
      (g) =>
        (g.mentorId || g.mentorUsername) ===
        (story.mentorId || story.mentorUsername)
    )
    setViewerIndex(idx >= 0 ? idx : 0)
    setStoryStart(0)
    onStoryClick(story)
  }

  return (
    <div>
      {/* Stories */}
      <div className="pb-2">
        <div className="flex space-x-2 overflow-x-auto hide-scrollbar">
          {groups.map((group) => (
            <div
              key={group.mentorId || group.mentorUsername}
              className="flex flex-col items-center first:ml-3 cursor-pointer"
              onClick={() => handleStoryClick(group)}
            >
              <div className="relative">
                <div
                  className={`w-20 h-20 rounded-full flex items-center justify-center ${
                    !group.isWatched
                      ? 'bg-gradient-to-tr from-yellow-500 to-pink-500 p-[3px]'
                      : 'p-[3px] opacity-50'
                  }`}
                >
                  <div className="bg-white dark:bg-black rounded-full p-[3px] w-full h-full flex items-center justify-center">
                    <img
                      src={group.mentorAvatar || '/placeholder.svg'}
                      alt={group.mentorUsername}
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                </div>
              </div>
              <span className="text-xs mt-1 truncate w-16 text-center">
                {group.mentorUsername}
              </span>
            </div>
          ))}
        </div>
      </div>
      {activeModal.type === 'story' && (
        <StoryViewer
          key={`${viewerIndex}-${storyStart}`}
          stories={groups[viewerIndex]?.stories || []}
          startIndex={storyStart}
          onClose={closeModal}
          onComplete={() => {
            if (viewerIndex < groups.length - 1) {
              setViewerIndex(viewerIndex + 1)
              setStoryStart(0)
            } else {
              closeModal()
            }
          }}
          onPrev={() => {
            if (viewerIndex > 0) {
              const newIdx = viewerIndex - 1
              setViewerIndex(newIdx)
              setStoryStart(groups[newIdx].stories.length - 1)
            } else {
              closeModal()
            }
          }}
        />
      )}
    </div>
  )
}
