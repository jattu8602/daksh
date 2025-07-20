'use client'

import { useSelector } from 'react-redux'
import MyProfile from '../../components/dashboard/MyProfile'

export default function StudentDashboard() {
  const { user, loading } = useSelector((state) => state.auth)

  return (
    <div className="min-h-screen bg-background text-foreground">
      <MyProfile user={user} isLoading={loading || !user} />
    </div>
  )
}
