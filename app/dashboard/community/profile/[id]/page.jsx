"use client"

import { useParams, useRouter } from "next/navigation"
import ProfileView from "@/components/profile-view"
import { useEffect, useState } from "react"

export default function ProfilePage() {
  const params = useParams()
  const router = useRouter()
  const profileId = params.id
  const [profileData, setProfileData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProfile() {
      setLoading(true)
      // Try student first
      let res = await fetch(`/api/students/${profileId}`)
      if (res.ok) {
        const data = await res.json()
        setProfileData({
          id: data.student.id,
          name: data.student.name,
          avatar: data.student.profileImage,
          type: 'student',
          info: {
            grade: data.student.class,
            username: data.student.username,
          },
        })
        setLoading(false)
        return
      }
      // Try mentor
      res = await fetch(`/api/mentor/${profileId}`)
      if (res.ok) {
        const data = await res.json()
        setProfileData({
          id: data.mentor.id,
          name: data.mentor.user?.name || data.mentor.name,
          avatar: data.mentor.profilePhoto,
          type: 'mentor',
          info: {
            subject: data.mentor.subject,
            username: data.mentor.user?.username || data.mentor.username,
          },
        })
        setLoading(false)
        return
      }
      setProfileData(null)
      setLoading(false)
    }
    if (profileId) fetchProfile()
  }, [profileId])

  if (loading) return <div>Loading profile...</div>
  if (!profileData) {
    return <div>Profile not found</div>
  }

  return <ProfileView profileData={profileData} onBack={() => router.back()} />
}
