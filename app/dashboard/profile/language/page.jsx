'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { ChevronLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function LanguageSelectionScreen() {
  const [selectedLanguage, setSelectedLanguage] = useState('English')
  const router = useRouter()

  const languages = [
    { value: 'English', label: 'English', native: '' },
    { value: 'Hindi', label: 'Hindi', native: '(हिंदी)' },
    { value: 'Bengali', label: 'Bengali', native: '(বাংলা)' },
    { value: 'Tamil', label: 'Tamil', native: '(தமிழ்)' },
    { value: 'Telugu', label: 'Telugu', native: '(తెలుగు)' },
    { value: 'Spanish', label: 'Spanish', native: '(Español)' },
    { value: 'French', label: 'French', native: '(Français)' },
    { value: 'German', label: 'German', native: '(Deutsch)' },
    { value: 'Portuguese', label: 'Portuguese', native: '(Português)' },
    { value: 'Italian', label: 'Italian', native: '(Italiano)' },
    { value: 'Russian', label: 'Russian', native: '(Русский)' },
    { value: 'Korean', label: 'Korean', native: '(한국어)' },
    { value: 'Arabic', label: 'Arabic', native: '(العربية)' },
    { value: 'Turkish', label: 'Turkish', native: '(Türkçe)' },
    {
      value: 'Malay',
      label: 'Malay/Indonesian',
      native: '(Bahasa Melayu / Bahasa Indonesia)',
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-white p-4 border-b border-gray-200">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-lg font-semibold">Language</h1>
        </div>
      </div>

      {/* Language List */}
      <div className="bg-white p-4 space-y-3">
        <RadioGroup
          value={selectedLanguage}
          onValueChange={setSelectedLanguage}
        >
          {languages.map((language) => (
            <div
              key={language.value}
              className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl"
            >
              <Label htmlFor={language.value} className="flex-1 cursor-pointer">
                <span className="font-medium">{language.label}</span>
                {language.native && (
                  <span className="text-gray-500 ml-2">{language.native}</span>
                )}
              </Label>
              <RadioGroupItem
                value={language.value}
                id={language.value}
                className="w-5 h-5"
              />
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Action Buttons */}
      <div className="p-4 space-y-3">
        <Button className="w-full bg-black text-white py-4 rounded-xl text-lg font-medium">
          Save Changes
        </Button>
        <Button variant="ghost" className="w-full py-4 text-lg font-medium">
          Discard Changes
        </Button>
      </div>
    </div>
  )
}
