'use client'

import React, { useState, useRef, useEffect } from 'react'
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MoreHorizontal,
  Volume2,
  VolumeX,
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'

const reelsData = [
  {
    id: 1,
    videoUrl:
      'https://pub-7021c24c5a8941118427c1fdc660efff.r2.dev/videos/1747683186452-what_happened_in_uphar_cinema_3d_animation__shorts.mp4',
    mentor: {
      username: 'science_explorer',
      avatar: '/icons/girl.png',
      isDaksh: false,
    },
    description:
      'What happened in Uphar Cinema? A detailed 3D animation explaining the tragic incident that changed fire safety regulations forever. This educational content helps us understand the importance of safety measures in public spaces.',
    likes: 19700,
    comments: 51,
    shares: 6556,
    isLiked: false,
  },
  {
    id: 2,
    videoUrl:
      'https://pub-7021c24c5a8941118427c1fdc660efff.r2.dev/videos/1747684534610-why_birds_don_t_die_of_high_voltage_____explained_in_1_min___shorts__shorts.mp4',
    mentor: {
      username: 'physics_mentor',
      avatar: '/icons/girl.png',
      isDaksh: true,
    },
    description:
      "Why birds don't die of high voltage? Explained in 1 minute! The fascinating physics behind how birds can safely perch on power lines.",
    likes: 12700,
    comments: 89,
    shares: 4200,
    isLiked: true,
  },
  {
    id: 3,
    videoUrl:
      'https://pub-7021c24c5a8941118427c1fdc660efff.r2.dev/videos/1747684569629-pee_rokna_galat_hai___explained_in_1_min__hindi__shorts__shorts.mp4',
    mentor: {
      username: 'health_guru',
      avatar: '/icons/girl.png',
      isDaksh: true,
    },
    description:
      'Pee rokna galat hai! Important health tips explained in Hindi. Learn why holding urine can be harmful to your health and what you should do instead.',
    likes: 8900,
    comments: 156,
    shares: 2100,
    isLiked: false,
  },
  {
    id: 4,
    videoUrl:
      'https://pub-7021c24c5a8941118427c1fdc660efff.r2.dev/videos/1747720979811-_why_did_japan_attack_pearl_harbor__uncover_the_strategy_behind_the_attack____history__map.mp4',
    mentor: {
      username: 'science_explorer',
      avatar: '/icons/girl.png',
      isDaksh: false,
    },
    description:
      'What happened in Uphar Cinema? A detailed 3D animation explaining the tragic incident that changed fire safety regulations forever. This educational content helps us understand the importance of safety measures in public spaces.',
    likes: 19700,
    comments: 51,
    shares: 6556,
    isLiked: false,
  },
  {
    id: 5,
    videoUrl:
      'https://pub-7021c24c5a8941118427c1fdc660efff.r2.dev/videos/1747721029100-_desertification_in_the_sahel__a_call_to_action__.mp4',
    mentor: {
      username: 'physics_mentor',
      avatar: '/icons/girl.png',
      isDaksh: true,
    },
    description:
      "Why birds don't die of high voltage? Explained in 1 minute! The fascinating physics behind how birds can safely perch on power lines.",
    likes: 12700,
    comments: 89,
    shares: 4200,
    isLiked: true,
  },
  {
    id: 6,
    videoUrl:
      'https://pub-7021c24c5a8941118427c1fdc660efff.r2.dev/videos/1747721143218-top_5_countries_with_the_most_forest_cover___fascinating_geography_facts.mp4',
    mentor: {
      username: 'health_guru',
      avatar: '/icons/girl.png',
      isDaksh: false,
    },
    description:
      'Pee rokna galat hai! Important health tips explained in Hindi. Learn why holding urine can be harmful to your health and what you should do instead.',
    likes: 8900,
    comments: 156,
    shares: 2100,
    isLiked: false,
  },
  {
    id: 7,
    videoUrl:
      'https://pub-7021c24c5a8941118427c1fdc660efff.r2.dev/videos/1747721210053-_the_rise_and_fall_of_the_korean_empire__a_journey_through_history_.mp4',
    mentor: {
      username: 'science_explorer',
      avatar: '/icons/girl.png',
      isDaksh: false,
    },
    description:
      'What happened in Uphar Cinema? A detailed 3D animation explaining the tragic incident that changed fire safety regulations forever. This educational content helps us understand the importance of safety measures in public spaces.',
    likes: 19700,
    comments: 51,
    shares: 6556,
    isLiked: false,
  },
  {
    id: 8,
    videoUrl:
      'https://pub-7021c24c5a8941118427c1fdc660efff.r2.dev/videos/1747721246995-_why_is_it_called_the_indian_subcontinent____geography_explained_.mp4',
    mentor: {
      username: 'physics_mentor',
      avatar: '/icons/girl.png',
      isDaksh: true,
    },
    description:
      "Why birds don't die of high voltage? Explained in 1 minute! The fascinating physics behind how birds can safely perch on power lines.",
    likes: 12700,
    comments: 89,
    shares: 4200,
    isLiked: true,
  },
  {
    id: 9,
    videoUrl:
      'https://pub-7021c24c5a8941118427c1fdc660efff.r2.dev/videos/1747721295909-the_dead_sea__earth_s_lowest___saltiest_wonder______.mp4',
    mentor: {
      username: 'health_guru',
      avatar: '/icons/girl.png',
      isDaksh: true,
    },
    description:
      'Pee rokna galat hai! Important health tips explained in Hindi. Learn why holding urine can be harmful to your health and what you should do instead.',
    likes: 8900,
    comments: 156,
    shares: 2100,
    isLiked: false,
  },
]

