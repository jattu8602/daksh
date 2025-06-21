/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'img.youtube.com',
      'res.cloudinary.com',
      'randomuser.me',
      'hebbkx1anhila5yf.public.blob.vercel-storage.com',
      'pub-7021c24c5a8941118427c1fdc660efff.r2.dev',
      'images.unsplash.com',
    ],
  },
  theme: {
    extend: {
      backgroundImage: {
        'rainbow-gradient':
          'linear-gradient(90deg, indigo, violet, blue, green, yellow, orange, red, indigo)',
      },
      backgroundSize: {
        200: '200% 100%',
      },
      animation: {
        'gradient-slide': 'slideGradient 5s linear infinite',
      },
      keyframes: {
        slideGradient: {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '100% 50%' },
        },
      },
    },
  },
}

export default nextConfig;
