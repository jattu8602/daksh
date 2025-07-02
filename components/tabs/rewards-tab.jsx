'use client'

import { Gift, Star, Zap, ShoppingBag, Crown } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default function RewardsTab() {
  return (
    <div className="p-4 space-y-4 text-gray-900 dark:text-white">
      {/* Available Points */}
      <Card className="bg-white dark:bg-zinc-800">
        <CardContent className="p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-green-100 dark:bg-green-300/20 rounded-lg flex items-center justify-center">
            <Star className="w-6 h-6 text-green-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold">Available Points</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Ready to redeem
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-green-600">249,560</p>
          </div>
        </CardContent>
      </Card>

      {/* Reward Categories */}
      <div className="grid grid-cols-2 gap-4">
        {[
          {
            icon: Gift,
            label: 'Gift Cards',
            desc: 'Amazon, iTunes & more',
            color: 'blue',
          },
          {
            icon: Crown,
            label: 'Premium',
            desc: 'Unlock exclusive features',
            color: 'purple',
          },
        ].map((r, i) => (
          <Card key={i} className="bg-white dark:bg-zinc-800">
            <CardContent className="p-4 text-center">
              <r.icon className={`w-8 h-8 text-${r.color}-600 mx-auto mb-2`} />
              <h4 className="font-medium">{r.label}</h4>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {r.desc}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Featured Rewards */}
      <div>
        <h3 className="font-semibold mb-4">Featured Rewards</h3>
        <div className="space-y-3">
          {[
            {
              title: 'Amazon Gift Card',
              points: '50,000',
              value: '$50',
              popular: true,
              icon: ShoppingBag,
            },
            {
              title: 'Premium Subscription',
              points: '100,000',
              value: '3 Months',
              popular: false,
              icon: Crown,
            },
            {
              title: 'Study Boost Pack',
              points: '25,000',
              value: 'Power-ups',
              popular: false,
              icon: Zap,
            },
          ].map((reward, index) => (
            <Card key={index} className="relative bg-white dark:bg-zinc-800">
              <CardContent className="p-4">
                {reward.popular && (
                  <Badge className="absolute -top-2 -right-2 bg-orange-500 text-white">
                    Popular
                  </Badge>
                )}
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-100 dark:bg-zinc-700 rounded-lg flex items-center justify-center">
                    <reward.icon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{reward.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {reward.value}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{reward.points}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      points
                    </p>
                  </div>
                </div>
                <Button
                  className="w-full mt-3"
                  variant={reward.popular ? 'default' : 'outline'}
                  disabled={
                    Number.parseInt(reward.points.replace(',', '')) > 249560
                  }
                >
                  {Number.parseInt(reward.points.replace(',', '')) > 249560
                    ? 'Not Enough Points'
                    : 'Redeem'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Redemption History */}
      <Card className="bg-white dark:bg-zinc-800">
        <CardContent className="p-6">
          <h3 className="font-semibold mb-4">Recent Redemptions</h3>
          <div className="space-y-3">
            {[
              { item: 'Study Timer Pro', date: '2 days ago', points: '15,000' },
              {
                item: 'Amazon Gift Card',
                date: '1 week ago',
                points: '25,000',
              },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{item.item}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {item.date}
                  </p>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  -{item.points}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