const commentsData = [
  {
    id: 1,
    username: 'curious_student',
    avatar: '/placeholder.svg?height=32&width=32',
    text: 'This is so informative! Thanks for sharing 🙏',
    time: '2h',
    replies: [
      {
        id: 11,
        username: 'science_explorer',
        avatar: '/placeholder.svg?height=32&width=32',
        text: 'Glad you found it helpful! 😊',
        time: '1h',
      },
      {
        id: 12,
        username: 'learning_enthusiast',
        avatar: '/placeholder.svg?height=32&width=32',
        text: 'Same here! Love these educational videos',
        time: '45m',
      },
    ],
  },
  {
    id: 2,
    username: 'knowledge_seeker',
    avatar: '/placeholder.svg?height=32&width=32',
    text: 'Can you make more videos like this? 🔥',
    time: '4h',
    replies: [],
  },
  {
    id: 3,
    username: 'student_life',
    avatar: '/placeholder.svg?height=32&width=32',
    text: 'Amazing explanation! This helped me understand the concept better 📚',
    time: '6h',
    replies: [
      {
        id: 31,
        username: 'physics_mentor',
        avatar: '/placeholder.svg?height=32&width=32',
        text: "That's exactly what we aim for! Keep learning 🚀",
        time: '5h',
      },
    ],
  },
]

const shareUsers = [
  {
    username: 'best_friend',
    avatar: '/placeholder.svg?height=40&width=40',
    name: 'Sarah Johnson',
  },
  {
    username: 'study_buddy',
    avatar: '/placeholder.svg?height=40&width=40',
    name: 'Mike Chen',
  },
  {
    username: 'lab_partner',
    avatar: '/placeholder.svg?height=40&width=40',
    name: 'Emma Davis',
  },
  {
    username: 'class_mate',
    avatar: '/placeholder.svg?height=40&width=40',
    name: 'Alex Kumar',
  },
  {
    username: 'project_team',
    avatar: '/placeholder.svg?height=40&width=40',
    name: 'Lisa Wang',
  },
]

