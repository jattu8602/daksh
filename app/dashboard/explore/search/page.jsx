'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import FollowButton from '@/app/components/FollowButton';

import { useRouter } from 'next/navigation' // 👈 Import router
export default function Component() {
  const [searchText, setSearchText] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)
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

  // Search for users when searchText changes
  useEffect(() => {
    const searchUsers = async () => {
      if (searchText.trim().length < 2) {
        setSearchResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(`/api/search/users?q=${encodeURIComponent(searchText)}`);
        if (response.ok) {
          const data = await response.json();
          setSearchResults(data.users || []);
        } else {
          setSearchResults([]);
        }
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchUsers, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchText]);

  return (
    <div className="min-h-screen bg-gray-50 ">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 border border-gray-300 rounded-lg bg-white hover:bg-gray-50"
            onClick={handleBack}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>

          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search people..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="pl-10 pr-10 h-10 bg-gray-100 border-0 rounded-full focus-visible:ring-2 focus-visible:ring-blue-500"
            />
            {searchText && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
                onClick={() => setSearchText('')}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Search Results */}
      {searchText && (
        <div className="px-4 py-2">
          <h3 className="text-sm font-medium text-gray-600 mb-3">
            {isLoading ? 'Searching...' : `Search Results (${searchResults.length})`}
          </h3>
          <div className="space-y-1">
            {isLoading ? (
              <div className="text-center py-4 text-gray-500">Loading...</div>
            ) : searchResults.length > 0 ? (
              searchResults.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center gap-3 py-3 px-3 hover:bg-gray-50 transition-colors"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={user.avatar || '/placeholder.svg'}
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
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      @{user.username}
                    </p>
                    {user.class && (
                      <p className="text-xs text-gray-400 truncate">
                        Class {user.class}
                      </p>
                    )}
                  </div>
                  <Badge
                    className={`text-xs px-2 py-0.5 ${user.tagColor} border-0`}
                  >
                    {user.tag}
                  </Badge>
                  <FollowButton
                    targetUserId={user.username}
                    initialIsFollowed={false}
                    size="sm"
                    variant="outline"
                  />
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-gray-500">
                No users found for "{searchText}"
              </div>
            )}
          </div>
        </div>
      )}

      {/* Recent Searches - Only show when not searching */}
      {!searchText && (
        <div className="px-4 py-4">
          <h3 className="text-sm font-medium text-gray-600 mb-3">Recent</h3>
          <div className="space-y-2">
            {recentSearches.map((search, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-2 px-3"
              >
                <div className="flex items-center gap-3">
                  <Search className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-700">{search}</span>
                </div>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <X className="h-3 w-3 text-gray-400" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
