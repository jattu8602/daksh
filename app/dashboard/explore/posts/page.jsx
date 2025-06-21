import Image from 'next/image'
import { MoreHorizontal } from 'lucide-react'

export default function PostsContent() {
  const postImages = [
    'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400&h=400&fit=crop',
  ]

  return (
    <div className="grid grid-cols-3 gap-1 px-4">
      {postImages.map((image, index) => (
        <div
          key={index}
          className="aspect-square relative rounded-lg overflow-hidden"
        >
          <Image
            src={image || '/placeholder.svg'}
            alt={`Biology post ${index + 1}`}
            fill
            className="object-cover"
          />
          <div className="absolute top-2 right-2">
            <div className="w-6 h-6 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
              <MoreHorizontal className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
