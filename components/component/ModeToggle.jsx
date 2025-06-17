'use client'

import * as React from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

export function ModeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  if (!mounted) {
    return (
      <button className="focus:outline-none" disabled>
        <Sun size={24} />
      </button>
    )
  }

  return (
    <button onClick={toggleTheme} className="focus:outline-none pb-2">
      {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
    </button>
  )
}
