'use client'

import { SkeletonCard, SkeletonText } from '@/components/ui/loading'

const ProfileSkeleton = () => (
  <div className="rounded-lg bg-card p-6 shadow mb-8">
    <div className="flex items-center space-x-4 mb-6">
      <SkeletonCard className="w-24 h-24 rounded-full" />
      <div className="flex-1 space-y-2">
        <SkeletonCard className="h-7 rounded w-3/4" />
        <SkeletonCard className="h-5 rounded w-1/2" />
      </div>
    </div>
    <div className="space-y-3">
      <SkeletonCard className="h-5 rounded w-1/3" />
      <SkeletonCard className="h-5 rounded w-1/2" />
      <SkeletonCard className="h-5 rounded w-2/3" />
    </div>
  </div>
)

export default function Profile({ user, isLoading }) {
  if (isLoading) {
    return <ProfileSkeleton />
  }

  return (
    <div className="rounded-lg bg-card p-6 shadow mb-8">
      <div className="flex items-center space-x-4 mb-6">
        <div className="relative w-24 h-24">
          <img
            src={user.student?.profileImage || '/icons/girl.png'}
            alt={user.name}
            className="w-24 h-24 rounded-full object-cover border-2 border-border"
            loading="lazy"
            onError={(e) => {
              e.target.src = '/icons/girl.png'
            }}
          />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">{user.name}</h1>
          <p className="text-muted-foreground">@{user.username}</p>
        </div>
      </div>
      <div className="space-y-3 text-sm">
        {user.student && (
          <>
            <div>
              <span className="font-medium text-muted-foreground">
                Roll Number:
              </span>{' '}
              <span className="text-foreground">{user.student.rollNo}</span>
            </div>
            <div>
              <span className="font-medium text-muted-foreground">Class:</span>{' '}
              <span className="text-foreground">
                {user.student.class?.name || 'N/A'}
              </span>
            </div>
            <div>
              <span className="font-medium text-muted-foreground">School:</span>{' '}
              <span className="text-foreground">
                {user.student.class?.school?.name || 'N/A'}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
