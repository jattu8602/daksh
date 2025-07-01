'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export default function CallScreen({
  callData,
  status,
  onBack,
  onRequestAgain,
}) {
  const [countdown, setCountdown] = useState(10)

  useEffect(() => {
    if (status === 'requesting' && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown((prev) => prev - 1)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown, status])

  useEffect(() => {
    if (status === 'requesting') {
      setCountdown(10)
    }
  }, [status])

  return (
    <div className="h-screen bg-white dark:bg-black text-black dark:text-white max-w-sm mx-auto flex flex-col">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-white dark:bg-black px-4 py-3 border-b border-gray-200 dark:border-zinc-800 flex items-center gap-2">
        <button
          onClick={onBack}
          className="p-1 rounded hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-semibold">Call Request</h1>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-6 space-y-8">
        {status === 'requesting' ? (
          <>
            <div className="relative">
              <div className="w-32 h-32 rounded-full border-4 border-black dark:border-white flex items-center justify-center">
                <span className="text-4xl font-bold">{countdown}</span>
              </div>
            </div>

            <div className="text-center space-y-3">
              <h1 className="text-xl font-bold">Request Sent</h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Waiting for <strong>{callData.name}</strong> to respond...
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="w-64 h-48 bg-gray-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center relative">
              <div className="relative">
                <div className="w-16 h-16 bg-black rounded-full mb-4 relative">
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-white rounded-full border-2 border-black" />
                </div>
                <div className="w-20 h-12 bg-gray-800 rounded-sm relative">
                  <div className="w-18 h-10 bg-gray-200 absolute top-1 left-1 rounded-sm" />
                </div>
                <div className="absolute -top-8 -right-8 bg-gray-800 text-white px-2 py-1 rounded text-xs font-bold">
                  ERROR
                </div>
                <div className="absolute -left-8 top-4">
                  <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">!</span>
                  </div>
                </div>
                <div className="absolute -right-4 -top-2 text-gray-400 text-lg">
                  ?
                </div>
                <div className="absolute -right-6 top-2 text-gray-400 text-sm">
                  ?
                </div>
              </div>
            </div>

            <div className="text-center space-y-3">
              <h1 className="text-xl font-bold">Oops! No Response</h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {callData.name} didn't respond. You can try requesting again or
                open a support ticket.
              </p>
            </div>
          </>
        )}

        {/* Buttons */}
        <div className="w-full space-y-3">
          <Button
            onClick={onRequestAgain}
            className="w-full bg-black dark:bg-white dark:text-black text-white py-3 rounded-lg font-medium"
          >
            Request Again
          </Button>
          <Button
            variant="outline"
            className="w-full bg-transparent border border-gray-300 dark:border-gray-600 py-3 rounded-lg font-medium"
          >
            Open a Ticket
          </Button>
        </div>
      </div>
    </div>
  )
}
