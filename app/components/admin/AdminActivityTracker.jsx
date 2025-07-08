'use client'

import { useEffect } from 'react'

export default function AdminActivityTracker() {
  useEffect(() => {
    // Track activity every 2 minutes
    const trackActivity = () => {
      fetch('/api/admin/all-admins', {
        method: 'POST',
        credentials: 'include',
      }).catch(console.error)
    }

    // Initial activity track
    trackActivity()

    // Set up interval for regular activity tracking
    const interval = setInterval(trackActivity, 2 * 60 * 1000) // 2 minutes

    // Track activity on page focus/visibility changes
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        trackActivity()
      }
    }

    // Track activity on mouse movement and keyboard events
    let activityTimer
    const resetActivityTimer = () => {
      clearTimeout(activityTimer)
      activityTimer = setTimeout(trackActivity, 30 * 1000) // 30 seconds after activity
    }

    // Add event listeners for user activity
    document.addEventListener('visibilitychange', handleVisibilityChange)
    document.addEventListener('mousemove', resetActivityTimer)
    document.addEventListener('keypress', resetActivityTimer)
    document.addEventListener('click', resetActivityTimer)
    document.addEventListener('scroll', resetActivityTimer)

    // Cleanup
    return () => {
      clearInterval(interval)
      clearTimeout(activityTimer)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      document.removeEventListener('mousemove', resetActivityTimer)
      document.removeEventListener('keypress', resetActivityTimer)
      document.removeEventListener('click', resetActivityTimer)
      document.removeEventListener('scroll', resetActivityTimer)
    }
  }, [])

  return null // This component doesn't render anything
}
