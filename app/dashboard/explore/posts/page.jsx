import Image from 'next/image'
import { MoreHorizontal } from 'lucide-react'

export default function PostsContent() {
  const postImages = [
    // Nature & Landscapes
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop',

    // Urban & Architecture
    'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=400&h=400&fit=crop',

    // Food & Lifestyle
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=400&fit=crop',

    'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1493770348161-369560ae357d?w=400&h=400&fit=crop',

    // Technology & Business
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=400&fit=crop',



    // Abstract & Artistic
    'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop',

    // People & Portraits
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',

    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',

    // Travel & Adventure
    'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=400&fit=crop',

    // Animals & Wildlife
    'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=400&h=400&fit=crop',

    // Sports & Fitness
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=400&fit=crop',
    // Nature & Landscapes
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop',

    // Urban & Architecture
    'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=400&h=400&fit=crop',

    // Food & Lifestyle
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=400&fit=crop',

    'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1493770348161-369560ae357d?w=400&h=400&fit=crop',

    // Technology & Business
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=400&fit=crop',



    // Abstract & Artistic
    'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop',

    // People & Portraits
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',

    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',

    // Travel & Adventure
    'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=400&fit=crop',

    // Animals & Wildlife
    'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=400&h=400&fit=crop',

    // Sports & Fitness
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=400&fit=crop',
    // Nature & Landscapes
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop',

    // Urban & Architecture
    'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=400&h=400&fit=crop',

    // Food & Lifestyle
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=400&fit=crop',

    'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1493770348161-369560ae357d?w=400&h=400&fit=crop',

    // Technology & Business
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=400&fit=crop',



    // Abstract & Artistic
    'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop',

    // People & Portraits
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',

    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',

    // Travel & Adventure
    'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=400&fit=crop',

    // Animals & Wildlife
    'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=400&h=400&fit=crop',

    // Sports & Fitness
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=400&fit=crop',
  ]

  return (
    <div className="grid grid-cols-3 gap-1 px-1">
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
          {/* <div className="absolute top-2 right-2">
            <div className="w-6 h-6 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
              <MoreHorizontal className="w-4 h-4 text-white" />
            </div>
          </div> */}
        </div>
      ))}
    </div>
  )
}
