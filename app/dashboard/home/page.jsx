"use client"
import { Heart, MessageCircle, Share, Bookmark, Home, Search, PlusSquare, Play, User } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import Image from "next/image"

export default function FeedScreen() {
  // Stories data - simplified without interfaces
  const [stories, setStories] = useState([
    { id: "1", username: "Your Story", avatar: "/placeholder.svg?height=50&width=50", isMine: true, hasStory: false, isLive: false },
    { id: "2", username: "karenme", avatar: "/placeholder.svg?height=50&width=50", isLive: true, hasStory: true, isMine: false },
    { id: "3", username: "zackjohn", avatar: "/placeholder.svg?height=50&width=50", hasStory: true, isMine: false, isLive: false },
    { id: "4", username: "Starc", avatar: "/placeholder.svg?height=50&width=50", hasStory: true, isMine: false, isLive: false },
    { id: "5", username: "kiron_d", avatar: "/placeholder.svg?height=50&width=50", hasStory: true, isMine: false, isLive: false },
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

      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <h1 className="text-2xl font-bold">Daksh</h1>
        <div className="flex space-x-4">
          <Link href="/dashboard/notifications">
            <button className="focus:outline-none">
              <Heart size={24} />
            </button>
          </Link>

          <Link href="/dashboard/community">
            <button className="focus:outline-none">
              <MessageCircle size={24} />
            </button>
          </Link>
        </div>
      </div>

      {/* Stories */}
      <div className="px-4 pb-4">
        <div className="flex space-x-4 overflow-x-auto pb-2">
          {stories.map((story, index) => (
            <div key={story.id} className="flex flex-col items-center">
              <div className="relative">
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center ${
                    story.hasStory
                      ? "bg-gradient-to-tr from-yellow-500 to-pink-500 p-[2px]"
                      : story.isMine
                        ? "border-2 border-gray-200"
                        : ""
                  }`}
                >
                  <div className="bg-white rounded-full p-[2px] w-full h-full flex items-center justify-center">
                    <img
                      src={story.avatar || "/placeholder.svg"}
                      alt={story.username}
                      className="w-full h-full rounded-full object-cover"
                    />
                    {story.isMine && (
                      <div className="absolute bottom-0 right-0 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white">
                        <span className="text-white text-xs font-bold">+</span>
                      </div>
                    )}
                  </div>
                </div>
                {story.isLive && (
                  <div className="absolute -bottom-1 w-full flex justify-center">
                    <div className="bg-red-500 text-white text-[8px] font-bold px-2 py-0.5 rounded-full">LIVE</div>
                  </div>
                )}
              </div>
              <span className="text-xs mt-1 truncate w-16 text-center">{story.username}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Posts */}
      <div className="flex-1 overflow-auto">
        {posts.map((post, index) => (
          <div key={post.id} className="border-b border-gray-100 pb-4">
            {/* Post Header */}
            <div className="flex items-center p-4">
              <img src={post.avatar || "/placeholder.svg"} alt={post.username} className="w-8 h-8 rounded-full mr-3" />
              <span className="font-medium">{post.username}</span>
            </div>

            {/* Post Image */}
            <div className="relative">
              <Image
                src={post.image || "/placeholder.svg"}
                alt="Post"
                width={500}
                height={500}
                className="w-full aspect-square object-cover"
              />
              <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded-full">
                1/3
              </div>
            </div>

            {/* Post Actions */}
            <div className="flex justify-between items-center px-4 pt-4">
              <div className="flex space-x-4">
                <button
                  className="focus:outline-none"
                  onClick={() => toggleLike(post.id)}
                >
                  <Heart
                    size={24}
                    fill={likedPosts.includes(post.id) ? "red" : "none"}
                    color={likedPosts.includes(post.id) ? "red" : "black"}
                  />
                </button>
                <button className="focus:outline-none">
                  <MessageCircle size={24} />
                </button>
                <button className="focus:outline-none">
                  <Share size={24} />
                </button>
              </div>
              <button className="focus:outline-none" onClick={() => toggleSave(post.id)}>
                <Bookmark
                  size={24}
                  fill={savedPosts.includes(post.id) ? "black" : "none"}
                  color={savedPosts.includes(post.id) ? "black" : "black"}
                />
              </button>
            </div>

            {/* Post Info */}
            <div className="px-4 pt-2">
              <p className="font-medium">{post.likes} Likes</p>
              <p>
                <span className="font-medium">{post.username}</span> {post.caption}
              </p>
              <p className="text-blue-500">
                {post.hashtags.map((tag) => `#${tag} `)}
                <span className="text-blue-500 cursor-pointer">more</span>
              </p>
              <p className="text-gray-500 text-sm mt-1">View all {post.comments} comments</p>
              <p className="text-gray-400 text-xs mt-1">{post.time}</p>
            </div>

            {/* Comment Input */}
            <div className="flex items-center px-4 mt-2">
              <img src="/placeholder.svg?height=30&width=30" alt="Your avatar" className="w-7 h-7 rounded-full mr-3" />
              <input type="text" placeholder="Add a comment..." className="flex-1 text-sm border-none outline-none" />
              <div className="flex space-x-2">
                <span className="text-gray-400">❤️</span>
                <span className="text-gray-400">🙌</span>
                <span className="text-gray-400">😊</span>
              </div>
            </div>
          </div>
        ))}
      </div>


    </div>
  )
}