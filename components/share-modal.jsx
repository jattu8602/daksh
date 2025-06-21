'use client'

import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'


const contacts = [
  {
    name: 'ranveer.singh_9',
    status: 'Online',
    avatar: '/placeholder.svg?height=40&width=40',
  },
  {
    name: 'ankur.kumar_12',
    status: 'Online',
    avatar: '/placeholder.svg?height=40&width=40',
  },
  {
    name: 'anchal.kumar_09',
    status: 'Online',
    avatar: '/placeholder.svg?height=40&width=40',
  },
  {
    name: 'rajveer.saini_87',
    status: '4 hours ago',
    avatar: '/placeholder.svg?height=40&width=40',
  },
  {
    name: 'rupali.singh_9',
    status: '5 hours ago',
    avatar: '/placeholder.svg?height=40&width=40',
  },
  {
    name: 'radhika.pal_12',
    status: '7+ days ago',
    avatar: '/placeholder.svg?height=40&width=40',
  },
]

export default function ShareModal({ onClose }) {
  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />

      {/* Modal */}
      <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 max-h-[60vh] overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Share</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[calc(60vh-80px)]">
          {contacts.map((contact, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 border-b border-gray-100 last:border-b-0"
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={contact.avatar || '/placeholder.svg'}
                    alt={contact.name}
                    className="w-10 h-10 rounded-full"
                  />
                  {contact.status === 'Online' && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
                  )}
                </div>
                <div>
                  <div className="font-medium text-gray-900">
                    {contact.name}
                  </div>
                  <div className="text-sm text-gray-500">{contact.status}</div>
                </div>
              </div>

              <Button
                size="sm"
                className="bg-purple-600 hover:bg-purple-700 text-white px-6"
              >
                Send
              </Button>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
