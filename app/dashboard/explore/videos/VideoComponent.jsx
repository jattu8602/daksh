'use client'

import Image from "next/image"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"


export default function VideoComponent({
  thumbnail = "/placeholder.svg?height=120&width=200",
  duration = "7:15",
  title = "Untitled Video",
  views = "0 views",
  timeAgo = "Just now",
  mentorPhoto = "/placeholder.svg?height=32&width=32",
  mentorName = "Unknown",
}) {
  return (
    <div className="flex gap-3 hover:bg-muted/50 rounded-lg transition-colors cursor-pointer">
      {/* Thumbnail with duration overlay */}
      <div className="relative flex-shrink-0">
        <Image
          src={thumbnail}
          alt={title}
          width={200}
          height={120}
          className="rounded-lg object-cover w-[200px] h-[120px]"
        />
        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded">
          {duration}
        </div>
      </div>

      {/* Video details */}
      <div className="flex-1 min-w-0">
        <h3 className="text-white font-medium text-sm leading-5 mb-1 line-clamp-2">
          {title}
        </h3>

        <div className="flex items-center gap-2 mb-1">
          <Avatar className="w-6 h-6">
            <AvatarImage src={mentorPhoto} alt={mentorName} />
            <AvatarFallback className="text-xs bg-gray-600 text-white">
              {mentorName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="text-gray-400 text-xs">{mentorName}</span>
        </div>

        <div className="text-gray-400 text-xs">
          {views} • {timeAgo}
        </div>
      </div>
    </div>
  )
}
