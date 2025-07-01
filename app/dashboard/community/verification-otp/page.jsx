'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowLeft } from 'lucide-react' // Optional: use an icon

export default function VerificationOTP() {
  const router = useRouter()
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [isComplete, setIsComplete] = useState(false)
  const inputRefs = useRef([])

  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  useEffect(() => {
    const allFilled = otp.every((digit) => digit !== '')
    setIsComplete(allFilled)
  }, [otp])

  const handleOtpChange = (index, value) => {
    if (value.length > 1 || (value && !/^\d$/.test(value))) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleSubmit = () => {
    if (isComplete) {
      router.push('/dashboard/community/community')
    }
  }

  const handleResendCode = () => {
    setOtp(['', '', '', '', '', ''])
    inputRefs.current[0]?.focus()
  }

  return (
    <div className="fixed inset-0 dark:bg-black bg-white flex flex-col items-center justify-center p-6 max-w-sm mx-auto overflow-hidden">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="absolute top-4 left-4 flex items-center text-black dark:text-white text-sm font-medium"
      >
        <ArrowLeft className="mr-1 h-4 w-4" /> Back
      </button>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-2xl font-bold text-black dark:text-white">
            Verification Code
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed px-4">
            Enter the 6-digit verification code sent to your mobile number.
          </p>
        </div>

        <div className="space-y-6">
          {/* OTP Inputs */}
          <div className="flex gap-3 justify-center">
            {otp.map((digit, index) => (
              <Input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-12 text-center text-xl font-bold bg-white dark:bg-gray-800 text-black dark:text-white border border-gray-300 dark:border-gray-700 rounded-lg outline-none focus:ring-0 focus:outline-none focus:border-black dark:focus:border-white"
                maxLength={1}
              />
            ))}
          </div>

          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Didn't receive code?{' '}
            <button
              onClick={handleResendCode}
              className="text-gray-700 dark:text-gray-300 underline"
            >
              Resend Code
            </button>
          </p>
        </div>

        {isComplete && (
          <Button
            onClick={handleSubmit}
            className="w-full bg-black dark:bg-white dark:text-black text-white py-4 rounded-lg font-medium hover:bg-gray-900 transition"
          >
            Verify & Continue
          </Button>
        )}
      </div>
    </div>
  )
}
