'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function SchoolNotificationsScreen() {
  const router = useRouter()

  // Handle mobile side back or browser back gesture
  useEffect(() => {
    const handlePopState = () => {
      router.replace('/dashboard/home')
    }

    window.addEventListener('popstate', handlePopState)
    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [])
  const notifications = [
    {
      icon: '👨‍🏫',
      title: 'Chemistry live class',
      description: 'Start today (10am-1pm) by VR Sharma.',
      time: '1h',
    },
    {
      icon: '❓',
      title: 'Quiz (Physics)',
      description: 'Start by today 7 April - 16 April for all Subjects.',
      time: '1h',
    },
    {
      icon: '❓',
      title: 'Quiz (First Term)',
      description: 'Today by 2pm. Be ready and all the best!',
      time: '1h',
    },
    {
      icon: '📄',
      title: 'Notice',
      description:
        'Dear students kindly attend the class, lack of attendance may restrict your',
      time: '1h',
    },
    {
      icon: '📄',
      title: 'Notice',
      description:
        "Gently reminder: 12 April is a Holiday due to 'Holi Festival'.",
      time: '1h',
    },
    {
      icon: '📄',
      title: 'Notice',
      description:
        'Dear student, kindly complete the fee payment. Please ignore if already paid.',
      time: '1h',
    },
  ]

  return (
    <div className="bg-white dark:bg-gray-900">
      {notifications.map((notification, index) => (
        <div
          key={index}
          className="flex items-start p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
            <span>{notification.icon}</span>
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-black dark:text-white">
              {notification.title}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              {notification.description}
            </p>
          </div>
          <span className="text-gray-400 text-xs ml-2">
            {notification.time}
          </span>
        </div>
      ))}
    </div>
  )
}
