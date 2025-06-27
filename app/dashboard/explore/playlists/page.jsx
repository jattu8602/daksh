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
      title: 'Ultimate JavaScript',
      thumbnail:
        'https://images.unsplash.com/photo-1581090700227-1e8a8f14b1e9?w=400&h=400&fit=crop',
      videoCount: 24,
      mentorPhoto: 'https://randomuser.me/api/portraits/men/45.jpg',
      mentorName: 'Kyle Cook',
    },
    {
      id: 4,
      title: 'Backend API Series',
      thumbnail:
        'https://images.unsplash.com/photo-1620051701841-b1e7b9f1fc77?w=400&h=400&fit=crop',
      videoCount: 10,
      mentorPhoto: 'https://randomuser.me/api/portraits/women/39.jpg',
      mentorName: 'Rhea Stone',
    },
    {
      id: 5,
      title: 'Machine Learning Kickoff',
      thumbnail:
        'https://images.unsplash.com/photo-1557683316-973673baf926?w=400&h=400&fit=crop',
      videoCount: 15,
      mentorPhoto: 'https://randomuser.me/api/portraits/men/78.jpg',
      mentorName: 'Dr. James Lee',
    },
  ]

  return (
    <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 px-1">
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
