'use client'
import { Card, CardContent } from '@/components/ui/card'
import { Check } from 'lucide-react'

export default function EducationStep({ formData, updateFormData }) {
  const levels = ['School', 'College/University', 'Online Courses', 'Other']

  return (
    <div className="flex flex-col h-full">
      <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
        Now are you in...
      </h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8 text-center">
        Choose the option that best describes your current education level.
      </p>

      <div className="flex-1">
        {levels.map((lvl) => (
          <Card
            key={lvl}
            className={`mb-3 !p-4 relative cursor-pointer transition-colors ${
              formData.education === lvl
                ? 'border-black dark:border-white bg-gray-50 dark:bg-transparent'
                : 'border-gray-200 dark:border-gray-700 dark:bg-gray-800'
            }`}
            onClick={() => updateFormData('education', lvl)}
          >
            <CardContent className="px-4 py-0.5 flex items-center justify-between">
              <span className="font-medium text-gray-900 dark:text-white">
                {lvl}
              </span>
              {formData.education === lvl && (
                <div className="w-6 h-6 bg-transparent flex items-center justify-center">
                  <Check className="w-6 h-6 font-semibold text-black dark:text-white" />
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
