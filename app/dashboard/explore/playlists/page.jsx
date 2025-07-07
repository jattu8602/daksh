'use client'

import PlaylistComponent from './PlaylistComponent' // Adjust the import path based on your project structure

export default function PlaylistsContent() {
  const playlists = [
    {
      id: 1,
      title: 'Exploring Deep Space',
      thumbnail:
        'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400&h=400&fit=crop',
      videoCount: 12,
      mentorPhoto: 'https://randomuser.me/api/portraits/men/12.jpg',
      mentorName: 'Neil Tyson',
    },
    {
      id: 2,
      title: 'Frontend Mastery',
      thumbnail:
        'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=400&fit=crop',
      videoCount: 18,
      mentorPhoto: 'https://randomuser.me/api/portraits/women/25.jpg',
      mentorName: 'Sarah Teach',
    },
    {
      id: 3,
      title: 'Exploring Deep Space',
      thumbnail:
        'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400&h=400&fit=crop',
      videoCount: 12,
      mentorPhoto: 'https://randomuser.me/api/portraits/men/12.jpg',
      mentorName: 'Neil Tyson',
    },
    {
      id: 4,
      title: 'Frontend Mastery',
      thumbnail:
        'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=400&fit=crop',
      videoCount: 18,
      mentorPhoto: 'https://randomuser.me/api/portraits/women/25.jpg',
      mentorName: 'Sarah Teach',
    },
    {
      id: 5,
      title: 'Exploring Deep Space',
      thumbnail:
        'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400&h=400&fit=crop',
      videoCount: 12,
      mentorPhoto: 'https://randomuser.me/api/portraits/men/12.jpg',
      mentorName: 'Neil Tyson',
    },
    {
      id: 6,
      title: 'Frontend Mastery',
      thumbnail:
        'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=400&fit=crop',
      videoCount: 18,
      mentorPhoto: 'https://randomuser.me/api/portraits/women/25.jpg',
      mentorName: 'Sarah Teach',
    },
  ]

  return (
    <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-1">
      {playlists.map((playlist) => (
        <PlaylistComponent
          key={playlist.id}
          thumbnail={playlist.thumbnail}
          videoCount={playlist.videoCount}
          title={playlist.title}
          mentorPhoto={playlist.mentorPhoto}
          mentorName={playlist.mentorName}
        />
      ))}
    </div>
  )
}
