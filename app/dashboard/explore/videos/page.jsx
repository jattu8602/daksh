'use client'

import Image from 'next/image'
import { Play } from 'lucide-react'

export default function VideosContent() {
  const videos = [
    {
      id: 1,
      title: 'Wonders of Nature',
      thumbnail:
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop',
    },
    {
      id: 2,
      title: 'Mountain Hike Documentary',
      thumbnail:
        'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=400&fit=crop',
    },
    {
      id: 3,
      title: 'Architectural Tour',
      thumbnail:
        'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=400&fit=crop',
    },
    {
      id: 4,
      title: 'City Timelapse',
      thumbnail:
        'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=400&h=400&fit=crop',
    },
    {
      id: 5,
      title: 'Cooking Masterclass',
      thumbnail:
        'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=400&fit=crop',
    },
    {
      id: 6,
      title: 'Street Food Stories',
      thumbnail:
        'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=400&fit=crop',
    },
    {
      id: 7,
      title: 'Tech Review 2025',
      thumbnail:
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=400&fit=crop',
    },
    {
      id: 8,
      title: 'Startup Pitch Day',
      thumbnail:
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=400&fit=crop',
    },
    {
      id: 9,
      title: 'Digital Artwork Process',
      thumbnail:
        'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=400&h=400&fit=crop',
    },
    {
      id: 10,
      title: 'Creative Design Reel',
      thumbnail:
        'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=400&h=400&fit=crop',
    },
    {
      id: 11,
      title: 'Human Expressions',
      thumbnail:
        'https://images.unsplash.com/photo-1494790108755-2616c9c0e8d3?w=400&h=400&fit=crop',
    },
    {
      id: 12,
      title: 'Wildlife in Africa',
      thumbnail:
        'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop',
    },
  ]


  return (
    <div className="grid grid-cols-3 gap-2 px-2 py-2">
      {videos.map((video) => (
        <div
          key={video.id}
          className="bg-white rounded-xl overflow-hidden shadow relative group"
        >
          <div className="relative h-60 w-full">
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
