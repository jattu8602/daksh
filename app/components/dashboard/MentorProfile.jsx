'use client'

import { useState, useEffect } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import {
  Users,
  UserPlus,
  Video,
  Image as ImageIcon,
  Star,
  Play,
  School,
  MapPin,
  MessageCircle,
  MoreHorizontal,
  UserCheck,
  ExternalLink,
  Instagram,
  Youtube,
  Heart,
  Eye,
} from 'lucide-react'
import Image from 'next/image'

export default function MentorProfile({ mentorData, currentUser }) {
  const [activeTab, setActiveTab] = useState('videos')
  const [content, setContent] = useState({
    videos: [],
    posts: [],
    highlights: [],
    reels: [],
  })
  const [loading, setLoading] = useState(true)
  const [isFollowing, setIsFollowing] = useState(false)
  const [followCounts, setFollowCounts] = useState({
    followersCount: 0,
    followingCount: 0,
  })
  const [followLoading, setFollowLoading] = useState(false)

  // Handle both old and new API response structures
  const mentor = mentorData?.mentor || mentorData
  const user = mentorData?.user || mentorData

  console.log('MentorProfile data:', { mentorData, mentor, user, currentUser })

  const profileData = {
    name: user?.name || 'Mentor',
    username: user?.username || 'mentor_2024',
    photo: mentor?.profilePhoto || user?.profileImage || '/icons/girl.png',
    bio: mentor?.bio || 'Passionate educator helping students excel',
    tag: mentor?.tag || 'organic',
    skills: mentor?.skills || ['Math', 'Science', 'English'],
    subject: mentor?.subject || 'Mathematics',
    language: mentor?.language || 'English',
    isOrganic: mentor?.isOrganic || true,
    followers: 1250,
    following: 89,
    posts: 156,
    isFollowing: false,
  }

  useEffect(() => {
    const fetchMentorContent = async () => {
      try {
        setLoading(true)
        const username = user?.username

        if (!username) {
          setLoading(false)
          return
        }

        // Fetch video assignments for this mentor
        const response = await fetch(`/api/mentor/${username}/content`)
        if (response.ok) {
          const data = await response.json()
          setContent(data)
        }
      } catch (error) {
        console.error('Error fetching mentor content:', error)
      } finally {
        setLoading(false)
      }
    }

    const fetchFollowData = async () => {
      if (!currentUser?.id || !user?.id) {
        console.log('Missing user data:', {
          currentUser: currentUser?.id,
          profileUser: user?.id,
        })
        return
      }

      console.log('Checking follow status for mentor:', {
        currentUserId: currentUser.id,
        profileUserId: user.id,
      })

      try {
        // Check if current user is following this mentor
        const followCheckResponse = await fetch(
          `/api/follow?followerId=${currentUser.id}&followingId=${user.id}`
        )
        console.log(
          'Mentor follow check response status:',
          followCheckResponse.status
        )

        if (followCheckResponse.ok) {
          const followData = await followCheckResponse.json()
          console.log('Mentor follow data received:', followData)
          setIsFollowing(followData.following)
        } else {
          console.error(
            'Mentor follow check failed:',
            followCheckResponse.status
          )
        }

        // Get follow counts
        const countsResponse = await fetch(`/api/follow/counts/${user.id}`)
        if (countsResponse.ok) {
          const countsData = await countsResponse.json()
          setFollowCounts(countsData)
        }
      } catch (error) {
        console.error('Error fetching follow data:', error)
      }
    }

    fetchMentorContent()
    fetchFollowData()
  }, [user?.username, currentUser?.id, user?.id])

  const handleFollowToggle = async () => {
    if (!currentUser?.id || !user?.id) {
      console.log('Cannot follow mentor - missing user data:', {
        currentUser: currentUser?.id,
        profileUser: user?.id,
      })
      return
    }

    console.log('Attempting to toggle follow for mentor:', {
      currentUserId: currentUser.id,
      profileUserId: user.id,
      currentState: isFollowing,
    })

    setFollowLoading(true)
    try {
      const response = await fetch('/api/follow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          followerId: currentUser.id,
          followingId: user.id,
        }),
      })

      console.log('Mentor follow toggle response status:', response.status)

      if (response.ok) {
        const data = await response.json()
        console.log('Mentor follow toggle response data:', data)

        if (data.success) {
          setIsFollowing(data.following)
          // Update follower count based on the action
          setFollowCounts((prev) => ({
            ...prev,
            followersCount: data.following
              ? prev.followersCount + 1
              : prev.followersCount - 1,
          }))
          console.log('Mentor follow state updated to:', data.following)
        }
      } else {
        console.error('Mentor follow toggle failed:', response.status)
      }
    } catch (error) {
      console.error('Error toggling follow:', error)
    } finally {
      setFollowLoading(false)
    }
  }

  const renderContentGrid = (items, contentType) => {
    if (loading) {
      return (
        <div className="grid grid-cols-3 gap-1">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="aspect-square bg-gray-200 dark:bg-gray-700 animate-pulse rounded"
            />
          ))}
        </div>
      )
    }

    if (!items || items.length === 0) {
      return (
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
            {contentType === 'videos' && (
              <Video className="w-8 h-8 text-gray-400" />
            )}
            {contentType === 'posts' && (
              <ImageIcon className="w-8 h-8 text-gray-400" />
            )}
            {contentType === 'highlights' && (
              <Star className="w-8 h-8 text-gray-400" />
            )}
            {contentType === 'reels' && (
              <Play className="w-8 h-8 text-gray-400" />
            )}
          </div>
          <p className="text-gray-500 dark:text-gray-400">
            No {contentType} yet
          </p>
        </div>
      )
    }

    return (
      <div className="grid grid-cols-3 gap-1">
        {items.map((item, index) => (
          <div
            key={item.id || index}
            className="aspect-square relative group cursor-pointer rounded-lg overflow-hidden"
          >
            <Image
              src={item.thumbnail || item.image || '/placeholder.svg'}
              alt={item.title || `Content ${index + 1}`}
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />

            {/* Instagram-style overlay with stats */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-center">
                <div className="flex items-center justify-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Heart className="w-4 h-4" />
                    <span>{item.likes || 0}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    <span>{item.views || 0}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Content type indicator */}
            {contentType === 'videos' && (
              <div className="absolute top-2 left-2">
                <Play className="w-4 h-4 text-white bg-black/50 rounded-full p-1" />
              </div>
            )}
            {contentType === 'reels' && (
              <div className="absolute top-2 right-2">
                <Play className="w-4 h-4 text-white bg-black/50 rounded-full p-1" />
              </div>
            )}
            {contentType === 'highlights' && (
              <div className="absolute top-2 right-2">
                <Star className="w-4 h-4 text-white bg-black/50 rounded-full p-1" />
              </div>
            )}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <School className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            <span className="font-semibold text-gray-900 dark:text-white">
              {profileData.username}
            </span>
            {profileData.isOrganic && (
              <Badge
                variant="secondary"
                className="text-xs bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800"
              >
                Organic
              </Badge>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="w-9 h-9 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <MoreHorizontal className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </Button>
        </div>
      </div>

      {/* Profile Section */}
      <div className="px-6 py-6">
        {/* Avatar and Stats */}
        <div className="flex items-center gap-6 mb-6">
          <Avatar className="w-24 h-24 ring-2 ring-gray-100 dark:ring-gray-700">
            <AvatarImage src={profileData.photo} alt={profileData.name} />
            <AvatarFallback className="text-lg font-semibold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
              {profileData.name
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-xl font-bold text-gray-900 dark:text-white">
                  {content.videos.length +
                    content.posts.length +
                    content.highlights.length +
                    content.reels.length}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Posts
                </div>
              </div>
              <div>
                <div className="text-xl font-bold text-gray-900 dark:text-white">
                  {followCounts.followersCount}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Followers
                </div>
              </div>
              <div>
                <div className="text-xl font-bold text-gray-900 dark:text-white">
                  {followCounts.followingCount}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Following
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Info */}
        <div className="space-y-3 mb-6">
          <div>
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">
              {profileData.name}
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {profileData.bio}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge
              variant="outline"
              className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800"
            >
              {profileData.subject}
            </Badge>
            <Badge
              variant="outline"
              className="bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600"
            >
              {profileData.language}
            </Badge>
            {profileData.skills.slice(0, 2).map((skill, index) => (
              <Badge
                key={index}
                variant="outline"
                className="bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600"
              >
                {skill}
              </Badge>
            ))}
          </div>

          <div className="flex items-center gap-4 pt-2">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Verified Mentor
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mb-6">
          <Button
            onClick={handleFollowToggle}
            disabled={followLoading}
            className={`flex-1 ${
              isFollowing
                ? 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            {followLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
            ) : isFollowing ? (
              <>
                <UserCheck className="w-4 h-4 mr-2" />
                Following
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4 mr-2" />
                Follow
              </>
            )}
          </Button>
          <Button
            variant="outline"
            className="flex-1 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Message
          </Button>
        </div>

        {/* Social Links */}
        {mentor?.socialLinks && (
          <div className="flex gap-3 mb-6">
            {mentor.socialLinks.instagram && (
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Instagram className="w-4 h-4" />
                <span className="text-xs">Instagram</span>
              </Button>
            )}
            {mentor.socialLinks.youtube && (
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Youtube className="w-4 h-4" />
                <span className="text-xs">YouTube</span>
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="border-t border-gray-100 dark:border-gray-800">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-transparent h-12 p-0">
            <TabsTrigger
              value="videos"
              className="flex items-center gap-2 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-gray-900 dark:data-[state=active]:border-gray-100 rounded-none"
            >
              <Video className="w-4 h-4" />
              <span className="hidden sm:inline">Videos</span>
            </TabsTrigger>
            <TabsTrigger
              value="posts"
              className="flex items-center gap-2 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-gray-900 dark:data-[state=active]:border-gray-100 rounded-none"
            >
              <ImageIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Posts</span>
            </TabsTrigger>
            <TabsTrigger
              value="highlights"
              className="flex items-center gap-2 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-gray-900 dark:data-[state=active]:border-gray-100 rounded-none"
            >
              <Star className="w-4 h-4" />
              <span className="hidden sm:inline">Highlights</span>
            </TabsTrigger>
            <TabsTrigger
              value="reels"
              className="flex items-center gap-2 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-gray-900 dark:data-[state=active]:border-gray-100 rounded-none"
            >
              <Play className="w-4 h-4" />
              <span className="hidden sm:inline">Reels</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="videos" className="p-6 pt-4">
            {renderContentGrid(content.videos, 'videos')}
          </TabsContent>

          <TabsContent value="posts" className="p-6 pt-4">
            {renderContentGrid(content.posts, 'posts')}
          </TabsContent>

          <TabsContent value="highlights" className="p-6 pt-4">
            {renderContentGrid(content.highlights, 'highlights')}
          </TabsContent>

          <TabsContent value="reels" className="p-6 pt-4">
            {renderContentGrid(content.reels, 'reels')}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
