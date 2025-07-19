'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ThemeProvider } from '@/components/theme-provider'
import { ModeToggle } from '@/components/component/ModeToggle'

export default function AdminLogin() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      console.log('Attempting login with:', { email, password })

      // Make a real API call to authenticate
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()
      console.log('Login response:', data)

      if (!response.ok) {
        throw new Error(data.message || 'Authentication failed')
      }

      // Store user data in localStorage or sessionStorage for persistence
      sessionStorage.setItem('user', JSON.stringify(data.user))

      // Set a cookie for middleware auth check
      document.cookie = `admin_auth_token=${data.user.id}; path=/;`

      // If successful, redirect to dashboard
      router.push('/admin/dashboard')
    } catch (err) {
      console.error('Login error:', err)
      setError(err.message || 'Invalid email or password')
      setIsLoading(false)
    }
  }

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
              Daksh
            </h1>
            <h2 className="mt-6 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Admin Login
            </h2>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Sign in to access the admin dashboard
            </p>
          </div>

          <div className="mt-8 bg-white dark:bg-gray-800 p-6 shadow rounded-lg border border-gray-200 dark:border-gray-700">
            {error && (
              <div className="mb-4 bg-red-50 dark:bg-red-900/20 p-4 rounded text-red-600 dark:text-red-400 text-sm">
                {error}
              </div>
            )}

            <form className="space-y-6" onSubmit={handleLogin}>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex w-full justify-center rounded-md border border-transparent bg-black dark:bg-white py-2 px-4 text-sm font-medium text-white dark:text-black shadow-sm hover:bg-gray-800 dark:hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                >
                  {isLoading ? 'Signing in...' : 'Sign in as Admin'}
                </button>
              </div>
            </form>
          </div>

          <div className="mt-4 text-center text-sm">
            <Link
              href="/"
              className="font-medium text-black dark:text-white hover:text-gray-800 dark:hover:text-gray-300"
            >
              Back to student login
            </Link>
          </div>

          {/* Theme Toggle */}
          <div className="flex justify-center">
            <ModeToggle />
          </div>
        </div>
      </div>
    </ThemeProvider>
  )
}
