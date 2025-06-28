'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { X, Home, Settings, User, FileText, Calendar, Bell } from 'lucide-react'

export function MobileMenu({ isOpen, onClose }) {
  const menuItems = [
    { icon: Home, label: 'Dashboard', href: '/dashboard' },
    { icon: FileText, label: 'Notes', href: '/dashboard/notes' },
    { icon: Calendar, label: 'Calendar', href: '/dashboard/calendar' },
    { icon: Bell, label: 'Notifications', href: '/dashboard/notifications' },
    { icon: User, label: 'Profile', href: '/dashboard/profile' },
    { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: 0 }}
          exit={{ x: '-100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed left-0 top-0 h-full w-80 bg-background border-r z-50 md:hidden"
        >
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">Menu</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <nav className="p-4">
            <div className="space-y-2">
              {menuItems.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 h-12"
                    onClick={onClose}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </Button>
                </motion.div>
              ))}
            </div>
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
