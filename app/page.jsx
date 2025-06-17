'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import QRScanner from './components/QRScanner'
import SplashScreen from './components/SplashScreen'
import {
  loginStart,
  loginSuccess,
  loginFailure,
} from './store/features/authSlice'
import { useForm } from 'react-hook-form'


import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Play,
  Users,
  BookOpen,
  Zap,
  Shield,
  Globe,
  CheckCircle,
} from 'lucide-react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import Link from 'next/link'

export default function StudentLogin() {
  const router = useRouter()
  const dispatch = useDispatch()
  const {
    isAuthenticated,
    loading,
    error: authError,
  } = useSelector((state) => state.auth)
  const [loginMethod, setLoginMethod] = useState('credentials')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [localError, setLocalError] = useState('')
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  // Check for existing session on page load
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('/api/auth/session', {
          credentials: 'include', // Important for cookies
        })
        const data = await response.json()

        if (data.success && data.user) {
          // User is already logged in
          dispatch(loginSuccess(data.user))
          router.replace('/dashboard/home')
        }
      } catch (error) {
        console.error('Session check error:', error)
      }
    }

    checkSession()
  }, [dispatch, router])

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/dashboard/home')
    }
  }, [isAuthenticated, router])

  const handleCredentialLogin = async (e) => {
    e.preventDefault()
    dispatch(loginStart())
    setLocalError('')

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
          role: 'STUDENT',
        }),
        credentials: 'include',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Login failed')
      }

      // Update Redux state with user data
      dispatch(loginSuccess(data.user))

      // Redirect to dashboard
      router.replace('/dashboard/home')
    } catch (error) {
      console.error('Login error:', error)
      setLocalError(error.message)
      dispatch(loginFailure(error.message))
    }
  }

  const handleQRScanSuccess = async (qrData) => {
    dispatch(loginStart())
    setLocalError('')

    try {
      const response = await fetch('/api/auth/qr-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: qrData.username,
          password: qrData.password,
        }),
        credentials: 'include',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'QR login failed')
      }

      if (data.success && data.user) {
        // Update Redux state with user data
        dispatch(loginSuccess(data.user))

        // Redirect to dashboard
        router.replace('/dashboard/home')
      } else {
        throw new Error('Invalid response from server')
      }
    } catch (error) {
      setLocalError(
        error.message || 'Failed to login with QR code. Please try again.'
      )
      dispatch(loginFailure(error.message))
    }
  }

  const handleQRScanError = (error) => {
    setLocalError(error)
    dispatch(loginFailure(error))
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
          <div className="text-xl font-semibold text-gray-700">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="hidden md:block">
        <div className="min-h-screen bg-[#F5F1ED]">
          <Header />

          {/* Hero Section */}
          <section className="py-20 relative overflow-hidden">
            <div className="container mx-auto px-4">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="animate-fade-in-up">
                  <Badge
                    variant="outline"
                    className="mb-6 text-[#8B4513] border-[#8B4513]/30 animate-bounce"
                  >
                    🚀 INSTAGRAM FOR STUDENTS
                  </Badge>
                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-[#8B4513] mb-6 leading-tight">
                    Learn & Grow
                    <br />
                    <span className="text-[#8B4513]/80 bg-gradient-to-r from-[#8B4513] to-[#8B4513]/60 bg-clip-text text-transparent">
                      The Cool Way
                    </span>
                  </h1>
                  <p className="text-xl text-[#8B4513]/70 mb-8 leading-relaxed">
                    Daksh transforms education through interactive reels, posts,
                    and highlights. Students just need a mobile device to access
                    engaging content with 24/7 mentor support. Join thousands of
                    schools already using our platform!
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 mb-8">
                    <Button
                      asChild
                      className="bg-[#8B4513] text-white hover:bg-[#8B4513]/90 hover:scale-105 rounded-full px-8 py-3 text-lg transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      <Link href="/contact">Register Your School</Link>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      className="border-[#8B4513] text-[#8B4513] hover:bg-[#8B4513]/10 hover:scale-105 rounded-full px-8 py-3 text-lg transition-all duration-300"
                    >
                      <Link href="/services">Explore Features</Link>
                    </Button>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-3 gap-4 pt-8 border-t border-[#8B4513]/20">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-[#8B4513]">
                        1000+
                      </div>
                      <div className="text-sm text-[#8B4513]/60">Schools</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-[#8B4513]">
                        50K+
                      </div>
                      <div className="text-sm text-[#8B4513]/60">Students</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-[#8B4513]">
                        24/7
                      </div>
                      <div className="text-sm text-[#8B4513]/60">Support</div>
                    </div>
                  </div>
                </div>

                {/* Mobile App Mockups */}
                <div className="relative animate-fade-in-right">
                  <div className="flex justify-center items-center space-x-4">
                    {/* Phone 1 - Home Feed */}
                    <div className="relative transform rotate-12 hover:rotate-6 transition-transform duration-500 hover:scale-105">
                      <div className="w-64 h-[500px] bg-black rounded-[2.5rem] p-2 shadow-2xl">
                        <div className="w-full h-full bg-white rounded-[2rem] overflow-hidden">
                          <div className="bg-[#8B4513] h-12 flex items-center justify-center relative">
                            <div className="w-32 h-1 bg-white/30 rounded-full"></div>
                            <div className="absolute right-4 text-white text-xs">
                              9:41
                            </div>
                          </div>
                          <div className="p-4 space-y-4">
                            {/* User Post */}
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-[#8B4513]/20 rounded-full flex items-center justify-center">
                                <span className="text-xs font-bold text-[#8B4513]">
                                  M
                                </span>
                              </div>
                              <div className="flex-1">
                                <div className="h-3 bg-[#8B4513]/20 rounded w-24 mb-1"></div>
                                <div className="h-2 bg-[#8B4513]/10 rounded w-16"></div>
                              </div>
                            </div>

                            {/* Video Content */}
                            <div className="h-48 bg-gradient-to-br from-[#8B4513]/20 to-[#8B4513]/10 rounded-lg flex items-center justify-center relative">
                              <Play className="w-12 h-12 text-[#8B4513]/50" />
                              <div className="absolute top-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                                Math Reel
                              </div>
                            </div>

                            {/* Interaction Buttons */}
                            <div className="flex justify-between items-center">
                              <div className="flex space-x-4">
                                <div className="w-6 h-6 bg-red-400 rounded flex items-center justify-center">
                                  <span className="text-white text-xs">♥</span>
                                </div>
                                <div className="w-6 h-6 bg-[#8B4513]/20 rounded"></div>
                                <div className="w-6 h-6 bg-[#8B4513]/20 rounded"></div>
                              </div>
                              <div className="w-6 h-6 bg-[#8B4513]/20 rounded"></div>
                            </div>
                          </div>

                          {/* Bottom Navigation */}
                          <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
                            <div className="flex justify-around">
                              <div className="w-6 h-6 bg-[#8B4513] rounded flex items-center justify-center">
                                <span className="text-white text-xs">🏠</span>
                              </div>
                              <div className="w-6 h-6 bg-[#8B4513]/30 rounded flex items-center justify-center">
                                <span className="text-[#8B4513] text-xs">
                                  🔍
                                </span>
                              </div>
                              <div className="w-6 h-6 bg-[#8B4513]/30 rounded flex items-center justify-center">
                                <span className="text-[#8B4513] text-xs">
                                  📚
                                </span>
                              </div>
                              <div className="w-6 h-6 bg-[#8B4513]/30 rounded flex items-center justify-center">
                                <span className="text-[#8B4513] text-xs">
                                  🎬
                                </span>
                              </div>
                              <div className="w-6 h-6 bg-[#8B4513]/30 rounded flex items-center justify-center">
                                <span className="text-[#8B4513] text-xs">
                                  👤
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Phone 2 - Reels */}
                    <div className="relative transform -rotate-6 hover:rotate-0 transition-transform duration-500 hover:scale-105">
                      <div className="w-64 h-[500px] bg-black rounded-[2.5rem] p-2 shadow-2xl">
                        <div className="w-full h-full bg-gradient-to-br from-[#8B4513]/10 to-[#8B4513]/5 rounded-[2rem] overflow-hidden">
                          <div className="bg-[#8B4513] h-12 flex items-center justify-center relative">
                            <div className="w-32 h-1 bg-white/30 rounded-full"></div>
                            <div className="absolute right-4 text-white text-xs">
                              9:41
                            </div>
                          </div>
                          <div className="h-full bg-gradient-to-b from-[#8B4513]/20 to-[#8B4513]/40 flex items-center justify-center relative">
                            <div className="text-center text-white">
                              <Zap className="w-16 h-16 mx-auto mb-4 animate-pulse" />
                              <p className="text-lg font-semibold">
                                Interactive Reels
                              </p>
                              <p className="text-sm opacity-80">
                                Physics Chapter 1
                              </p>
                            </div>

                            {/* Side Actions */}
                            <div className="absolute right-4 bottom-20 space-y-6">
                              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                                <span className="text-white">♥</span>
                              </div>
                              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                                <span className="text-white">💬</span>
                              </div>
                              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                                <span className="text-white">📤</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="py-20 bg-white/30">
            <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                <Badge
                  variant="outline"
                  className="mb-6 text-[#8B4513] border-[#8B4513]/30"
                >
                  PLATFORM FEATURES
                </Badge>
                <h2 className="text-4xl md:text-5xl font-bold text-[#8B4513] mb-6">
                  Why Schools Choose Daksh?
                </h2>
                <p className="text-xl text-[#8B4513]/70 max-w-3xl mx-auto">
                  Several schools are registering their students to Daksh and
                  working hard with us to provide students new era knowledge
                  through our innovative platform.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                  {
                    icon: Play,
                    title: 'Interactive Reels',
                    description:
                      'Students get involved and learn quickly through engaging video content, just like their favorite social media apps.',
                  },
                  {
                    icon: BookOpen,
                    title: 'Chapter-wise Content',
                    description:
                      'Books, voice notes, and organized content with familiar social media interface for easy student engagement.',
                  },
                  {
                    icon: Users,
                    title: '24/7 Mentors',
                    description:
                      'Dedicated mentors and content creators work continuously to provide better education and instant support.',
                  },
                  {
                    icon: Shield,
                    title: 'Safe Environment',
                    description:
                      'Harmful and 18+ content gets instant ban by our dedicated team, ensuring a safe learning environment.',
                  },
                  {
                    icon: Zap,
                    title: 'Smart AI & Games',
                    description:
                      "Daksh Smart AI and educational games make learning fun and personalized for every student's needs.",
                  },
                  {
                    icon: Globe,
                    title: 'Global Connection',
                    description:
                      'Connect with students globally while maintaining privacy with minimal student identity exposure.',
                  },
                ].map((feature, index) => (
                  <Card
                    key={index}
                    className="bg-white/50 rounded-3xl border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
                  >
                    <CardContent className="p-8 text-center">
                      <div className="w-16 h-16 bg-[#8B4513]/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-[#8B4513]/30 transition-colors duration-300">
                        <feature.icon className="w-8 h-8 text-[#8B4513]" />
                      </div>
                      <h3 className="text-xl font-bold text-[#8B4513] mb-4">
                        {feature.title}
                      </h3>
                      <p className="text-[#8B4513]/70">{feature.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* How It Works Section */}
          <section className="py-20">
            <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-[#8B4513] mb-6">
                  How Schools Can Register
                </h2>
                <p className="text-xl text-[#8B4513]/70 max-w-3xl mx-auto">
                  We'll be available 24/7 for your calls - Daksh will be at your
                  school as soon as you contact us
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8 mb-16">
                {[
                  {
                    step: '1',
                    title: 'Contact Us',
                    description:
                      "Reach out via email or mobile number. We're available 24/7 to assist you with the registration process.",
                    details: [
                      'Email or phone contact',
                      '24/7 availability',
                      'Immediate response',
                    ],
                  },
                  {
                    step: '2',
                    title: 'Provide Details',
                    description:
                      'Share minimal school details and student information in our provided Excel format.',
                    details: [
                      'School name & code',
                      'Class details',
                      'Student information',
                    ],
                  },
                  {
                    step: '3',
                    title: 'Get Started',
                    description:
                      'Receive digital & physical ID cards, plus login credentials for all students.',
                    details: [
                      'Digital ID cards',
                      'Physical ID cards',
                      'Login credentials',
                    ],
                  },
                ].map((step, index) => (
                  <Card
                    key={index}
                    className="bg-white/50 rounded-3xl border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    <CardContent className="p-8 text-center">
                      <div className="w-20 h-20 bg-[#8B4513] text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                        {step.step}
                      </div>
                      <h3 className="text-2xl font-bold text-[#8B4513] mb-4">
                        {step.title}
                      </h3>
                      <p className="text-[#8B4513]/70 text-lg mb-6">
                        {step.description}
                      </p>
                      <div className="space-y-2">
                        {step.details.map((detail, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-center space-x-2 text-[#8B4513]/60"
                          >
                            <CheckCircle className="w-4 h-4" />
                            <span className="text-sm">{detail}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-20 bg-gradient-to-br from-[#8B4513]/10 to-[#8B4513]/5">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-4xl md:text-5xl font-bold text-[#8B4513] mb-8">
                Ready to Transform Your School's Learning Experience?
              </h2>
              <p className="text-xl text-[#8B4513]/70 mb-12 max-w-3xl mx-auto">
                Join thousands of schools already using Daksh to provide their
                students with engaging, interactive, and safe educational
                content. Hurry up and tie up your school to Daksh!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  asChild
                  className="bg-[#8B4513] text-white hover:bg-[#8B4513]/90 hover:scale-105 rounded-full px-8 py-4 text-lg transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <Link href="/contact">Register Your School Now</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="border-[#8B4513] text-[#8B4513] hover:bg-[#8B4513]/10 hover:scale-105 rounded-full px-8 py-4 text-lg transition-all duration-300"
                >
                  <Link href="/services">Explore All Features</Link>
                </Button>
              </div>
            </div>
          </section>

          <Footer />

          <style jsx>{`
            @keyframes fade-in-up {
              from {
                opacity: 0;
                transform: translateY(30px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }

            @keyframes fade-in-right {
              from {
                opacity: 0;
                transform: translateX(30px);
              }
              to {
                opacity: 1;
                transform: translateX(0);
              }
            }

            .animate-fade-in-up {
              animation: fade-in-up 0.8s ease-out;
            }

            .animate-fade-in-right {
              animation: fade-in-right 0.8s ease-out 0.2s both;
            }
          `}</style>
        </div>
      </div>
      <div className="md:hidden">
        <SplashScreen />

        <div className=" min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Daksh
              </h1>
            </div>

            {/* Login Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
              {/* Tab Navigation */}
              <div className="bg-gray-50/50 p-1 m-6 rounded-xl">
                <div className="grid grid-cols-2 gap-1">
                  <button
                    onClick={() => setLoginMethod('credentials')}
                    className={`py-3 px-4 rounded-lg font-medium text-sm transition-all duration-200 ${
                      loginMethod === 'credentials'
                        ? 'bg-white shadow-sm text-indigo-600 border border-indigo-100'
                        : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
                    }`}
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      <span>Username</span>
                    </div>
                  </button>
                  <button
                    onClick={() => setLoginMethod('qr')}
                    className={`py-3 px-4 rounded-lg font-medium text-sm transition-all duration-200 ${
                      loginMethod === 'qr'
                        ? 'bg-white shadow-sm text-indigo-600 border border-indigo-100'
                        : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
                    }`}
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v1m6 11a9 9 0 11-18 0 9 9 0 0118 0zm-9 7v1m0-18v1m0 16v1"
                        />
                      </svg>
                      <span>QR Code</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {(localError || authError) && (
                <div className="mx-6 mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <svg
                      className="w-5 h-5 text-red-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="text-sm text-red-700">
                      {localError || authError}
                    </span>
                  </div>
                </div>
              )}

              {/* Login Content */}
              <div className="px-6 pb-6">
                {loginMethod === 'credentials' ? (
                  <form className="space-y-6" onSubmit={handleCredentialLogin}>
                    <div>
                      <label
                        htmlFor="username"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Username
                      </label>
                      <div className="relative">
                        <input
                          id="username"
                          name="username"
                          type="text"
                          autoComplete="username"
                          required
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                          placeholder="Enter your username"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                          <svg
                            className="w-5 h-5 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="password"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Password
                      </label>
                      <div className="relative">
                        <input
                          id="password"
                          name="password"
                          type={showPassword ? 'text' : 'password'}
                          autoComplete="current-password"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                          placeholder="Enter your password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 flex items-center pr-3 hover:bg-gray-100 rounded-r-lg transition-colors duration-200"
                        >
                          {showPassword ? (
                            <svg
                              className="w-5 h-5 text-gray-500 hover:text-gray-700"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                              />
                            </svg>
                          ) : (
                            <svg
                              className="w-5 h-5 text-gray-500 hover:text-gray-700"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                      {loading ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Signing in...</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center space-x-2">
                          <span>Sign In</span>
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                            />
                          </svg>
                        </div>
                      )}
                    </button>
                  </form>
                ) : (
                  <div className="text-center space-y-6">
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border-2 border-dashed border-gray-300">
                      <div className="max-w-sm mx-auto">
                        <QRScanner
                          onScanSuccess={handleQRScanSuccess}
                          onScanError={handleQRScanError}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-700">
                        Scan Your Student QR Code
                      </p>
                      <p className="text-xs text-gray-500">
                        Point your camera at the QR code to login instantly
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="text-center mt-6">
              <p className="text-xs text-gray-500">
                Secure student authentication system
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
