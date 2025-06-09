import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import authManager from '@/lib/auth'

export function useAuth() {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  // Check authentication status
  const checkAuth = useCallback(async () => {
    try {
      const userData = await authManager.checkSession()

      if (userData) {
        setUser(userData)
        setIsAuthenticated(true)
      } else {
        setUser(null)
        setIsAuthenticated(false)
      }
    } catch (error) {
      console.error('Auth check error:', error)
      setUser(null)
      setIsAuthenticated(false)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Initialize auth on mount
  useEffect(() => {
    authManager.initialize()
    checkAuth()
  }, [checkAuth])

  // Logout function
  const logout = useCallback(async () => {
    try {
      await authManager.logout()
      setUser(null)
      setIsAuthenticated(false)
      router.push('/')
    } catch (error) {
      console.error('Logout error:', error)
      // Even if logout fails on server, clear local state
      authManager.clearTokens()
      setUser(null)
      setIsAuthenticated(false)
      router.push('/')
    }
  }, [router])

  // Make authenticated API request
  const apiRequest = useCallback(
    async (url, options = {}) => {
      try {
        return await authManager.apiRequest(url, options)
      } catch (error) {
        if (error.message === 'Session expired') {
          // Session expired, redirect to login
          await logout()
          throw error
        }
        throw error
      }
    },
    [logout]
  )

  // Refresh user data
  const refreshUser = useCallback(async () => {
    await checkAuth()
  }, [checkAuth])

  return {
    user,
    isLoading,
    isAuthenticated,
    logout,
    apiRequest,
    refreshUser,
    checkAuth,
  }
}

// Hook specifically for protecting routes
export function useAuthGuard(allowedRoles = []) {
  const { user, isLoading, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/')
        return
      }

      if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
        // Redirect based on role
        switch (user?.role) {
          case 'STUDENT':
            router.push('/dashboard/home')
            break
          case 'MENTOR':
            router.push('/mentor/dashboard')
            break
          case 'ADMIN':
          case 'SUPER_ADMIN':
            router.push('/admin/dashboard')
            break
          default:
            router.push('/')
        }
      }
    }
  }, [user, isLoading, isAuthenticated, router, allowedRoles])

  return {
    user,
    isLoading,
    isAuthenticated,
    isAuthorized:
      isAuthenticated &&
      (allowedRoles.length === 0 || allowedRoles.includes(user?.role)),
  }
}
