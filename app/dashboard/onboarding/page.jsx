'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import Image from 'next/image'
import { Wifi, Battery, Signal, ArrowLeft } from 'lucide-react'

const interests = [
  'drawing',
  'science experiments',
  'coding',
  'music',
  'dance',
  'reading books',
  'sports',
  'chess',
  'painting',
  'space and astronomy',
  'crafts',
  'public speaking',
  'language learning',
  'theatre and drama',
]

export default function OnboardingInterests() {
  const router = useRouter()
  const { user } = useSelector((state) => state.auth)
  const [selectedInterests, setSelectedInterests] = useState([])
  const [loading, setLoading] = useState(false)

  // Handle browser back button
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      // Allow browser back navigation
      return undefined
    }

    const handlePopState = () => {
      // If user tries to go back, redirect to login
      router.replace('/')
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    window.addEventListener('popstate', handlePopState)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      window.removeEventListener('popstate', handlePopState)
    }
  }, [router])

  const toggleInterest = (interest, index) => {
    const interestKey = `${interest}-${index}`
    setSelectedInterests((prev) =>
      prev.includes(interestKey)
        ? prev.filter((item) => item !== interestKey)
        : [...prev, interestKey]
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedInterests.length) return
    setLoading(true)
    try {
      // Extract unique interests (remove duplicates and index suffixes)
      const uniqueInterests = [
        ...new Set(selectedInterests.map((item) => item.split('-')[0])),
      ]

      const res = await fetch('/api/onboarding/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ interests: uniqueInterests }),
      })
      const data = await res.json()
      if (data.success) {
        router.replace('/dashboard/home')
      } else {
        alert(data.error || 'Failed to save onboarding data')
      }
    } catch (err) {
      alert('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-screen bg-[#FFFFFF] flex flex-col overflow-hidden">
      {/* Mobile Frame */}
      <div
        className="max-w-sm mx-auto bg-white h-full relative overflow-hidden"
        style={{ width: '375px' }}
      >
        {/* Content */}
        <div className="px-6 pt-8 pb-6 flex flex-col h-full">
          {/* Title */}
          <h1 className="text-3xl font-bold text-black mb-8">
            Choose your interests
          </h1>

          {/* Interest Tags */}
          <div className="flex flex-wrap gap-3 mb-8">
            {interests.map((interest, index) => {
              const interestKey = `${interest}-${index}`
              const isSelected = selectedInterests.includes(interestKey)

              return (
                <button
                  key={interestKey}
                  onClick={() => toggleInterest(interest, index)}
                  className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors ${
                    isSelected
                      ? 'bg-black text-white border-black'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {interest}
                </button>
              )
            })}
          </div>

          {/* Continue Button */}
          <button
            onClick={handleSubmit}
            disabled={!selectedInterests.length || loading}
            className="w-full py-3 rounded-lg bg-black text-white font-semibold text-lg shadow-md transition-all duration-150 disabled:opacity-60 mb-6"
          >
            {loading ? 'Saving...' : 'Continue'}
          </button>

          {/* Illustration - Fixed positioning */}
          <div className="flex-1 relative">
            <div className="absolute bottom-0 left-0 w-full h-full">
              <Image
                src="https://res.cloudinary.com/doxmvuss9/image/upload/v1752980532/link-generator/zyj6uldc8jaevocvo7ca.jpg"
                alt="Onboarding Interests"
                fill
                className="object-contain object-bottom"
                sizes="(max-width: 375px) 100vw, 375px"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
