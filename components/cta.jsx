import { Button } from "@/components/ui/button"

import Link from "next/link"

export default function CTA() {
  return (
    <div>
      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[#8B4513]/10 to-[#8B4513]/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-[#8B4513] mb-8">
            Ready to Transform Your School's Learning Experience?
          </h2>
          <p className="text-xl text-[#8B4513]/70 mb-12 max-w-3xl mx-auto">
            Join thousands of schools already using Daksh to provide their
            students with engaging, interactive, and safe educational content.
            Hurry up and tie up your school to Daksh!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              className="bg-[#8B4513] text-white hover:bg-[#8B4513]/90 hover:scale-105 rounded-full px-8 py-4 text-lg transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <Link href="/contact">Register Your School Now</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-[#8B4513] text-[#8B4513] hover:bg-[#8B4513]/10 hover:scale-105 rounded-full px-8 py-4 text-lg transition-all duration-300"
            >
              <Link href="/services">Explore All Features</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}