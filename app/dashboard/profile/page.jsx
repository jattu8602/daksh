'use client'

import { useSelector } from 'react-redux'
import Profile from '../../components/dashboard/Profile'
import Settings from '../../components/dashboard/Settings'

export default function StudentDashboard() {
  const { user, loading } = useSelector((state) => state.auth)

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <Profile user={user} isLoading={loading || !user} />
        <Settings />
      </main>
    </div>
  )
}
