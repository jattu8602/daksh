'use client'

import { Button } from '@/components/ui/button'
import { ChevronLeft, MoreHorizontal } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function PrivacyPolicyScreen() {
  const router = useRouter()
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="bg-card p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-lg font-semibold">Privacy Policy</h1>
          <Button variant="ghost" size="icon"></Button>
        </div>
      </div>

      {/* Content */}
      <div className="bg-card p-4 space-y-6">
        <div className="text-sm text-muted-foreground mb-4">
          Effective Date: December 19, 2024
        </div>

        <div className="space-y-4 text-sm leading-relaxed">
          <p>
            Welcome to Loyalty! Your privacy is important to us. This Privacy
            Policy outlines how we collect, use, and protect your personal
            information when you use our app.
          </p>

          <div>
            <h3 className="font-semibold text-foreground mb-2">
              1. Information We Collect:
            </h3>
            <p className="text-muted-foreground">
              We collect basic user information such as name, email, and
              location for account creation and personalized services.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-2">
              2. How We Use Your Information:
            </h3>
            <p className="text-muted-foreground">
              Your information is used to provide personalized rewards, improve
              our services, and send relevant notifications. We do not sell your
              data.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-2">
              3. Data Security:
            </h3>
            <p className="text-muted-foreground">
              We use industry-standard security measures to protect your data.
              However, please be aware that no online platform is entirely
              secure.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-2">
              4. Third-Party Services:
            </h3>
            <p className="text-muted-foreground">
              Loyalty may integrate with third-party services. Please review
              their privacy policies.
            </p>
          </div>

          <div className="pt-4 border-t border-border">
            <h2 className="font-semibold text-lg text-foreground mb-4">
              Terms of Service
            </h2>
            <div className="text-sm text-muted-foreground mb-4">
              Effective Date: December 19, 2024
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-2">
                1. User Eligibility:
              </h3>
              <p className="text-muted-foreground mb-4">
                Users must be at least 13 years old to use Loyalty. Users under
                18 require parental consent.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-2">
                2. Account Creation:
              </h3>
              <p className="text-muted-foreground mb-4">
                You are responsible for accurate information during account
                creation. Do not share login credentials.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-2">
                3. Earning and Redeeming Points:
              </h3>
              <p className="text-muted-foreground mb-4">
                Points are earned through eligible activities as outlined in the
                app. Points have expiration dates.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-2">
                4. Tier System:
              </h3>
              <p className="text-muted-foreground mb-4">
                Loyalty operates on a tier system. Each tier has associated
                benefits. The criteria for each tier are outlined in the app.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-2">
                5. Notification Settings:
              </h3>
              <p className="text-muted-foreground">
                Users can customize notification preferences in the app.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
