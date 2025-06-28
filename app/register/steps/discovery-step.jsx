"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Check } from "lucide-react"

export default function DiscoveryStep({ formData, updateFormData }) {
  const items = [
    { label: "Social media", icon: "📱" },
    { label: "Google Search", icon: "🔍" },
    { label: "Youtube", icon: "📺" },
    { label: "App store", icon: "📱" },
    { label: "Friends/Family", icon: "👥" },
  ]

  return (
    <div className="flex flex-col h-full">
      <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
        Lastly, how did you hear about Daksh?
      </h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8 text-center">
        This helps us understand where our users come from.
      </p>

      <div className="flex-1">
        {items.map((it) => (
          <Card
            key={it.label}
            className={`mb-3 relative cursor-pointer transition-colors ${
              formData.discovery === it.label
                ? 'border-black dark:border-white bg-gray-50 dark:bg-gray-800'
                : 'border-gray-200 dark:border-gray-700'
            }`}
            onClick={() => updateFormData('discovery', it.label)}
          >
            <CardContent className="px-4 py-0.5 flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-2xl mr-3">{it.icon}</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {it.label}
                </span>
              </div>
              {formData.discovery === it.label && (
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
