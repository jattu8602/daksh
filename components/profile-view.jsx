'use client'

import { ArrowLeft, Settings, Search, Users, Phone } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import FollowButton from '@/app/components/FollowButton';
import { useEffect, useState } from 'react';

export default function ProfileView({ profileData, onBack }) {
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);
  const [isFollowed, setIsFollowed] = useState(profileData.isFollowed || false);

  // Fetch followers/following count
  useEffect(() => {
    async function fetchCounts() {
      if (!profileData.id) return;
      try {
        const [followersRes, followingRes] = await Promise.all([
          fetch(`/api/followers/${profileData.id}`),
          fetch(`/api/following/${profileData.id}`),
        ]);
        const followersData = await followersRes.json();
        const followingData = await followingRes.json();
        setFollowers(followersData.followers?.length || 0);
        setFollowing(followingData.following?.length || 0);
      } catch {
        setFollowers(0);
        setFollowing(0);
      }
    }
    fetchCounts();
  }, [profileData.id]);

  // Handler to update counts on follow/unfollow
  const handleFollowChange = (nowFollowed) => {
    setIsFollowed(nowFollowed);
    setFollowers((prev) => prev + (nowFollowed ? 1 : -1));
  };

  return (
    <div className="h-screen flex flex-col bg-white dark:bg-black text-gray-900 dark:text-white transition-colors duration-300">
      {/* Sticky Header */}
      <div className="sticky top-0 z-20 bg-white dark:bg-black px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <ArrowLeft className="w-6 h-6 cursor-pointer" onClick={onBack} />
        <h1 className="text-lg font-semibold">{profileData.name}</h1>
        <Settings className="w-6 h-6 text-gray-600 dark:text-gray-400" />
      </div>

      {/* Sticky Profile Info */}
      <div className="sticky top-[56px] z-10 bg-white dark:bg-black px-4 py-4 ">
        <div className="flex flex-col items-center space-y-4">
          <Avatar className="w-24 h-24 border-4 border-gray-200 dark:border-zinc-800">
            <AvatarImage
              src={profileData.avatar || '/placeholder.svg'}
              alt={profileData.name}
            />
            <AvatarFallback className="text-2xl">
              {profileData.name
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </AvatarFallback>
          </Avatar>

          <div className="text-center space-y-1">
            <h2 className="text-xl font-bold">{profileData.name}</h2>
            <div className="flex justify-center gap-6 text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span><b>{followers}</b> Followers</span>
              <span><b>{following}</b> Following</span>
            </div>
            {profileData.info && (
              <div className="text-gray-600 dark:text-gray-400 text-sm">
                {profileData.info.subject && <p>{profileData.info.subject}</p>}
                {profileData.info.grade && (
                  <p>Grade {profileData.info.grade}</p>
                )}
                {profileData.info.school && <p>{profileData.info.school}</p>}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-3 mt-1">
            {/* Only show FollowButton for student/mentor profiles, not groups */}
            {['student', 'mentor'].includes(profileData.type) && (
              <FollowButton
                targetUserId={profileData.id}
                initialIsFollowed={isFollowed}
                onChange={handleFollowChange}
                size="sm"
                variant="outline"
              />
            )}
            <Button
              variant="outline"
              size="sm"
              className="rounded-full bg-transparent border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-zinc-800"
            >
              <Phone className="w-4 h-4 mr-2" />
              Call
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full bg-transparent border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-zinc-800"
            >
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full bg-transparent border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-zinc-800"
            >
              <Users className="w-4 h-4 mr-2" />
              Group
            </Button>
          </div>
        </div>
      </div>

      {/* Scrollable Group Members */}
      {profileData.type === 'group' && profileData.members && (
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          <h3 className="font-semibold text-lg">People</h3>
          {profileData.members.map((member) => (
            <div key={member.id} className="flex items-center space-x-3">
              <div className="relative">
                <Avatar className="w-10 h-10">
                  <AvatarImage
                    src={member.avatar || '/placeholder.svg'}
                    alt={member.name}
                  />
                  <AvatarFallback>
                    {member.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar>
                {member.isOnline && (
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-black"></div>
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium">{member.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {member.isOnline ? 'Live' : 'Offline'}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
