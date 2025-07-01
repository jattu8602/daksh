'use client'

import { useState, useMemo } from 'react'
import { ArrowLeft, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import ContactList from '@/components/contact-list'
import { useRouter } from 'next/navigation'
import {
  friendsData,
  mentorsData,
  schoolData,
  callsData,
} from '@/lib/dummy-data'

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState('Friends')
  const [searchQuery, setSearchQuery] = useState('')
  const tabs = ['Friends', 'Mentors', 'School', 'Calls']
  const router = useRouter()

  const getDataForTab = () => {
    switch (activeTab) {
      case 'Friends':
        return friendsData
      case 'Mentors':
        return mentorsData
      case 'School':
        return schoolData
      case 'Calls':
        return callsData
      default:
        return friendsData
    }
  }

  const filteredData = useMemo(() => {
    const currentData = getDataForTab()
    if (!searchQuery.trim()) return currentData
    const query = searchQuery.toLowerCase()

    return currentData
      .filter(
        (contact) =>
          contact.name.toLowerCase().includes(query) ||
          (contact.lastMessage &&
            contact.lastMessage.toLowerCase().includes(query))
      )
      .sort((a, b) => {
        const aMatch = a.name.toLowerCase().startsWith(query)
        const bMatch = b.name.toLowerCase().startsWith(query)
        return aMatch === bMatch ? 0 : aMatch ? -1 : 1
      })
  }, [activeTab, searchQuery])

  const handleSearchChange = (e) => setSearchQuery(e.target.value)
  const clearSearch = () => setSearchQuery('')

  return (
    <>
      {/* Sticky Top Section */}
      <div className="sticky top-0 z-10 bg-white dark:bg-black">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
          <ArrowLeft
            className="w-6 h-6"
            onClick={() => router.push('/dashboard/home')}
          />
          <h1 className="text-lg font-semibold">Community</h1>
          <div className="w-6 h-6" />
        </div>

        {/* Search */}
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search"
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-10 bg-gray-100 dark:bg-gray-800 dark:text-white border-0 rounded-lg"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex px-4 pb-4 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full text-sm font-medium mr-2 whitespace-nowrap ${
                activeTab === tab
                  ? 'bg-black dark:bg-white text-white dark:text-black'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {filteredData.length > 0 ? (
          <ContactList data={filteredData} type={activeTab.toLowerCase()} />
        ) : searchQuery ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <Search className="w-12 h-12 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300 mt-2">
              No results found
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Try searching with a different name or keyword in {activeTab}
            </p>
          </div>
        ) : (
          <ContactList data={filteredData} type={activeTab.toLowerCase()} />
        )}
      </div>
    </>
  )
}
