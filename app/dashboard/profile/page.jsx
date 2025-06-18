'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import Link from 'next/link'
import { Slider } from '@/components/ui/slider'
import {
  ChevronLeft,
  ChevronRight,
  Languages,
  Diamond,
  Scan,
  MessageSquare,
  BarChart3,
  HelpCircle,
  Shield,
  Clock,
} from 'lucide-react'
import {
  PageLoader,
  ComponentLoader,
  SkeletonCard,
  SkeletonText,
} from '@/components/ui/loading'
import { Card } from '@/components/ui/card'
import {
  Settings,
  User,
  Calendar,
  Globe,
  MessageCircle,
  Instagram,
  QrCode,
} from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

export default function StudentDashboard() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [activeView, setActiveView] = useState('home')
  const [isLogoutAlertOpen, setIsLogoutAlertOpen] = useState(false)
  const [theme, setTheme] = useState('Light')
  const [securitySettings, setSecuritySettings] = useState({
    sensitiveId: false,
    faceId: false,
    smsAuthenticator: false,
    googleAuthenticator: false,
  })
  const [preferences, setPreferences] = useState({
    lessonExperience: false,
    soundEffects: false,
    animations: false,
    listeningExercises: false,
    useWifi: false,
    autoDownload: false,
    sound: false,
    vibrations: false,
    resources: false,
    dataSaver1: false,
    dataSaver2: false,
    explicitContent: false,
  })

  const [fontSize, setFontSize] = useState(1) // 0: small, 1: medium, 2: large
  const [aiSoundVolume, setAiSoundVolume] = useState([50])

  const fontSizes = ['Aa', 'Aa', 'Aa']
  const fontSizeClasses = ['text-sm', 'text-base', 'text-lg']

  const togglePreference = (key) => {
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const toggleSecurity = (key) => {
    setSecuritySettings((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const fetchUser = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/auth/session', {
        credentials: 'include', // Important for cookies
      })
      const data = await response.json()

      if (data.success && data.user) {
        console.log('User data:', data.user) // Debug log
        setUser(data.user)
        setError(null)
      } else {
        setError(data.error || 'Failed to fetch user data')
        router.push('/')
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
      setError('Failed to fetch user data')
      router.push('/')
    } finally {
      setIsLoading(false)
    }
  }, [router])

  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  const handleLogoutClick = () => {
    setIsLogoutAlertOpen(true)
  }

  const confirmLogout = useCallback(async () => {
    setIsLoggingOut(true)

    try {
      await fetch('/api/auth/session', {
        method: 'DELETE',
        credentials: 'include',
      })
    } catch (error) {
      console.error('Error during logout:', error)
    }

    router.push('/')
  }, [router])

  if (isLoading) {
    return <PageLoader message="Loading your profile..." />
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-2xl font-semibold text-red-600">
            {error}
          </div>
          <button
            onClick={fetchUser}
            className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect in useEffect
  }

  const ProfileSkeleton = () => (
    <div className="rounded-lg bg-white p-6 shadow">
      <div className="flex items-center space-x-4 mb-6">
        <SkeletonCard className="w-24 h-24 rounded-full" />
        <div className="flex-1">
          <SkeletonText lines={2} />
        </div>
      </div>
      <SkeletonText lines={5} />
    </div>
  )

  const ActionsSkeleton = () => (
    <div className="rounded-lg bg-white p-6 shadow">
      <SkeletonText lines={1} className="mb-4" />
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <SkeletonCard key={i} className="h-10" />
        ))}
      </div>
    </div>
  )


        return (
          <div className="min-h-screen bg-gray-50">
            <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
              {/* Student Information Card */}
              <div className="rounded-lg bg-white p-6 shadow mb-8">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="relative w-24 h-24">
                    <img
                      src={user.student?.profileImage || '/icons/girl.png'}
                      alt={user.name}
                      className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
                      loading="lazy"
                      onError={(e) => {
                        e.target.src = '/icons/girl.png'
                      }}
                    />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                      {user.name}
                    </h1>
                    <p className="text-gray-600">@{user.username}</p>
                  </div>
                </div>
                <div className="space-y-3 text-sm">
                  {user.student && (
                    <>
                      <div>
                        <span className="font-medium text-gray-500">
                          Roll Number:
                        </span>{' '}
                        <span className="text-gray-900">
                          {user.student.rollNo}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-500">
                          Class:
                        </span>{' '}
                        <span className="text-gray-900">
                          {user.student.class?.name || 'N/A'}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-500">
                          School:
                        </span>{' '}
                        <span className="text-gray-900">
                          {user.student.class?.school?.name || 'N/A'}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Settings Grid */}

              <div>
                <h2 className="text-3xl font-bold mb-6">Settings</h2>

                <div className="min-h-screen bg-gray-50">
                  <div className="max-w-md mx-auto bg-white min-h-screen">
                    <div className=" space-y-8">
                      {/* Appearance */}
                      <div>
                        <h2 className="text-2xl font-bold mb-4">Appearance</h2>
                        <div className="bg-gray-100 rounded-xl p-1 flex">
                          {['Light', 'Dark', 'System'].map((option) => (
                            <button
                              key={option}
                              onClick={() => setTheme(option)}
                              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                                theme === option
                                  ? 'bg-white text-black shadow-sm'
                                  : 'text-gray-600'
                              }`}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Language */}
                      <div>
                        <h2 className="text-2xl font-bold mb-4">Language</h2>
                        <Link href="/dashboard/profile/language">
                          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                                <Languages className="w-5 h-5 text-gray-600" />
                              </div>
                              <span className="font-medium">English</span>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                          </div>
                        </Link>
                      </div>

                      {/* Preferences */}
                      <div>
                        <div className=" space-y-4">
                          <h2 className="text-2xl font-bold mb-4">
                            Preferences
                          </h2>
                          {/* Lesson Experience */}
                          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                                <span className="text-lg font-bold">N</span>
                              </div>
                              <span className="font-medium">
                                Lesson experience
                              </span>
                            </div>
                            <Switch
                              checked={preferences.lessonExperience}
                              onCheckedChange={() =>
                                togglePreference('lessonExperience')
                              }
                            />
                          </div>

                          {/* Sound Effects */}
                          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                                <span className="text-lg">🔊</span>
                              </div>
                              <span className="font-medium">Sound effects</span>
                            </div>
                            <Switch
                              checked={preferences.soundEffects}
                              onCheckedChange={() =>
                                togglePreference('soundEffects')
                              }
                            />
                          </div>

                          {/* Animations */}
                          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                                <span className="text-lg">📱</span>
                              </div>
                              <span className="font-medium">Animations</span>
                            </div>
                            <Switch
                              checked={preferences.animations}
                              onCheckedChange={() =>
                                togglePreference('animations')
                              }
                            />
                          </div>

                          {/* Listening Exercises */}
                          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                                <span className="text-lg">🎧</span>
                              </div>
                              <span className="font-medium">
                                Listening exercises
                              </span>
                            </div>
                            <Switch
                              checked={preferences.listeningExercises}
                              onCheckedChange={() =>
                                togglePreference('listeningExercises')
                              }
                            />
                          </div>

                          {/* Use Wifi */}
                          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                                <span className="text-lg">📶</span>
                              </div>
                              <span className="font-medium">Use Wifi</span>
                            </div>
                            <Switch
                              checked={preferences.useWifi}
                              onCheckedChange={() =>
                                togglePreference('useWifi')
                              }
                            />
                          </div>

                          {/* Auto Download */}
                          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                                <span className="text-lg">⬇️</span>
                              </div>
                              <span className="font-medium">Auto Download</span>
                            </div>
                            <Switch
                              checked={preferences.autoDownload}
                              onCheckedChange={() =>
                                togglePreference('autoDownload')
                              }
                            />
                          </div>

                          {/* Font Size */}
                          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                                <span className="text-lg">🔤</span>
                              </div>
                              <span className="font-medium">Font Size</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {fontSizes.map((size, index) => (
                                <button
                                  key={index}
                                  onClick={() => setFontSize(index)}
                                  className={`px-3 py-1 rounded ${
                                    fontSize === index
                                      ? 'bg-black text-white'
                                      : 'bg-gray-200 text-gray-600'
                                  } ${fontSizeClasses[index]}`}
                                >
                                  {size}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* AI Sound Volume */}
                          <div className="p-4 bg-gray-50 rounded-xl">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                                  <span className="text-lg">🎵</span>
                                </div>
                                <span className="font-medium">
                                  AI Sound Volume
                                </span>
                              </div>
                            </div>
                            <Slider
                              value={aiSoundVolume}
                              onValueChange={setAiSoundVolume}
                              max={100}
                              step={1}
                              className="w-full"
                            />
                          </div>

                          {/* Sound */}
                          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                                <span className="text-lg">🎶</span>
                              </div>
                              <span className="font-medium">Sound</span>
                            </div>
                            <Switch
                              checked={preferences.sound}
                              onCheckedChange={() => togglePreference('sound')}
                            />
                          </div>

                          {/* Vibrations */}
                          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                                <span className="text-lg">📳</span>
                              </div>
                              <span className="font-medium">Vibrations</span>
                            </div>
                            <Switch
                              checked={preferences.vibrations}
                              onCheckedChange={() =>
                                togglePreference('vibrations')
                              }
                            />
                          </div>

                          {/* Resources */}
                          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                                <span className="text-lg">📚</span>
                              </div>
                              <span className="font-medium">Resources</span>
                            </div>
                            <Switch
                              checked={preferences.resources}
                              onCheckedChange={() =>
                                togglePreference('resources')
                              }
                            />
                          </div>

                          {/* Data Saver 1 */}
                          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                                <span className="text-lg">💾</span>
                              </div>
                              <span className="font-medium">Data saver</span>
                            </div>
                            <Switch
                              checked={preferences.dataSaver1}
                              onCheckedChange={() =>
                                togglePreference('dataSaver1')
                              }
                            />
                          </div>

                          {/* Explicit Content */}
                          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                                <span className="text-lg">🚫</span>
                              </div>
                              <span className="font-medium">
                                Explicit content
                              </span>
                            </div>
                            <Switch
                              checked={preferences.explicitContent}
                              onCheckedChange={() =>
                                togglePreference('explicitContent')
                              }
                            />
                          </div>

                          {/* Reminder to take breaks */}
                          <Link href="/dashboard/profile/reminder">
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                                  <span className="text-lg">⏰</span>
                                </div>
                                <span className="font-medium">
                                  Reminder to take breaks
                                </span>
                              </div>
                              <ChevronRight className="w-5 h-5 text-gray-400" />
                            </div>
                          </Link>
                        </div>
                      </div>

                      {/* Help & Support */}
                      <div className="pb-8">
                        <h2 className="text-3xl font-semibold mb-6 text-gray-800 dark:text-white">
                          Help & Support
                        </h2>
                        <div className="space-y-4">
                          {[
                            {
                              href: '/dashboard/profile/founder',
                              icon: (
                                <HelpCircle className="w-5 h-5 text-indigo-600" />
                              ),
                              label: 'Talk to Founder',
                            },
                            {
                              href: '/dashboard/profile/contact',
                              icon: (
                                <MessageSquare className="w-5 h-5 text-indigo-600" />
                              ),
                              label: 'Contact Support',
                            },
                            {
                              href: '/dashboard/profile/policy',
                              icon: (
                                <Clock className="w-5 h-5 text-indigo-600" />
                              ),
                              label: 'Privacy Policy',
                            },
                          ].map(({ href, icon, label }, index) => (
                            <Link key={index} href={href}>
                              <div className="group flex items-center justify-between p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl transition-all hover:shadow-md hover:border-indigo-500 cursor-pointer">
                                <div className="flex items-center gap-4">
                                  <div className="w-11 h-11 bg-indigo-50 dark:bg-indigo-900 rounded-lg flex items-center justify-center transition-transform group-hover:scale-105">
                                    {icon}
                                  </div>
                                  <span className="font-medium text-gray-800 dark:text-gray-200">
                                    {label}
                                  </span>
                                </div>
                                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-indigo-500 transition-colors" />
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Logout Button */}
              <div className="mt-8 text-center">
                <button
                  onClick={handleLogoutClick}
                  disabled={isLoggingOut}
                  className="rounded-md bg-black px-6 py-3 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoggingOut ? 'Logging out...' : 'Logout'}
                </button>
              </div>
            </main>

            <AlertDialog
              open={isLogoutAlertOpen}
              onOpenChange={setIsLogoutAlertOpen}
            >
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Do you really want to logout?
                  </AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>No</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={confirmLogout}
                    disabled={isLoggingOut}
                  >
                    {isLoggingOut ? 'Logging out...' : 'Yes'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )
    }



