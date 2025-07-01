"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"


export default function CallScreen({ callData, status, onBack, onRequestAgain }) {
  const [countdown, setCountdown] = useState(10)

  useEffect(() => {
    if (status === "requesting" && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown, status])

  useEffect(() => {
    if (status === "requesting") {
      setCountdown(10)
    }
  }, [status])

  if (status === "requesting") {
    return (
      <div className="min-h-screen bg-white max-w-sm mx-auto flex flex-col">
        {/* Status Bar */}
        <div className="flex justify-between items-center p-4 text-sm font-medium">
          <span>9:41</span>
          <div className="flex items-center gap-1">
            <div className="flex gap-1">
              <div className="w-1 h-3 bg-black rounded-full"></div>
              <div className="w-1 h-3 bg-black rounded-full"></div>
              <div className="w-1 h-3 bg-black rounded-full"></div>
              <div className="w-1 h-3 bg-gray-300 rounded-full"></div>
            </div>
            <svg className="w-6 h-4" viewBox="0 0 24 16" fill="none">
              <rect x="2" y="3" width="20" height="10" rx="2" stroke="black" strokeWidth="1" fill="none" />
              <path d="M22 6v4" stroke="black" strokeWidth="1" />
            </svg>
          </div>
        </div>

        {/* Request Sent Screen */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-8">
          {/* Circular Progress */}
          <div className="relative">
            <div className="w-32 h-32 rounded-full border-4 border-black flex items-center justify-center">
              <span className="text-4xl font-bold">{countdown}</span>
            </div>
          </div>

          <div className="text-center space-y-4">
            <h1 className="text-xl font-bold">Request Sent</h1>
            <p className="text-gray-600 text-sm px-4">
              {callData.name} didn't respond please try requesting again or open a support ticket.
            </p>
          </div>

          <div className="w-full space-y-3">
            <Button onClick={onRequestAgain} className="w-full bg-black text-white py-3 rounded-lg font-medium">
              Request Again
            </Button>
            <Button
              variant="outline"
              className="w-full bg-transparent border border-gray-300 py-3 rounded-lg font-medium"
            >
              Open a Ticket
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white max-w-sm mx-auto flex flex-col">
      {/* Status Bar */}
      <div className="flex justify-between items-center p-4 text-sm font-medium">
        <span>9:41</span>
        <div className="flex items-center gap-1">
          <div className="flex gap-1">
            <div className="w-1 h-3 bg-black rounded-full"></div>
            <div className="w-1 h-3 bg-black rounded-full"></div>
            <div className="w-1 h-3 bg-black rounded-full"></div>
            <div className="w-1 h-3 bg-gray-300 rounded-full"></div>
          </div>
          <svg className="w-6 h-4" viewBox="0 0 24 16" fill="none">
            <rect x="2" y="3" width="20" height="10" rx="2" stroke="black" strokeWidth="1" fill="none" />
            <path d="M22 6v4" stroke="black" strokeWidth="1" />
          </svg>
        </div>
      </div>

      {/* No Response Screen */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-8">
        {/* Error Illustration */}
        <div className="w-64 h-48 bg-gray-100 rounded-lg flex items-center justify-center relative">
          {/* Person with laptop illustration */}
          <div className="relative">
            {/* Person */}
            <div className="w-16 h-16 bg-black rounded-full mb-4 relative">
              {/* Head */}
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-white rounded-full border-2 border-black"></div>
            </div>

            {/* Laptop */}
            <div className="w-20 h-12 bg-gray-800 rounded-sm relative">
              <div className="w-18 h-10 bg-gray-200 rounded-sm absolute top-1 left-1"></div>
            </div>

            {/* Error speech bubble */}
            <div className="absolute -top-8 -right-8 bg-gray-800 text-white px-2 py-1 rounded text-xs font-bold">
              ERROR
            </div>

            {/* Warning icon */}
            <div className="absolute -left-8 top-4">
              <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">!</span>
              </div>
            </div>

            {/* Question marks */}
            <div className="absolute -right-4 -top-2 text-gray-400 text-lg">?</div>
            <div className="absolute -right-6 top-2 text-gray-400 text-sm">?</div>
          </div>
        </div>

        <div className="text-center space-y-4">
          <h1 className="text-xl font-bold">Oopps! No Response</h1>
          <p className="text-gray-600 text-sm px-4">
            {callData.name} didn't respond please try requesting again or open a support ticket.
          </p>
        </div>

        <div className="w-full space-y-3">
          <Button onClick={onRequestAgain} className="w-full bg-black text-white py-3 rounded-lg font-medium">
            Request Again
          </Button>
          <Button
            variant="outline"
            className="w-full bg-transparent border border-gray-300 py-3 rounded-lg font-medium"
          >
            Open a Ticket
          </Button>
        </div>
      </div>
    </div>
  )
}
