'use client'

import { useState, useEffect, useCallback } from 'react'
import { ArrowLeft, Search, X, UserPlus, Check } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSelector } from 'react-redux'

export default function Component() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useSelector((state) => state.auth)
  const [searchText, setSearchText] = useState('')
  const [recentSearches, setRecentSearches] = useState([])
  const [suggestedMentors, setSuggestedMentors] = useState([])
  const [searchResults, setSearchResults] = useState(null)
  const [isSearching, setIsSearching] = useState(false)
  const [loadingMentors, setLoadingMentors] = useState(true)
  const [followingStates, setFollowingStates] = useState({})

  // Initialize search text from URL parameters
  useEffect(() => {
    const urlSearch = searchParams.get('search')
    if (urlSearch !== null) {
      setSearchText(urlSearch)
    } else {
      // Clear search results when no search parameter
      setSearchText('')
      setSearchResults(null)
    }
  }, [searchParams])

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setRecentSearches(parsed.slice(0, 4)) // Max 4 items
      } catch (error) {
        console.error('Error parsing recent searches:', error)
      }
    }
  }, [])

  // Load suggested mentors
  useEffect(() => {
    const fetchMentors = async () => {
      try {
        setLoadingMentors(true)
        const response = await fetch('/api/mentor/suggestions?limit=10')
        const data = await response.json()

        if (data.success) {
          setSuggestedMentors(data.mentors)

          // Check follow status for each mentor if user is logged in
          if (user && data.mentors.length > 0) {
            await checkFollowStatusForMentors(data.mentors)
          }
        } else {
          console.error('Failed to fetch mentors:', data.error)
        }
      } catch (error) {
        console.error('Error fetching mentors:', error)
      } finally {
        setLoadingMentors(false)
      }
    }

    fetchMentors()
  }, [user])

  // Check follow status for mentors
  const checkFollowStatusForMentors = async (mentors) => {
    if (!user) return

    console.log(
      'Checking follow status for user:',
      user.id,
      'User object:',
      user
    )

    try {
      const followChecks = mentors.map(async (mentor) => {
        try {
          const response = await fetch(
            `/api/follow?followerId=${user.id}&followingId=${mentor.id}`
          )
          const data = await response.json()

          if (data.success) {
            return { mentorId: mentor.id, following: data.following }
          } else {
            console.error(
              `Follow check failed for mentor ${mentor.id}:`,
              data.error
            )
            return { mentorId: mentor.id, following: false }
          }
        } catch (error) {
          console.error(
            `Error checking follow status for mentor ${mentor.id}:`,
            error
          )
          return { mentorId: mentor.id, following: false }
        }
      })

      const results = await Promise.all(followChecks)

      // Update follow states
      const newFollowStates = {}
      results.forEach((result) => {
        newFollowStates[result.mentorId] = result.following
      })

      setFollowingStates((prev) => ({
        ...prev,
        ...newFollowStates,
      }))
    } catch (error) {
      console.error('Error checking follow statuses:', error)
    }
  }

  // Real-time search functionality with debouncing
  const searchUsers = useCallback(
    async (query) => {
      if (!query.trim()) {
        setSearchResults(null)
        return
      }

      setIsSearching(true)
      try {
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(query)}&limit=20`
        )
        const data = await response.json()

        if (data.success) {
          setSearchResults(data)

          // Check follow status for all users in search results
          if (user && (data.students.length > 0 || data.mentors.length > 0)) {
            await checkFollowStatusForUsers([...data.students, ...data.mentors])
          }

          // Add to recent searches only if it's a meaningful search
          if (query.trim().length > 2) {
            addToRecentSearches(query)
          }
        }
      } catch (error) {
        console.error('Search error:', error)
        setSearchResults({ students: [], mentors: [], total: 0 })
      } finally {
        setIsSearching(false)
      }
    },
    [user]
  )

  // Check follow status for users (both students and mentors)
  const checkFollowStatusForUsers = async (users) => {
    if (!user) return

    console.log('Checking follow status for users:', user.id)

    try {
      const followChecks = users.map(async (userItem) => {
        try {
          const response = await fetch(
            `/api/follow?followerId=${user.id}&followingId=${userItem.id}`
          )
          const data = await response.json()

          if (data.success) {
            return { userId: userItem.id, following: data.following }
          } else {
            console.error(
              `Follow check failed for user ${userItem.id}:`,
              data.error
            )
            return { userId: userItem.id, following: false }
          }
        } catch (error) {
          console.error(
            `Error checking follow status for user ${userItem.id}:`,
            error
          )
          return { userId: userItem.id, following: false }
        }
      })

      const results = await Promise.all(followChecks)

      // Update follow states
      const newFollowStates = {}
      results.forEach((result) => {
        newFollowStates[result.userId] = result.following
      })

      setFollowingStates((prev) => ({
        ...prev,
        ...newFollowStates,
      }))
    } catch (error) {
      console.error('Error checking follow statuses:', error)
    }
  }

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchUsers(searchText)
    }, 300) // 300ms debounce

    return () => clearTimeout(timeoutId)
  }, [searchText, searchUsers])

  const addToRecentSearches = (search) => {
    if (!search.trim()) return

    const updated = [
      search,
      ...recentSearches.filter((s) => s !== search),
    ].slice(0, 4)
    setRecentSearches(updated)
    localStorage.setItem('recentSearches', JSON.stringify(updated))
  }

  const removeFromRecentSearches = (searchToRemove) => {
    const updated = recentSearches.filter((s) => s !== searchToRemove)
    setRecentSearches(updated)
    localStorage.setItem('recentSearches', JSON.stringify(updated))
  }

  const handleBack = () => {
    router.back()
  }

  const handleUserClick = (username) => {
    router.push(`/dashboard/profile/${username}`)
  }

  const handleFollow = async (userId, username) => {
    if (!user) {
      // Handle not logged in state
      console.log('User not logged in')
      return
    }

    console.log('Attempting to follow/unfollow:', {
      userId,
      username,
      currentUserId: user.id,
    })

    try {
      const response = await fetch('/api/follow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          followerId: user.id,
          followingId: userId,
        }),
      })

      const data = await response.json()

      if (data.success) {
        // Update following state
        setFollowingStates((prev) => ({
          ...prev,
          [userId]: data.following,
        }))

        console.log(
          `Successfully ${data.following ? 'followed' : 'unfollowed'} user ${username}`
        )
      } else {
        console.error('Follow operation failed:', data.error)
      }
    } catch (error) {
      console.error('Follow error:', error)
    }
  }

  const renderUserItem = (user, type) => {
    const isFollowing = followingStates[user.id] || false

    return (
      <div
        key={`${type}-${user.id}`}
        className="flex items-center gap-3 py-3 px-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors rounded-lg cursor-pointer"
        onClick={() => handleUserClick(user.username)}
      >
        <Avatar
          className={`h-10 w-10 ${type === 'mentor' ? 'ring-2 ring-pink-400' : ''}`}
        >
          <AvatarImage
            src={user.profileImage || '/placeholder.svg'}
            alt={user.name}
          />
          <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-500 text-white text-sm">
            {user.name
              .split(' ')
              .map((n) => n[0])
              .join('')}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
            {user.name}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
            @{user.username}
          </p>
          {type === 'student' && (
            <p className="text-xs text-gray-400 dark:text-gray-500 truncate">
              {user.class} • {user.school}
            </p>
          )}
          {type === 'mentor' && user.bio && (
            <p className="text-xs text-gray-400 dark:text-gray-500 truncate">
              {user.bio}
            </p>
          )}
        </div>

        <Button
          size="sm"
          variant={isFollowing ? 'secondary' : 'outline'}
          className={`text-xs px-3 py-1 ${
            isFollowing
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              : ''
          }`}
          onClick={(e) => {
            e.stopPropagation()
            handleFollow(user.id, user.username)
          }}
        >
          {isFollowing ? (
            <>
              <Check className="h-3 w-3 mr-1" />
              Following
            </>
          ) : (
            <>
              <UserPlus className="h-3 w-3 mr-1" />
              Follow
            </>
          )}
        </Button>
      </div>
    )
  }

  // Check if we're in neutral state (no search text and no search results)
  const isNeutralState = !searchText && !searchResults

  return (
    <div className="bg-gray-50 dark:bg-black min-h-screen">
      {/* Search Results */}
      {searchText && (
        <div className="px-4 py-4">
          <div className="flex items-center gap-2 mb-4">
            <Search className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Search results for "{searchText}"
            </span>
          </div>

          {isSearching ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Searching...
              </p>
            </div>
          ) : searchResults ? (
            <div className="space-y-1">
              {searchResults.total === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400">
                    No users found for "{searchText}"
                  </p>
                </div>
              ) : (
                <>
                  {searchResults.students.map((student) =>
                    renderUserItem(student, 'student')
                  )}
                  {searchResults.mentors.map((mentor) =>
                    renderUserItem(mentor, 'mentor')
                  )}
                </>
              )}
            </div>
          ) : null}
        </div>
      )}

      {/* Recent Searches */}
      {isNeutralState && recentSearches.length > 0 && (
        <div className="px-4 py-4">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">
            Recent
          </h3>
          <div className="space-y-2">
            {recentSearches.map((search, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-2 px-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors rounded-lg cursor-pointer"
                onClick={() => setSearchText(search)}
              >
                <div className="flex items-center gap-3">
                  <Search className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {search}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={(e) => {
                    e.stopPropagation()
                    removeFromRecentSearches(search)
                  }}
                >
                  <X className="h-3 w-3 text-gray-400 dark:text-gray-500" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Suggested Mentors */}
      {isNeutralState && (
        <div className="px-4 py-4">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">
            Suggested for you
          </h3>

          {loadingMentors ? (
            <div className="space-y-3">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="flex items-center gap-3 py-3">
                  <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3 animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-1">
              {suggestedMentors.length > 0 ? (
                suggestedMentors.map((mentor) =>
                  renderUserItem(mentor, 'mentor')
                )
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400">
                    No mentors available at the moment
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    Check back later for new mentors
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
