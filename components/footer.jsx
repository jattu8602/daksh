import { Instagram, Linkedin, Facebook } from "lucide-react"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-6xl md:text-8xl lg:text-9xl font-bold text-black mb-8">daksh</h2>
          <div className="flex justify-between items-start">
            <div className="text-left">
              <p className="text-lg text-[#8B4513]/70 mb-8">
                shaping tomorrow,
                <br />
                one school at a time.
              </p>
              <div className="flex space-x-6 mb-12">
                <Link
                  href="#"
                  className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white hover:bg-black/80"
                >
                  <Instagram className="w-5 h-5" />
                </Link>
                <Link
                  href="#"
                  className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white hover:bg-black/80"
                >
                  <Linkedin className="w-5 h-5" />
                </Link>
                <Link
                  href="#"
                  className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white hover:bg-black/80"
                >
                  <Facebook className="w-5 h-5" />
                </Link>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xl text-[#8B4513] mb-4">@just ₹1 per day</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-[#8B4513]/20">
          <p className="text-[#8B4513]/70 mb-4 md:mb-0">© 2025 – Muskan@daksh</p>
          <div className="flex space-x-8">
            <Link href="/policy" className="text-[#8B4513]/70 hover:text-[#8B4513]">
              Privacy Policy
            </Link>
            <Link href="/policy" className="text-[#8B4513]/70 hover:text-[#8B4513]">
              Cookies
            </Link>
            <Link href="/policy" className="text-[#8B4513]/70 hover:text-[#8B4513]">
              Terms & Conditions
            </Link>
          </div>
          <div className="text-[#8B4513]/70 text-sm mt-4 md:mt-0">🔗 Made in Framer</div>
        </div>
      </div>
    </footer>
  )
}
