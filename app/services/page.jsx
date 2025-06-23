import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Play,
  BookOpen,
  Users,
  Zap,
  Shield,
  Globe,
  Gamepad2,
  Search,
} from 'lucide-react'

export default function Services() {
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
              OUR FEATURES
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-[#8B4513] mb-6">
              Instagram for Students
              <br />
              <span className="text-[#8B4513]/70">
                Complete Learning Platform
              </span>
            </h1>
            <p className="text-xl text-[#8B4513]/70 max-w-4xl mx-auto">
              Daksh provides a comprehensive learning experience through
              interactive reels, posts, highlights, and 24/7 mentor support.
              Students just need a mobile device to access our engaging
              educational content.
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-white/50 rounded-3xl border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-[#8B4513]/20 rounded-full flex items-center justify-center mb-6">
                  <Play className="w-8 h-8 text-[#8B4513]" />
                </div>
                <h3 className="text-2xl font-bold text-[#8B4513] mb-4">
                  Interactive Reels
                </h3>
                <p className="text-[#8B4513]/70 text-lg">
                  Interactive way where students get involved and learn quickly
                  through engaging video content, similar to popular social
                  media platforms.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/50 rounded-3xl border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-[#8B4513]/20 rounded-full flex items-center justify-center mb-6">
                  <BookOpen className="w-8 h-8 text-[#8B4513]" />
                </div>
                <h3 className="text-2xl font-bold text-[#8B4513] mb-4">
                  Chapter-wise Content
                </h3>
                <p className="text-[#8B4513]/70 text-lg">
                  Books, voice notes, and chapter-wise content with an interface
                  similar to famous social media apps for easy student
                  engagement.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/50 rounded-3xl border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-[#8B4513]/20 rounded-full flex items-center justify-center mb-6">
                  <Users className="w-8 h-8 text-[#8B4513]" />
                </div>
                <h3 className="text-2xl font-bold text-[#8B4513] mb-4">
                  24/7 Mentors & Creators
                </h3>
                <p className="text-[#8B4513]/70 text-lg">
                  Mentors and Daksh official content creators work regularly
                  24/7 to provide students better education and instant support.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/50 rounded-3xl border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-[#8B4513]/20 rounded-full flex items-center justify-center mb-6">
                  <Shield className="w-8 h-8 text-[#8B4513]" />
                </div>
                <h3 className="text-2xl font-bold text-[#8B4513] mb-4">
                  Safe Environment
                </h3>
                <p className="text-[#8B4513]/70 text-lg">
                  Harmful and 18+ content gets instant ban by Daksh team,
                  ensuring a completely safe learning environment for all
                  students.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/50 rounded-3xl border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-[#8B4513]/20 rounded-full flex items-center justify-center mb-6">
                  <Zap className="w-8 h-8 text-[#8B4513]" />
                </div>
                <h3 className="text-2xl font-bold text-[#8B4513] mb-4">
                  Daksh Smart AI
                </h3>
                <p className="text-[#8B4513]/70 text-lg">
                  Advanced AI technology that personalizes learning experiences
                  and provides intelligent recommendations for each student.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/50 rounded-3xl border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-[#8B4513]/20 rounded-full flex items-center justify-center mb-6">
                  <Gamepad2 className="w-8 h-8 text-[#8B4513]" />
                </div>
                <h3 className="text-2xl font-bold text-[#8B4513] mb-4">
                  Educational Games
                </h3>
                <p className="text-[#8B4513]/70 text-lg">
                  Interactive games that make learning fun and engaging while
                  reinforcing educational concepts through play.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/50 rounded-3xl border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-[#8B4513]/20 rounded-full flex items-center justify-center mb-6">
                  <Globe className="w-8 h-8 text-[#8B4513]" />
                </div>
                <h3 className="text-2xl font-bold text-[#8B4513] mb-4">
                  Global Student Connect
                </h3>
                <p className="text-[#8B4513]/70 text-lg">
                  Connect with students globally while maintaining privacy with
                  very minimal student identity exposure for safe interactions.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/50 rounded-3xl border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-[#8B4513]/20 rounded-full flex items-center justify-center mb-6">
                  <Search className="w-8 h-8 text-[#8B4513]" />
                </div>
                <h3 className="text-2xl font-bold text-[#8B4513] mb-4">
                  Explore Section
                </h3>
                <p className="text-[#8B4513]/70 text-lg">
                  Dedicated explore section for free courses and analytics
                  maintenance, helping students discover new learning
                  opportunities.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/50 rounded-3xl border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-[#8B4513]/20 rounded-full flex items-center justify-center mb-6">
                  <Users className="w-8 h-8 text-[#8B4513]" />
                </div>
                <h3 className="text-2xl font-bold text-[#8B4513] mb-4">
                  Auto Class Groups
                </h3>
                <p className="text-[#8B4513]/70 text-lg">
                  Class groups are automatically created, and students can
                  follow mentors and other students for collaborative learning.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Video Demo Section */}
      <section className="py-20 bg-white/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#8B4513] mb-6">
              See Daksh in Action
            </h2>
            <p className="text-xl text-[#8B4513]/70 max-w-3xl mx-auto">
              Watch how our platform transforms traditional learning into an
              engaging, social media-like experience.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-[#8B4513]/20 to-[#8B4513]/10 rounded-3xl p-8 h-96 flex items-center justify-center">
              <div className="text-center">
                <div className="w-24 h-24 bg-[#8B4513] rounded-full flex items-center justify-center mx-auto mb-6">
                  <Play className="w-12 h-12 text-white ml-1" />
                </div>
                <h3 className="text-2xl font-bold text-[#8B4513] mb-4">
                  Platform Demo Video
                </h3>
                <p className="text-[#8B4513]/70">
                  Click to watch our comprehensive platform walkthrough
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
