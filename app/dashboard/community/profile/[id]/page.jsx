"use client"

import { useParams, useRouter } from "next/navigation"
import ProfileView from "@/components/profile-view"
import { getProfileData } from "@/lib/dummy-data"

export default function ProfilePage() {
  const params = useParams()
  const router = useRouter()
  const profileId = params.id 

  const profileData = getProfileData(profileId)

  if (!profileData) {
    return <div>Profile not found</div>
  }

  return <ProfileView profileData={profileData} onBack={() => router.back()} />
}
