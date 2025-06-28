import { Inter } from "next/font/google"
import "./styles.css"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Student Registration - Daksh",
  description: "Complete your student registration to get started",
}

export default function RegisterLayout({ children }) {
  return (
    <div className={inter.className}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        {children}
      </ThemeProvider>
    </div>
  )
}
