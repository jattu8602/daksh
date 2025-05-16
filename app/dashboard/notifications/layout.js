"use client"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { GraduationCap, Settings, User } from "lucide-react"
import Link from "next/link"

export default function NotificationsLayout({ children }) {
  const router = useRouter()
  const pathname = usePathname()

  // Redirect /notifications to /notifications/school
  useEffect(() => {
    if (pathname === "/dashboard/notifications") {
      router.push("/dashboard/notifications/school")
    }
  }, [pathname, router])

  // Determine which tab is active
  const isSchoolActive = pathname === "/dashboard/notifications/school"
  const isCommunityActive = pathname === "/dashboard/notifications/community"
  const isMySpaceActive = pathname === "/dashboard/notifications/my-space"

  return (
    <div className="flex flex-col min-h-screen bg-white max-w-md mx-auto">
      {/* Status Bar */}
      <div className="flex justify-between items-center p-2 text-xs">
        <span>9:41</span>
        <div className="flex items-center gap-1">
          <span className="font-bold">•••</span>
          <span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M18 9.5C18 5.36 14.64 2 10.5 2C6.36 2 3 5.36 3 9.5C3 13.64 6.36 17 10.5 17C14.64 17 18 13.64 18 9.5Z"
                fill="black"
              />
              <path
                d="M10.5 20C9.67 20 9 20.67 9 21.5C9 22.33 9.67 23 10.5 23C11.33 23 12 22.33 12 21.5C12 20.67 11.33 20 10.5 20Z"
                fill="black"
              />
              <path
                d="M19.5 8C18.67 8 18 8.67 18 9.5C18 10.33 18.67 11 19.5 11C20.33 11 21 10.33 21 9.5C21 8.67 20.33 8 19.5 8Z"
                fill="black"
              />
            </svg>
          </span>
          <span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M1 9C1 7.89543 1.89543 7 3 7H21C22.1046 7 23 7.89543 23 9V20C23 21.1046 22.1046 22 21 22H3C1.89543 22 1 21.1046 1 20V9Z"
                fill="black"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M5 4C5 2.89543 5.89543 2 7 2H17C18.1046 2 19 2.89543 19 4V7H5V4Z"
                fill="black"
              />
            </svg>
          </span>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center p-4">
        <Link href="/dashboard" className="text-black">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>
        <h1 className="text-lg font-medium text-center flex-1">Notifications</h1>
      </div>

      {/* Search */}
      <div className="px-4 mb-4">
        <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-500 mr-2">
            <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <input type="text" placeholder="Search" className="bg-transparent border-none outline-none w-full text-sm" />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <Link href="/dashboard/notifications/school" className="flex-1">
          <div className={`flex flex-col items-center py-3 ${isSchoolActive ? 'border-b-2 border-black' : 'text-gray-500'}`}>
            <GraduationCap size={20} />
            <span className="text-xs font-medium mt-1">School</span>
          </div>
        </Link>
        <Link href="/dashboard/notifications/community" className="flex-1">
          <div className={`flex flex-col items-center py-3 ${isCommunityActive ? 'border-b-2 border-black' : 'text-gray-500'}`}>
            <Settings size={20} />
            <span className="text-xs font-medium mt-1">Community</span>
          </div>
        </Link>
        <Link href="/dashboard/notifications/my-space" className="flex-1">
          <div className={`flex flex-col items-center py-3 ${isMySpaceActive ? 'border-b-2 border-black' : 'text-gray-500'}`}>
            <User size={20} />
            <span className="text-xs font-medium mt-1">My Space</span>
          </div>
        </Link>
      </div>

      {/* Page content will be rendered here */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  )
}