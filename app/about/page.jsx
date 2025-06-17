import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Users, Target, Eye, Award } from 'lucide-react'
import Image from 'next/image'

export default function About() {
  const teamMembers = [
    {
      name: 'Rahul Sharma',
      role: 'Founder & CEO',
      image: '/placeholder.svg?height=200&width=200',
    },
    {
      name: 'Priya Patel',
      role: 'Head of Education',
      image: '/placeholder.svg?height=200&width=200',
    },
    {
      name: 'Amit Kumar',
      role: 'Tech Lead',
      image: '/placeholder.svg?height=200&width=200',
    },
    {
      name: 'Sneha Gupta',
      role: 'Content Director',
      image: '/placeholder.svg?height=200&width=200',
    },
    {
      name: 'Vikash Singh',
      role: 'Product Manager',
      image: '/placeholder.svg?height=200&width=200',
    },
    {
      name: 'Anita Rao',
      role: 'Community Manager',
      image: '/placeholder.svg?height=200&width=200',
    },
  ]

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
              ABOUT DAKSH
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-[#8B4513] mb-6">
              Revolutionizing Education
              <br />
              <span className="text-[#8B4513]/70">One School at a Time</span>
            </h1>
            <p className="text-xl text-[#8B4513]/70 max-w-4xl mx-auto leading-relaxed">
              Daksh is more than just an educational platform - we're building
              the future of learning. Our mission is to make quality education
              accessible, engaging, and fun for every student through innovative
              technology and dedicated mentorship.
            </p>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-20 bg-white/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-white/50 rounded-3xl border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-[#8B4513]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Target className="w-8 h-8 text-[#8B4513]" />
                </div>
                <h3 className="text-2xl font-bold text-[#8B4513] mb-4">
                  Our Mission
                </h3>
                <p className="text-[#8B4513]/70 text-lg">
                  To transform traditional education by creating an
                  Instagram-like platform where students learn through
                  interactive content, connecting schools globally with
                  innovative teaching methods.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/50 rounded-3xl border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-[#8B4513]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Eye className="w-8 h-8 text-[#8B4513]" />
                </div>
                <h3 className="text-2xl font-bold text-[#8B4513] mb-4">
                  Our Vision
                </h3>
                <p className="text-[#8B4513]/70 text-lg">
                  To become the world's leading educational social platform,
                  where every student has access to quality education through
                  engaging, safe, and personalized learning experiences.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/50 rounded-3xl border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-[#8B4513]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Award className="w-8 h-8 text-[#8B4513]" />
                </div>
                <h3 className="text-2xl font-bold text-[#8B4513] mb-4">
                  Our Values
                </h3>
                <p className="text-[#8B4513]/70 text-lg">
                  Innovation, Safety, Accessibility, and Excellence. We believe
                  in creating a secure learning environment where creativity
                  meets education, making learning enjoyable for every student.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-[#8B4513] mb-8">
                Our Story
              </h2>
              <div className="space-y-6 text-lg text-[#8B4513]/70">
                <p>
                  Daksh was born from a simple observation: students spend hours
                  on social media, but struggle to engage with traditional
                  educational content. We asked ourselves - what if we could
                  combine the engagement of social media with the power of
                  education?
                </p>
                <p>
                  Our journey began with a small team of educators and
                  technologists who believed that learning should be as engaging
                  as scrolling through your favorite social app. We developed a
                  platform that speaks the language students understand -
                  visual, interactive, and social.
                </p>
                <p>
                  Today, Daksh serves hundreds of schools and thousands of
                  students, providing 24/7 mentorship, interactive content, and
                  a safe learning environment. Our dedicated team works
                  continuously to ensure every student has access to quality
                  education in a format they love.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-[#8B4513]/20 to-[#8B4513]/10 rounded-3xl p-8 h-96 flex items-center justify-center">
                <Users className="w-32 h-32 text-[#8B4513]/50" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#8B4513] mb-6">
              Meet Our Team
            </h2>
            <p className="text-xl text-[#8B4513]/70 max-w-3xl mx-auto">
              Daksh has a large number of people working continuously to provide
              the best educational experience for students worldwide.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <Card
                key={index}
                className="bg-white/50 rounded-3xl border-0 shadow-lg hover:shadow-xl transition-shadow"
              >
                <CardContent className="p-8 text-center">
                  <div className="w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden bg-[#8B4513]/20">
                    <Image
                      src={member.image || '/placeholder.svg'}
                      alt={member.name}
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-[#8B4513] mb-2">
                    {member.name}
                  </h3>
                  <p className="text-[#8B4513]/70 mb-4">{member.role}</p>
                  <div className="flex justify-center space-x-3">
                    <a
                      href="#"
                      className="w-8 h-8 bg-[#8B4513]/20 rounded-full flex items-center justify-center hover:bg-[#8B4513]/30 transition-colors"
                    >
                      <span className="text-xs text-[#8B4513]">in</span>
                    </a>
                    <a
                      href="#"
                      className="w-8 h-8 bg-[#8B4513]/20 rounded-full flex items-center justify-center hover:bg-[#8B4513]/30 transition-colors"
                    >
                      <span className="text-xs text-[#8B4513]">tw</span>
                    </a>
                    <a
                      href="#"
                      className="w-8 h-8 bg-[#8B4513]/20 rounded-full flex items-center justify-center hover:bg-[#8B4513]/30 transition-colors"
                    >
                      <span className="text-xs text-[#8B4513]">ig</span>
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#8B4513] mb-6">
              Our Achievements
            </h2>
            <p className="text-xl text-[#8B4513]/70">
              Milestones that define our journey
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-[#8B4513] mb-2">
                500+
              </div>
              <p className="text-[#8B4513]/70 text-lg">Schools Registered</p>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-[#8B4513] mb-2">
                50K+
              </div>
              <p className="text-[#8B4513]/70 text-lg">Active Students</p>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-[#8B4513] mb-2">
                24/7
              </div>
              <p className="text-[#8B4513]/70 text-lg">Mentor Support</p>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-[#8B4513] mb-2">
                100%
              </div>
              <p className="text-[#8B4513]/70 text-lg">Safe Environment</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
