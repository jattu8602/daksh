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

export default function DashboardLayout({ children }) {
  const pathname = usePathname()
  const dispatch = useDispatch()
  const router = useRouter()
  const { user, isAuthenticated } = useSelector((state) => state.auth)
  const [isAuthenticating, setIsAuthenticating] = useState(!isAuthenticated)
  const [authChecked, setAuthChecked] = useState(isAuthenticated)

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

  // Optimized authentication check - only run once or when explicitly needed
  useEffect(() => {
    let isMounted = true

    const checkAuth = async () => {
      // Skip if already authenticated and checked
      if (isAuthenticated && authChecked) {
        setIsAuthenticating(false)
        return
      }

      try {
        const response = await fetch('/api/auth/session', {
          credentials: 'include',
        })

        if (!isMounted) return

        const data = await response.json()

        if (data.success && data.user) {
          dispatch(loginSuccess(data.user))
          setAuthChecked(true)
        } else {
          dispatch(loginFailure(data.error || 'Session expired'))
          router.replace('/')
          return
        }
      } catch (err) {
        if (!isMounted) return
        console.error('Failed to fetch session:', err)
        dispatch(loginFailure('Failed to fetch session'))
        router.replace('/')
        return
      } finally {
        if (isMounted) {
          setIsAuthenticating(false)
        }
      }
    }

    // Only check auth if not already authenticated or not yet checked
    if (!isAuthenticated || !authChecked) {
      checkAuth()
    } else {
      setIsAuthenticating(false)
    }

    return () => {
      isMounted = false
    }
  }, [isAuthenticated, authChecked, dispatch, router])

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

  // Preload routes when user is authenticated and idle
  useEffect(() => {
    if (isAuthenticated && !isAuthenticating) {
      const timeoutId = setTimeout(() => {
        preloadRoutes()
      }, 2000) // Preload after 2 seconds of being on the page

      return () => clearTimeout(timeoutId)
    }
  }, [isAuthenticated, isAuthenticating])

  if (isAuthenticating) {
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
