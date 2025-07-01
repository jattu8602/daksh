"use client"

import { ArrowLeft, Settings, Search, Users, Phone } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

export default function ProfileView({ profileData, onBack }) {
  return (
    <div className="min-h-screen bg-white max-w-sm mx-auto">
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

      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <ArrowLeft className="w-6 h-6 cursor-pointer" onClick={onBack} />
        <h1 className="font-semibold">{profileData.name}</h1>
        <Settings className="w-6 h-6 text-gray-600" />
      </div>

      {/* Profile Info */}
      <div className="flex flex-col items-center p-6 space-y-4">
        <Avatar className="w-24 h-24">
          <AvatarImage src={profileData.avatar || "/placeholder.svg"} alt={profileData.name} />
          <AvatarFallback className="text-2xl">
            {profileData.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>

        <div className="text-center">
          <h2 className="text-xl font-semibold">{profileData.name}</h2>
          {profileData.info && (
            <div className="text-gray-600 text-sm mt-1">
              {profileData.info.subject && <p>{profileData.info.subject}</p>}
              {profileData.info.grade && <p>Grade {profileData.info.grade}</p>}
              {profileData.info.school && <p>{profileData.info.school}</p>}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <Button variant="outline" size="sm" className="rounded-full bg-transparent">
            <Phone className="w-4 h-4 mr-2" />
            Call
          </Button>
          <Button variant="outline" size="sm" className="rounded-full bg-transparent">
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>
          <Button variant="outline" size="sm" className="rounded-full bg-transparent">
            <Users className="w-4 h-4 mr-2" />
            Group
          </Button>
        </div>
      </div>

      {/* Group Members (if group profile) */}
      {profileData.type === "group" && profileData.members && (
        <div className="px-6">
          <h3 className="font-semibold mb-4">People</h3>
          <div className="space-y-3">
            {profileData.members.map((member) => (
              <div key={member.id} className="flex items-center space-x-3">
                <div className="relative">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                    <AvatarFallback>
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  {member.isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{member.name}</p>
                  <p className="text-sm text-gray-500">{member.isOnline ? "Live" : "Offline"}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
