'use client'

import { useRouter } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Phone } from 'lucide-react'

export default function ContactList({ data, type, searchQuery = '' }) {
  const router = useRouter()

  const handleContactClick = (contact) => {
    if (type === 'calls') {
      router.push(`/dashboard/community/call/${contact.id}`)
    } else {
      router.push(`/dashboard/community/chat/${contact.id}`)
    }
  }

  const highlightText = (text, query) => {
    if (!query.trim()) return text
    const regex = new RegExp(`(${query})`, 'gi')
    const parts = text.split(regex)

    return parts.map((part, index) =>
      regex.test(part) ? (
        <span
          key={index}
          className="bg-yellow-200 dark:bg-yellow-600 font-medium"
        >
          {part}
        </span>
      ) : (
        part
      )
    )
  }

  return (
    <>
      {data.map((contact) => (
        <div
          key={contact.id}
          onClick={() => handleContactClick(contact)}
          className="flex items-center space-x-3 p-3 hover:bg-gray-100 dark:hover:bg-gray-800 bg-white dark:bg-gray-900 rounded-lg cursor-pointer transition-colors"
        >
          <div className="relative">
            <Avatar className="w-12 h-12">
              <AvatarImage
                src={contact.avatar || '/placeholder.svg'}
                alt={contact.name}
              />
              <AvatarFallback>
                {contact.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </AvatarFallback>
            </Avatar>
            {contact.isOnline && (
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"></div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-black dark:text-white truncate">
                {highlightText(contact.name, searchQuery)}
              </h3>
              {contact.time && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {contact.time}
                </span>
              )}
            </div>
            {contact.lastMessage && (
              <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                {highlightText(contact.lastMessage, searchQuery)}
              </p>
            )}
          </div>

          {type === 'calls' && (
            <Phone className="w-5 h-5 text-gray-400 dark:text-gray-300" />
          )}

          {contact.hasNewMessage && (
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          )}
        </div>
      ))}
    </>
  )
}
