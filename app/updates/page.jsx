import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, User, ArrowRight } from 'lucide-react'

export default function Updates() {
  const blogPosts = [
    {
      title: 'Daksh Reaches 1000+ Schools Milestone',
      excerpt:
        "We're excited to announce that Daksh has successfully onboarded over 1000 schools across India, transforming education for thousands of students.",
      date: '2025-01-15',
      author: 'Daksh Team',
      category: 'Milestone',
    },
    {
      title: 'New AI Features Launch: Personalized Learning Paths',
      excerpt:
        "Our latest AI update introduces personalized learning paths that adapt to each student's learning style and pace for better educational outcomes.",
      date: '2025-01-10',
      author: 'Tech Team',
      category: 'Product Update',
    },
    {
      title: 'Student Safety: Our Zero-Tolerance Policy',
      excerpt:
        'Learn about our comprehensive safety measures and instant content moderation system that keeps our platform safe for all students.',
      date: '2025-01-05',
      author: 'Safety Team',
      category: 'Safety',
    },
    {
      title: 'Success Story: Rural School Transformation',
      excerpt:
        "How a rural school in Rajasthan increased student engagement by 300% using Daksh's interactive learning platform.",
      date: '2024-12-28',
      author: 'Success Stories',
      category: 'Case Study',
    },
    {
      title: '24/7 Mentor Program: Behind the Scenes',
      excerpt:
        'Meet our dedicated mentors who work around the clock to provide students with instant support and guidance.',
      date: '2024-12-20',
      author: 'Mentor Team',
      category: 'Team Spotlight',
    },
    {
      title: 'Interactive Reels: The Future of Learning',
      excerpt:
        'Discover how our Instagram-style reels are revolutionizing the way students consume and engage with educational content.',
      date: '2024-12-15',
      author: 'Content Team',
      category: 'Innovation',
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
              LATEST UPDATES
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-[#8B4513] mb-6">
              Daksh Blog & Updates
            </h1>
            <p className="text-xl text-[#8B4513]/70 max-w-4xl mx-auto">
              Stay updated with the latest news, features, success stories, and
              insights from the Daksh educational platform.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="bg-white/50 rounded-3xl border-0 shadow-lg mb-16">
            <CardContent className="p-12">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <Badge className="bg-[#8B4513] text-white mb-4">
                    Featured
                  </Badge>
                  <h2 className="text-3xl md:text-4xl font-bold text-[#8B4513] mb-6">
                    Daksh Reaches 1000+ Schools Milestone
                  </h2>
                  <p className="text-lg text-[#8B4513]/70 mb-8">
                    We're thrilled to announce that Daksh has successfully
                    onboarded over 1000 schools across India, transforming
                    education for thousands of students through our innovative
                    Instagram-like learning platform.
                  </p>
                  <div className="flex items-center space-x-6 mb-8">
                    <div className="flex items-center space-x-2 text-[#8B4513]/60">
                      <Calendar className="w-4 h-4" />
                      <span>January 15, 2025</span>
                    </div>
                    <div className="flex items-center space-x-2 text-[#8B4513]/60">
                      <User className="w-4 h-4" />
                      <span>Daksh Team</span>
                    </div>
                  </div>
                  <Button className="bg-[#8B4513] text-white hover:bg-[#8B4513]/90 rounded-full px-8">
                    Read Full Story
                  </Button>
                </div>
                <div className="bg-gradient-to-br from-[#8B4513]/20 to-[#8B4513]/10 rounded-2xl h-80 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl font-bold text-[#8B4513] mb-2">
                      1000+
                    </div>
                    <p className="text-[#8B4513]/70 text-lg">
                      Schools Onboarded
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <Card
                key={index}
                className="bg-white/50 rounded-3xl border-0 shadow-lg hover:shadow-xl transition-shadow"
              >
                <CardContent className="p-8">
                  <Badge
                    variant="outline"
                    className="mb-4 text-[#8B4513] border-[#8B4513]/30"
                  >
                    {post.category}
                  </Badge>
                  <h3 className="text-xl font-bold text-[#8B4513] mb-4 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-[#8B4513]/70 mb-6 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-2 text-sm text-[#8B4513]/60">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(post.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-[#8B4513]/60">
                      <User className="w-4 h-4" />
                      <span>{post.author}</span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full border-[#8B4513] text-[#8B4513] hover:bg-[#8B4513]/10 rounded-full"
                  >
                    Read More <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
