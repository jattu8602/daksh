'use client'

import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useRouter } from 'next/navigation'
import Profile from '../../components/dashboard/Profile'
import Settings from '../../components/dashboard/Settings'
import { loginSuccess, loginFailure } from '../../store/features/authSlice'

export default function StudentDashboard() {
  const router = useRouter()
  const dispatch = useDispatch()
  const { user: reduxUser, isAuthenticated } = useSelector(
    (state) => state.auth
  )
  const [user, setUser] = useState(reduxUser)
  const [isLoading, setIsLoading] = useState(!reduxUser)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadProfile = async () => {
      // If user is in Redux, use it.
      if (reduxUser) {
        setUser(reduxUser)
        setIsLoading(false)
        // Optionally, save to localStorage here if not already handled in authSlice
        if (typeof window !== 'undefined') {
          localStorage.setItem('userProfile', JSON.stringify(reduxUser))
        }
        return
      }

      // If no user in Redux, try localStorage first
      if (typeof window !== 'undefined') {
        const cachedUser = localStorage.getItem('userProfile')
        if (cachedUser) {
          const userProfile = JSON.parse(cachedUser)
          setUser(userProfile)
          dispatch(loginSuccess(userProfile)) // Sync with Redux
          setIsLoading(false)
          return
        }
      }

      // If not in Redux or localStorage, fetch from API
      try {
        setIsLoading(true)
        const response = await fetch('/api/auth/session', {
          credentials: 'include',
        })
        const data = await response.json()

        if (data.success && data.user) {
          setUser(data.user)
          dispatch(loginSuccess(data.user)) // Sync with Redux
          if (typeof window !== 'undefined') {
            localStorage.setItem('userProfile', JSON.stringify(data.user))
          }
        } else {
          setError(data.error || 'Failed to fetch user data')
          dispatch(loginFailure(data.error || 'Failed to fetch user data'))
          router.push('/')
        }
      } catch (err) {
        setError('Failed to fetch user data')
        dispatch(loginFailure('Failed to fetch user data'))
        router.push('/')
      } finally {
        setIsLoading(false)
      }
    }

    if (!isAuthenticated) {
      router.push('/')
    } else {
      loadProfile()
    }
  }, [reduxUser, dispatch, router, isAuthenticated])

  const handleRetry = () => {
    setError(null)
    setIsLoading(true)
    // Re-trigger the loadProfile logic in useEffect
    if (typeof window !== 'undefined') {
      localStorage.removeItem('userProfile')
    }
    // A bit of a hack to re-trigger, but effective
    dispatch({ type: 'auth/refetch' })
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <div className="text-center">
          <div className="mb-4 text-2xl font-semibold text-destructive">
            {error}
          </div>
          <button
            onClick={handleRetry}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
          <Profile user={null} isLoading={true} />
          <Settings />
        </main>
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
