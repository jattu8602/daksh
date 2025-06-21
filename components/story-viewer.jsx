"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Heart, Send, Play, Pause } from "lucide-react"


const stories = [
  { id: 1, image: "/placeholder.svg?height=600&width=400", user: "sachin.sir", duration: 5000 },
  { id: 2, image: "/placeholder.svg?height=600&width=400", user: "teacher.math", duration: 4000 },
  { id: 3, image: "/placeholder.svg?height=600&width=400", user: "study.group", duration: 6000 },
]

export default function StoryViewer({ onClose }) {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isPaused, setIsPaused] = useState(false)

  const currentStory = stories[currentStoryIndex]

  useEffect(() => {
    if (!isPlaying || isPaused) return

    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 100 / (currentStory.duration / 100)
        if (newProgress >= 100) {
          // Auto advance to next story
          if (currentStoryIndex < stories.length - 1) {
            setCurrentStoryIndex(currentStoryIndex + 1)
            return 0
          } else {
            onClose()
            return 100
          }
        }
        return newProgress
      })
    }, 100)

    return () => clearInterval(interval)
  }, [currentStoryIndex, currentStory.duration, isPlaying, isPaused, onClose])

  const handlePlayPause = () => {
    setIsPaused(!isPaused)
  }

  const handleNext = () => {
    if (currentStoryIndex < stories.length - 1) {
      setCurrentStoryIndex(currentStoryIndex + 1)
      setProgress(0)
    } else {
      onClose()
    }
  }

  const handlePrevious = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(currentStoryIndex - 1)
      setProgress(0)
    }
  }

  return (
    <div className="fixed inset-0 bg-black z-50">
      {/* Progress bars */}
      <div className="absolute top-4 left-4 right-4 flex gap-1 z-10">
        {stories.map((_, index) => (
          <div key={index} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-white transition-all duration-100 ease-linear"
              style={{
                width: index < currentStoryIndex ? "100%" : index === currentStoryIndex ? `${progress}%` : "0%",
              }}
            />
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="absolute top-12 left-4 right-4 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/20">
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500" />
            <span className="text-white font-medium">{currentStory.user}</span>
          </div>
        </div>

        <Button variant="ghost" size="icon" onClick={handlePlayPause} className="text-white hover:bg-white/20">
          {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
        </Button>
      </div>

      {/* Story content */}
      <div
        className="w-full h-full bg-cover bg-center relative"
        style={{ backgroundImage: `url(${currentStory.image})` }}
      >
        {/* Touch areas for navigation */}
        <div className="absolute inset-0 flex">
          <div className="flex-1" onClick={handlePrevious} />
          <div className="flex-1" onClick={handleNext} />
        </div>
      </div>

      {/* Bottom actions */}
      <div className="absolute bottom-4 left-4 right-4 flex items-center gap-3">
        <div className="flex-1 bg-white/20 rounded-full px-4 py-2">
          <input
            type="text"
            placeholder="Send message"
            className="w-full bg-transparent text-white placeholder-white/70 outline-none"
          />
        </div>
        <Button size="icon" className="bg-white/20 hover:bg-white/30 text-white">
          <Heart className="w-5 h-5" />
        </Button>
        <Button size="icon" className="bg-white/20 hover:bg-white/30 text-white">
          <Send className="w-5 h-5" />
        </Button>
      </div>
    </div>
  )
}
