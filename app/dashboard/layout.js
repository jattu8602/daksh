'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import Image from 'next/image'
import { useState, useEffect, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Home, Search, BookOpen, Clapperboard } from 'lucide-react' // Lucide icons
import { PageLoader } from '@/components/ui/loading'
import { ThemeProvider } from '@/components/theme-provider'
import { loginSuccess, loginFailure } from '../store/features/authSlice'

// Route preloader for instant navigation
const preloadRoutes = () => {
  const routes = [
    '/dashboard/home',
    '/dashboard/explore',
    '/dashboard/learn',
    '/dashboard/reels',
    '/dashboard/profile',
  ]

  routes.forEach((route) => {
    const link = document.createElement('link')
    link.rel = 'prefetch'
    link.href = route
    document.head.appendChild(link)
  })
}

// Check if we have valid cached authentication
function hasValidAuthCache() {
  try {
    const authState = localStorage.getItem('auth_cache')
    if (!authState) return false

    const { user, timestamp } = JSON.parse(authState)
    const isRecent = Date.now() - timestamp < 5 * 60 * 1000 // 5 minutes

    return user && isRecent
  } catch {
    return false
  }
}

// Cache auth state
function cacheAuthState(user) {
  try {
    localStorage.setItem(
      'auth_cache',
      JSON.stringify({
        user,
        timestamp: Date.now(),
      })
    )
  } catch (e) {
    console.warn('Failed to cache auth state:', e)
  }
}

export default function DashboardLayout({ children }) {
  const pathname = usePathname()
  const dispatch = useDispatch()
  const router = useRouter()
  const { user, isAuthenticated } = useSelector((state) => state.auth)

  // Skip loading state if we have valid cached auth
  const [isAuthenticating, setIsAuthenticating] = useState(
    !isAuthenticated && !hasValidAuthCache()
  )

  // Memoize navigation items to prevent re-renders
  const navItems = useMemo(
    () => [
      {
        href: '/dashboard/home',
        label: 'Home',
        icon: <Home className="w-6 h-6" />,
      },
      {
        href: '/dashboard/explore',
        label: 'Explore',
        icon: <Search className="w-6 h-6" />,
      },
      {
        href: '/dashboard/learn',
        label: 'Learn',
        icon: <BookOpen className="w-6 h-6" />,
      },
      {
        href: '/dashboard/reels',
        label: 'Reels',
        icon: <Clapperboard className="w-6 h-6" />,
      },
    ],
    []
  )

  // Non-blocking authentication check
  useEffect(() => {
    let isMounted = true

    const checkAuth = async () => {
      // If already authenticated, just cache and continue
      if (isAuthenticated && user) {
        cacheAuthState(user)
        setIsAuthenticating(false)
        return
      }

      // If we have recent cached auth, assume valid and check in background
      if (hasValidAuthCache()) {
        setIsAuthenticating(false)
      }

      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 3000) // 3s timeout

        const response = await fetch('/api/auth/session', {
          credentials: 'include',
          signal: controller.signal,
        })

        clearTimeout(timeoutId)

        if (!isMounted) return

        const data = await response.json()

        if (data.success && data.user) {
          dispatch(loginSuccess(data.user))
          cacheAuthState(data.user)
        } else {
          // Only redirect if we're definitely not authenticated
          if (!hasValidAuthCache()) {
            dispatch(loginFailure(data.error || 'Session expired'))
            router.replace('/')
            return
          }
        }
      } catch (err) {
        if (!isMounted) return

        // Don't fail if request times out - just continue with cached state
        if (err.name === 'AbortError') {
          console.warn('Auth check timed out, continuing with cached state')
        } else {
          console.error('Auth check failed:', err)
          // Only redirect if we have no fallback
          if (!hasValidAuthCache()) {
            dispatch(loginFailure('Failed to fetch session'))
            router.replace('/')
            return
          }
        }
      } finally {
        if (isMounted) {
          setIsAuthenticating(false)
        }
      }
    }

    checkAuth()

    return () => {
      isMounted = false
    }
  }, [isAuthenticated, user, dispatch, router])

  // Memoize navigation visibility logic
  const shouldHideNav = useMemo(
    () =>
      pathname.includes('/dashboard/community') ||
      pathname.includes('/dashboard/notifications'),
    [pathname]
  )

  // Memoize profile image src
  const profileImageSrc = useMemo(
    () => user?.student?.profileImage || '/icons/girl.png',
    [user?.student?.profileImage]
  )

  // Preload routes when idle
  useEffect(() => {
    if (!isAuthenticating) {
      const timeoutId = setTimeout(preloadRoutes, 1000)
      return () => clearTimeout(timeoutId)
    }
  }, [isAuthenticating])

  // Only show loader if truly needed (no cached auth)
  if (isAuthenticating && !hasValidAuthCache()) {
    return <PageLoader />
  }

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <div className="flex flex-col min-h-screen">
        <main className="flex-1 pb-12">{children}</main>
        {!shouldHideNav && (
          <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 dark:bg-black dark:border-gray-800">
            <div className="flex justify-around items-center h-12">
              {navItems.map((item) => {
                const isActive = pathname.includes(item.href)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    prefetch={true}
                    className={`flex flex-col items-center justify-center space-y-1 p-2 transition-colors duration-200 ${
                      isActive
                        ? 'text-black font-semibold dark:text-white'
                        : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                    }`}
                  >
                    {item.icon}
                  </Link>
                )
              })}

              {/* Profile Image */}
              <Link
                href="/dashboard/profile"
                prefetch={true}
                className="flex items-center justify-center p-2 transition-transform duration-200 hover:scale-110"
              >
                <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-pink-300">
                  <Image
                    src={profileImageSrc}
                    alt="Profile"
                    width={32}
                    height={32}
                    className="w-full h-full object-cover"
                    loading="eager"
                    priority={pathname === '/dashboard/home'}
                  />
                </div>
              </Link>
            </div>
          </nav>
        )}
      </div>
    </ThemeProvider>
  )
}
