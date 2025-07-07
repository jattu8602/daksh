'use client'

import Image from 'next/image'
import { Play, MoreHorizontal } from 'lucide-react'

export default function AllContent() {
  const randomShots = [
    'Exploring Atoms',
    'Gravity Demo',
    'Robotics Lab',
    'Energy Conservation',
    'Photosynthesis Explained',
    'Rocket Launch Project',
    'Microscope Wonders',
    'DNA Structure',
    'Acid-Base Reaction',
    'Magnetism in Action',
    'The Water Cycle',
    'Newton’s Cradle',
    'Drone Test Flight',
    'VR Learning',
    'Volcano Model Eruption',
    'Chemistry Lab Setup',
    'Artificial Intelligence Demo',
    'Circuit Building',
    'Solar System Display',
    'Cloud Computing Workshop',
    'Bridge Strength Test',
    'DNA Extraction Lab',
    'Physics Pendulum',
    'Environmental Awareness Video',
    'Solar Cooker Test',
  ]

  const thumbnails = [
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=600&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&h=600&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=600&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=600&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1448375240586-882707db888b?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1f?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
  ]

  const generateRandomContent = (count = 50) => {
    const items = []
    for (let i = 0; i < count; i++) {
      const isShot = Math.random() < 0.4 // 40% chance for 'shot'
      const thumb = thumbnails[i % thumbnails.length]
      if (isShot) {
        const title = randomShots[i % randomShots.length]
        items.push({ type: 'shot', title, thumbnail: thumb })
      } else {
        items.push({ type: 'post', thumbnail: thumb })
      }
    }
    return items
  }

  const content = [
    // original few
    {
      type: 'shot',
      title: 'Cells in the blood',
      thumbnail:
        'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=600&fit=crop&crop=center',
    },
    {
      type: 'post',
      thumbnail:
        'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=400&fit=crop',
    },
    {
      type: 'shot',
      title: 'Science Fair 2023',
      thumbnail:
        'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&h=600&fit=crop&crop=center',
    },
    {
      type: 'post',
      thumbnail:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    },
    // generated batch
    ...generateRandomContent(50),
  ]

  return (
    <div className="grid grid-cols-3 auto-rows-[130px]">
      {content.map((item, index) => (
        <div
          key={index}
          className={`relative bg-white overflow-hidden shadow group ${
            item.type === 'shot' ? 'row-span-2' : 'row-span-1'
          }`}
        >
          <Image
            src={item.thumbnail || '/placeholder.svg'}
            alt={item.title || `Post ${index + 1}`}
            fill
            className="object-cover"
            unoptimized
          />

          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity" />

          {/* Icons */}
          {item.type === 'shot' ? (
            <>
              <div className="absolute top-2 left-2 z-10">
                <div className="w-8 h-8 bg-black/60 rounded-full flex items-center justify-center">
                  <Play className="w-4 h-4 text-white" />
                </div>
              </div>
              <p className="absolute bottom-2 left-2 text-sm font-semibold text-white z-10">
                {item.title}
              </p>
            </>
          ) : (
            <div className="absolute top-2 right-2 z-10">
              {/* <div className="w-6 h-6 bg-black/60 rounded-full flex items-center justify-center">
                <MoreHorizontal className="w-4 h-4 text-white" />
              </div> */}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
