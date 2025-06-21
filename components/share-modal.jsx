'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'

const contacts = [
  { name: 'ranveer.singh_9', status: 'Online', avatar: '/icons/girl.png' },
  { name: 'ankur.kumar_12', status: 'Online', avatar: '/icons/girl.png' },
  { name: 'anchal.kumar_09', status: 'Online', avatar: '/icons/girl.png' },
  {
    name: 'rajveer.saini_87',
    status: '4 hours ago',
    avatar: '/icons/girl.png',
  },
  { name: 'rupali.singh_9', status: '5 hours ago', avatar: '/icons/girl.png' },
  { name: 'radhika.pal_12', status: '7+ days ago', avatar: '/icons/girl.png' },
  {
    name: 'rajveer.saini_87',
    status: '4 hours ago',
    avatar: '/icons/girl.png',
  },
  { name: 'rupali.singh_9', status: '5 hours ago', avatar: '/icons/girl.png' },
  { name: 'radhika.pal_12', status: '7+ days ago', avatar: '/icons/girl.png' },
]

export default function ShareModal({ onClose }) {
  const [sentStatus, setSentStatus] = useState(
    Array(contacts.length).fill(false)
  )

  const handleSendClick = (index) => {
    const updatedStatus = [...sentStatus]
    updatedStatus[index] = true
    setSentStatus(updatedStatus)
  }

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-[99]" onClick={onClose} />

      {/* Modal */}
      <div className="fixed bottom-0 left-0 right-0 bg-background text-foreground rounded-t-3xl z-[100] max-h-[60vh] overflow-hidden">
        <div className="p-4 border-b border-border">
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
              className="flex items-center justify-between p-4 border-b border-border last:border-b-0"
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={contact.avatar}
                    alt={contact.name}
                    className="w-10 h-10 rounded-full"
                  />
                  {contact.status === 'Online' && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
                  )}
                </div>
                <div>
                  <div className="font-medium text-foreground">
                    {contact.name}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {contact.status}
                  </div>
                </div>
              </div>

              <Button
                size="sm"
                disabled={sentStatus[index]}
                className={`px-6 ${
                  sentStatus[index]
                    ? 'bg-gray-400 text-white cursor-default'
                    : 'bg-primary hover:bg-primary/90 text-primary-foreground'
                }`}
                onClick={() => handleSendClick(index)}
              >
                {sentStatus[index] ? 'Sent' : 'Send'}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
