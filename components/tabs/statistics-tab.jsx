'use client'

import { Trophy, Users, ChevronRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function StatisticsTab() {
  return (
    <div className="p-4 space-y-4 text-gray-900 dark:text-white">
      {/* Points Card */}
      <Card className="bg-white dark:bg-orange-300/20">
        <CardContent className="px-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-300/20 rounded-lg flex items-center justify-center">
              <Trophy className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">Your Points</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Points available
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">249,560</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      {[
        ['Avg. Watch Time', '35 min (+23.5%)'],
        ['Reviews', '20,254 (+25.37%)'],
        ['Daily', '74% Completion'],
        ['Weekly', 'Consistent Progress'],
      ].map(([label, value]) => (
        <div key={label} className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-400">{label}</span>
          <span className="font-semibold">{value}</span>
        </div>
      ))}

      {/* Longest Streak */}
      <Card className="bg-white dark:bg-blue-400/30">
        <CardContent className="px-4 flex justify-between items-center">
          <h3 className="font-semibold">Longest Streak</h3>
          <p className="text-2xl font-bold">20 Days</p>
        </CardContent>
      </Card>

      {/* Leaderboard */}
      <Card className="bg-white dark:bg-yellow-300/20">
        <CardContent className="px-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-300/20 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="font-semibold">Leaderboard</h3>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400 dark:text-gray-500" />
        </CardContent>
      </Card>

      {/* Daily Stamp Reminder */}
      <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
        <CardContent className="p-6">
          <h3 className="text-xl font-bold mb-2">Daily Stamp Reminder!</h3>
          <p className="text-red-100 mb-4">
            Don't miss out! Stamp & score points today.
          </p>
          <Button
            className="bg-white text-red-600 hover:bg-gray-100"
            variant="secondary"
          >
            Get Stamp
          </Button>
        </CardContent>
      </Card>

      {/* Daily Stress Reminder */}
      <Card className="border-purple-200 dark:border-purple-400 bg-purple-50 dark:bg-purple-200/10">
        <CardContent className="p-6 flex justify-between items-center">
          <div>
            <h3 className="font-semibold">Daily Stress Reminder</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Take a break and relax!
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="text-gray-600 dark:text-white"
          >
            Dismiss
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
