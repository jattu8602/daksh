// page.jsx
'use client'

import CommunityLayout from './layout'
import { useMemo } from 'react'
import ContactList from '@/components/contact-list'
import { Search } from 'lucide-react'
import {
  friendsData,
  mentorsData,
  schoolData,
  callsData,
} from '@/lib/dummy-data'

export default function CommunityPage() {
  return (
    <CommunityLayout>
      {({ activeTab, searchQuery }) => {
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

        return filteredData.length > 0 ? (
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
        )
      }}
    </CommunityLayout>
  )
}
