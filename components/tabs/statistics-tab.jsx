import { Trophy, Users, ChevronRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function StatisticsTab() {
  return (
    <div className="p-4 space-y-4">
      {/* Points Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Trophy className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">Your Points</h3>
              <p className="text-sm text-gray-600">Points available</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900">249,560</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Grid */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Avg. Watch Time</span>
          <span className="font-semibold text-gray-900">35 min (+23.5%)</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-600">Reviews</span>
          <span className="font-semibold text-gray-900">20,254 (+25.37%)</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-600">Daily</span>
          <span className="font-semibold text-gray-900">74% Completion</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-600">Weekly</span>
          <span className="font-semibold text-gray-900">
            Consistent Progress
          </span>
        </div>
      </div>

      {/* Longest Streak */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Longest Streak</h3>
            <p className="text-2xl font-bold text-gray-900">20 Days</p>
          </div>
        </CardContent>
      </Card>

      {/* Leaderboard */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Leaderboard</h3>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
        </CardContent>
      </Card>

      {/* Daily Stamp Reminder */}
      <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
        <CardContent className="p-6">
          <h3 className="text-xl font-bold mb-2">Daily Stamp Reminder!</h3>
          <p className="text-red-100 mb-4">
            {"Don't miss out! Stamp & score points today."}
          </p>
          <Button
            variant="secondary"
            className="bg-white text-red-600 hover:bg-gray-100"
          >
            Get Stamp
          </Button>
        </CardContent>
      </Card>

      {/* Daily Stress Reminder */}
      <Card className="border-purple-200 bg-purple-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">
                Daily Stress Reminder
              </h3>
              <p className="text-sm text-gray-600">Take a break and relax!</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="text-gray-600 bg-transparent"
            >
              Dismiss
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
