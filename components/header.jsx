'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import SplashScreen from '@/app/components/SplashScreen'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/services', label: 'Services' },
    { href: '/updates', label: 'Updates' },
    { href: '/reviews', label: 'Reviews' },
    { href: '/gallery', label: 'Gallery' },
    { href: '/policy', label: 'Policy' },
  ]

  const isActive = (href) => {
    if (href === '/' && pathname === '/') return true
    if (href !== '/' && pathname.startsWith(href)) return true
    return false
  }

  return (
    <>

      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#F5F1ED]/95 backdrop-blur-md shadow-lg border-b border-[#8B4513]/10'
            : 'bg-[#F5F1ED]/80 backdrop-blur-sm'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link
              href="/"
              className="text-2xl lg:text-3xl font-bold text-black hover:text-[#8B4513] transition-colors duration-300 transform hover:scale-105"
            >
              daksh
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative px-4 py-2 rounded-full font-medium transition-all duration-300 hover:bg-[#8B4513]/10 ${
                    isActive(item.href)
                      ? 'text-[#8B4513] bg-[#8B4513]/5'
                      : 'text-[#8B4513]/80 hover:text-[#8B4513]'
                  }`}
                >
                  {item.label}
                  {isActive(item.href) && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-[#8B4513] rounded-full animate-pulse" />
                  )}
                </Link>
              ))}
            </nav>

            {/* Desktop CTA Button */}
            <div className="hidden lg:flex items-center space-x-4">
              <Button
                asChild
                className="bg-[#E8C5C5] text-[#8B4513] hover:bg-[#E8C5C5]/80 hover:scale-105 rounded-full px-6 py-2 font-medium transition-all duration-300 shadow-md hover:shadow-lg"
              >
                <Link href="/contact">Contact us</Link>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 rounded-full hover:bg-[#8B4513]/10 transition-all duration-300 transform hover:scale-110"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              <div className="relative w-6 h-6">
                <Menu
                  className={`absolute inset-0 w-6 h-6 text-[#8B4513] transition-all duration-300 ${
                    isMenuOpen ? 'opacity-0 rotate-180' : 'opacity-100 rotate-0'
                  }`}
                />
                <X
                  className={`absolute inset-0 w-6 h-6 text-[#8B4513] transition-all duration-300 ${
                    isMenuOpen
                      ? 'opacity-100 rotate-0'
                      : 'opacity-0 -rotate-180'
                  }`}
                />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-500 ease-in-out ${
            isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="bg-[#F5F1ED]/98 backdrop-blur-md border-t border-[#8B4513]/10">
            <nav className="container mx-auto px-4 py-6">
              <div className="flex flex-col space-y-2">
                {navItems.map((item, index) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`group relative px-4 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 hover:bg-[#8B4513]/10 ${
                      isActive(item.href)
                        ? 'text-[#8B4513] bg-[#8B4513]/5 shadow-sm'
                        : 'text-[#8B4513]/80 hover:text-[#8B4513]'
                    }`}
                    style={{
                      animationDelay: `${index * 50}ms`,
                      animation: isMenuOpen
                        ? 'slideInFromRight 0.3s ease-out forwards'
                        : 'none',
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span>{item.label}</span>
                      {isActive(item.href) && (
                        <div className="w-2 h-2 bg-[#8B4513] rounded-full animate-pulse" />
                      )}
                    </div>
                    <div
                      className={`absolute bottom-0 left-4 right-4 h-0.5 bg-gradient-to-r from-[#8B4513] to-transparent transition-all duration-300 ${
                        isActive(item.href)
                          ? 'opacity-100'
                          : 'opacity-0 group-hover:opacity-50'
                      }`}
                    />
                  </Link>
                ))}

                {/* Mobile CTA Button */}
                <div className="pt-4 mt-4 border-t border-[#8B4513]/10">
                  <Button
                    asChild
                    className="w-full bg-[#E8C5C5] text-[#8B4513] hover:bg-[#E8C5C5]/80 hover:scale-105 rounded-xl py-3 font-medium transition-all duration-300 shadow-md hover:shadow-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Link href="/contact">Contact us</Link>
                  </Button>
                </div>
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Spacer to prevent content from hiding behind fixed header */}
      <div className="h-16 lg:h-20" />

      <style jsx>{`
        @keyframes slideInFromRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  )
}
