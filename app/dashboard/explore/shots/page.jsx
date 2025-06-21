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
      title: 'How Doctors examine human cells',
      thumbnail:
        'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&h=600&fit=crop&crop=center',
    },
    {
      id: 4,
      title: 'How Vaccines are made?',
      thumbnail:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop&crop=center',
    },
    {
      id: 5,
      title: 'Plant cells under microscope',
      thumbnail:
        'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400&h=600&fit=crop&crop=center',
    },
    {
      id: 6,
      title: 'DNA Research',
      thumbnail:
        'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=600&fit=crop&crop=center',
    },
    {
      id: 7,
      title: 'Medical Testing Process',
      thumbnail:
        'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=600&fit=crop&crop=center',
    },
    {
      id: 8,
      title: 'Chemical Analysis',
      thumbnail:
        'https://images.unsplash.com/photo-1518152006812-edab29b069ac?w=400&h=600&fit=crop&crop=center',
    },
    {
      id: 9,
      title: 'Microscopic World',
      thumbnail:
        'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=400&h=600&fit=crop&crop=center',
    },
    {
      id: 10,
      title: 'Laboratory Equipment',
      thumbnail:
        'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=400&h=600&fit=crop&crop=center',
    },
    {
      id: 11,
      title: 'Petri Dish Cultures',
      thumbnail:
        'https://images.unsplash.com/photo-1628595351029-c2bf17511435?w=400&h=600&fit=crop&crop=center',
    },
    {
      id: 12,
      title: 'Medical Research',
      thumbnail:
        'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&h=600&fit=crop&crop=center',
    },
    {
      id: 13,
      title: 'Virus Structure Study',
      thumbnail:
        'https://images.unsplash.com/photo-1584362917165-526a968579e8?w=400&h=600&fit=crop&crop=center',
    },
    {
      id: 14,
      title: 'Pharmaceutical Development',
      thumbnail:
        'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400&h=600&fit=crop&crop=center',
    },
    {
      id: 15,
      title: 'Molecular Biology',
      thumbnail:
        'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=600&fit=crop&crop=center',
    },
    {
      id: 16,
      title: 'Lab Safety Protocols',
      thumbnail:
        'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400&h=600&fit=crop&crop=center',
    },
    {
      id: 17,
      title: 'Genetic Engineering',
      thumbnail:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop&crop=center',
    },
    {
      id: 18,
      title: 'Cell Division Process',
      thumbnail:
        'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400&h=600&fit=crop&crop=center',
    },
  ]

  return (
    <div className="grid grid-cols-3 gap-1 px-4">
      {videos.map((video) => (
        <div
          key={video.id}
          className="aspect-[3/4] relative rounded-lg overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-200"
        >
          <Image
            src={video.thumbnail || '/placeholder.svg'}
            alt={video.title}
            width={400}
            height={600}
            className="object-cover w-full h-full"
            unoptimized
          />
          <div className="absolute inset-0 bg-black bg-opacity-20" />
          <div className="absolute top-2 left-2">
            <div className="w-8 h-8 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
              <Play className="w-4 h-4 text-white ml-0.5" />
            </div>
          </div>
          <div className="absolute bottom-2 left-2 right-2">
            <p className="text-white text-xs font-medium leading-tight drop-shadow-lg">
              {video.title}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
