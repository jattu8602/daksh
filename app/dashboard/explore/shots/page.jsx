'use client'

import Image from 'next/image'
import { Play } from 'lucide-react'

export default function ShotsContent() {
  const videos = [
    {
      id: 1,
      title: 'Cells in the blood',
      thumbnail:
        'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=600&fit=crop&crop=center',
    },
    {
      id: 2,
      title: 'Lab Experiment',
      thumbnail:
        'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=600&fit=crop&crop=center',
    },
    {
      id: 3,
      title: 'Science Fair 2023',
      thumbnail:
        'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&h=600&fit=crop&crop=center',
    },
    {
      id: 4,
      title: 'Microscopic World',
      thumbnail:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop&crop=center',
    },
    {
      id: 5,
      title: 'Classroom Chemistry',
      thumbnail:
        'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400&h=600&fit=crop&crop=center',
    },
    {
      id: 6,
      title: 'Physics in Motion',
      thumbnail:
        'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=600&fit=crop&crop=center',
    },
    {
      id: 7,
      title: 'Student Presentation',
      thumbnail:
        'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=600&fit=crop&crop=center',
    },
    {
      id: 8,
      title: 'DNA Extraction Demo',
      thumbnail:
        'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=600&fit=crop&crop=center',
    },
    {
      id: 9,
      title: 'Brain & Neural Activity',
      thumbnail:
        'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=600&fit=crop&crop=center',
    },
    {
      id: 10,
      title: 'Solar Energy Project',
      thumbnail:
        'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&h=600&fit=crop&crop=center',
    },
    {
      id: 11,
      title: 'Magnetism Experiment',
      thumbnail:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop&crop=center',
    },
    {
      id: 12,
      title: 'Understanding Gravity',
      thumbnail:
        'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400&h=600&fit=crop&crop=center',
    },
  ]

  return (
    <div className="grid grid-cols-3 gap-1">
      {videos.map((video) => (
        <div
          key={video.id}
          className="bg-white overflow-hidden shadow relative group"
        >
          <div className="relative h-66 w-full">
            <Image
              src={video.thumbnail || '/placeholder.svg'}
              alt={video.title}
              width={100}
              height={500}
              className="object-cover w-full h-full"
              unoptimized
            />
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute top-2 left-2 z-10">
              <div className="w-8 h-8 bg-black/60 rounded-full flex items-center justify-center">
                <Play className="w-4 h-4 text-white" />
              </div>
            </div>

            <p className="absolute bottom-2 left-2 text-sm font-semibold text-gray-800 leading-snug dark:text-white">
              {video.title}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
