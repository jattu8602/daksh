"use client"

import { Heart, MessageCircle, Share, Bookmark,Send, Home, Search, PlusSquare, Play, User } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import Image from "next/image"
import Stories from "@/components/component/Stories"
import Header from "@/components/component/Header"
import Posts from "@/components/component/Posts"
import { dummyPosts, followedUsersDummy } from './dummyDataFile'

export default function FeedScreen() {
  // Stories data - simplified without interfaces
  const [stories, setStories] = useState([
    {
      id: '1',
      username: 'justin',
      avatar: '/placeholder.png',
      hasStory:true,
      isWatched: false,
    },
   {
     id: '2',
     username: 'karenme',
     avatar: '/placeholder.png',
     hasStory: true,
     isWatched: true,
   },
   {
     id: '3',
     username: 'zackjohn',
     avatar: '/placeholder.png',
     hasStory: true,
     isWatched: false,
   },
   {
     id: '4',
     username: 'Starc',
     avatar: '/placeholder.png',
     hasStory: true,
     isWatched: true,
   },
   {
     id: '5',
     username: 'kiron_d',
     avatar: '/placeholder.png',
     hasStory: true,
     isWatched: false,
   },
   {
     id: '6',
     username: 'kiron_d',
     avatar: '/placeholder.png',
     hasStory: true,
     isWatched: false,
   },
 ])

  // Posts data - simplified without interfaces
  const [posts, setPosts] = useState([
    {
      id: "1",
      username: "sachin.sir_history",
      avatar: "/placeholder.svg?height=40&width=40",
      image: "/images/books-image.png",
      caption: "Books are the best friends",
      likes: 100,
      comments: 16,
      time: "30 minutes ago",
      hashtags: ["hardwork", "studymotivation"],
    },
  ])

  const [likedPosts, setLikedPosts] = useState([])
  const [savedPosts, setSavedPosts] = useState([])

  const toggleLike = (postId) => {
    if (likedPosts.includes(postId)) {
      setLikedPosts(likedPosts.filter((id) => id !== postId))
    } else {
      setLikedPosts([...likedPosts, postId])
    }
  }

  const toggleSave = (postId) => {
    if (savedPosts.includes(postId)) {
      setSavedPosts(savedPosts.filter((id) => id !== postId))
    } else {
      setSavedPosts([...savedPosts, postId])
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-white max-w-md mx-auto">
      <Header />
      <Stories stories={stories} likedPosts={likedPosts} />
      <Posts
        posts={dummyPosts}
        likedPosts={likedPosts}
        savedPosts={savedPosts}
        toggleLike={toggleLike}
        toggleSave={toggleSave}
        followedUsers={followedUsersDummy}
      />
    </div>
  )
}