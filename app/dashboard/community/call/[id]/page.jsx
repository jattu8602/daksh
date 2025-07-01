'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import CallScreen from '@/components/call-screen'
import { getCallData } from '@/lib/dummy-data'

export default function CallPage() {
  const params = useParams()
  const router = useRouter()
  const callId = params.id
  const [callStatus, setCallStatus] =
    (useState < 'requesting') | ('no-response' > 'requesting')

  const callData = getCallData(callId)

  useEffect(() => {
    // Simulate call timeout after 10 seconds
    const timer = setTimeout(() => {
      setCallStatus('no-response')
    }, 10000)

    return () => clearTimeout(timer)
  }, [])

  if (!callData) {
    return <div>Call data not found</div>
  }

  return (
    <CallScreen
      callData={callData}
      status={callStatus}
      onBack={() => router.back()}
      onRequestAgain={() => setCallStatus('requesting')}
    />
  )
}
