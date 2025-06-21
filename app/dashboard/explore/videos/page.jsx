import Image from 'next/image'
import { Play } from 'lucide-react'

export default function VideosContent() {
  const videos = [
    {
      id: 1,
      title: 'How Vaccines are made?',
      thumbnail:
        'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=600&fit=crop',
    },
    {
      id: 2,
      title: 'How Vaccines are made?',
      thumbnail:
        'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=600&fit=crop',
    },
    {
      id: 3,
      title: 'How Vaccines are made?',
      thumbnail:
        'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&h=600&fit=crop',
    },
    {
      id: 4,
      title: 'Lab Experiment',
      thumbnail:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop',
    },
    {
      id: 5,
      title: 'Lab Experiment',
      thumbnail:
        'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400&h=600&fit=crop',
    },
    {
      id: 6,
      title: 'How Vaccines are made?',
      thumbnail:
        'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=600&fit=crop',
    },
    {
      id: 7,
      title: 'Lab Experiment',
      thumbnail:
        'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=600&fit=crop',
    },
    {
      id: 8,
      title: 'Lab Experiment',
      thumbnail:
        'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=600&fit=crop',
    },
    {
      id: 9,
      title: 'Cells in the blood',
      thumbnail:
        'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=600&fit=crop',
    },
    {
      id: 10,
      title: 'How Doctors examine human cells',
      thumbnail:
        'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&h=600&fit=crop',
    },
  ]

  return (
    <div className="grid grid-cols-3 gap-1 px-4">
      {videos.map((video) => (
        <div
          key={video.id}
          className="aspect-[3/4] relative rounded-lg overflow-hidden"
        >
          <Image
            src={video.thumbnail || '/placeholder.svg'}
            alt={video.title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-20" />
          <div className="absolute top-2 left-2">
            <div className="w-8 h-8 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
              <Play className="w-4 h-4 text-white ml-0.5" />
            </div>
          </div>
          <div className="absolute bottom-2 left-2 right-2">
            <p className="text-white text-xs font-medium leading-tight">
              {video.title}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
