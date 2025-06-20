'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Home, Search, BookOpen, Clapperboard } from 'lucide-react' // Lucide icons
import { PageLoader } from '@/components/ui/loading'
import { ThemeProvider } from '@/components/theme-provider'
import { loginSuccess, loginFailure } from '../store/features/authSlice'

export default function DashboardLayout({ children }) {
  const pathname = usePathname()
  const dispatch = useDispatch()
  const router = useRouter()
  const { user, isAuthenticated } = useSelector((state) => state.auth)
  const [isAuthenticating, setIsAuthenticating] = useState(!isAuthenticated)

  useEffect(() => {
    const checkAuth = async () => {
      if (isAuthenticated) {
        return
      }

      try {
        const response = await fetch('/api/auth/session', {
          credentials: 'include',
        })
        const data = await response.json()

        if (data.success && data.user) {
          dispatch(loginSuccess(data.user))
        } else {
          dispatch(loginFailure(data.error || 'Session expired'))
          router.push('/')
        }
      } catch (err) {
        console.error('Failed to fetch session:', err)
        dispatch(loginFailure('Failed to fetch session'))
        router.push('/')
      } finally {
        setIsAuthenticating(false)
      }
    }

    checkAuth()
  }, [isAuthenticated, dispatch, router])

  const navItems = [
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
  ]

  const shouldHideNav =
    pathname.includes('/dashboard/community') ||
    pathname.includes('/dashboard/notifications')

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
        <main className="flex-1 pb-16">{children}</main>
        {!shouldHideNav && (
          <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 dark:bg-black dark:border-gray-800">
            <div className="flex justify-around items-center h-13">
              {navItems.map((item) => {
                const isActive = pathname.includes(item.href)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
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
                className="flex items-center justify-center p-2 transition-transform duration-200 hover:scale-110"
              >
                <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-pink-300">
                  <Image
                    src={user?.student?.profileImage || '/icons/girl.png'}
                    alt="Profile"
                    width={32}
                    height={32}
                    className="w-full h-full object-cover"
                    loading="lazy"
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
