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
  Bookmark,
  School,
  Trophy,
  MapPin,
  MessageCircle,
  MoreHorizontal,
  UserCheck,
} from 'lucide-react'
import Image from 'next/image'

export default function OtherStudentProfile({ studentData, currentUser }) {
  const [isFollowing, setIsFollowing] = useState(false)
  const [followCounts, setFollowCounts] = useState({
    followersCount: 0,
    followingCount: 0,
  })
  const [followLoading, setFollowLoading] = useState(false)
  const student = studentData?.student
  const studentClass = student?.class
  const school = studentClass?.school
  const user = studentData?.user

  const profileData = {
    name: user?.name || 'Student',
    username: user?.username || 'student_2024',
    section: studentClass?.section || '10-B',
    photo: student?.profileImage || user?.profileImage || '/icons/girl.png',
    school: {
      name: school?.name || 'School Name',
      code: school?.code || 'SCH001',
    },
    stats: {
      totalClasses: 12,
      totalStudentsInSchool: 1250,
      totalStudentsInClass: studentClass?.totalStudents || 32,
      boysInClass: studentClass?.boys || 16,
      girlsInClass: studentClass?.girls || 16,
      boysInSchool: 625,
      girlsInSchool: 625,
    },
    dailyStreak: 22,
    followers: 67,
    following: 45,
    isFollowing: false, // This would be determined by API
  }

  const savedPosts = [
    {
      id: 1,
      image: '/placeholder.svg?height=300&width=300',
      title: 'Biology Notes',
    },
    {
      id: 2,
      image: '/placeholder.svg?height=300&width=300',
      title: 'Art Project',
    },
    {
      id: 3,
      image: '/placeholder.svg?height=300&width=300',
      title: 'Geography Map',
    },
    {
      id: 4,
      image: '/placeholder.svg?height=300&width=300',
      title: 'English Essay',
    },
    {
      id: 5,
      image: '/placeholder.svg?height=300&width=300',
      title: 'Math Solutions',
    },
    {
      id: 6,
      image: '/placeholder.svg?height=300&width=300',
      title: 'Science Lab',
    },
  ]

  useEffect(() => {
    const fetchFollowData = async () => {
      if (!currentUser?.id || !user?.id) return

      try {
        // Check if current user is following this student
        const followCheckResponse = await fetch(
          `/api/follow/check?followerId=${currentUser.id}&followingId=${user.id}`
        )
        if (followCheckResponse.ok) {
          const followData = await followCheckResponse.json()
          setIsFollowing(followData.isFollowing)
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

    fetchFollowData()
  }, [currentUser?.id, user?.id])

  const handleFollowToggle = async () => {
    if (!currentUser?.id || !user?.id) return

    setFollowLoading(true)
    try {
      if (isFollowing) {
        // Unfollow
        const response = await fetch('/api/follow', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            followerId: currentUser.id,
            followingId: user.id,
          }),
        })
        if (response.ok) {
          setIsFollowing(false)
          setFollowCounts((prev) => ({
            ...prev,
            followersCount: prev.followersCount - 1,
          }))
        }
      } else {
        // Follow
        const response = await fetch('/api/follow', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            followerId: currentUser.id,
            followingId: user.id,
          }),
        })
        if (response.ok) {
          setIsFollowing(true)
          setFollowCounts((prev) => ({
            ...prev,
            followersCount: prev.followersCount + 1,
          }))
        }
      }
    } catch (error) {
      console.error('Error toggling follow:', error)
    } finally {
      setFollowLoading(false)
    }
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
            <AvatarFallback className="text-lg font-semibold bg-gradient-to-br from-purple-500 to-pink-600 text-white">
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
                  {profileData.stats.totalClasses}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Classes
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
            <div className="flex items-center gap-2 mt-1">
              <MapPin className="w-4 h-4 text-gray-400 dark:text-gray-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {profileData.school.name}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge
              variant="outline"
              className="bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600"
            >
              Section: {profileData.section}
            </Badge>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {profileData.dailyStreak} day streak
            </span>
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

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Card className="border-gray-200 dark:border-gray-700 shadow-sm">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {profileData.stats.totalStudentsInSchool}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                School Students
              </div>
            </CardContent>
          </Card>
          <Card className="border-gray-200 dark:border-gray-700 shadow-sm">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {profileData.stats.totalStudentsInClass}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Class Students
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-t border-gray-100 dark:border-gray-800">
        <Tabs defaultValue="saved" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-transparent h-12 p-0">
            <TabsTrigger
              value="saved"
              className="flex items-center gap-2 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-gray-900 dark:data-[state=active]:border-gray-100 rounded-none"
            >
              <Bookmark className="w-4 h-4" />
              <span>Saved Posts</span>
            </TabsTrigger>
            <TabsTrigger
              value="info"
              className="flex items-center gap-2 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-gray-900 dark:data-[state=active]:border-gray-100 rounded-none"
            >
              <Users className="w-4 h-4" />
              <span>Class Info</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="saved" className="p-6 pt-4">
            <div className="grid grid-cols-3 gap-1">
              {savedPosts.map((post) => (
                <div
                  key={post.id}
                  className="aspect-square relative group cursor-pointer rounded-lg overflow-hidden"
                >
                  <Image
                    src={post.image || '/placeholder.svg'}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                    <Bookmark className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="info" className="p-6 pt-4">
            <div className="space-y-4">
              <Card className="border-gray-200 dark:border-gray-700 shadow-sm">
                <CardContent className="p-5">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                    School Information
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">
                        Name
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {profileData.school.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">
                        Code
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {profileData.school.code}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gray-200 dark:border-gray-700 shadow-sm">
                <CardContent className="p-5">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                    Class Statistics
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="text-xl font-bold text-gray-900 dark:text-white">
                        {profileData.stats.boysInClass}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Boys in Class
                      </div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="text-xl font-bold text-gray-900 dark:text-white">
                        {profileData.stats.girlsInClass}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Girls in Class
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
