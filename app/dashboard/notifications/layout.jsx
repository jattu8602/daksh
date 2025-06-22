'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { GraduationCap, Settings, User } from 'lucide-react'
import Link from 'next/link'
import ScrollToTop from './scrolltop'

export default function NotificationsLayout({ children }) {
  const router = useRouter()
  const pathname = usePathname()

  const isDashboardNotificationRoute = pathname.startsWith(
    '/dashboard/notifications'
  )

  useEffect(() => {
    // Prevent scrolling
    if (isDashboardNotificationRoute) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }

    // Handle mobile back gesture / browser back
    const handlePopState = () => {
      if (isDashboardNotificationRoute) {
        router.push('/dashboard/home')
      }
    }

    window.addEventListener('popstate', handlePopState)

    return () => {
      document.body.style.overflow = 'auto'
      window.removeEventListener('popstate', handlePopState)
    }
  }, [isDashboardNotificationRoute])

  const isSchoolActive = pathname === '/dashboard/notifications'
  const isCommunityActive = pathname === '/dashboard/notifications/community'
  const isMySpaceActive = pathname === '/dashboard/notifications/my-space'

  return (
    <div className="flex flex-col bg-white h-screen dark:bg-gray-900 max-w-md mx-auto text-black dark:text-white">
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-900">
        {/* Header */}
        <div className="flex items-center p-4">
          <div
            onClick={() => router.push('/dashboard/home')}
            className="text-black dark:text-white cursor-pointer"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 12H5M5 12L12 19M5 12L12 5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h1 className="text-lg font-medium text-center flex-1">
            Notifications
          </h1>
        </div>

        {/* Search */}
        <div className="px-4 mb-4">
          <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-gray-500 dark:text-gray-400 mr-2"
            >
              <path
                d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <input
              type="text"
              placeholder="Search"
              className="bg-transparent border-none outline-none w-full text-sm text-black dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <Link href="/dashboard/notifications" className="flex-1">
            <div
              className={`flex flex-col items-center py-3 ${
                isSchoolActive
                  ? 'border-b-2 border-black dark:border-white text-black dark:text-white'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              <GraduationCap size={20} />
              <span className="text-xs font-medium mt-1">School</span>
            </div>
          </Link>
          <Link href="/dashboard/notifications/community" className="flex-1">
            <div
              className={`flex flex-col items-center py-3 ${
                isCommunityActive
                  ? 'border-b-2 border-black dark:border-white text-black dark:text-white'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              <Settings size={20} />
              <span className="text-xs font-medium mt-1">Community</span>
            </div>
          </Link>
          <Link href="/dashboard/notifications/my-space" className="flex-1">
            <div
              className={`flex flex-col items-center py-3 ${
                isMySpaceActive
                  ? 'border-b-2 border-black dark:border-white text-black dark:text-white'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              <User size={20} />
              <span className="text-xs font-medium mt-1">My Space</span>
            </div>
          </Link>
        </div>
      </div>

      {/* Page content */}
      <div className="flex-1 overflow-auto">
        <ScrollToTop />
        {children}
      </div>
    </div>
  )
}
