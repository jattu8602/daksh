'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import {
  PageLoader,
  ComponentLoader,
  SkeletonCard,
  SkeletonText,
} from '@/components/ui/loading'

export default function StudentDashboard() {
  const router = useRouter()
  const {
    user,
    isLoading: authLoading,
    isAuthenticated,
    logout,
    refreshUser,
  } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        router.push('/')
        return
      }

      if (user?.role !== 'STUDENT') {
        router.push('/')
        return
      }

      setIsLoading(false)
    }
  }, [authLoading, isAuthenticated, user, router])

  const handleLogout = useCallback(async () => {
    setIsLoggingOut(true)
    try {
      await logout()
    } catch (error) {
      console.error('Error during logout:', error)
    } finally {
      setIsLoggingOut(false)
    }
  }, [logout])

  const handleRefresh = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      await refreshUser()
    } catch (error) {
      setError('Failed to refresh user data')
    } finally {
      setIsLoading(false)
    }
  }, [refreshUser])

  if (authLoading || isLoading) {
    return <PageLoader message="Loading your profile..." />
  }

  if (!isAuthenticated) {
    return <PageLoader message="Redirecting..." />
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-2xl font-semibold text-red-600">
            {error}
          </div>
          <button
            onClick={handleRefresh}
            className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (!user) {
    return <PageLoader message="Loading user data..." />
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
              Student Profile
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
                  <h2 className="text-xl font-semibold">
                    {user.student?.name || user.name}
                  </h2>
                  <p className="text-gray-600">@{user.username}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <span className="font-medium text-gray-500">Name:</span>{' '}
                  <span className="text-gray-900">
                    {user.student?.name || user.name}
                  </span>
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
                    <div>
                      <span className="font-medium text-gray-500">Gender:</span>{' '}
                      <span className="text-gray-900">
                        {user.student.gender || 'N/A'}
                      </span>
                    </div>
                  </>
                )}
                <div>
                  <span className="font-medium text-gray-500">Role:</span>{' '}
                  <span className="text-gray-900 capitalize">
                    {user.role.toLowerCase()}
                  </span>
                </div>
              </div>
            </div>
          </ComponentLoader>

          {/* Quick Actions Card */}
          <ComponentLoader isLoading={false} skeleton={<ActionsSkeleton />}>
            <div className="rounded-lg bg-white p-6 shadow">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-4">
                <button
                  onClick={() => router.push('/dashboard/home')}
                  className="w-full text-left p-3 rounded-md border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <div className="font-medium">Go to Dashboard</div>
                  <div className="text-sm text-gray-500">
                    View your main dashboard
                  </div>
                </button>

                <button
                  onClick={() => router.push('/dashboard/learn')}
                  className="w-full text-left p-3 rounded-md border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <div className="font-medium">Learning Center</div>
                  <div className="text-sm text-gray-500">
                    Access your courses and materials
                  </div>
                </button>

                <button
                  onClick={() => router.push('/dashboard/reels')}
                  className="w-full text-left p-3 rounded-md border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <div className="font-medium">Video Reels</div>
                  <div className="text-sm text-gray-500">
                    Watch educational content
                  </div>
                </button>

                <button
                  onClick={handleRefresh}
                  className="w-full text-left p-3 rounded-md border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <div className="font-medium">Refresh Profile</div>
                  <div className="text-sm text-gray-500">
                    Update your profile information
                  </div>
                </button>
              </div>
            </div>
          </ComponentLoader>
        </div>

        {/* Session Info Card (for debugging) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-6">
            <div className="rounded-lg bg-blue-50 p-6 shadow">
              <h3 className="text-lg font-semibold mb-4 text-blue-900">
                Session Info (Dev)
              </h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium text-blue-700">User ID:</span>{' '}
                  <span className="text-blue-900">{user.id}</span>
                </div>
                <div>
                  <span className="font-medium text-blue-700">
                    Has Access Token:
                  </span>{' '}
                  <span className="text-blue-900">
                    {localStorage.getItem('accessToken') ? 'Yes' : 'No'}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-blue-700">
                    Has Refresh Token:
                  </span>{' '}
                  <span className="text-blue-900">
                    {localStorage.getItem('refreshToken') ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
