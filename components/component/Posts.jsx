'use client'

import {
  Heart,
  MessageCircle,
  Share,
  Send,
  Bookmark,
  MoreVertical,
} from 'lucide-react'
import Image from 'next/image'
import { useState, useRef } from 'react'

export default function Posts({
  posts,
  toggleLike,
  toggleSave,
  likedPosts,
  savedPosts,
  followedUsers,
}) {
  return (
    <div className="flex-1 overflow-auto">
      {posts.map((post) => (
        <PostItem
          key={post.id}
          post={post}
          toggleLike={toggleLike}
          toggleSave={toggleSave}
          likedPosts={likedPosts}
          savedPosts={savedPosts}
          followedUsers={followedUsers}
        />
      ))}
    </div>
  )
}

function PostItem({
  post,
  toggleLike,
  toggleSave,
  likedPosts,
  savedPosts,
  followedUsers,
}) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isFollowed, setIsFollowed] = useState(
    followedUsers.includes(post.username)
  )
  const [isExpanded, setIsExpanded] = useState(false)
  const images = Array.isArray(post.images) ? post.images : [post.images]

  const touchStartX = useRef(null)
  const touchEndX = useRef(null)

  const mouseDownX = useRef(null)
  const mouseUpX = useRef(null)

  const minSwipeDistance = 50

  const onTouchStart = (e) => {
    touchStartX.current = e.targetTouches[0].clientX
  }

  const onTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX
  }

  const onTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return
    const distance = touchStartX.current - touchEndX.current
    if (distance > minSwipeDistance) {
      setCurrentImageIndex((prev) =>
        prev === images.length - 1 ? 0 : prev + 1
      )
    } else if (distance < -minSwipeDistance) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? images.length - 1 : prev - 1
      )
    }
    touchStartX.current = null
    touchEndX.current = null
  }

  const onMouseDown = (e) => {
    mouseDownX.current = e.clientX
  }

  const onMouseUp = (e) => {
    mouseUpX.current = e.clientX
    const distance = mouseDownX.current - mouseUpX.current
    if (distance > minSwipeDistance) {
      setCurrentImageIndex((prev) =>
        prev === images.length - 1 ? 0 : prev + 1
      )
    } else if (distance < -minSwipeDistance) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? images.length - 1 : prev - 1
      )
    }
    mouseDownX.current = null
    mouseUpX.current = null
  }

  const handleDotClick = (index) => {
    setCurrentImageIndex(index)
  }

  return (
    <div className="border-b border-gray-100 pb-4">
      {/* Image Slider */}
      <div
        className="w-full overflow-hidden relative aspect-square"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
      >
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${currentImageIndex * 100}%)`,
            width: `${images.length * 100}%`,
          }}
        >
          {images.map((img, idx) =>
            post.mediaType === 'video' ? (
              <video
                key={idx}
                src={img}
                controls
                className="w-full flex-shrink-0 object-cover aspect-square select-none"
                playsInline
              />
            ) : (
              <Image
                key={idx}
                src={img}
                alt={`Slide ${idx + 1}`}
                width={500}
                height={500}
                className="w-full flex-shrink-0 object-cover aspect-square select-none"
                draggable={false}
              />
            )
          )}
        </div>

        {/* Dots */}
        {images.length > 1 && (
          <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-2 z-10">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => handleDotClick(idx)}
                className={`w-3 h-3 rounded-full ${
                  currentImageIndex === idx ? 'bg-white' : 'bg-gray-400'
                }`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>
        )}

        {/* Top Overlay */}
        <div className="absolute top-0 left-0 w-full flex items-center justify-between px-4 py-2 text-white z-10">
          <div className="flex items-center space-x-2">
            <img
              src={post.avatar || '/placeholder.png'}
              alt={post.username}
              className="w-8 h-8 rounded-full"
            />
            <span className="font-medium text-sm">{post.username}</span>
          </div>
          <div className="flex items-center space-x-3">
            {!isFollowed && (
              <button
                className="text-xs bg-white text-black px-3 py-1 rounded-full font-medium hover:bg-gray-200 transition"
                onClick={() => setIsFollowed(true)}
              >
                Follow
              </button>
            )}
            <MoreVertical size={20} />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center px-4 pt-4">
        <div className="flex space-x-4">
          <button onClick={() => toggleLike(post.id)}>
            <Heart
              size={24}
              fill={likedPosts.includes(post.id) ? 'red' : 'none'}
              color={likedPosts.includes(post.id) ? 'red' : 'black'}
            />
          </button>
          <MessageCircle size={24} />
          <Send size={24} />
        </div>
        <button onClick={() => toggleSave(post.id)}>
          <Bookmark
            size={24}
            fill={savedPosts.includes(post.id) ? 'black' : 'none'}
            color={savedPosts.includes(post.id) ? 'black' : 'black'}
          />
        </button>
      </div>

      {/* Post Info */}
      <div className="px-4 pt-2">
        <p className="font-medium">{post.likes} Likes</p>
        <p className="font-medium mt-1">{post.title}</p>
        <p className="text-sm">
          {/* <span className="font-medium">{post.username}</span>{' '} */}
          {isExpanded
            ? post.caption
            : `${post.caption.substring(0, 70)}${
                post.caption.length > 70 ? '...' : ''
              }`}
        </p>
        <div className="flex flex-wrap items-center gap-2 mt-1">
          {(isExpanded ? post.hashtags : post.hashtags.slice(0, 3)).map(
            (tag, i) => (
              <span
                key={i}
                className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full font-medium"
              >
                #{tag}
              </span>
            )
          )}
          {(post.caption.length > 70 || post.hashtags.length > 3) && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-sm text-gray-500 cursor-pointer"
            >
              {isExpanded ? 'show less' : '...more'}
            </button>
          )}
        </div>
        <p className="text-gray-400 text-xs mt-1">{post.time}</p>
      </div>
    </div>
  )
}
