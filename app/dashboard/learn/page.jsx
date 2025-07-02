'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { GraduationCap, TrendingUp, Trophy } from 'lucide-react'
import LearnTab from '@/components/tabs/learn-tab'
import StatisticsTab from '@/components/tabs/statistics-tab'
import RewardsTab from '@/components/tabs/rewards-tab'

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('learn')
  const router = useRouter()

  const tabs = [
    { id: 'learn', label: 'Learn', icon: GraduationCap },
    { id: 'statistics', label: 'Statistics', icon: TrendingUp },
    { id: 'rewards', label: 'Rewards', icon: Trophy },
  ]

  const handleTabChange = (tabId) => {
    setActiveTab(tabId)
    window.history.pushState({ tab: tabId }, '', `?tab=${tabId}`)
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'learn':
        return <LearnTab />
      case 'statistics':
        return <StatisticsTab />
      case 'rewards':
        return <RewardsTab />
      default:
        return <LearnTab />
    }
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'auto' })
    }
  }, [activeTab])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-[116px] text-black dark:text-white">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 fixed top-0 left-0 right-0 z-50">
        <div className="max-w-md mx-auto px-4 py-3">
          <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
            Daksh
          </h1>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-md mx-auto">
          <div className="flex">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`flex-1 flex flex-col items-center py-4 px-2 text-sm font-medium transition-colors border-b-2 ${
                    isActive
                      ? 'text-black dark:text-white border-black dark:border-white'
                      : 'text-gray-500 dark:text-gray-300 border-transparent hover:text-black dark:hover:text-white'
                  }`}
                >
                  <Icon className="w-6 h-6 mb-1" />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-md mx-auto mt-6">{renderTabContent()}</div>
    </div>
  )
}
