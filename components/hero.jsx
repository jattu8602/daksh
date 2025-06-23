import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

import { Play } from "lucide-react"
import { Zap } from "lucide-react"
import Link from "next/link"


export default function Hero() {
  return (
    <div>
      {/* Hero Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in-up">
              <Badge
                variant="outline"
                className="mb-6 text-[#8B4513] border-[#8B4513]/30 animate-bounce"
              >
                🚀 INSTAGRAM FOR STUDENTS
              </Badge>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-[#8B4513] mb-6 leading-tight">
                Learn & Grow
                <br />
                <span className="text-[#8B4513]/80 bg-gradient-to-r from-[#8B4513] to-[#8B4513]/60 bg-clip-text text-transparent">
                  The Cool Way
                </span>
              </h1>
              <p className="text-xl text-[#8B4513]/70 mb-8 leading-relaxed">
                Daksh transforms education through interactive reels, posts, and
                highlights. Students just need a mobile device to access
                engaging content with 24/7 mentor support. Join thousands of
                schools already using our platform!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button
                  asChild
                  className="bg-[#8B4513] text-white hover:bg-[#8B4513]/90 hover:scale-105 rounded-full px-8 py-3 text-lg transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <Link href="/contact">Register Your School</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="border-[#8B4513] text-[#8B4513] hover:bg-[#8B4513]/10 hover:scale-105 rounded-full px-8 py-3 text-lg transition-all duration-300"
                >
                  <Link href="/services">Explore Features</Link>
                </Button>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4 pt-8 border-t border-[#8B4513]/20">
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#8B4513]">1000+</div>
                  <div className="text-sm text-[#8B4513]/60">Schools</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#8B4513]">50K+</div>
                  <div className="text-sm text-[#8B4513]/60">Students</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#8B4513]">24/7</div>
                  <div className="text-sm text-[#8B4513]/60">Support</div>
                </div>
              </div>
            </div>

            {/* Mobile App Mockups */}
            <div className="relative animate-fade-in-right">
              <div className="flex justify-center items-center space-x-4">
                {/* Phone 1 - Home Feed */}
                <div className="relative transform rotate-12 hover:rotate-6 transition-transform duration-500 hover:scale-105">
                  <div className="w-64 h-[500px] bg-black rounded-[2.5rem] p-2 shadow-2xl">
                    <div className="w-full h-full bg-white rounded-[2rem] overflow-hidden">
                      <div className="bg-[#8B4513] h-12 flex items-center justify-center relative">
                        <div className="w-32 h-1 bg-white/30 rounded-full"></div>
                        <div className="absolute right-4 text-white text-xs">
                          9:41
                        </div>
                      </div>
                      <div className="p-4 space-y-4">
                        {/* User Post */}
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-[#8B4513]/20 rounded-full flex items-center justify-center">
                            <span className="text-xs font-bold text-[#8B4513]">
                              M
                            </span>
                          </div>
                          <div className="flex-1">
                            <div className="h-3 bg-[#8B4513]/20 rounded w-24 mb-1"></div>
                            <div className="h-2 bg-[#8B4513]/10 rounded w-16"></div>
                          </div>
                        </div>

                        {/* Video Content */}
                        <div className="h-48 bg-gradient-to-br from-[#8B4513]/20 to-[#8B4513]/10 rounded-lg flex items-center justify-center relative">
                          <Play className="w-12 h-12 text-[#8B4513]/50" />
                          <div className="absolute top-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                            Math Reel
                          </div>
                        </div>

                        {/* Interaction Buttons */}
                        <div className="flex justify-between items-center">
                          <div className="flex space-x-4">
                            <div className="w-6 h-6 bg-red-400 rounded flex items-center justify-center">
                              <span className="text-white text-xs">♥</span>
                            </div>
                            <div className="w-6 h-6 bg-[#8B4513]/20 rounded"></div>
                            <div className="w-6 h-6 bg-[#8B4513]/20 rounded"></div>
                          </div>
                          <div className="w-6 h-6 bg-[#8B4513]/20 rounded"></div>
                        </div>
                      </div>

                      {/* Bottom Navigation */}
                      <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
                        <div className="flex justify-around">
                          <div className="w-6 h-6 bg-[#8B4513] rounded flex items-center justify-center">
                            <span className="text-white text-xs">🏠</span>
                          </div>
                          <div className="w-6 h-6 bg-[#8B4513]/30 rounded flex items-center justify-center">
                            <span className="text-[#8B4513] text-xs">🔍</span>
                          </div>
                          <div className="w-6 h-6 bg-[#8B4513]/30 rounded flex items-center justify-center">
                            <span className="text-[#8B4513] text-xs">📚</span>
                          </div>
                          <div className="w-6 h-6 bg-[#8B4513]/30 rounded flex items-center justify-center">
                            <span className="text-[#8B4513] text-xs">🎬</span>
                          </div>
                          <div className="w-6 h-6 bg-[#8B4513]/30 rounded flex items-center justify-center">
                            <span className="text-[#8B4513] text-xs">👤</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Phone 2 - Reels */}
                <div className="relative transform -rotate-6 hover:rotate-0 transition-transform duration-500 hover:scale-105">
                  <div className="w-64 h-[500px] bg-black rounded-[2.5rem] p-2 shadow-2xl">
                    <div className="w-full h-full bg-gradient-to-br from-[#8B4513]/10 to-[#8B4513]/5 rounded-[2rem] overflow-hidden">
                      <div className="bg-[#8B4513] h-12 flex items-center justify-center relative">
                        <div className="w-32 h-1 bg-white/30 rounded-full"></div>
                        <div className="absolute right-4 text-white text-xs">
                          9:41
                        </div>
                      </div>
                      <div className="h-full bg-gradient-to-b from-[#8B4513]/20 to-[#8B4513]/40 flex items-center justify-center relative">
                        <div className="text-center text-white">
                          <Zap className="w-16 h-16 mx-auto mb-4 animate-pulse" />
                          <p className="text-lg font-semibold">
                            Interactive Reels
                          </p>
                          <p className="text-sm opacity-80">
                            Physics Chapter 1
                          </p>
                        </div>

                        {/* Side Actions */}
                        <div className="absolute right-4 bottom-20 space-y-6">
                          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                            <span className="text-white">♥</span>
                          </div>
                          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                            <span className="text-white">💬</span>
                          </div>
                          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                            <span className="text-white">📤</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}