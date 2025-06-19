'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Profile from '../../components/dashboard/Profile'
import Settings from '../../components/dashboard/Settings'

export default function StudentDashboard() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

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

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <div className="text-center">
          <div className="mb-4 text-2xl font-semibold text-destructive">
            {error}
          </div>
          <button
            onClick={fetchUser}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
          <Profile user={null} isLoading={true} />
          <Settings />
        </main>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <div className="text-center">
          <p>Could not load user profile.</p>
          <button
            onClick={fetchUser}
            className="mt-4 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <Profile user={user} isLoading={false} />
        <Settings />
      </main>
    </div>
  )
}
