'use client'

import { Heart, MessageCircle, Send, Bookmark } from 'lucide-react'
import Image from 'next/image'
import { useState, useRef, useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import clsx from 'clsx'
import { Button } from '@/components/ui/button' // Make sure this import is correct
import { SkeletonCard, SkeletonText } from '@/components/ui/loading'
import Comments from '../comments'
import ShareModal from '../share-modal'

export default function Posts({
  posts,
  toggleLike,
  toggleSave,
  likedPosts,
  savedPosts,
  followedUsers,
  openModal,
  activeModal,
  closeModal,
  fetchMorePosts,
  hasMore,
  isLoading,
  onScroll,
  scrollPosition,
}) {
  const scrollRef = useRef(null)

  // Restore scroll position on mount
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollPosition
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleScroll = () => {
    if (scrollRef.current) {
      onScroll(scrollRef.current.scrollTop)
    }
  }

  return (
    <div
      ref={scrollRef}
      onScroll={handleScroll}
      className="flex-1 overflow-auto"
    >
      {posts.map((post, index) => (
        <PostItem
          key={post.id}
          post={post}
          isLast={index === posts.length - 1}
          fetchMorePosts={fetchMorePosts}
          hasMore={hasMore}
          toggleLike={toggleLike}
          toggleSave={toggleSave}
          likedPosts={likedPosts}
          savedPosts={savedPosts}
          followedUsers={followedUsers}
          onCommentClick={() => openModal('comments', post.id)}
          onShareClick={() => openModal('share', post.id)}
        />
      ))}

      {isLoading && <PostLoader />}
      {!hasMore && posts.length > 0 && (
        <div className="text-center py-4 text-gray-500">
          You've reached the end.
        </div>
      )}
      {!hasMore && posts.length === 0 && !isLoading && (
        <div className="text-center py-4 text-gray-500">
          No posts to show right now.
        </div>
      )}

      {activeModal.type === 'comments' && (
        <Comments
          post={posts.find((p) => p.id === activeModal.postId)}
          onClose={closeModal}
        />
      )}

      {activeModal.type === 'share' && (
        <ShareModal
          post={posts.find((p) => p.id === activeModal.postId)}
          onClose={closeModal}
        />
      )}
    </div>
  )
}

const PostLoader = () => (
  <div className="space-y-6 p-4">
    <div className="space-y-3">
      <div className="flex items-center space-x-3">
        <SkeletonCard className="w-10 h-10 rounded-full" />
        <SkeletonText lines={1} className="flex-1" />
      </div>
      <SkeletonCard className="w-full h-64" />
      <SkeletonText lines={2} />
    </div>
  </div>
)

function PostItem({
  post,
  isLast,
  fetchMorePosts,
  hasMore,
  toggleLike,
  toggleSave,
  likedPosts,
  savedPosts,
  followedUsers,
  onCommentClick,
  onShareClick,
}) {
  const { ref, inView } = useInView({
    threshold: 0.5,
    triggerOnce: true,
  })

  useEffect(() => {
    if (inView && isLast && hasMore) {
      fetchMorePosts()
    }
  }, [inView, isLast, hasMore, fetchMorePosts])

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
    <div ref={ref} className="border-gray-100 pb-4">
      {/* Header with Avatar + Username + Follow Button */}
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center space-x-3">
          <img
            src={post.avatar || '/placeholder.png'}
            alt={post.username}
            className="w-8 h-8 rounded-full"
          />
          <span className="font-medium text-sm text-black dark:text-white">
            {post.username}
          </span>
        </div>
        <Button
          variant="outline"
          size="sm"
          className={clsx(
            'border text-sm px-4 py-1.5 rounded-md transition-colors',
            isFollowed
              ? 'bg-white text-black border-gray-300 hover:bg-gray-100 dark:bg-black dark:text-white dark:border-gray-700 dark:hover:bg-gray-900'
              : 'bg-black text-white border-gray-700 hover:bg-gray-800 dark:bg-white dark:text-black dark:border-gray-300 dark:hover:bg-gray-200'
          )}
          onClick={() => setIsFollowed((prev) => !prev)}
        >
          {isFollowed ? 'Following' : 'Follow'}
        </Button>
      </div>

      {/* Image / Video Slider */}
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
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center px-4 pt-4">
        <div className="flex space-x-4">
          <button onClick={() => toggleLike(post.id)}>
            <Heart
              size={24}
              fill={likedPosts.includes(post.id) ? 'red' : 'none'}
              className={
                likedPosts.includes(post.id)
                  ? 'text-red-500'
                  : 'text-black dark:text-white'
              }
            />
          </button>
          <button onClick={onCommentClick}>
            <MessageCircle size={24} className="text-black dark:text-white" />
          </button>
          <button onClick={onShareClick}>
            <Send size={24} className="text-black dark:text-white" />
          </button>
        </div>
        <button onClick={() => toggleSave(post.id)}>
          <Bookmark
            size={24}
            fill="currentColor"
            strokeWidth={1.5}
            className={clsx(
              'transition-colors duration-200',
              savedPosts.includes(post.id)
                ? 'text-gray-600 dark:text-gray-300 stroke-gray-600 dark:stroke-gray-300'
                : 'text-transparent stroke-black dark:stroke-white'
            )}
          />
        </button>
      </div>

      {/* Post Info */}
      <div className="px-4 pt-2">
        <p className="font-medium">{post.likes} Likes</p>
        <p className="font-medium mt-1">{post.title}</p>
        <p className="text-sm">
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
                className="bg-blue-100 text-blue-700 text-[10px] px-2 py-[2px] rounded-full font-medium"
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
