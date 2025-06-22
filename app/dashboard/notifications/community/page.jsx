'use client'

import { Check } from 'lucide-react'

export default function CommunityNotificationsScreen() {
  const todayNotifications = [
    {
      avatar: '👩‍🦰',
      name: 'Naina.jain_12',
      action: 'requested to follow.',
      description: 'Please confirm the request.',
      time: '',
      hasButtons: true,
    },
    {
      avatar: '',
      name: '',
      action: 'Your live session with Robert Fox starts in 30 min',
      description: '',
      time: '',
      hasButtons: false,
    },
    {
      avatar: '👩‍🦰',
      name: 'Naina.jain_12',
      action: 'requested to follow.',
      description: 'Please confirm the request.',
      time: '',
      hasButtons: true,
    },
  ]

  const yesterdayNotifications = [
    {
      avatar: '👨',
      name: 'Ayush.verma_16',
      action: 'liked the post.',
      time: '12h',
      hasImage: true,
    },
    {
      avatar: '👩',
      name: 'Kirti.patel_10',
      hasButtons: true,
      time: '5m',
    },
    {
      avatar: '👩‍🦱',
      name: 'Doubt Solved by Shruti Sharma',
      hasCheckbox: true,
      time: '20h',
    },
    {
      avatar: '👩‍🦰',
      name: 'Doubt Solved by Hanshika Dev',
      hasCheckbox: true,
      time: '22h',
    },
    {
      avatar: '👩',
      name: 'Doubt Solved by Rashmika',
      hasCheckbox: true,
      hasGreenDot: true,
      time: '20h',
    },
    {
      avatar: '👥',
      name: 'Your friends miss you',
      description: 'Your friends in the Challenge are',
      hasActionButton: true,
    },
    {
      avatar: '👥',
      name: 'You have new followers!',
      description: 'Akari Mi just followed you. 8h',
      hasGreenDot: true,
    },
    {
      avatar: '💬',
      name: 'You have unread messages!',
      description: '56 Total Unread messages.',
      hasGreenDot: true,
    },
    {
      avatar: '💬',
      name: 'Someone commented!',
      description: 'Dr.Haikari commented on your post.',
    },
    {
      avatar: '🎬',
      name: 'Someone posted new video!',
      description: 'Joe Biden posted new video.',
    },
    {
      avatar: '📝',
      name: 'Someone mentioned you!',
      description: 'JoeMakima 5 just mentioned you.',
    },
  ]

  return (
    <div className="flex flex-col bg-white dark:bg-gray-900 max-w-md mx-auto text-black dark:text-white">
      {/* Today Section */}
      <div className="px-4 py-3">
        <h2 className="text-lg font-bold">Today</h2>
      </div>

      {/* Today Notifications */}
      <div className="overflow-auto">
        {todayNotifications.map((notification, index) => (
          <div
            key={`today-${index}`}
            className="flex items-start p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            {notification.avatar && (
              <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                <span className="text-lg">{notification.avatar}</span>
              </div>
            )}
            <div className="flex-1">
              {notification.name && (
                <h3 className="font-medium">{notification.name}</h3>
              )}
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                {notification.action}
              </p>
              {notification.description && (
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  {notification.description}
                </p>
              )}
              {notification.hasButtons && (
                <div className="flex gap-2 mt-2">
                  <button className="px-4 py-1 bg-black dark:bg-white text-white dark:text-black text-sm rounded-md">
                    Confirm
                  </button>
                  <button className="px-4 py-1 bg-gray-200 dark:bg-gray-700 text-black dark:text-white text-sm rounded-md">
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Yesterday Section */}
      <div className="px-4 py-3">
        <h2 className="text-lg font-bold">Yesterday</h2>
      </div>

      {/* Yesterday Notifications */}
      <div className="overflow-auto">
        {yesterdayNotifications.map((notification, index) => (
          <div
            key={`yesterday-${index}`}
            className="flex items-start p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
              <span className="text-lg">{notification.avatar}</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center">
                <h3 className="font-medium">{notification.name}</h3>
                {notification.hasGreenDot && (
                  <div className="w-2 h-2 bg-green-500 rounded-full ml-2" />
                )}
              </div>
              {notification.action && (
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  {notification.action}
                </p>
              )}
              {notification.description && (
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  {notification.description}
                </p>
              )}

              {notification.hasButtons && (
                <div className="flex gap-2 mt-2">
                  <button className="px-4 py-1 bg-black dark:bg-white text-white dark:text-black text-sm rounded-md">
                    Confirm
                  </button>
                  <button className="px-4 py-1 bg-gray-200 dark:bg-gray-700 text-black dark:text-white text-sm rounded-md">
                    Delete
                  </button>
                </div>
              )}
            </div>

            {notification.time && (
              <span className="text-gray-400 text-xs ml-2">
                {notification.time}
              </span>
            )}

            {notification.hasImage && (
              <div className="ml-2 w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center">
                <span className="text-xs text-gray-600 dark:text-gray-300">
                  IMG
                </span>
              </div>
            )}

            {notification.hasCheckbox && (
              <div className="ml-2 w-5 h-5 border border-gray-300 dark:border-gray-600 rounded flex items-center justify-center">
                {Math.random() > 0.5 && (
                  <Check size={12} className="text-black dark:text-white" />
                )}
              </div>
            )}

            {notification.hasActionButton && (
              <button className="ml-2 px-3 py-1 bg-black dark:bg-white text-white dark:text-black text-xs rounded-md">
                Take Action
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
