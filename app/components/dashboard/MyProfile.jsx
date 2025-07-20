'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import {
  Settings,
  QrCode,
  Users,
  Edit3,
  Bookmark,
  School,
  Trophy,
  MapPin,
  Share2,
  Eye,
  Plus,
} from 'lucide-react'
import Image from 'next/image'
import { SkeletonCard, SkeletonText } from '@/components/ui/loading'
import Link from 'next/link'

const ProfileSkeleton = () => (
  <div className="max-w-md mx-auto bg-white min-h-screen">
    <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="flex items-center justify-between px-6 py-4">
        <SkeletonCard className="h-6 w-32" />
        <div className="flex gap-1">
          <SkeletonCard className="w-9 h-9 rounded" />
          <SkeletonCard className="w-9 h-9 rounded" />
        </div>
      </div>
    </div>
    <div className="px-6 py-6">
      <div className="flex items-center gap-6 mb-6">
        <SkeletonCard className="w-24 h-24 rounded-full" />
        <div className="flex-1">
          <div className="grid grid-cols-3 gap-4 text-center">
            <SkeletonCard className="h-8 w-16" />
            <SkeletonCard className="h-8 w-16" />
            <SkeletonCard className="h-8 w-16" />
          </div>
        </div>
      </div>
      <SkeletonText count={5} />
    </div>
  </div>
)

