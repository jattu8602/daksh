'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowLeft } from 'lucide-react'

export default function VerificationStart() {
  const router = useRouter()
  const [mobileNumber, setMobileNumber] = useState('')
  const [isValidNumber, setIsValidNumber] = useState(false)

  const handleMobileChange = (e) => {
    const value = e.target.value.replace(/\D/g, '')
    if (value.length <= 10) {
      setMobileNumber(value)
      setIsValidNumber(value.length === 10)
    }
  }

  const handleSendOTP = () => {
    if (isValidNumber) {
      router.push('/dashboard/community/verification-otp')
    }
  }

  return (
    <div className="fixed inset-0 z-50 dark:bg-black bg-white flex flex-col p-4 max-w-sm mx-auto overflow-hidden">
      {/* Back Button */}
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={() => router.back()}
          className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <ArrowLeft className="w-5 h-5 text-black dark:text-white" />
        </button>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Back
        </span>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center text-center gap-8">
        <div className="space-y-4">
          <h1 className="text-2xl font-bold text-black dark:text-white">
            Get Verified to Use
            <br />
            Community Feature..
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed px-4">
            Only verified users can send Direct Message requests to people that
            don't follow them. Enter your mobile number to continue.
          </p>
        </div>

        <div className="w-full space-y-4">
          <div className="space-y-2 text-left">
            <label
              htmlFor="mobile"
              className="text-lg font-medium text-gray-700 dark:text-gray-300"
            >
              Mobile Number
            </label>
            <Input
              id="mobile"
              type="tel"
              value={mobileNumber}
              onChange={handleMobileChange}
              placeholder="Enter 10-digit mobile number"
              className="w-full px-4 py-3 rounded-lg text-center text-lg tracking-wider dark:bg-gray-800 dark:text-white bg-white text-black border-none outline-none ring-0 focus:ring-0 focus:outline-none focus:border-none shadow-none"
            />
          </div>

          {isValidNumber && (
            <Button
              onClick={handleSendOTP}
              className="w-full bg-black dark:bg-white dark:text-black text-white py-4 rounded-lg font-medium hover:bg-gray-900 transition"
            >
              Send OTP
            </Button>
          )}

          <Button
            variant="outline"
            className="w-full bg-gray-100 dark:bg-gray-800 text-black dark:text-white py-4 rounded-lg font-medium border-0 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          >
            No thanks
          </Button>
        </div>
      </div>
    </div>
  )
}
