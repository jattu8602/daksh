'use client'

import Image from "next/image"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { List } from "lucide-react"


export default function PlaylistComponent({
  thumbnail = "/placeholder.svg?height=120&width=200",
  videoCount = 25,
  title = "Space Exploration",
  mentorPhoto = "/placeholder.svg?height=32&width=32",
  mentorName = "Kurzgesagt",
}) {
  return (
    <div className="flex gap-3 hover:bg-muted/50 transition-colors cursor-pointer">
      {/* Thumbnail with video count overlay */}
      <div className="relative flex-shrink-0">
        <Image
          src={thumbnail}
          alt={title}
          width={200}
          height={120}
          className=" object-cover w-[200px] h-[120px]"
        />
        <div className="absolute inset-0 bg-black/20 rounded-lg" />
        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded flex items-center gap-1">
          <List className="w-3 h-3" />
          {videoCount}
        </div>
      </div>

      {/* Playlist details */}
      <div className="flex-1 min-w-0">
        <h3 className="text-gray-800 dark:text-white font-medium text-sm leading-5 mb-1 line-clamp-2">
          {title}
        </h3>

        <div className="flex items-center gap-2 mb-1">
          <Avatar className="w-6 h-6">
            <AvatarImage src={mentorPhoto} alt={mentorName} />
            <AvatarFallback className="text-xs bg-gray-600 text-gray-800 dark:text-white">
              {mentorName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="text-gray-800 dark:text-white text-xs">{mentorName}</span>
        </div>

      </div>
    </div>
  )
}
