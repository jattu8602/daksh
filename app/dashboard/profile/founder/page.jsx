'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { ChevronLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function TalkToFounderScreen() {
  const [selectedOption, setSelectedOption] = useState('')
  const router = useRouter()

  const getButtonText = () => {
    switch (selectedOption) {
      case 'report':
        return 'Talk to me'
      case 'idea':
        return 'Send a message'
      case 'appreciate':
        return 'Leave a review'
      default:
        return 'Select an option'
    }
  }

  const getButtonDisabled = () => {
    return selectedOption === ''
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="bg-card p-4 border-b border-border">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-lg font-semibold">TALK TO THE FOUNDER</h1>
        </div>
      </div>

      {/* Content */}
      <div className="bg-card p-6">
        {/* Founder Profile */}
        <div className="flex items-start gap-4 mb-8">
          <div className="relative">
            <img
              src="https://res.cloudinary.com/doxmvuss9/image/upload/v1750277816/link-generator/hr4rox9v0oxwzojclsxt.jpg"
              alt="Kabir Jaiswal"
              className="w-30 h-30 rounded-full object-cover"
            />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold mb-1">Kabir Jaiswal</h2>
            <p className="text-muted-foreground mb-3">Founder of Daksh</p>
            <div className="bg-primary text-primary-foreground px-3 py-2 rounded-lg text-sm inline-block">
              Hey how can I help you today?
            </div>
          </div>
        </div>

        {/* Options */}
        <div className="space-y-4 mb-8">
          <RadioGroup value={selectedOption} onValueChange={setSelectedOption}>
            <div className="flex items-center justify-between p-4 border border-border rounded-xl">
              <Label
                htmlFor="report"
                className="flex-1 cursor-pointer font-medium"
              >
                Report a problem
              </Label>
              <RadioGroupItem value="report" id="report" className="w-5 h-5" />
            </div>

            <div className="flex items-center justify-between p-4 border border-border rounded-xl">
              <Label
                htmlFor="idea"
                className="flex-1 cursor-pointer font-medium"
              >
                Share an idea
              </Label>
              <RadioGroupItem value="idea" id="idea" className="w-5 h-5" />
            </div>

            <div className="flex items-center justify-between p-4 border border-border rounded-xl">
              <Label
                htmlFor="appreciate"
                className="flex-1 cursor-pointer font-medium"
              >
                Appreciate the Team
              </Label>
              <RadioGroupItem
                value="appreciate"
                id="appreciate"
                className="w-5 h-5"
              />
            </div>
          </RadioGroup>
        </div>

        {/* Action Button */}
        <Button
          className="w-full py-4 rounded-xl text-lg font-medium"
          disabled={getButtonDisabled()}
        >
          {getButtonText()}
        </Button>
      </div>
    </div>
  )
}