export default function MyProfile({ user, isLoading }) {
  if (isLoading) {
    return <ProfileSkeleton />
  }

  const student = user?.student
  const studentClass = student?.class
  const school = studentClass?.school

  const myData = {
    name: user?.name || 'Student',
    username: user?.username || 'student_2024',
    rollNumber: student?.rollNo || 'ST001234',
    uniqueCode: 'AJ2024ST',
    photo: student?.profileImage || '/icons/girl.png',
    school: {
      name: school?.name || 'School Name',
      code: school?.code || 'SCH001',
      email: school?.email || 'info@school.edu',
      phone: school?.phone || '+1 (555) 123-4567',
    },
    section: studentClass?.section || '10-A',
    stats: {
      totalClasses: 12,
      totalStudentsInSchool: 1250,
      totalStudentsInClass: studentClass?.totalStudents || 35,
      boysInClass: studentClass?.boys || 18,
      girlsInClass: studentClass?.girls || 17,
      boysInSchool: 625,
      girlsInSchool: 625,
    },
    dailyStreak: 15,
    followers: 45,
    following: 32,
    profileViews: 127,
  }

  const savedPosts = [
    {
      id: 1,
      image: '/placeholder.svg?height=300&width=300',
      title: 'Math Formula',
    },
    {
      id: 2,
      image: '/placeholder.svg?height=300&width=300',
      title: 'Science Project',
    },
    {
      id: 3,
      image: '/placeholder.svg?height=300&width=300',
      title: 'History Notes',
    },
    {
      id: 4,
      image: '/placeholder.svg?height=300&width=300',
      title: 'Literature Guide',
    },
    {
      id: 5,
      image: '/placeholder.svg?height=300&width=300',
      title: 'Chemistry Lab',
    },
    {
      id: 6,
      image: '/placeholder.svg?height=300&width=300',
      title: 'Physics Theory',
    },
  ]

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <School className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            <span className="font-semibold text-gray-900 dark:text-white">
              {myData.username}
            </span>
            <Badge
              variant="secondary"
              className="text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800"
            >
              You
            </Badge>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="w-9 h-9 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <QrCode className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </Button>
            <Link href="/dashboard/profile/settings">
              <Button
                variant="ghost"
                size="icon"
                className="w-9 h-9 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <Settings className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Profile Section */}
      <div className="px-6 py-6">
        {/* Avatar and Stats */}
        <div className="flex items-center gap-6 mb-6">
          <div className="relative">
            <Avatar className="w-24 h-24 ring-2 ring-gray-100 dark:ring-gray-700">
              <AvatarImage src={myData.photo} alt={myData.name} />
              <AvatarFallback className="text-lg font-semibold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                {myData.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </AvatarFallback>
            </Avatar>
            <Button
              size="icon"
              className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-blue-500 hover:bg-blue-600 shadow-lg"
            >
              <Plus className="w-4 h-4 text-white" />
            </Button>
          </div>

          <div className="flex-1">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-xl font-bold text-gray-900 dark:text-white">
                  {myData.stats.totalClasses}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Classes
                </div>
              </div>
              <div>
                <div className="text-xl font-bold text-gray-900 dark:text-white">
                  {myData.followers}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Followers
                </div>
              </div>
              <div>
                <div className="text-xl font-bold text-gray-900 dark:text-white">
                  {myData.following}
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
              {myData.name}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <MapPin className="w-4 h-4 text-gray-400 dark:text-gray-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {myData.school.name}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge
              variant="outline"
              className="bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600"
            >
              Roll: {myData.rollNumber}
            </Badge>
            <Badge
              variant="outline"
              className="bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600"
            >
              Section: {myData.section}
            </Badge>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {myData.dailyStreak} day streak
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-gray-400 dark:text-gray-500" />
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {myData.profileViews} views
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mb-6">
          <Button className="flex-1 bg-gray-900 dark:bg-gray-100 hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-gray-900">
            <Edit3 className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
          <Button
            variant="outline"
            className="flex-1 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Card className="border-gray-200 dark:border-gray-700 shadow-sm">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {myData.stats.totalStudentsInSchool}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                School Students
              </div>
            </CardContent>
          </Card>
          <Card className="border-gray-200 dark:border-gray-700 shadow-sm">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {myData.stats.totalStudentsInClass}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Class Students
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Class Demographics */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-4 text-center">
            <div className="text-lg font-bold text-blue-700 dark:text-blue-300">
              {myData.stats.boysInClass}
            </div>
            <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">
              Boys in Class
            </div>
          </div>
          <div className="bg-gradient-to-r from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/20 rounded-xl p-4 text-center">
            <div className="text-lg font-bold text-pink-700 dark:text-pink-300">
              {myData.stats.girlsInClass}
            </div>
            <div className="text-xs text-pink-600 dark:text-pink-400 font-medium">
              Girls in Class
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-t border-gray-100 dark:border-gray-800">
        <Tabs defaultValue="saved" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-transparent h-12 p-0">
            <TabsTrigger
              value="saved"
              className="flex items-center gap-2 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-gray-900 dark:data-[state=active]:border-gray-100 rounded-none"
            >
              <Bookmark className="w-4 h-4" />
              <span className="hidden sm:inline">Saved</span>
            </TabsTrigger>
            <TabsTrigger
              value="info"
              className="flex items-center gap-2 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-gray-900 dark:data-[state=active]:border-gray-100 rounded-none"
            >
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Info</span>
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="flex items-center gap-2 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-gray-900 dark:data-[state=active]:border-gray-100 rounded-none"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="saved" className="p-6 pt-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Saved Posts
              </h3>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {savedPosts.length} posts
              </span>
            </div>
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
              <Card className="border-gray-200 shadow-sm">
                <CardContent className="p-5">
                  <h3 className="font-semibold text-gray-900 mb-3">
                    School Information
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Name</span>
                      <span className="font-medium text-gray-900">
                        {myData.school.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Code</span>
                      <span className="font-medium text-gray-900">
                        {myData.school.code}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Email</span>
                      <span className="font-medium text-gray-900">
                        {myData.school.email}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gray-200 shadow-sm">
                <CardContent className="p-5">
                  <h3 className="font-semibold text-gray-900 mb-3">
                    School Statistics
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-xl font-bold text-gray-900">
                        {myData.stats.boysInSchool}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Boys in School
                      </div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-xl font-bold text-gray-900">
                        {myData.stats.girlsInSchool}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Girls in School
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="p-6 pt-4">
            <div className="space-y-4">
              <Card className="border-gray-200 shadow-sm">
                <CardContent className="p-5">
                  <h3 className="font-semibold text-gray-900 mb-4">Account</h3>
                  <div className="space-y-3">
                    <Button
                      variant="ghost"
                      className="w-full justify-start h-12 px-3 hover:bg-gray-50"
                    >
                      <Edit3 className="w-5 h-5 mr-3 text-gray-400" />
                      <span className="text-gray-700">Edit Username</span>
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start h-12 px-3 hover:bg-gray-50"
                    >
                      <Settings className="w-5 h-5 mr-3 text-gray-400" />
                      <span className="text-gray-700">Reset Password</span>
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start h-12 px-3 hover:bg-gray-50"
                    >
                      <QrCode className="w-5 h-5 mr-3 text-gray-400" />
                      <span className="text-gray-700">Update QR Code</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gray-200 shadow-sm">
                <CardContent className="p-5">
                  <h3 className="font-semibold text-gray-900 mb-4">Privacy</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Profile Visibility</span>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-green-50 text-green-700 border-green-200"
                      >
                        Public
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Show Profile Views</span>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-blue-50 text-blue-700 border-blue-200"
                      >
                        Enabled
                      </Button>
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
