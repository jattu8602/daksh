'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { ChevronLeft, Clock } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function BreakRemindersScreen() {
  const router = useRouter()
  const [selectedInterval, setSelectedInterval] = useState('')

  const intervals = [
    { value: '30', label: 'Every 30 Minutes' },
    { value: '45', label: 'Every 45 Minutes' },
    { value: '60', label: 'Every 60 Minutes' },
    { value: '90', label: 'Every 90 Minutes' },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="p-4 bg-card">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-xl font-semibold">Reminder to take breaks</h1>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        <RadioGroup
          value={selectedInterval}
          onValueChange={setSelectedInterval}
        >
          {intervals.map((interval) => (
            <div
              key={interval.value}
              className="flex items-center justify-between p-4 bg-card rounded-xl"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                  <Clock className="w-6 h-6 text-muted-foreground" />
                </div>
                <Label
                  htmlFor={interval.value}
                  className="text-lg font-medium cursor-pointer"
                >
                  {interval.label}
                </Label>
              </div>
              <RadioGroupItem
                value={interval.value}
                id={interval.value}
                className="w-6 h-6 border-2 border-border"
              />
            </div>
          ))}
        </RadioGroup>
      </div>
    </div>
  )
}
