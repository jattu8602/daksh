'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Star, Quote, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'

export default function Reviews() {
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
              TESTIMONIALS & FAQ
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-[#8B4513] mb-6">
              What Schools & Students Say
            </h1>
            <p className="text-xl text-[#8B4513]/70 max-w-4xl mx-auto">
              Hear from schools and students who have transformed their learning
              experience with Daksh.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-20">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-[#8B4513] mb-2">
                1000+
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
                4.9/5
              </div>
              <p className="text-[#8B4513]/70 text-lg">Average Rating</p>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-[#8B4513] mb-2">
                98%
              </div>
              <p className="text-[#8B4513]/70 text-lg">Satisfaction Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-[#8B4513] mb-16 text-center">
            School Testimonials
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            <Card className="bg-white/50 rounded-3xl border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <Quote className="w-8 h-8 text-[#8B4513]/30 mb-4" />
                <p className="text-[#8B4513]/70 mb-6 text-lg">
                  "Daksh has completely transformed how our students engage with
                  learning. The Instagram-like interface makes education fun and
                  accessible. Our student engagement has increased by 300%."
                </p>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-[#8B4513]/20 rounded-full flex items-center justify-center">
                    <span className="text-[#8B4513] font-bold">RS</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#8B4513]">
                      Rajesh Sharma
                    </h4>
                    <p className="text-[#8B4513]/60 text-sm">
                      Principal, Delhi Public School
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/50 rounded-3xl border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <Quote className="w-8 h-8 text-[#8B4513]/30 mb-4" />
                <p className="text-[#8B4513]/70 mb-6 text-lg">
                  "The 24/7 mentor support is incredible. Our students get
                  instant help whenever they need it. The platform is safe,
                  engaging, and educationally effective."
                </p>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-[#8B4513]/20 rounded-full flex items-center justify-center">
                    <span className="text-[#8B4513] font-bold">PG</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#8B4513]">
                      Priya Gupta
                    </h4>
                    <p className="text-[#8B4513]/60 text-sm">
                      Director, Modern School
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/50 rounded-3xl border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <Quote className="w-8 h-8 text-[#8B4513]/30 mb-4" />
                <p className="text-[#8B4513]/70 mb-6 text-lg">
                  "Registration was seamless, and the support team was available
                  24/7. The digital and physical ID cards for students are a
                  great touch. Highly recommended!"
                </p>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-[#8B4513]/20 rounded-full flex items-center justify-center">
                    <span className="text-[#8B4513] font-bold">AK</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#8B4513]">Amit Kumar</h4>
                    <p className="text-[#8B4513]/60 text-sm">
                      Vice Principal, St. Mary's School
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white/30">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-[#8B4513] mb-16 text-center">
            Frequently Asked Questions
          </h2>

          <div className="max-w-4xl mx-auto space-y-6">
            <FAQItem
              question="How can schools register with Daksh?"
              answer="Schools can register by contacting us via email or mobile number. We're available 24/7 for calls. The registration process requires minimal details: school name, school code, email, mobile number, class details with sections, and student information in our provided Excel format."
            />

            <FAQItem
              question="What does Daksh provide to schools after registration?"
              answer="After registration, we provide digital and physical ID cards for students, plus a fully functional Excel sheet containing student login details including name, roll number, username, password, QR code, and unique student code."
            />

            <FAQItem
              question="What if a student loses their login credentials?"
              answer="Daksh takes care of such situations immediately. Call us right away, and we'll provide a new password to the student. Students are asked to change their username and password immediately after receiving credentials. They can also check active sessions and logout other sessions using their latest password."
            />

            <FAQItem
              question="Is the platform safe for students?"
              answer="We have a zero-tolerance policy for harmful and 18+ content with instant bans by our dedicated team. Students connect globally with minimal identity exposure, and our 24/7 monitoring ensures a completely safe learning environment."
            />

            <FAQItem
              question="How does the Instagram-like interface work for education?"
              answer="Our platform features interactive reels, posts, highlights, chapter-wise content, voice notes, and books. The familiar social media interface helps students engage easily while learning. We have dedicated mentors and content creators working 24/7 to provide quality educational content."
            />

            <FAQItem
              question="What features are included in the platform?"
              answer="Daksh includes interactive reels, chapter-wise content, 24/7 mentors, Smart AI, educational games, explore section for free courses, follow/follow-back system, automatically created class groups, global student connections, and comprehensive analytics."
            />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

function FAQItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Card className="bg-white/50 rounded-2xl border-0 shadow-lg">
      <CardContent className="p-0">
        <button
          className="w-full p-8 text-left flex items-center justify-between hover:bg-white/30 transition-colors rounded-2xl"
          onClick={() => setIsOpen(!isOpen)}
        >
          <h3 className="text-xl font-semibold text-[#8B4513] pr-4">
            {question}
          </h3>
          {isOpen ? (
            <ChevronUp className="w-6 h-6 text-[#8B4513] flex-shrink-0" />
          ) : (
            <ChevronDown className="w-6 h-6 text-[#8B4513] flex-shrink-0" />
          )}
        </button>
        {isOpen && (
          <div className="px-8 pb-8">
            <p className="text-[#8B4513]/70 text-lg leading-relaxed">
              {answer}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
