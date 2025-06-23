import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Play, BookOpen, Users, Shield, Zap, Globe } from "lucide-react"

export default function Features() {
  return (
    <div>
      {/* Features Section */};
      <section className="py-20 bg-white/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge
              variant="outline"
              className="mb-6 text-[#8B4513] border-[#8B4513]/30"
            >
              PLATFORM FEATURES
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-[#8B4513] mb-6">
              Why Schools Choose Daksh?
            </h2>
            <p className="text-xl text-[#8B4513]/70 max-w-3xl mx-auto">
              Several schools are registering their students to Daksh and
              working hard with us to provide students new era knowledge through
              our innovative platform.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Play,
                title: 'Interactive Reels',
                description:
                  'Students get involved and learn quickly through engaging video content, just like their favorite social media apps.',
              },
              {
                icon: BookOpen,
                title: 'Chapter-wise Content',
                description:
                  'Books, voice notes, and organized content with familiar social media interface for easy student engagement.',
              },
              {
                icon: Users,
                title: '24/7 Mentors',
                description:
                  'Dedicated mentors and content creators work continuously to provide better education and instant support.',
              },
              {
                icon: Shield,
                title: 'Safe Environment',
                description:
                  'Harmful and 18+ content gets instant ban by our dedicated team, ensuring a safe learning environment.',
              },
              {
                icon: Zap,
                title: 'Smart AI & Games',
                description:
                  "Daksh Smart AI and educational games make learning fun and personalized for every student's needs.",
              },
              {
                icon: Globe,
                title: 'Global Connection',
                description:
                  'Connect with students globally while maintaining privacy with minimal student identity exposure.',
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="bg-white/50 rounded-3xl border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
              >
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-[#8B4513]/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-[#8B4513]/30 transition-colors duration-300">
                    <feature.icon className="w-8 h-8 text-[#8B4513]" />
                  </div>
                  <h3 className="text-xl font-bold text-[#8B4513] mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-[#8B4513]/70">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}