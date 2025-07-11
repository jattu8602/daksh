'use client'

import { useState, useEffect, useContext } from 'react'
import { ArrowLeft, Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

import { useRouter } from 'next/navigation' // 👈 Import router
import { SearchContext } from '../layout'

export default function Component() {
  const { searchText } = useContext(SearchContext)
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (!searchText) {
      setResults([])
      return
    }
    setLoading(true)
    Promise.all([
      fetch(`/api/mentor/list?search=${encodeURIComponent(searchText)}&limit=10`).then(r => r.json()),
      fetch(`/api/students/list?search=${encodeURIComponent(searchText)}&limit=10`).then(r => r.json()),
    ]).then(([mentorData, studentData]) => {
      const mentors = (mentorData.mentors || []).map(m => ({
        id: `mentor-${m.id}`,
        name: m.name,
        username: m.username,
        avatar: m.profilePhoto || '/placeholder.svg?height=40&width=40',
        tag: 'mentor',
        tagColor: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      }))
      const students = (studentData.students || []).map(s => ({
        id: `student-${s.id}`,
        name: s.name,
        username: s.username,
        avatar: s.profileImage || '/placeholder.svg?height=40&width=40',
        tag: 'student',
        tagColor: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      }))
      setResults([...mentors, ...students])
    }).finally(() => setLoading(false))
  }, [searchText])

  const handleBack = () => {
    router.back()
  }

  return (
    <div className="bg-gray-50 dark:bg-black">
      <div className="px-4 pt-4 pb-2">
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9 border border-gray-300 rounded-lg bg-white hover:bg-gray-50"
          onClick={handleBack}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </div>
      {/* Search Results */}
      {searchText ? (
        <div className="px-4 py-2">
          {loading ? (
            <div className="text-center text-gray-500 py-8">Searching...</div>
          ) : results.length === 0 ? (
            <div className="text-center text-gray-400 py-8">No results found.</div>
          ) : (
            <div className="space-y-1">
              {results.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 py-3 px-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors rounded-lg cursor-pointer"
                  onClick={() => {
                    const id = item.id.replace(/^mentor-|^student-/, '');
                    router.push(`/dashboard/community/profile/${id}`);
                  }}
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
          )}
        </div>
      ) : null}
    </div>
  )
}
