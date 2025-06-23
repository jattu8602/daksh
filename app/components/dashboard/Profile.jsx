'use client'

import { SkeletonCard, SkeletonText } from '@/components/ui/loading'
import { User, School, Users, Award, Mail, Phone } from 'lucide-react'

const ProfileSkeleton = () => (
  <div className="space-y-8">
    <div className="rounded-lg bg-card p-6 shadow">
      <div className="flex items-center space-x-6 mb-6">
        <SkeletonCard className="w-24 h-24 rounded-full" />
        <div className="flex-1 space-y-2">
          <SkeletonCard className="h-8 rounded w-3/4" />
          <SkeletonCard className="h-5 rounded w-1/2" />
        </div>
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="rounded-lg bg-card p-6 shadow space-y-4">
        <SkeletonCard className="h-6 w-1/3 rounded" />
        <SkeletonText count={3} />
      </div>
      <div className="rounded-lg bg-card p-6 shadow space-y-4">
        <SkeletonCard className="h-6 w-1/3 rounded" />
        <SkeletonText count={3} />
      </div>
    </div>
  </div>
)

const InfoItem = ({ icon, label, value }) => (
  <div className="flex items-center space-x-3">
    <div className="bg-muted p-2 rounded-full">{icon}</div>
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="font-semibold text-foreground">{value || 'N/A'}</p>
    </div>
  </div>
)

export default function Profile({ user, isLoading }) {
  if (isLoading) {
    return <ProfileSkeleton />
  }

  const student = user?.student
  const studentClass = student?.class
  const school = studentClass?.school

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <div className="rounded-xl bg-card p-6 shadow-lg">
        <div className="flex flex-col items-center sm:flex-row sm:items-center sm:space-x-6">
          <div className="relative w-28 h-28 mb-4 sm:mb-0">
            <img
              src={student?.profileImage || '/icons/girl.png'}
              alt={user.name}
              className="w-full h-full rounded-full object-cover aspect-square border-4 border-primary/20"
              loading="lazy"
              onError={(e) => {
                e.target.src = '/icons/girl.png'
              }}
            />
          </div>
          <div className="text-center sm:text-left">
            <h1 className="text-3xl font-bold text-foreground">{user.name}</h1>
            <p className="text-md text-muted-foreground">@{user.username}</p>
            <p className="text-sm text-muted-foreground mt-1">
              Student ID: {student?.id}
            </p>
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Class and Personal Details */}
        <div className="rounded-xl bg-card p-6 shadow-lg space-y-5">
          <h2 className="text-xl font-bold flex items-center mb-4">
            <Users className="mr-3 h-6 w-6 text-primary" />
            Class & Personal Details
          </h2>
          <InfoItem
            icon={<Award className="h-5 w-5 text-primary" />}
            label="Roll Number"
            value={student?.rollNo}
          />
          <InfoItem
            icon={<Users className="h-5 w-5 text-primary" />}
            label="Class"
            value={studentClass?.name}
          />
          <InfoItem
            icon={<User className="h-5 w-5 text-primary" />}
            label="Section"
            value={studentClass?.section}
          />
          <InfoItem
            icon={<User className="h-5 w-5 text-primary" />}
            label="Total Students in Class"
            value={studentClass?.totalStudents}
          />
          <div className="grid grid-cols-2 gap-4 pt-2">
            <InfoItem
              icon={<User className="h-5 w-5 text-primary" />}
              label="Boys"
              value={studentClass?.boys}
            />
            <InfoItem
              icon={<User className="h-5 w-5 text-primary" />}
              label="Girls"
              value={studentClass?.girls}
            />
          </div>
        </div>

        {/* School Details */}
        <div className="rounded-xl bg-card p-6 shadow-lg space-y-5">
          <h2 className="text-xl font-bold flex items-center mb-4">
            <School className="mr-3 h-6 w-6 text-primary" />
            School Information
          </h2>
          <InfoItem
            icon={<School className="h-5 w-5 text-primary" />}
            label="School Name"
            value={school?.name}
          />
          <InfoItem
            icon={<Award className="h-5 w-5 text-primary" />}
            label="School Code"
            value={school?.code}
          />
          <InfoItem
            icon={<Mail className="h-5 w-5 text-primary" />}
            label="Email"
            value={school?.email}
          />
          <InfoItem
            icon={<Phone className="h-5 w-5 text-primary" />}
            label="Phone"
            value={school?.phone}
          />
        </div>
      </div>
    </div>
  )
}
