'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import { Bell } from 'lucide-react'
import { Toaster } from 'react-hot-toast'
import AdminActivityTracker from '../components/admin/AdminActivityTracker'
import { ThemeProvider } from '@/components/theme-provider'
import { ModeToggle } from '@/components/component/ModeToggle'

// Search Bar Component with Animated Text
function AdminSearchBar() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Placeholders for admin-specific searches
  const placeholders = [
    'Search schools...',
    'Search mentors...',
    'Search admins...',
    'Search content...',
    'Search classes...',
    'Search settings...',
  ]

  // Animation states
  const [placeholderIndex, setPlaceholderIndex] = useState(0)
  const [displayText, setDisplayText] = useState('')
  const [count, setCount] = useState(0)
  const phaseRef = useRef('countUp')
  const intervalRef = useRef(null)
  const [showCursor, setShowCursor] = useState(true)

  // Cursor blink effect
  useEffect(() => {
    const blink = setInterval(() => setShowCursor((v) => !v), 500)
    return () => clearInterval(blink)
  }, [])

  // Animated placeholder text effect
  useEffect(() => {
    if (searchQuery) {
      setDisplayText('')
      return
    }

    if (intervalRef.current) clearInterval(intervalRef.current)

    const current = placeholders[placeholderIndex]
    phaseRef.current = 'countUp'
    setCount(0)

    intervalRef.current = setInterval(() => {
      setCount((c) => {
        if (phaseRef.current === 'countUp') {
          if (c < 100) {
            const pct = c + 3 // Slightly faster animation
            const len = Math.floor((pct / 100) * current.length)
            setDisplayText(current.slice(0, len))
            return pct
          } else {
            phaseRef.current = 'hold'
            setTimeout(() => {
              phaseRef.current = 'countDown'
            }, 1500) // Hold for 1.5 seconds
            return c
          }
        } else if (phaseRef.current === 'hold') {
          return c
        } else {
          if (c > 0) {
            const pct = c - 3
            const len = Math.floor((pct / 100) * current.length)
            setDisplayText(current.slice(0, len))
            return pct
          } else {
            setPlaceholderIndex((idx) => (idx + 1) % placeholders.length)
            phaseRef.current = 'countUp'
            return 0
          }
        }
      })
    }, 50)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [searchQuery, placeholderIndex])

  // Input change handler
  const onChange = (e) => {
    setSearchQuery(e.target.value)
    setIsLoading(true)
    clearTimeout(window._adminSearchTimeout)
    window._adminSearchTimeout = setTimeout(() => setIsLoading(false), 500)
  }

  // Form submit handler
  const onSubmit = (e) => {
    e.preventDefault()
    console.log('Admin searching for:', searchQuery)
    // Add your search logic here
  }

  // Combine display text and cursor
  const placeholderToShow =
    displayText + (showCursor && !searchQuery ? ' |' : '')

  return (
    <form onSubmit={onSubmit} className="relative flex-1 max-w-md">
      <div className="relative">
        {/* Search icon */}
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            className="h-4 w-4 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* Input field */}
        <input
          type="text"
          placeholder={placeholderToShow}
          value={searchQuery}
          onChange={onChange}
          className="block w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 dark:focus:placeholder-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-900 dark:text-white"
        />

        {/* Clear button */}
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="absolute inset-y-0 right-8 flex items-center pr-2 text-gray-400 hover:text-gray-600"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}

        {/* Loading indicator or search button */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          {isLoading ? (
            <div className="h-4 w-4 border-2 border-t-transparent border-blue-500 rounded-full animate-spin" />
          ) : (
            <button
              type="submit"
              className="text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
    </form>
  )
}

export default function AdminLayout({ children }) {
  const pathname = usePathname()
  const router = useRouter()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false) // Changed to false for mobile-first
  const [isMobile, setIsMobile] = useState(false)
  const [adminUser, setAdminUser] = useState(null)
  const [showSignOutModal, setShowSignOutModal] = useState(false)

  const navItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/admin/schools', label: 'Schools', icon: '🏫' },
    { href: '/admin/mentors', label: 'Mentors', icon: '👨‍💼' },
    { href: '/admin/admins', label: 'Admins', icon: '👑' },
    { href: '/admin/content', label: 'Content', icon: '🎬' },
    { href: '/admin/class', label: 'Class', icon: '👥' },
    { href: '/admin/settings', label: 'Settings', icon: '⚙️' },
  ]

  // Check if mobile and handle sidebar state
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024
      setIsMobile(mobile)
      if (!mobile) {
        setIsSidebarOpen(true) // Open sidebar on desktop
      } else {
        setIsSidebarOpen(false) // Close sidebar on mobile
      }
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Close sidebar when clicking nav items on mobile
  const handleNavClick = () => {
    if (isMobile) {
      setIsSidebarOpen(false)
    }
  }

  // Handle clicking outside sidebar to close it
  const handleOutsideClick = (e) => {
    if (
      isMobile &&
      isSidebarOpen &&
      !e.target.closest('aside') &&
      !e.target.closest('button')
    ) {
      setIsSidebarOpen(false)
    }
  }

  // Add click listener to close sidebar when clicking outside
  useEffect(() => {
    if (isMobile && isSidebarOpen) {
      document.addEventListener('click', handleOutsideClick)
      return () => document.removeEventListener('click', handleOutsideClick)
    }
  }, [isMobile, isSidebarOpen])

  const isLoginPage = pathname === '/admin/login'

  // Load admin user data from sessionStorage
  useEffect(() => {
    const userData = sessionStorage.getItem('user')
    if (userData) {
      try {
        const user = JSON.parse(userData)
        setAdminUser(user)
      } catch (error) {
        console.error('Error parsing user data:', error)
        // If there's an error parsing, redirect to login
        router.push('/admin/login')
      }
    } else if (!isLoginPage) {
      // If no user data and not on login page, redirect to login
      router.push('/admin/login')
    }
  }, [router, isLoginPage])

  // Show sign out confirmation modal
  const handleSignOut = () => {
    setShowSignOutModal(true)
  }

  // Actually perform sign out
  const confirmSignOut = async () => {
    try {
      // Mark admin as offline before signing out
      await fetch('/api/admin/status', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          isOnline: false,
          lastActivity: new Date().toISOString(),
        }),
      })
    } catch (error) {
      console.error('Failed to mark admin offline:', error)
      // Continue with sign out even if the API call fails
    }

    // Clear session storage
    sessionStorage.removeItem('user')

    // Clear the auth cookie
    document.cookie =
      'admin_auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;'

    // Close modal
    setShowSignOutModal(false)

    // Redirect to login page
    router.push('/admin/login')
  }

  if (isLoginPage) {
    return <>{children}</>
  }

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
        {/* <Toaster position="top-right" /> */}
        <AdminActivityTracker />
        {/* Mobile Overlay - Removed to keep background visible */}

        {/* Sidebar */}
        <aside
          className={`bg-white dark:bg-gray-800 fixed inset-y-0 z-50 flex flex-col border-r border-gray-200 dark:border-gray-700 transition-transform duration-300 ease-in-out ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } w-64 lg:static lg:translate-x-0`}
        >
          <div className="flex h-14 items-center border-b border-gray-200 dark:border-gray-700 px-4">
            <h1 className="font-bold text-lg text-gray-900 dark:text-white">
              Daksh Admin
            </h1>
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="ml-auto inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 dark:border-gray-600 lg:hidden text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <span className="sr-only">Toggle sidebar</span>
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <nav className="flex-1 overflow-auto py-4">
            <ul className="grid gap-1 px-2">
              {navItems.map((item) => {
                const isActive = pathname.startsWith(item.href)
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={handleNavClick}
                      className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-gray-100 dark:bg-gray-700 text-black dark:text-white'
                          : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      <span className="text-xl">{item.icon}</span>
                      <span>{item.label}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>
          <div className="border-t border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-gray-700 dark:text-gray-300">
                {adminUser?.name ? adminUser.name.charAt(0).toUpperCase() : 'A'}
              </div>
              <div>
                <div className="font-medium text-gray-900 dark:text-white">
                  {adminUser?.name || 'Admin User'}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {adminUser?.email || 'admin@example.com'}
                </div>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="mt-4 w-full rounded-md bg-red-50 dark:bg-red-900/20 px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex flex-1 flex-col overflow-hidden">
          <header className="flex h-14 items-center gap-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 lg:px-6">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 dark:border-gray-600 lg:hidden text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <span className="sr-only">Toggle sidebar</span>
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            <div className="flex flex-1 items-center justify-between gap-4">
              {/* Left side - Page title (hidden on mobile) */}
              <h1 className="text-lg font-semibold hidden lg:block text-gray-900 dark:text-white">
                {navItems.find((item) => pathname.startsWith(item.href))
                  ?.label || 'Dashboard'}
              </h1>

              {/* Center - Search bar */}
              <div className="flex-1 max-w-md mx-4">
                <AdminSearchBar />
              </div>

              {/* Right side - Action buttons */}
              <div className="flex items-center gap-2">
                {/* Theme Toggle */}
                <div className="mr-2">
                  <ModeToggle />
                </div>

                <Link href="/admin/notifications">
                  <button className="relative inline-flex items-center justify-center h-8 w-8 rounded-full bg-white dark:bg-gray-700 shadow-sm hover:bg-gray-100 dark:hover:bg-gray-600 transition cursor-pointer">
                    <Bell className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                    {/* Notification badge */}
                    <span className="absolute -top-1.5 -right-1.5 h-4 w-4 bg-red-500 rounded-full text-xs text-white font-bold flex items-center justify-center shadow">
                      3
                    </span>
                  </button>
                </Link>
              </div>
            </div>
          </header>

          <div className="flex-1 overflow-auto p-4 lg:p-6 bg-gray-50 dark:bg-gray-900">
            {children}
          </div>
        </main>

        {/* Sign Out Confirmation Modal */}
        {showSignOutModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-md rounded-lg bg-white dark:bg-gray-800 p-6 shadow-lg">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Confirm Sign Out
                </h2>
                <button
                  onClick={() => setShowSignOutModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="mb-6">
                <p className="text-gray-700 dark:text-gray-300">
                  Do you want to really sign out? You will need to log in again
                  to access the admin panel.
                </p>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowSignOutModal(false)}
                  className="rounded-md border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                >
                  No, Stay Logged In
                </button>
                <button
                  type="button"
                  onClick={confirmSignOut}
                  className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 cursor-pointer"
                >
                  Yes, Sign Out
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ThemeProvider>
  )
}
