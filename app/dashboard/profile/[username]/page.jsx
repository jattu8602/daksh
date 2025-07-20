'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { useSelector } from 'react-redux'
import OtherStudentProfile from '../../../components/dashboard/OtherStudentProfile'
import MentorProfile from '../../../components/dashboard/MentorProfile'
import { SkeletonCard, SkeletonText } from '@/components/ui/loading'

export default function DynamicProfilePage() {
  const params = useParams()
  const { user } = useSelector((state) => state.auth)
  const [profileData, setProfileData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [profileType, setProfileType] = useState(null) // 'student' or 'mentor'

  // Temporary test user for debugging (remove this in production)
  const testUser = {
    id: 'test-user-id',
    name: 'Test User',
    username: 'testuser',
  }

  // Use test user if no real user is logged in (for testing only)
  const currentUser = user || testUser

  console.log('Profile page debug:', {
    username: params.username,
    currentUser: currentUser?.id,
    isLoggedIn: !!user,
    usingTestUser: !user,
  })

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true)
        const username = params.username

        console.log('Fetching profile for username:', username)

        // First try to fetch as student
        const studentResponse = await fetch(`/api/students/${username}`)
        console.log('Student response status:', studentResponse.status)

        if (studentResponse.ok) {
          const studentData = await studentResponse.json()
          console.log('Student data received:', studentData)
          setProfileData(studentData)
          setProfileType('student')
          return
        }

        // If not found as student, try as mentor
        const mentorResponse = await fetch(`/api/mentor/${username}`)
        console.log('Mentor response status:', mentorResponse.status)

        if (mentorResponse.ok) {
          const mentorData = await mentorResponse.json()
          console.log('Mentor data received:', mentorData)
          setProfileData(mentorData)
          setProfileType('mentor')
          return
        }

        // If neither found, set error state
        console.log('No profile found for username:', username)
        setProfileData(null)
        setProfileType(null)
      } catch (error) {
        console.error('Error fetching profile:', error)
        setProfileData(null)
        setProfileType(null)
      } finally {
        setLoading(false)
      }
    }

    if (params.username) {
      fetchProfile()
    }
  }, [params.username])

  if (loading) {
    return (
      <div className="max-w-md mx-auto bg-white dark:bg-gray-900 min-h-screen">
        <div className="sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between px-6 py-4">
            <SkeletonCard className="h-6 w-32" />
            <SkeletonCard className="w-9 h-9 rounded" />
          </div>
        </div>
        <div className="px-6 py-6">
          <div className="flex items-center gap-6 mb-6">
            <SkeletonCard className="w-24 h-24 rounded-full" />
            <div className="flex-1">
              <div className="grid grid-cols-3 gap-4 text-center">
                <SkeletonCard className="h-8 w-16" />
                <SkeletonCard className="h-8 w-16" />
                <SkeletonCard className="h-8 w-16" />
              </div>
            </div>
          </div>
          <SkeletonText count={5} />
        </div>
      </div>
    )
  }

  if (!profileData || !profileType) {
    return (
      <div className="max-w-md mx-auto bg-white dark:bg-gray-900 min-h-screen">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Profile Not Found
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              The user you're looking for doesn't exist.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {profileType === 'student' ? (
        <OtherStudentProfile
          studentData={profileData}
          currentUser={currentUser}
        />
      ) : (
        <MentorProfile mentorData={profileData} currentUser={currentUser} />
      )}
    </div>
  )
}
