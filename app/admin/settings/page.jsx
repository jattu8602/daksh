'use client'

import { useState, useEffect, useRef, useCallback, useMemo, memo } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  User,
  Mail,
  Phone,
  Lock,
  Upload,
  Eye,
  EyeOff,
  Check,
  X,
  Shield,
  Users,
  Activity,
  CheckCircle,
  Clock,
} from 'lucide-react'
import { toast } from 'react-hot-toast'

// Utility function to format last activity time
const formatLastActivity = (lastActiveAt) => {
  if (!lastActiveAt) return 'Never'

  const now = new Date()
  const lastActive = new Date(lastActiveAt)
  const diffInSeconds = Math.floor((now - lastActive) / 1000)

  if (diffInSeconds < 60) {
    return 'Just now'
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`
  } else {
    const days = Math.floor(diffInSeconds / 86400)
    return `${days} ${days === 1 ? 'day' : 'days'} ago`
  }
}

// Memoized Admin Card Component to prevent unnecessary re-renders
const AdminCard = memo(({ admin, formatLastActivity }) => {
  return (
    <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 bg-white dark:bg-gray-800">
      <div className="flex items-center gap-4">
        <div className="relative">
          <Avatar className="h-12 w-12">
            <AvatarImage src={admin.profileImage} />
            <AvatarFallback className="bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300">
              {admin.name?.charAt(0)?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div
            className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-gray-800 ${
              admin.isOnline ? 'bg-green-500' : 'bg-gray-400'
            }`}
          />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-gray-900 dark:text-white">
              {admin.name}
            </h4>
            <Badge
              variant={
                admin.role === 'SUPER_ADMIN' ? 'destructive' : 'secondary'
              }
              className={
                admin.role === 'SUPER_ADMIN'
                  ? 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }
            >
              {admin.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Admin'}
            </Badge>
            {admin.emailVerified && (
              <CheckCircle className="h-4 w-4 text-green-500" />
            )}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            @{admin.username}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {admin.email}
          </p>
          {admin.phone !== 'Not provided' && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {admin.phone}
            </p>
          )}
        </div>
      </div>

      <div className="text-right flex flex-col items-end">
        <div className="flex items-center gap-2 mb-1">
          <div
            className={`w-2 h-2 rounded-full ${
              admin.isOnline ? 'bg-green-500' : 'bg-gray-400'
            }`}
          />
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {admin.isOnline ? 'Online' : 'Offline'}
          </span>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Last active: {formatLastActivity(admin.lastActiveAt)}
        </p>
      </div>
    </div>
  )
})

AdminCard.displayName = 'AdminCard'

