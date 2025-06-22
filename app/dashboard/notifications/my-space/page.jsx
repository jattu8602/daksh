'use client'

import { ChevronRight } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function MySpaceNotificationsScreen() {
  const router = useRouter()

  // Handle mobile side back or browser back gesture
  useEffect(() => {
    const handlePopState = () => {
      router.push('/dashboard/home')
    }

    window.addEventListener('popstate', handlePopState)
    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [])
  const todayNotifications = [
    {
      icon: '🍃',
      title: 'Take a break',
      description: 'Take a break by relaxing your concentration.',
      time: 'Now',
    },
    {
      icon: '✓',
      title: 'Complete your daily goals',
      description: 'Daily goals help in improving productivity.',
      time: '10m',
    },
  ]

  const yesterdayNotifications = [
    {
      icon: '📝',
      title: 'Review test',
      description: 'Start test for today.',
      time: '1h',
    },
    {
      icon: '📄',
      title: 'Take an application of notes',
      description: 'Today by 22:00.',
      time: '2h',
    },
    {
      icon: '📅',
      title: 'Start preparation',
      description: 'Start today (10am-1pm).',
      time: '3h',
    },
    {
      icon: '☕',
      title: 'Take a break',
      description: 'Start today (10am-1pm).',
      time: '5h',
    },
    {
      icon: '📚',
      title: 'Lesson Completed',
      description: 'Sign lesson summary test runs.',
      time: '6h',
    },
    {
      icon: '⭐',
      title: '10 points earned',
      description: '10 points earned.',
      time: '',
      hasGreenDot: true,
    },
    {
      icon: '🏆',
      title: 'Challenge completed',
      description: 'Winning streak is excellent.',
      time: '',
    },
    {
      icon: '💬',
      title: 'Message from Dr. Fraud AI',
      description: 'Big final review of messages.',
      time: '8h',
    },
    {
      icon: '✏️',
      title: 'Journal incomplete',
      description: '5 reflections incomplete.',
      time: '9h',
    },
    {
      icon: '❤️',
      title: 'Mental Health Data is here',
      description: 'Monthly mental acceptance is here.',
      time: '10h',
    },
    {
      icon: '📄',
      title: 'Stress documented',
      description: 'Stress levels recorded.',
      time: '11h',
    },
    {
      icon: '🛡️',
      title: 'Account Security Alert',
      description: 'New suspicious device detected.',
      time: '',
      hasArrow: true,
    },
    {
      icon: '⚙️',
      title: 'System Update Available',
      description: 'Update your system to improve security.',
      time: '',
      hasArrow: true,
    },
    {
      icon: '🔑',
      title: 'Password Reset Successful',
      description: 'Your password has been reset.',
      time: '',
      hasArrow: true,
    },
    {
      icon: '✨',
      title: 'Exciting New Feature',
      description: 'Try our new feature now.',
      time: '',
      hasArrow: true,
    },
  ]

  return (
    <div className="flex flex-col bg-white dark:bg-gray-900 max-w-md mx-auto">
      {/* Today */}
      <div className="overflow-auto">
        {todayNotifications.map((notification, index) => (
          <div
            key={`today-${index}`}
            className="flex items-start p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
              <span>{notification.icon}</span>
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-900 dark:text-white">
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

      {/* Yesterday Heading */}
      <div className="px-4 py-3">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
          Yesterday
        </h2>
      </div>

      {/* Yesterday Notifications */}
      <div className="overflow-auto">
        {yesterdayNotifications.map((notification, index) => (
          <div
            key={`yesterday-${index}`}
            className="flex items-start p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
              <span>{notification.icon}</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center">
                <h3 className="font-medium text-gray-900 dark:text-white">
                  {notification.title}
                </h3>
                {notification.hasGreenDot && (
                  <div className="w-2 h-2 bg-green-500 rounded-full ml-2" />
                )}
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                {notification.description}
              </p>
            </div>
            {notification.hasArrow ? (
              <ChevronRight size={20} className="text-gray-400 ml-2" />
            ) : (
              <span className="text-gray-400 text-xs ml-2">
                {notification.time}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
