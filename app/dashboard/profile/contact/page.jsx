'use client'

import { Button } from '@/components/ui/button'
import {
  ChevronLeft,
  ChevronRight,
  Headphones,
  Globe,
  MessageCircle,
} from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function ContactSupportScreen() {
  const router = useRouter()
  const supportOptions = [
    {
      icon: <Headphones className="w-5 h-5 text-muted-foreground" />,
      title: 'Customer Support',
      hasArrow: true,
    },
    {
      icon: <Globe className="w-5 h-5 text-muted-foreground" />,
      title: 'Website',
      hasArrow: true,
    },
    {
      icon: <MessageCircle className="w-5 h-5 text-muted-foreground" />,
      title: 'WhatsApp',
      hasArrow: true,
    },
    {
      icon: (
        <div className="w-5 h-5 bg-gradient-to-tr from-purple-500 via-pink-500 to-orange-500 rounded-lg flex items-center justify-center">
          <div className="w-3 h-3 bg-white rounded-sm"></div>
        </div>
      ),
      title: 'Instagram',
      hasArrow: true,
    },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="bg-card p-4 border-b border-border">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-lg font-semibold">Contact Support</h1>
        </div>
      </div>

      {/* Support Options */}
      <div className="bg-card p-4 space-y-3">
        {supportOptions.map((option, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 bg-background rounded-xl cursor-pointer hover:bg-muted transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                {option.icon}
              </div>
              <span className="font-medium">{option.title}</span>
            </div>
            {option.hasArrow && (
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
