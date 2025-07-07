'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { useTheme } from 'next-themes'

export default function NotesLayout({ children }) {
  const pathname = usePathname()
  const [isMobile, setIsMobile] = useState(false)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const checkMobile = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)

      // Force mobile viewport for notes section
      if (!mobile) {
        // Add a class to force mobile styling
        document.body.classList.add('force-mobile-view')
      } else {
        document.body.classList.remove('force-mobile-view')
      }
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)

    return () => {
      window.removeEventListener('resize', checkMobile)
      document.body.classList.remove('force-mobile-view')
    }
  }, [])

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Force mobile container */}
      <div className="max-w-md mx-auto min-h-screen bg-background relative">
        {children}
      </div>

      {/* Mobile navigation bar for notes */}
      <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50 md:hidden">
        <div className="flex justify-around items-center h-12 max-w-md mx-auto">
          <div className="flex items-center justify-center p-2">
            <span className="text-sm font-medium text-foreground">Notes</span>
          </div>
        </div>
      </nav>

      {/* Add padding to account for mobile nav */}
      <div className="pb-16 md:hidden" />

      <style jsx global>{`
        @media (min-width: 768px) {
          .force-mobile-view {
            /* Force mobile-like behavior on desktop */
            overflow-x: hidden;
          }

          .force-mobile-view body {
            /* Prevent horizontal scroll on desktop */
            max-width: 100vw;
            overflow-x: hidden;
          }
        }
      `}</style>
    </div>
  )
}