export default function InstagramReels() {
  const [currentReel, setCurrentReel] = useState(0)
  const [showComments, setShowComments] = useState(false)
  const [showShare, setShowShare] = useState(false)
  const [showFullDescription, setShowFullDescription] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [reels, setReels] = useState(reelsData)
  const [newComment, setNewComment] = useState('')
  const [replyingTo, setReplyingTo] = useState(null)
  const [isHolding, setIsHolding] = useState(false)
  const [touchStartY, setTouchStartY] = useState(0)
  const [touchEndY, setTouchEndY] = useState(0)
  const [isScrolling, setIsScrolling] = useState(false)

  const videoRefs = useRef([])
  const containerRef = useRef(null)
  const holdTimeoutRef = useRef(null)
  const touchTimeoutRef = useRef(null)

  const toggleLike = () => {
    setReels((prev) =>
      prev.map((reel, index) =>
        index === currentReel
          ? {
              ...reel,
              isLiked: !reel.isLiked,
              likes: reel.isLiked ? reel.likes - 1 : reel.likes + 1,
            }
          : reel
      )
    )
  }

  const formatCount = (count) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`
    return count.toString()
  }

  const truncateText = (text, maxLength = 30) =>
    text.length <= maxLength ? text : text.substring(0, maxLength) + '...'

  const handleAddComment = () => {
    if (!newComment.trim()) return
    setNewComment('')
    setReplyingTo(null)
  }

  const handleVideoTap = (e) => {
    e.preventDefault()
    if (!isHolding) {
      setIsMuted(!isMuted)
    }
  }

  const handleMouseDown = () => {
    holdTimeoutRef.current = setTimeout(() => {
      setIsHolding(true)
      const currentVideo = videoRefs.current[currentReel]
      if (currentVideo) {
        currentVideo.pause()
      }
    }, 200)
  }

  const handleMouseUp = () => {
    clearTimeout(holdTimeoutRef.current)
    if (isHolding) {
      setIsHolding(false)
      const currentVideo = videoRefs.current[currentReel]
      if (currentVideo) {
        currentVideo
          .play()
          .catch((err) => err.name !== 'AbortError' && console.warn(err))
      }
    }
  }

  const handleTouchStart = (e) => {
    setTouchStartY(e.touches[0].clientY)
    holdTimeoutRef.current = setTimeout(() => {
      setIsHolding(true)
      const currentVideo = videoRefs.current[currentReel]
      if (currentVideo) {
        currentVideo.pause()
      }
    }, 200)
  }

  const handleTouchMove = (e) => {
    setTouchEndY(e.touches[0].clientY)
    const diff = touchStartY - touchEndY
    if (Math.abs(diff) > 10) {
      setIsScrolling(true)
      clearTimeout(holdTimeoutRef.current)
      setIsHolding(false)
    }
  }

  const handleTouchEnd = () => {
    clearTimeout(holdTimeoutRef.current)
    if (isHolding) {
      setIsHolding(false)
      const currentVideo = videoRefs.current[currentReel]
      if (currentVideo) {
        currentVideo
          .play()
          .catch((err) => err.name !== 'AbortError' && console.warn(err))
      }
    }

    if (isScrolling) {
      const diff = touchStartY - touchEndY
      if (Math.abs(diff) > 50) {
        if (diff > 0 && currentReel < reels.length - 1) {
          setCurrentReel((prev) => prev + 1)
        } else if (diff < 0 && currentReel > 0) {
          setCurrentReel((prev) => prev - 1)
        }
      }
      setIsScrolling(false)
    }

    setTouchStartY(0)
    setTouchEndY(0)
  }

  const handleWheel = (e) => {
    e.preventDefault()
    if (e.deltaY > 0 && currentReel < reels.length - 1) {
      setCurrentReel((prev) => prev + 1)
    } else if (e.deltaY < 0 && currentReel > 0) {
      setCurrentReel((prev) => prev - 1)
    }
  }

  useEffect(() => {
    const video = videoRefs.current[currentReel]
    if (video) {
      video.muted = isMuted
    }
  }, [isMuted])

  useEffect(() => {
    videoRefs.current.forEach((video, idx) => {
      if (video) {
        if (idx === currentReel) {
          video.currentTime = 0
          video
            .play()
            .catch((err) => err.name !== 'AbortError' && console.warn(err))
        } else {
          video.pause()
        }
      }
    })
  }, [currentReel])

  // Add useEffect to prevent pull-to-reload
  useEffect(() => {
    const preventPullToReload = (e) => {
      if (window.scrollY === 0 && e.touches[0].clientY > 0) {
        e.preventDefault()
      }
    }

    document.addEventListener('touchmove', preventPullToReload, {
      passive: false,
    })
    document.body.style.overscrollBehavior = 'none'

    return () => {
      document.removeEventListener('touchmove', preventPullToReload)
      document.body.style.overscrollBehavior = ''
    }
  }, [])

  const currentReelData = reels[currentReel]

  return (
    <div
      className="fixed inset-0 bg-black overscroll-none"
      style={{ overscrollBehavior: 'none' }}
    >
      <div
        ref={containerRef}
        className="h-full w-full overflow-hidden overscroll-none"
        style={{ overscrollBehavior: 'none' }}
        onWheel={handleWheel}
      >
        <div
          className="h-full transition-transform duration-300 ease-out"
          style={{ transform: `translateY(-${currentReel * 100}%)` }}
        >
          {reels.map((reel, idx) => (
            <div key={reel.id} className="h-full w-full relative">
              <video
                ref={(el) => (videoRefs.current[idx] = el)}
                className="w-full h-full object-cover"
                src={reel.videoUrl}
                loop
                muted={isMuted}
                playsInline
                onClick={handleVideoTap}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onContextMenu={(e) => e.preventDefault()}
              />

              {/* Mute indicator */}
              <div className="absolute top-4 right-4">
                <div className="bg-slate-200 rounded-full p-2">
                  {isMuted ? (
                    <VolumeX className="w-4 h-4" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="absolute right-3 bottom-24 flex flex-col items-center gap-5">
                {/* Like */}
                <div className="flex flex-col items-center">
                  <Button
                    variant="ghost"
                    className="!w-9 !h-9 text-white hover:text-red-500 transition-colors p-0"
                    onClick={toggleLike}
                  >
                    <Heart
                      className={`!w-7 !h-7 ${
                        reel.isLiked ? 'fill-red-500 text-red-500' : ''
                      }`}
                    />
                  </Button>
                  <span className="text-sm font-medium text-slate-200">
                    {formatCount(reel.likes)}
                  </span>
                </div>

                {/* Comment */}
                <div className="flex flex-col items-center">
                  <Button
                    variant="ghost"
                    className="!w-9 !h-9 text-white hover:text-blue-400 transition-colors p-0"
                    onClick={() => setShowComments(true)}
                  >
                    <MessageCircle className="!w-7 !h-7" />
                  </Button>
                  <span className="text-sm font-medium text-slate-200">
                    {reel.comments}
                  </span>
                </div>

                {/* Share */}
                <div className="flex flex-col items-center">
                  <Button
                    variant="ghost"
                    className="!w-9 !h-9 text-white hover:text-green-400 transition-colors p-0"
                    onClick={() => setShowShare(true)}
                  >
                    <Send className="!w-7 !h-7" />
                  </Button>
                  <span className="text-sm font-medium text-slate-200">
                    {formatCount(reel.shares)}
                  </span>
                </div>

                {/* Bookmark */}
                <div className="flex flex-col items-center">
                  <Button
                    variant="ghost"
                    className="!w-9 !h-9 text-white hover:text-yellow-400 transition-colors p-0"
                  >
                    <Bookmark className="!w-7 !h-7" />
                  </Button>
                </div>

                {/* More */}
                <Button
                  variant="ghost"
                  className="!w-9 !h-9 text-white hover:text-gray-400 transition-colors p-0"
                >
                  <MoreHorizontal className="!w-7 !h-7" />
                </Button>
              </div>

              {/* Bottom Content */}
              <div className="absolute bottom-16 left-4 right-20">
                {/* Mentor Info */}
                <div className="flex items-center gap-3 mb-3 relative">
                  <Avatar className="w-12 h-12 border-2 border-white">
                    <AvatarImage
                      src={reel.mentor.avatar || '/placeholder.svg'}
                    />
                    <AvatarFallback>
                      {reel.mentor.username[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex items-center gap-3 bottom-0 left-14 absolute">
                    <div className="flex items-center gap-2 ">
                      <span className="font-semibold text-sm text-slate-200">
                        {reel.mentor.username}
                      </span>
                      {reel.mentor.isDaksh && (
                        <Badge className="bg-[#F66B7A] hover:bg-orange-500 text-white text-xs py-1 cursor-default">
                          daksh
                        </Badge>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-sm px-2 py-1 h-8 border-2 border-white text-black hover:bg-black hover:text-black font-semibold"
                    >
                      Follow
                    </Button>
                  </div>
                </div>

                {/* Description */}
                <div className="text-xs text-slate-200 leading-tight">
                  <p>
                    {showFullDescription
                      ? reel.description
                      : truncateText(reel.description, 30)}{' '}
                    {/* Reduced from 50 to 30 characters */}
                    {reel.description.length > 30 && (
                      <button
                        className="text-blue-200 ml-1 font-medium text-xs"
                        onClick={() =>
                          setShowFullDescription(!showFullDescription)
                        }
                      >
                        {showFullDescription ? 'less' : 'more'}
                      </button>
                    )}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Comments Modal */}
      <Dialog open={showComments} onOpenChange={setShowComments}>
        <DialogContent className="max-w-sm mx-auto h-[80vh] p-0 bg-white text-black">
          <DialogHeader className="p-4 border-b">
            <DialogTitle>Comments</DialogTitle>
          </DialogHeader>

          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {commentsData.map((comment) => (
                <div key={comment.id} className="space-y-2">
                  <div className="flex gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={comment.avatar || '/placeholder.svg'} />
                      <AvatarFallback>
                        {comment.username[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm">
                          {comment.username}
                        </span>
                        <span className="text-xs text-gray-500">
                          {comment.time}
                        </span>
                      </div>
                      <p className="text-sm">{comment.text}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs text-gray-500 p-0 h-auto"
                        onClick={() => setReplyingTo(comment.id)}
                      >
                        Reply
                      </Button>
                    </div>
                  </div>
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className="flex gap-3 ml-8">
                      <Avatar className="w-6 h-6">
                        <AvatarImage src={reply.avatar || '/placeholder.svg'} />
                        <AvatarFallback>
                          {reply.username[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-xs">
                            {reply.username}
                          </span>
                          <span className="text-xs text-gray-500">
                            {reply.time}
                          </span>
                        </div>
                        <p className="text-xs">{reply.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Avatar className="w-8 h-8">
                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                <AvatarFallback>You</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <Input
                  placeholder={
                    replyingTo ? 'Add a reply...' : 'Add a comment...'
                  }
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="border-0 bg-gray-100 text-sm"
                />
                {replyingTo && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs text-gray-500 p-0 h-auto mt-1"
                    onClick={() => setReplyingTo(null)}
                  >
                    Cancel reply
                  </Button>
                )}
              </div>
              <Button size="sm" onClick={handleAddComment}>
                Post
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Share Modal */}
      <Dialog open={showShare} onOpenChange={setShowShare}>
        <DialogContent className="max-w-sm mx-auto bg-white text-black">
          <DialogHeader>
            <DialogTitle>Share</DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            {shareUsers.map((user) => (
              <div
                key={user.username}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={user.avatar || '/placeholder.svg'} />
                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-sm">{user.name}</p>
                    <p className="text-xs text-gray-500">@{user.username}</p>
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  Send
                </Button>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
