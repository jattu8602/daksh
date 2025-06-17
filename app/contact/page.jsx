import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Phone, Mail, Clock, MapPin, CheckCircle } from 'lucide-react'

export default function Contact() {
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
              GET IN TOUCH
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-[#8B4513] mb-6">
              Contact Daksh
            </h1>
            <p className="text-xl text-[#8B4513]/70 max-w-3xl mx-auto">
              Ready to transform your school's learning experience? We're
              available 24/7 to help you get started with Daksh. Contact us via
              email or mobile number - we'll be at your school as soon as you
              reach out!
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold text-[#8B4513] mb-8">
                Register Your School
              </h2>
              <p className="text-lg text-[#8B4513]/70 mb-8">
                Fill out this form with your school details and we'll get back
                to you within 2-4 hours to start the registration process.
              </p>

              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="schoolName"
                      className="block text-[#8B4513] font-medium mb-2"
                    >
                      School Name *
                    </label>
                    <Input
                      id="schoolName"
                      type="text"
                      placeholder="Enter your school name"
                      className="bg-white/50 border-[#8B4513]/20 text-[#8B4513] h-12 focus:border-[#8B4513] focus:ring-[#8B4513]"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="schoolCode"
                      className="block text-[#8B4513] font-medium mb-2"
                    >
                      School Code *
                    </label>
                    <Input
                      id="schoolCode"
                      type="text"
                      placeholder="School identification code"
                      className="bg-white/50 border-[#8B4513]/20 text-[#8B4513] h-12 focus:border-[#8B4513] focus:ring-[#8B4513]"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-[#8B4513] font-medium mb-2"
                    >
                      Email Address *
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="school@example.com"
                      className="bg-white/50 border-[#8B4513]/20 text-[#8B4513] h-12 focus:border-[#8B4513] focus:ring-[#8B4513]"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-[#8B4513] font-medium mb-2"
                    >
                      Mobile Number *
                    </label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+91 XXXXX XXXXX"
                      className="bg-white/50 border-[#8B4513]/20 text-[#8B4513] h-12 focus:border-[#8B4513] focus:ring-[#8B4513]"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="students"
                      className="block text-[#8B4513] font-medium mb-2"
                    >
                      Number of Students
                    </label>
                    <Input
                      id="students"
                      type="number"
                      placeholder="e.g., 500"
                      className="bg-white/50 border-[#8B4513]/20 text-[#8B4513] h-12 focus:border-[#8B4513] focus:ring-[#8B4513]"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="classes"
                      className="block text-[#8B4513] font-medium mb-2"
                    >
                      Classes (e.g., 1-12)
                    </label>
                    <Input
                      id="classes"
                      type="text"
                      placeholder="1-12 or specific classes"
                      className="bg-white/50 border-[#8B4513]/20 text-[#8B4513] h-12 focus:border-[#8B4513] focus:ring-[#8B4513]"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-[#8B4513] font-medium mb-2"
                  >
                    Additional Information
                  </label>
                  <Textarea
                    id="message"
                    placeholder="Tell us about your school, specific requirements, or any questions you have..."
                    rows={6}
                    className="bg-white/50 border-[#8B4513]/20 text-[#8B4513] focus:border-[#8B4513] focus:ring-[#8B4513]"
                  />
                </div>

                <Button className="w-full bg-[#8B4513] text-white hover:bg-[#8B4513]/90 hover:scale-105 rounded-full py-4 text-lg transition-all duration-300 shadow-lg hover:shadow-xl">
                  Submit Registration & Schedule Demo
                </Button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-[#8B4513] mb-8">
                  Get in Touch
                </h2>
                <p className="text-lg text-[#8B4513]/70 mb-8">
                  We're here to help you transform your school's educational
                  experience. Reach out to us through any of the following
                  channels and we'll be at your school as soon as you contact
                  us.
                </p>
              </div>

              <div className="space-y-6">
                <Card className="bg-white/50 rounded-2xl border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-[#8B4513]/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <Phone className="w-6 h-6 text-[#8B4513]" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-[#8B4513] mb-2">
                          24/7 Phone Support
                        </h3>
                        <p className="text-[#8B4513]/70 mb-2">
                          Call us anytime for immediate assistance
                        </p>
                        <p className="text-[#8B4513] font-medium">
                          +91 XXXXX XXXXX
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/50 rounded-2xl border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-[#8B4513]/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <Mail className="w-6 h-6 text-[#8B4513]" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-[#8B4513] mb-2">
                          Email Support
                        </h3>
                        <p className="text-[#8B4513]/70 mb-2">
                          Send us your queries and requirements
                        </p>
                        <p className="text-[#8B4513] font-medium">
                          contact@daksh.edu
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/50 rounded-2xl border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-[#8B4513]/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <Clock className="w-6 h-6 text-[#8B4513]" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-[#8B4513] mb-2">
                          Response Time
                        </h3>
                        <p className="text-[#8B4513]/70 mb-2">
                          We respond to all inquiries within
                        </p>
                        <p className="text-[#8B4513] font-medium">2-4 hours</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/50 rounded-2xl border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-[#8B4513]/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-6 h-6 text-[#8B4513]" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-[#8B4513] mb-2">
                          On-Site Visits
                        </h3>
                        <p className="text-[#8B4513]/70 mb-2">
                          We'll visit your school for demos
                        </p>
                        <p className="text-[#8B4513] font-medium">
                          Pan India Coverage
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* What We Provide */}
              <Card className="bg-[#8B4513] text-white rounded-2xl border-0 shadow-lg">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-6">
                    What Daksh Provides
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-300" />
                      <span>Digital and Physical ID cards for students</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-300" />
                      <span>
                        Fully functional Excel sheet with login credentials
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-300" />
                      <span>
                        Username, password, QR code, and unique student codes
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-300" />
                      <span>
                        24/7 support for password recovery and security
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