export default function AdminSettings() {
  // Memoized format function to prevent unnecessary re-renders
  const memoizedFormatLastActivity = useMemo(() => formatLastActivity, [])

  // Profile state
  const [profile, setProfile] = useState(null)
  const [profileFormData, setProfileFormData] = useState({
    name: '',
    username: '',
    email: '',
    phone: '',
    profileImage: '',
  })
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false)

  // Email verification state
  const [emailVerification, setEmailVerification] = useState({
    newEmail: '',
    otp: '',
    isVerifying: false,
    otpSent: false,
    isVerifyingOtp: false,
    countdown: 0,
  })

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  })
  const [isChangingPassword, setIsChangingPassword] = useState(false)

  // All admins state
  const [allAdmins, setAllAdmins] = useState([])
  const [isLoadingAdmins, setIsLoadingAdmins] = useState(false)
  const [isBackgroundUpdating, setIsBackgroundUpdating] = useState(false)

  // File upload ref
  const fileInputRef = useRef(null)

  // Online status tracking
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const heartbeatRef = useRef(null)
  const lastActivityRef = useRef(Date.now())

  // Update last activity time
  const updateLastActivity = () => {
    lastActivityRef.current = Date.now()
  }

  // Send heartbeat to maintain online status
  const sendHeartbeat = async () => {
    try {
      await fetch('/api/admin/heartbeat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          lastActivity: new Date(lastActivityRef.current).toISOString(),
        }),
      })
    } catch (error) {
      console.error('Heartbeat failed:', error)
    }
  }

  // Mark admin as offline
  const markOffline = async () => {
    try {
      await fetch('/api/admin/status', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          isOnline: false,
          lastActivity: new Date(lastActivityRef.current).toISOString(),
        }),
      })
    } catch (error) {
      console.error('Failed to mark offline:', error)
    }
  }

  // Mark admin as online
  const markOnline = async () => {
    try {
      await fetch('/api/admin/status', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          isOnline: true,
          lastActivity: new Date().toISOString(),
        }),
      })
    } catch (error) {
      console.error('Failed to mark online:', error)
    }
  }

  // Handle online/offline detection
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      markOnline()
    }

    const handleOffline = () => {
      setIsOnline(false)
      markOffline()
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Handle page visibility changes (when user switches tabs or minimizes window)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // User switched away from the page
        updateLastActivity()
        markOffline()
      } else {
        // User came back to the page
        updateLastActivity()
        if (navigator.onLine) {
          markOnline()
        }
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  // Handle beforeunload (when user closes browser or navigates away)
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Use sendBeacon for reliable delivery when page is unloading
      const data = JSON.stringify({
        isOnline: false,
        lastActivity: new Date(lastActivityRef.current).toISOString(),
      })

      navigator.sendBeacon(
        '/api/admin/status',
        new Blob([data], {
          type: 'application/json',
        })
      )
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [])

  // Activity tracking - update last activity on user interactions
  useEffect(() => {
    const events = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
      'click',
    ]

    const handleActivity = () => {
      updateLastActivity()
    }

    events.forEach((event) => {
      document.addEventListener(event, handleActivity, true)
    })

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, handleActivity, true)
      })
    }
  }, [])

  // Heartbeat system - send periodic updates when online
  useEffect(() => {
    if (isOnline && navigator.onLine) {
      // Send initial online status
      markOnline()

      // Set up heartbeat every 30 seconds
      heartbeatRef.current = setInterval(() => {
        if (!document.hidden && navigator.onLine) {
          sendHeartbeat()
        }
      }, 30 * 1000)
    } else {
      // Clear heartbeat when offline
      if (heartbeatRef.current) {
        clearInterval(heartbeatRef.current)
        heartbeatRef.current = null
      }
    }

    return () => {
      if (heartbeatRef.current) {
        clearInterval(heartbeatRef.current)
      }
    }
  }, [isOnline])

  // Silent status update function - doesn't trigger full UI re-render
  const silentStatusUpdate = useCallback(async () => {
    setIsBackgroundUpdating(true)
    try {
      // Just trigger cleanup and get minimal status data
      const response = await fetch('/api/admin/status-check', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      })

      const data = await response.json()

      if (data.success && data.admins) {
        // Only update state if there are actual changes
        setAllAdmins((prevAdmins) => {
          const hasChanges = prevAdmins.some((prevAdmin) => {
            const updatedAdmin = data.admins.find(
              (admin) => admin.id === prevAdmin.id
            )
            return (
              updatedAdmin &&
              (updatedAdmin.isOnline !== prevAdmin.isOnline ||
                new Date(updatedAdmin.lastActiveAt).getTime() !==
                  new Date(prevAdmin.lastActiveAt).getTime())
            )
          })

          // Only update if there are actual changes
          return hasChanges ? data.admins : prevAdmins
        })
      }
    } catch (error) {
      // Silently fail - don't show errors for background updates
      console.warn('Silent status update failed:', error)
    } finally {
      setIsBackgroundUpdating(false)
    }
  }, [])

  // Real-time status updates (silent) - runs every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      silentStatusUpdate()
    }, 30 * 1000)

    return () => clearInterval(interval)
  }, [silentStatusUpdate])

  // Additional cleanup every 2 minutes for more thorough cleanup
  useEffect(() => {
    const cleanupInterval = setInterval(async () => {
      try {
        await fetch('/api/admin/cleanup-offline', {
          method: 'POST',
          credentials: 'include',
        })
        // Trigger a silent update after cleanup
        silentStatusUpdate()
      } catch (error) {
        console.warn('Background cleanup failed:', error)
      }
    }, 120 * 1000) // Run every 2 minutes

    return () => clearInterval(cleanupInterval)
  }, [silentStatusUpdate])

  const fetchProfile = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/profile', {
        credentials: 'include',
      })
      const data = await response.json()

      if (data.success) {
        setProfile(data.admin)
        setProfileFormData({
          name: data.admin.name,
          username: data.admin.username,
          email: data.admin.email || '',
          phone: data.admin.phone || '',
          profileImage: data.admin.profileImage || '',
        })
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
      toast.error('Failed to load profile')
    }
  }, [])

  const fetchAllAdmins = useCallback(async () => {
    setIsLoadingAdmins(true)
    try {
      // Fetch admin list (cleanup is now handled automatically by the API)
      const response = await fetch('/api/admin/all-admins', {
        credentials: 'include',
      })
      const data = await response.json()

      if (data.success) {
        setAllAdmins(data.admins)
      }
    } catch (error) {
      console.error('Error fetching admins:', error)
      toast.error('Failed to load admin list')
    } finally {
      setIsLoadingAdmins(false)
    }
  }, [])

  // Initial data fetch on component mount
  useEffect(() => {
    fetchProfile()
    fetchAllAdmins()
  }, []) // Empty dependency array - only run once on mount

  // Handle profile image upload
  const handleImageUpload = async (file) => {
    if (!file) return

    try {
      // Get Cloudinary signature
      const signatureResponse = await fetch('/api/cloudinary/signature', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          timestamp: Math.round(new Date().getTime() / 1000),
        }),
      })

      const { signature, timestamp, apiKey, cloudName } =
        await signatureResponse.json()

      // Upload to Cloudinary
      const formData = new FormData()
      formData.append('file', file)
      formData.append('signature', signature)
      formData.append('timestamp', timestamp)
      formData.append('api_key', apiKey)

      const uploadResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      )

      const uploadData = await uploadResponse.json()

      if (uploadData.secure_url) {
        setProfileFormData((prev) => ({
          ...prev,
          profileImage: uploadData.secure_url,
        }))
        toast.success('Image uploaded successfully')
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      toast.error('Failed to upload image')
    }
  }

  // Handle profile update
  const handleProfileUpdate = async () => {
    setIsUpdatingProfile(true)
    try {
      const response = await fetch('/api/admin/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(profileFormData),
      })

      const data = await response.json()

      if (data.success) {
        setProfile(data.admin)
        toast.success('Profile updated successfully')
        if (profileFormData.email !== profile?.email) {
          setEmailVerification((prev) => ({
            ...prev,
            newEmail: profileFormData.email,
          }))
        }
      } else {
        toast.error(data.error || 'Failed to update profile')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Failed to update profile')
    } finally {
      setIsUpdatingProfile(false)
    }
  }

  // Handle email verification
  const handleSendOTP = async () => {
    if (!profile.email) {
      toast.error('No email address found in your profile')
      return
    }

    setEmailVerification((prev) => ({ ...prev, isVerifying: true }))
    try {
      const response = await fetch('/api/admin/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: profile.email }),
      })

      const data = await response.json()

      if (data.success) {
        setEmailVerification((prev) => ({
          ...prev,
          otpSent: true,
          isVerifying: false,
        }))

        // Show success message with debug info in development
        let successMessage = 'OTP sent to your email! Check your inbox.'
        if (data.debug?.otp && process.env.NODE_ENV === 'development') {
          successMessage += ` [Dev: ${data.debug.otp}]`
        }
        toast.success(successMessage, { duration: 6000 })

        // Log debug info for development
        if (data.debug) {
          console.log('=== EMAIL DEBUG INFO ===')
          console.log('OTP:', data.debug.otp)
          console.log('Email ID:', data.debug.resendId)
        }
      } else {
        // Handle rate limiting specifically
        if (response.status === 429) {
          toast.error(`${data.error}. ${data.details}`, { duration: 5000 })

          // Set countdown timer
          if (data.waitTime) {
            setEmailVerification((prev) => ({
              ...prev,
              countdown: data.waitTime,
              isVerifying: false,
            }))

            // Start countdown
            const countdownInterval = setInterval(() => {
              setEmailVerification((prev) => {
                if (prev.countdown <= 1) {
                  clearInterval(countdownInterval)
                  toast('You can now request a new OTP', {
                    icon: '⏰',
                    duration: 3000,
                  })
                  return { ...prev, countdown: 0 }
                }
                return { ...prev, countdown: prev.countdown - 1 }
              })
            }, 1000)
          }
        } else {
          toast.error(data.error || 'Failed to send OTP', { duration: 4000 })

          // Show more details in development
          if (data.details && process.env.NODE_ENV === 'development') {
            console.error('Email Error Details:', data.details)
            if (data.debug) {
              console.error('Debug Info:', data.debug)
            }
          }
        }
        setEmailVerification((prev) => ({ ...prev, isVerifying: false }))
      }
    } catch (error) {
      console.error('Error sending OTP:', error)
      toast.error('Network error. Please check your connection and try again.')
      setEmailVerification((prev) => ({ ...prev, isVerifying: false }))
    }
  }

  const handleVerifyOTP = async () => {
    if (!emailVerification.otp) {
      toast.error('Please enter the OTP')
      return
    }

    setEmailVerification((prev) => ({ ...prev, isVerifyingOtp: true }))
    try {
      const response = await fetch('/api/admin/verify-email', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          email: profile.email,
          otp: emailVerification.otp,
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Email verified successfully')
        setEmailVerification({
          newEmail: '',
          otp: '',
          isVerifying: false,
          otpSent: false,
          isVerifyingOtp: false,
        })
        fetchProfile() // Refresh profile to get updated verification status
      } else {
        toast.error(data.error || 'Failed to verify email')
      }
    } catch (error) {
      console.error('Error verifying OTP:', error)
      toast.error('Failed to verify email')
    } finally {
      setEmailVerification((prev) => ({ ...prev, isVerifyingOtp: false }))
    }
  }

  // Handle password change
  const handlePasswordChange = async () => {
    if (
      !passwordData.currentPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      toast.error('All password fields are required')
      return
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New password and confirm password do not match')
      return
    }

    setIsChangingPassword(true)
    try {
      const response = await fetch('/api/admin/change-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(passwordData),
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Password changed successfully')
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        })
      } else {
        toast.error(data.error || 'Failed to change password')
      }
    } catch (error) {
      console.error('Error changing password:', error)
      toast.error('Failed to change password')
    } finally {
      setIsChangingPassword(false)
    }
  }

  if (!profile) {
    return (
      <div className="max-w-7xl mx-auto space-y-8 animate-pulse">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between gap-3 mb-8">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
            <div className="h-8 w-64 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
          </div>
        </div>

        {/* Profile and Password Section Skeleton */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Profile Card Skeleton */}
          <Card className="flex-1 lg:w-[70%] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profile Image Skeleton */}
              <div className="flex items-center gap-6">
                <div className="h-24 w-24 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                <div className="space-y-2">
                  <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
                  <div className="h-4 w-48 bg-gray-100 dark:bg-gray-600 rounded"></div>
                </div>
              </div>

              {/* Form Fields Skeleton */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-10 w-full bg-gray-100 dark:bg-gray-600 rounded-md"></div>
                  </div>
                ))}
              </div>

              <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
            </CardContent>
          </Card>

          {/* Password Card Skeleton */}
          <Card className="lg:w-[30%] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-10 w-full bg-gray-100 dark:bg-gray-600 rounded-md"></div>
                </div>
              ))}
              <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded-md"></div>
            </CardContent>
          </Card>
        </div>

        {/* Email Verification Card Skeleton */}
        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-6 w-36 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg">
              <div className="h-4 w-4 bg-yellow-200 dark:bg-yellow-700 rounded"></div>
              <div className="h-4 w-80 bg-yellow-200 dark:bg-yellow-700 rounded"></div>
            </div>
            <div className="space-y-3">
              <div className="p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg space-y-2">
                <div className="h-4 w-32 bg-gray-200 dark:bg-gray-600 rounded"></div>
                <div className="h-5 w-48 bg-gray-200 dark:bg-gray-600 rounded"></div>
              </div>
              <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded-md"></div>
            </div>
          </CardContent>
        </Card>

        {/* All Admins Card Skeleton */}
        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
            <div className="h-9 w-24 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
                  style={{
                    animationDelay: `${i * 0.1}s`,
                    animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded-full border-2 border-white dark:border-gray-800"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        <div className="h-5 w-20 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                        <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                      </div>
                      <div className="h-4 w-24 bg-gray-100 dark:bg-gray-600 rounded"></div>
                      <div className="h-4 w-40 bg-gray-100 dark:bg-gray-600 rounded"></div>
                      <div className="h-4 w-28 bg-gray-100 dark:bg-gray-600 rounded"></div>
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                      <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </div>
                    <div className="h-3 w-20 bg-gray-100 dark:bg-gray-600 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Loading indicator */}
        <div className="flex items-center justify-center py-8">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 dark:border-blue-400"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
              Loading admin settings...
            </span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-8">
        <div className="flex items-center gap-3">
          <Shield className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Admin Settings
          </h1>
        </div>

        {/* Connection Status Indicator */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700">
            <div
              className={`w-2 h-2 rounded-full ${isOnline && navigator.onLine ? 'bg-green-500' : 'bg-red-500'}`}
            />
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {isOnline && navigator.onLine ? 'Connected' : 'Disconnected'}
            </span>
          </div>
          {!navigator.onLine && (
            <div className="flex items-center gap-1 px-2 py-1 rounded bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200">
              <span className="text-xs">No Internet</span>
            </div>
          )}
        </div>
      </div>

      {/* Profile and Password Section */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Profile Section - 70% on large screens */}
        <Card className="flex-1 lg:w-[70%] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
              <User className="h-5 w-5" />
              Profile Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Profile Image */}
            <div className="flex items-center gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={profileFormData.profileImage} />
                <AvatarFallback className="text-lg bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300">
                  {profile.name?.charAt(0)?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <Upload className="h-4 w-4" />
                  Upload Photo
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleImageUpload(file)
                  }}
                />
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  JPG, PNG or GIF. Max size 5MB.
                </p>
              </div>
            </div>

            {/* Profile Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label
                  htmlFor="name"
                  className="text-gray-700 dark:text-gray-300"
                >
                  Full Name
                </Label>
                <Input
                  id="name"
                  value={profileFormData.name}
                  onChange={(e) =>
                    setProfileFormData((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  placeholder="Enter your full name"
                  className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>
              <div>
                <Label
                  htmlFor="username"
                  className="text-gray-700 dark:text-gray-300"
                >
                  Username
                </Label>
                <Input
                  id="username"
                  value={profileFormData.username}
                  onChange={(e) =>
                    setProfileFormData((prev) => ({
                      ...prev,
                      username: e.target.value,
                    }))
                  }
                  placeholder="Enter username"
                  className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>
              <div>
                <Label
                  htmlFor="email"
                  className="flex items-center gap-2 text-gray-700 dark:text-gray-300"
                >
                  Email Address
                  {profile.emailVerified && (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  )}
                  {!profile.emailVerified && profile.email && (
                    <X className="h-4 w-4 text-red-500" />
                  )}
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={profileFormData.email}
                  onChange={(e) =>
                    setProfileFormData((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                  placeholder="Enter email address"
                  className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>
              <div>
                <Label
                  htmlFor="phone"
                  className="text-gray-700 dark:text-gray-300"
                >
                  Mobile Number
                </Label>
                <Input
                  id="phone"
                  value={profileFormData.phone}
                  onChange={(e) =>
                    setProfileFormData((prev) => ({
                      ...prev,
                      phone: e.target.value,
                    }))
                  }
                  placeholder="Enter mobile number"
                  className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>
            </div>

            <Button
              onClick={handleProfileUpdate}
              disabled={isUpdatingProfile}
              className="w-full md:w-auto bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100"
            >
              {isUpdatingProfile ? 'Updating...' : 'Update Profile'}
            </Button>
          </CardContent>
        </Card>

        {/* Password Change Section - 30% on large screens */}
        <Card className="lg:w-[30%] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
              <Lock className="h-5 w-5" />
              Change Password
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label
                htmlFor="currentPassword"
                className="text-gray-700 dark:text-gray-300"
              >
                Current Password
              </Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showPasswords.current ? 'text' : 'password'}
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData((prev) => ({
                      ...prev,
                      currentPassword: e.target.value,
                    }))
                  }
                  placeholder="Enter current password"
                  className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-gray-500 dark:text-gray-400"
                  onClick={() =>
                    setShowPasswords((prev) => ({
                      ...prev,
                      current: !prev.current,
                    }))
                  }
                >
                  {showPasswords.current ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div>
              <Label
                htmlFor="newPassword"
                className="text-gray-700 dark:text-gray-300"
              >
                New Password
              </Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showPasswords.new ? 'text' : 'password'}
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData((prev) => ({
                      ...prev,
                      newPassword: e.target.value,
                    }))
                  }
                  placeholder="Enter new password"
                  className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-gray-500 dark:text-gray-400"
                  onClick={() =>
                    setShowPasswords((prev) => ({ ...prev, new: !prev.new }))
                  }
                >
                  {showPasswords.new ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div>
              <Label
                htmlFor="confirmPassword"
                className="text-gray-700 dark:text-gray-300"
              >
                Confirm New Password
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showPasswords.confirm ? 'text' : 'password'}
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData((prev) => ({
                      ...prev,
                      confirmPassword: e.target.value,
                    }))
                  }
                  placeholder="Confirm new password"
                  className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-gray-500 dark:text-gray-400"
                  onClick={() =>
                    setShowPasswords((prev) => ({
                      ...prev,
                      confirm: !prev.confirm,
                    }))
                  }
                >
                  {showPasswords.confirm ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <Button
              onClick={handlePasswordChange}
              disabled={isChangingPassword}
              className="w-full bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100"
            >
              {isChangingPassword ? 'Changing Password...' : 'Change Password'}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Email Verification Section */}
      {profile.email && !profile.emailVerified && (
        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
              <Mail className="h-5 w-5" />
              Email Verification
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg">
              <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
              <span className="text-sm text-yellow-800 dark:text-yellow-200">
                Your email address is not verified. Please verify to receive
                important notifications.
              </span>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Email to verify:
                </p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {profile.email}
                </p>
              </div>

              {!emailVerification.otpSent ? (
                <Button
                  onClick={handleSendOTP}
                  disabled={
                    emailVerification.isVerifying ||
                    emailVerification.countdown > 0
                  }
                  className="w-full bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100"
                >
                  {emailVerification.isVerifying
                    ? 'Sending OTP...'
                    : emailVerification.countdown > 0
                      ? `Wait ${emailVerification.countdown}s before resending`
                      : 'Send OTP to Email'}
                </Button>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      OTP sent to {profile.email}. Please check your email.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEmailVerification((prev) => ({
                          ...prev,
                          otpSent: false,
                          otp: '',
                        }))
                      }}
                      disabled={emailVerification.countdown > 0}
                      className="text-xs border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      {emailVerification.countdown > 0
                        ? `Resend in ${emailVerification.countdown}s`
                        : 'Resend OTP'}
                    </Button>
                  </div>
                  <div className="flex gap-3">
                    <Input
                      placeholder="Enter 6-digit OTP"
                      value={emailVerification.otp}
                      onChange={(e) =>
                        setEmailVerification((prev) => ({
                          ...prev,
                          otp: e.target.value,
                        }))
                      }
                      maxLength={6}
                      className="flex-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400"
                    />
                    <Button
                      onClick={handleVerifyOTP}
                      disabled={emailVerification.isVerifyingOtp}
                      className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100"
                    >
                      {emailVerification.isVerifyingOtp
                        ? 'Verifying...'
                        : 'Verify'}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Admins Section */}
      <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
            <Users className="h-5 w-5" />
            All Admins
            {isBackgroundUpdating && (
              <div className="flex items-center gap-1 px-2 py-1 rounded bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                <span className="text-xs">Updating...</span>
              </div>
            )}
          </CardTitle>
          <Button
            variant="outline"
            onClick={fetchAllAdmins}
            disabled={isLoadingAdmins}
            className="flex items-center gap-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <Activity className="h-4 w-4" />
            {isLoadingAdmins ? 'Refreshing...' : 'Refresh'}
          </Button>
        </CardHeader>
        <CardContent>
          {isLoadingAdmins ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {allAdmins.map((admin) => (
                <AdminCard
                  key={admin.id}
                  admin={admin}
                  formatLastActivity={memoizedFormatLastActivity}
                />
              ))}

              {allAdmins.length === 0 && (
                <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                  No admins found.
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
