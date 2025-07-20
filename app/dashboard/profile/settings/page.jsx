'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useDispatch } from 'react-redux'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Slider } from '@/components/ui/slider'
import {
  ChevronRight,
  Languages,
  MessageSquare,
  HelpCircle,
  Clock,
  ArrowLeft,
} from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
} from '@/components/ui/alert-dialog'
import { useTheme } from 'next-themes'
import { logout } from '../../../store/features/authSlice'

export default function SettingsPage() {
  const router = useRouter()
  const dispatch = useDispatch()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [isLogoutAlertOpen, setIsLogoutAlertOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
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

  useEffect(() => {
    setMounted(true)
  }, [])

  const togglePreference = (key) => {
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const handleLogoutClick = () => {
    setIsLogoutAlertOpen(true)
  }

  const confirmLogout = useCallback(async () => {
    setIsLoggingOut(true)

    try {
      // Clear server session
      await fetch('/api/auth/session', {
        method: 'DELETE',
        credentials: 'include',
      })
    } catch (error) {
      console.error('Error during logout:', error)
    }

    // Clear client-side state and localStorage
    dispatch(logout())

    // Redirect to login page
    router.push('/')
  }, [router, dispatch])

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Link href="/dashboard/profile">
              <Button
                variant="ghost"
                size="icon"
                className="w-9 h-9 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <ArrowLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </Button>
            </Link>
            <span className="font-semibold text-gray-900 dark:text-white">
              Settings
            </span>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="space-y-8">
          {/* Appearance */}
          <div>
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              Appearance
            </h2>
            <div className="bg-muted rounded-xl p-1 flex">
              {mounted &&
                ['Light', 'Dark', 'System'].map((option) => (
                  <button
                    key={option}
                    onClick={() => setTheme(option.toLowerCase())}
                    className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                      theme === option.toLowerCase()
                        ? 'bg-background text-foreground shadow-sm'
                        : 'text-muted-foreground'
                    }`}
                  >
                    {option}
                  </button>
                ))}
            </div>
          </div>

          {/* Language */}
          <div>
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              Language
            </h2>
            <Link href="/dashboard/profile/language">
              <div className="flex items-center justify-between p-4 bg-muted rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-background rounded-lg flex items-center justify-center">
                    <Languages className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white">
                    English
                  </span>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </div>
            </Link>
          </div>

          {/* Preferences */}
          <div>
            <div className="space-y-4">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                Preferences
              </h2>
              {/* Lesson Experience */}
              <div className="flex items-center justify-between p-4 bg-muted rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-background rounded-lg flex items-center justify-center">
                    <span className="text-lg font-bold">N</span>
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white">
                    Lesson experience
                  </span>
                </div>
                <Switch
                  checked={preferences.lessonExperience}
                  onCheckedChange={() => togglePreference('lessonExperience')}
                />
              </div>

              {/* Sound Effects */}
              <div className="flex items-center justify-between p-4 bg-muted rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-background rounded-lg flex items-center justify-center">
                    <span className="text-lg">🔊</span>
                  </div>
                  <span className="font-medium">Sound effects</span>
                </div>
                <Switch
                  checked={preferences.soundEffects}
                  onCheckedChange={() => togglePreference('soundEffects')}
                />
              </div>

              {/* Animations */}
              <div className="flex items-center justify-between p-4 bg-muted rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-background rounded-lg flex items-center justify-center">
                    <span className="text-lg">📱</span>
                  </div>
                  <span className="font-medium">Animations</span>
                </div>
                <Switch
                  checked={preferences.animations}
                  onCheckedChange={() => togglePreference('animations')}
                />
              </div>

              {/* Listening Exercises */}
              <div className="flex items-center justify-between p-4 bg-muted rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-background rounded-lg flex items-center justify-center">
                    <span className="text-lg">🎧</span>
                  </div>
                  <span className="font-medium">Listening exercises</span>
                </div>
                <Switch
                  checked={preferences.listeningExercises}
                  onCheckedChange={() => togglePreference('listeningExercises')}
                />
              </div>

              {/* Use Wifi */}
              <div className="flex items-center justify-between p-4 bg-muted rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-background rounded-lg flex items-center justify-center">
                    <span className="text-lg">📶</span>
                  </div>
                  <span className="font-medium">Use Wifi</span>
                </div>
                <Switch
                  checked={preferences.useWifi}
                  onCheckedChange={() => togglePreference('useWifi')}
                />
              </div>

              {/* Auto Download */}
              <div className="flex items-center justify-between p-4 bg-muted rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-background rounded-lg flex items-center justify-center">
                    <span className="text-lg">⬇️</span>
                  </div>
                  <span className="font-medium">Auto Download</span>
                </div>
                <Switch
                  checked={preferences.autoDownload}
                  onCheckedChange={() => togglePreference('autoDownload')}
                />
              </div>

              {/* Font Size */}
              <div className="flex items-center justify-between p-4 bg-muted rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-background rounded-lg flex items-center justify-center">
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
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-background text-muted-foreground'
                      } ${fontSizeClasses[index]}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* AI Sound Volume */}
              <div className="p-4 bg-muted rounded-xl">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-background rounded-lg flex items-center justify-center">
                      <span className="text-lg">🎵</span>
                    </div>
                    <span className="font-medium">AI Sound Volume</span>
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
              <div className="flex items-center justify-between p-4 bg-muted rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-background rounded-lg flex items-center justify-center">
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
              <div className="flex items-center justify-between p-4 bg-muted rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-background rounded-lg flex items-center justify-center">
                    <span className="text-lg">📳</span>
                  </div>
                  <span className="font-medium">Vibrations</span>
                </div>
                <Switch
                  checked={preferences.vibrations}
                  onCheckedChange={() => togglePreference('vibrations')}
                />
              </div>

              {/* Resources */}
              <div className="flex items-center justify-between p-4 bg-muted rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-background rounded-lg flex items-center justify-center">
                    <span className="text-lg">📚</span>
                  </div>
                  <span className="font-medium">Resources</span>
                </div>
                <Switch
                  checked={preferences.resources}
                  onCheckedChange={() => togglePreference('resources')}
                />
              </div>

              {/* Data Saver 1 */}
              <div className="flex items-center justify-between p-4 bg-muted rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-background rounded-lg flex items-center justify-center">
                    <span className="text-lg">💾</span>
                  </div>
                  <span className="font-medium">Data saver</span>
                </div>
                <Switch
                  checked={preferences.dataSaver1}
                  onCheckedChange={() => togglePreference('dataSaver1')}
                />
              </div>

              {/* Explicit Content */}
              <div className="flex items-center justify-between p-4 bg-muted rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-background rounded-lg flex items-center justify-center">
                    <span className="text-lg">🚫</span>
                  </div>
                  <span className="font-medium">Explicit content</span>
                </div>
                <Switch
                  checked={preferences.explicitContent}
                  onCheckedChange={() => togglePreference('explicitContent')}
                />
              </div>

              {/* Reminder to take breaks */}
              <Link href="/dashboard/profile/reminder">
                <div className="flex items-center justify-between p-4 bg-muted rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-background rounded-lg flex items-center justify-center">
                      <span className="text-lg">⏰</span>
                    </div>
                    <span className="font-medium">Reminder to take breaks</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </Link>
            </div>
          </div>

          {/* Help & Support */}
          <div className="pb-8">
            <h2 className="text-3xl font-semibold mb-6 text-gray-900 dark:text-white">
              Help & Support
            </h2>
            <div className="space-y-2">
              {[
                {
                  href: '/dashboard/profile/founder',
                  icon: <HelpCircle className="w-5 h-5 text-primary" />,
                  label: 'Talk to Founder',
                },
                {
                  href: '/dashboard/profile/contact',
                  icon: <MessageSquare className="w-5 h-5 text-primary" />,
                  label: 'Contact Support',
                },
                {
                  href: '/dashboard/profile/policy',
                  icon: <Clock className="w-5 h-5 text-primary" />,
                  label: 'Privacy Policy',
                },
              ].map(({ href, icon, label }, index) => (
                <Link key={index} href={href} className="block">
                  <div className="group flex items-center justify-between p-4 bg-card border border-border rounded-xl transition-all hover:shadow-md hover:border-primary cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 bg-primary/10 text-primary rounded-lg flex items-center justify-center transition-transform group-hover:scale-105">
                        {icon}
                      </div>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {label}
                      </span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Logout Button */}
      <div className="p-6 pt-0">
        <button
          onClick={handleLogoutClick}
          disabled={isLoggingOut}
          className="w-full flex items-center justify-between p-4 bg-destructive text-white dark:text-white font-medium text-sm rounded-xl hover:bg-destructive/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <span>{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <AlertDialog open={isLogoutAlertOpen} onOpenChange={setIsLogoutAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Do you really want to logout?</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No</AlertDialogCancel>
            <AlertDialogAction onClick={confirmLogout} disabled={isLoggingOut}>
              {isLoggingOut ? 'Logging out...' : 'Yes'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
