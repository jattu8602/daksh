'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { Home, Search, BookOpen, Clapperboard } from 'lucide-react' // Lucide icons
import { PageLoader } from '@/components/ui/loading'

export default function DashboardLayout({ children }) {
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(true)

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

  // Simulate initial loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 100) // Very short loading time for layout

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return <PageLoader message="Loading dashboard..." />
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 pb-16">{children}</main>
      {!shouldHideNav && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
          <div className="flex justify-around items-center h-13">
            {navItems.map((item) => {
              const isActive = pathname.includes(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex flex-col items-center justify-center space-y-1 p-2 transition-colors duration-200 ${
                    isActive
                      ? 'text-black font-semibold'
                      : 'text-gray-500 hover:text-gray-900'
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
                  src="/icons/girl.png"
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
  )
}
