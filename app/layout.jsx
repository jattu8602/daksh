import { Geist } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import InstallPWA from './components/InstallPWA'
import { Providers } from './providers'

const geist = Geist({
  subsets: ['latin'],
  display: 'swap',
})

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#72717f',
}

export const metadata = {
  title: 'Daksh - Student Portal',
  description: 'A platform for students, mentors, and admins',
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Daksh',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
        <meta name="apple-mobile-web-app-title" content="Daksh" />
        <link rel="apple-touch-icon" href="/icons/apple-icon.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta
          name="theme-color"
          content="#72717f"
          media="(prefers-color-scheme: light)"
        />
        <meta
          name="theme-color"
          content="#1a1a1a"
          media="(prefers-color-scheme: dark)"
        />
        <meta
          name="google-site-verification"
          content="1dmarru9P3gaivQMYG8pD5nVERSVBb7rr6ewslRmEiE"
        />
        <link rel="manifest" href="/manifest.json" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const savedTheme = localStorage.getItem('theme')
                  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
                  const currentTheme = savedTheme || systemTheme
                  document.documentElement.classList.toggle('dark', currentTheme === 'dark')
                } catch (e) {
                  // Fallback to system theme if localStorage fails
                  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
                  document.documentElement.classList.toggle('dark', systemTheme === 'dark')
                }
              })()
            `,
          }}
        />
      </head>
      <body
        className={`${geist.className} min-h-screen bg-background pt-[env(safe-area-inset-top)] antialiased`}
      >
        <Providers>
          {children}
          <Toaster position="top-center" />
          {/* <InstallPWA /> */}
        </Providers>
      </body>
    </html>
  )
}
