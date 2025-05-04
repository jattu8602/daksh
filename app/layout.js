import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Daksh - Student Portal",
  description: "A platform for students, mentors, and admins",
  manifest: "/manifest.json",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geist.className} min-h-screen bg-background antialiased`}>
        {children}
      </body>
    </html>
  );
}
