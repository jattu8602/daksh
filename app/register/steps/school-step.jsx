"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, Check } from "lucide-react"

export default function SchoolStep({ formData, updateFormData }) {
  const schools = [
    "Lincoln High School",
    "Washington Elementary",
    "Roosevelt Middle School",
    "Jefferson Academy",
    "Madison Prep School",
  ]

  return (
    <div className="flex flex-col h-full">
      <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
        Select your school
      </h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8 text-center">
        Choose the school you are currently attending.
      </p>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="Search"
            className="pl-10 py-3 bg-gray-100 dark:bg-gray-800 border-0 rounded-xl text-gray-900 dark:text-white"
          />
        </div>
      </div>

      <div className="flex-1">
        {schools.map((s) => (
          <Card
            key={s}
            className={`mb-3 relative cursor-pointer transition-colors ${
              formData.school === s
                ? 'border-black dark:border-white bg-gray-50 dark:bg-gray-800'
                : 'border-gray-200 dark:border-gray-700'
            }`}
            onClick={() => updateFormData('school', s)}
          >
            <CardContent className="px-4 py-0.5 flex items-center justify-between">
              <span className="font-medium text-gray-900 dark:text-white">
                {s}
              </span>
              {formData.school === s && (
                <div className="w-6 h-6 bg-black dark:bg-white rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-white dark:text-black" />
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
