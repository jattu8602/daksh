'use client'

import Image from 'next/image'
import VideoComponent from './VideoComponent' // Adjust the path based on your file structure

export default function VideosContent() {
  const videos = [
    {
      id: 1,
      title: 'Wonders of Nature',
      thumbnail:
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop',
      duration: '8:23',
      views: '1.2M views',
      timeAgo: '2 months ago',
      mentorPhoto: 'https://randomuser.me/api/portraits/men/45.jpg',
      mentorName: 'David Attenborough',
    },
    {
      id: 2,
      title: 'Mountain Hike Documentary',
      thumbnail:
        'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=400&fit=crop',
      duration: '12:10',
      views: '530K views',
      timeAgo: '1 year ago',
      mentorPhoto: 'https://randomuser.me/api/portraits/women/32.jpg',
      mentorName: 'Emily Rose',
    },
    {
      id: 3,
      title: 'Architectural Tour',
      thumbnail:
        'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=400&fit=crop',
      duration: '9:45',
      views: '856K views',
      timeAgo: '3 years ago',
      mentorPhoto: 'https://randomuser.me/api/portraits/men/11.jpg',
      mentorName: 'John Doe',
    },
    {
      id: 4,
      title: 'City Timelapse',
      thumbnail:
        'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=400&h=400&fit=crop',
      duration: '5:50',
      views: '2.3M views',
      timeAgo: '6 months ago',
      mentorPhoto: 'https://randomuser.me/api/portraits/men/22.jpg',
      mentorName: 'Alex Rider',
    },
    {
      id: 5,
      title: 'Cooking Masterclass',
      thumbnail:
        'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=400&fit=crop',
      duration: '14:02',
      views: '3.5M views',
      timeAgo: '1 week ago',
      mentorPhoto: 'https://randomuser.me/api/portraits/women/77.jpg',
      mentorName: 'Chef Priya',
    },
    // Add more if needed...
  ]

  return (
    <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 px-1">
      {videos.map((video) => (
        <VideoComponent
          key={video.id}
          thumbnail={video.thumbnail}
          duration={video.duration}
          title={video.title}
          views={video.views}
          timeAgo={video.timeAgo}
          mentorPhoto={video.mentorPhoto}
          mentorName={video.mentorName}
        />
      ))}
    </div>
  )
}
