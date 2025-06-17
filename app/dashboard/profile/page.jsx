'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
  PageLoader,
  ComponentLoader,
  SkeletonCard,
  SkeletonText,
} from '@/components/ui/loading'

export default function StudentDashboard() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

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

  const handleLogout = useCallback(async () => {
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
      {/* Header */}
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Student Dashboard
            </h1>
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoggingOut ? 'Logging out...' : 'Logout'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Student Information Card */}
          <ComponentLoader isLoading={false} skeleton={<ProfileSkeleton />}>
            <div className="rounded-lg bg-white p-6 shadow">
              <div className="flex items-center space-x-4 mb-6">
                <div className="relative w-24 h-24">
                  <img
                    src={user.student?.profileImage || '/public/icons/girl.png'}
                    alt={user.name}
                    className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = '/public/icons/girl.png'
                    }}
                  />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">{user.name}</h2>
                  <p className="text-gray-600">@{user.username}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <span className="font-medium text-gray-500">Name:</span>{' '}
                  <span className="text-gray-900">{user.name}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-500">Username:</span>{' '}
                  <span className="text-gray-900">{user.username}</span>
                </div>
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
                      <span className="font-medium text-gray-500">Class:</span>{' '}
                      <span className="text-gray-900">
                        {user.student.class?.name || 'N/A'}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-500">School:</span>{' '}
                      <span className="text-gray-900">
                        {user.student.class?.school?.name || 'N/A'}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </ComponentLoader>


        </div>


      </main>
    </div>
  )
}
