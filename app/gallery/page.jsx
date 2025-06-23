import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Play, ImageIcon, Users, Award, BookOpen, Zap } from 'lucide-react'

export default function Gallery() {
  return (
    <div className="min-h-screen bg-[#F5F1ED]">
      <Header />

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge
              variant="outline"
              className="mb-6 text-[#8B4513] border-[#8B4513]/30"
            >
              VISUAL GALLERY
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-[#8B4513] mb-6">
              Daksh in Action
            </h1>
            <p className="text-xl text-[#8B4513]/70 max-w-4xl mx-auto">
              Explore our visual gallery showcasing students learning, schools
              transforming, and the Daksh platform in action.
            </p>
          </div>
        </div>
      </section>

      {/* Platform Screenshots */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-[#8B4513] mb-16 text-center">
            Platform Interface
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            <Card className="bg-white/50 rounded-3xl border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-0">
                <div className="bg-gradient-to-br from-[#8B4513]/20 to-[#8B4513]/10 rounded-t-3xl h-48 flex items-center justify-center">
                  <Play className="w-16 h-16 text-[#8B4513]/50" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-[#8B4513] mb-2">
                    Interactive Reels
                  </h3>
                  <p className="text-[#8B4513]/70">
                    Students engaging with educational content through
                    Instagram-style reels
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/50 rounded-3xl border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-0">
                <div className="bg-gradient-to-br from-[#8B4513]/20 to-[#8B4513]/10 rounded-t-3xl h-48 flex items-center justify-center">
                  <BookOpen className="w-16 h-16 text-[#8B4513]/50" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-[#8B4513] mb-2">
                    Chapter-wise Content
                  </h3>
                  <p className="text-[#8B4513]/70">
                    Organized learning materials with voice notes and
                    interactive elements
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/50 rounded-3xl border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-0">
                <div className="bg-gradient-to-br from-[#8B4513]/20 to-[#8B4513]/10 rounded-t-3xl h-48 flex items-center justify-center">
                  <Users className="w-16 h-16 text-[#8B4513]/50" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-[#8B4513] mb-2">
                    Class Groups
                  </h3>
                  <p className="text-[#8B4513]/70">
                    Automatically created class groups for collaborative
                    learning
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/50 rounded-3xl border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-0">
                <div className="bg-gradient-to-br from-[#8B4513]/20 to-[#8B4513]/10 rounded-t-3xl h-48 flex items-center justify-center">
                  <Zap className="w-16 h-16 text-[#8B4513]/50" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-[#8B4513] mb-2">
                    Smart AI Features
                  </h3>
                  <p className="text-[#8B4513]/70">
                    AI-powered personalized learning recommendations and
                    analytics
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/50 rounded-3xl border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-0">
                <div className="bg-gradient-to-br from-[#8B4513]/20 to-[#8B4513]/10 rounded-t-3xl h-48 flex items-center justify-center">
                  <Award className="w-16 h-16 text-[#8B4513]/50" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-[#8B4513] mb-2">
                    Achievement System
                  </h3>
                  <p className="text-[#8B4513]/70">
                    Gamified learning with achievements and progress tracking
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/50 rounded-3xl border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-0">
                <div className="bg-gradient-to-br from-[#8B4513]/20 to-[#8B4513]/10 rounded-t-3xl h-48 flex items-center justify-center">
                  <ImageIcon className="w-16 h-16 text-[#8B4513]/50" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-[#8B4513] mb-2">
                    Visual Learning
                  </h3>
                  <p className="text-[#8B4513]/70">
                    Rich visual content including images, videos, and
                    interactive media
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Success Stories Gallery */}
      <section className="py-20 bg-white/30">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-[#8B4513] mb-16 text-center">
            Success Stories
          </h2>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <h3 className="text-3xl font-bold text-[#8B4513] mb-6">
                Rural School Transformation
              </h3>
              <p className="text-lg text-[#8B4513]/70 mb-8">
                A rural school in Rajasthan saw a 300% increase in student
                engagement after implementing Daksh. Students who previously
                struggled with traditional learning methods now actively
                participate in interactive reels and group discussions.
              </p>
              <Button className="bg-[#8B4513] text-white hover:bg-[#8B4513]/90 rounded-full px-8">
                View Full Story
              </Button>
            </div>
            <div className="bg-gradient-to-br from-[#8B4513]/20 to-[#8B4513]/10 rounded-3xl h-80 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl font-bold text-[#8B4513] mb-2">
                  300%
                </div>
                <p className="text-[#8B4513]/70 text-lg">Engagement Increase</p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="bg-gradient-to-br from-[#8B4513]/20 to-[#8B4513]/10 rounded-3xl h-80 flex items-center justify-center order-2 md:order-1">
              <div className="text-center">
                <div className="text-6xl font-bold text-[#8B4513] mb-2">
                  24/7
                </div>
                <p className="text-[#8B4513]/70 text-lg">Mentor Support</p>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <h3 className="text-3xl font-bold text-[#8B4513] mb-6">
                Always Available Support
              </h3>
              <p className="text-lg text-[#8B4513]/70 mb-8">
                Our dedicated mentors and content creators work around the clock
                to provide students with instant support and guidance. No
                question goes unanswered, no student is left behind.
              </p>
              <Button className="bg-[#8B4513] text-white hover:bg-[#8B4513]/90 rounded-full px-8">
                Meet Our Mentors
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Video Gallery */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-[#8B4513] mb-16 text-center">
            Video Gallery
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-white/50 rounded-3xl border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-0">
                <div className="bg-gradient-to-br from-[#8B4513]/20 to-[#8B4513]/10 rounded-t-3xl h-48 flex items-center justify-center relative">
                  <Play className="w-16 h-16 text-[#8B4513]/50" />
                  <div className="absolute top-4 right-4 bg-black/50 text-white px-2 py-1 rounded text-sm">
                    2:30
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-[#8B4513] mb-2">
                    Platform Overview
                  </h3>
                  <p className="text-[#8B4513]/70">
                    Complete walkthrough of the Daksh platform features
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/50 rounded-3xl border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-0">
                <div className="bg-gradient-to-br from-[#8B4513]/20 to-[#8B4513]/10 rounded-t-3xl h-48 flex items-center justify-center relative">
                  <Play className="w-16 h-16 text-[#8B4513]/50" />
                  <div className="absolute top-4 right-4 bg-black/50 text-white px-2 py-1 rounded text-sm">
                    1:45
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-[#8B4513] mb-2">
                    Student Testimonials
                  </h3>
                  <p className="text-[#8B4513]/70">
                    Hear directly from students about their Daksh experience
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/50 rounded-3xl border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-0">
                <div className="bg-gradient-to-br from-[#8B4513]/20 to-[#8B4513]/10 rounded-t-3xl h-48 flex items-center justify-center relative">
                  <Play className="w-16 h-16 text-[#8B4513]/50" />
                  <div className="absolute top-4 right-4 bg-black/50 text-white px-2 py-1 rounded text-sm">
                    3:15
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-[#8B4513] mb-2">
                    School Registration Process
                  </h3>
                  <p className="text-[#8B4513]/70">
                    Step-by-step guide for schools to join Daksh
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
