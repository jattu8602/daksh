import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Shield, FileText, Eye, Lock } from 'lucide-react'

export default function Policy() {
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
              LEGAL & PRIVACY
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-[#8B4513] mb-6">
              Privacy Policy & Terms
            </h1>
            <p className="text-xl text-[#8B4513]/70 max-w-4xl mx-auto">
              Your privacy and security are our top priorities. Learn about how
              we protect your data and the terms of using Daksh.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            <Card className="bg-white/50 rounded-3xl border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-[#8B4513]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Shield className="w-8 h-8 text-[#8B4513]" />
                </div>
                <h3 className="text-xl font-bold text-[#8B4513] mb-4">
                  Privacy Policy
                </h3>
                <p className="text-[#8B4513]/70">
                  How we collect, use, and protect your personal information
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/50 rounded-3xl border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-[#8B4513]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FileText className="w-8 h-8 text-[#8B4513]" />
                </div>
                <h3 className="text-xl font-bold text-[#8B4513] mb-4">
                  Terms of Service
                </h3>
                <p className="text-[#8B4513]/70">
                  Rules and guidelines for using the Daksh platform
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/50 rounded-3xl border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-[#8B4513]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Eye className="w-8 h-8 text-[#8B4513]" />
                </div>
                <h3 className="text-xl font-bold text-[#8B4513] mb-4">
                  Cookie Policy
                </h3>
                <p className="text-[#8B4513]/70">
                  Information about cookies and tracking technologies we use
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/50 rounded-3xl border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-[#8B4513]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Lock className="w-8 h-8 text-[#8B4513]" />
                </div>
                <h3 className="text-xl font-bold text-[#8B4513] mb-4">
                  Data Security
                </h3>
                <p className="text-[#8B4513]/70">
                  Our commitment to keeping your data safe and secure
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Privacy Policy Content */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="bg-white/50 rounded-3xl border-0 shadow-lg mb-12">
              <CardContent className="p-12">
                <h2 className="text-3xl font-bold text-[#8B4513] mb-8">
                  Privacy Policy
                </h2>
                <div className="space-y-8 text-[#8B4513]/70 text-lg leading-relaxed">
                  <div>
                    <h3 className="text-2xl font-semibold text-[#8B4513] mb-4">
                      Information We Collect
                    </h3>
                    <p>
                      We collect minimal information necessary to provide our
                      educational services. This includes school details (name,
                      code, email, mobile number), class information, and
                      student details (name, roll number, photo) as provided by
                      schools during registration.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-2xl font-semibold text-[#8B4513] mb-4">
                      How We Use Your Information
                    </h3>
                    <p>
                      Your information is used solely for educational purposes:
                      creating student accounts, providing learning content,
                      facilitating mentor support, and maintaining a safe
                      learning environment. We do not sell or share personal
                      information with third parties for commercial purposes.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-2xl font-semibold text-[#8B4513] mb-4">
                      Student Privacy & Safety
                    </h3>
                    <p>
                      Student privacy is paramount. We maintain minimal student
                      identity exposure for global connections, implement
                      instant content moderation, and provide 24/7 monitoring.
                      Students can manage their sessions and logout other
                      devices for security.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-2xl font-semibold text-[#8B4513] mb-4">
                      Data Security
                    </h3>
                    <p>
                      We implement industry-standard security measures to
                      protect your data. All information is encrypted in transit
                      and at rest. Our team continuously monitors for security
                      threats and maintains strict access controls.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/50 rounded-3xl border-0 shadow-lg">
              <CardContent className="p-12">
                <h2 className="text-3xl font-bold text-[#8B4513] mb-8">
                  Terms & Conditions
                </h2>
                <div className="space-y-8 text-[#8B4513]/70 text-lg leading-relaxed">
                  <div>
                    <h3 className="text-2xl font-semibold text-[#8B4513] mb-4">
                      Platform Usage
                    </h3>
                    <p>
                      Daksh is an educational platform designed for students and
                      schools. Users must use the platform responsibly and in
                      accordance with educational purposes. Any misuse,
                      including sharing inappropriate content, will result in
                      immediate account suspension.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-2xl font-semibold text-[#8B4513] mb-4">
                      School Registration
                    </h3>
                    <p>
                      Schools must provide accurate information during
                      registration. By registering, schools agree to our terms
                      and commit to using the platform for educational purposes
                      only. Schools are responsible for ensuring their students
                      follow platform guidelines.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-2xl font-semibold text-[#8B4513] mb-4">
                      Content Guidelines
                    </h3>
                    <p>
                      All content must be educational and appropriate for
                      students. Harmful, inappropriate, or 18+ content is
                      strictly prohibited and will result in instant bans. Our
                      moderation team works 24/7 to maintain a safe learning
                      environment.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-2xl font-semibold text-[#8B4513] mb-4">
                      Account Security
                    </h3>
                    <p>
                      Students must keep their login credentials secure and
                      change passwords immediately upon receiving them. If
                      credentials are compromised, contact our support team
                      immediately for assistance. Students can monitor and
                      manage their active sessions.
                    </p>
                  </div>
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
