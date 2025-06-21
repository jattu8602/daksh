'use client'

import { useState } from 'react'
import { ArrowLeft, Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

import { useRouter } from 'next/navigation' // 👈 Import router
export default function Component() {
  const [searchText, setSearchText] = useState('')
  const router = useRouter() // 👈 use the hook

  const handleBack = () => {
    router.back() // 👈 goes to previous page
  }

  const recentSearches = [
    'React components',
    'Mobile UI design',
    'JavaScript tutorials',
    'CSS animations',
  ]

  const historyItems = [
    {
      id: 1,
      name: 'Sarah Johnson',
      username: '@sarah_dev',
      avatar: '/placeholder.svg?height=40&width=40',
      tag: 'mentor',
      tagColor: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    },
    {
      id: 2,
      name: 'Alex Chen',
      username: '@alexchen',
      avatar: '/placeholder.svg?height=40&width=40',
      tag: 'student',
      tagColor:
        'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    },
    {
      id: 3,
      name: 'Daksh Patel',
      username: '@daksh_codes',
      avatar: '/placeholder.svg?height=40&width=40',
      tag: 'daksh',
      tagColor:
        'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    },
    {
      id: 4,
      name: 'Emma Wilson',
      username: '@emma_design',
      avatar: '/placeholder.svg?height=40&width=40',
      tag: 'mentor',
      tagColor: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    },
    {
      id: 5,
      name: 'Ryan Kumar',
      username: '@ryan_student',
      avatar: '/placeholder.svg?height=40&width=40',
      tag: 'student',
      tagColor:
        'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    },
  ]

  return (
    <div className=" bg-gray-50 dark:bg-black">
      {/* Recent Searches */}
      <div className="px-4 ">
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">
          Recent
        </h3>
        <div className="space-y-2">
          {recentSearches.map((search, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-2 px-3"
            >
              <div className="flex items-center gap-3">
                <Search className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {search}
                </span>
              </div>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <X className="h-3 w-3 text-gray-400 dark:text-gray-500" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* History */}
      <div className="px-4 py-2">
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">
          History
        </h3>
        <div className="space-y-1">
          {historyItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 py-3 px-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors rounded-lg"
            >
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={item.avatar || '/placeholder.svg'}
                  alt={item.name}
                />
                <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-500 text-white text-sm">
                  {item.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                  {item.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {item.username}
                </p>
              </div>
              <Badge
                className={`text-xs px-2 py-0.5 ${item.tagColor} border-0`}
              >
                {item.tag}
              </Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
