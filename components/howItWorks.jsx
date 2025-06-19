import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"


export default function HowItWorks() {
  return (
    <div>
      {/* How It Works Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#8B4513] mb-6">
              How Schools Can Register
            </h2>
            <p className="text-xl text-[#8B4513]/70 max-w-3xl mx-auto">
              We'll be available 24/7 for your calls - Daksh will be at your
              school as soon as you contact us
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[
              {
                step: '1',
                title: 'Contact Us',
                description:
                  "Reach out via email or mobile number. We're available 24/7 to assist you with the registration process.",
                details: [
                  'Email or phone contact',
                  '24/7 availability',
                  'Immediate response',
                ],
              },
              {
                step: '2',
                title: 'Provide Details',
                description:
                  'Share minimal school details and student information in our provided Excel format.',
                details: [
                  'School name & code',
                  'Class details',
                  'Student information',
                ],
              },
              {
                step: '3',
                title: 'Get Started',
                description:
                  'Receive digital & physical ID cards, plus login credentials for all students.',
                details: [
                  'Digital ID cards',
                  'Physical ID cards',
                  'Login credentials',
                ],
              },
            ].map((step, index) => (
              <Card
                key={index}
                className="bg-white/50 rounded-3xl border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <CardContent className="p-8 text-center">
                  <div className="w-20 h-20 bg-[#8B4513] text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                    {step.step}
                  </div>
                  <h3 className="text-2xl font-bold text-[#8B4513] mb-4">
                    {step.title}
                  </h3>
                  <p className="text-[#8B4513]/70 text-lg mb-6">
                    {step.description}
                  </p>
                  <div className="space-y-2">
                    {step.details.map((detail, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-center space-x-2 text-[#8B4513]/60"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-sm">{detail}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}