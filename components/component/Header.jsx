import Link from "next/link"
import { Heart, Send } from "lucide-react"
import { useState } from "react"

export default function Header() {
  return (
    <div>
      {/* Header */};
      <div className="flex items-center justify-between px-4">
        <h1 className="text-2xl font-bold">Daksh</h1>
        <div className="flex space-x-4">
          <Link href="/dashboard/notifications">
            <button className="focus:outline-none">
              <Heart size={24} />
            </button>
          </Link>

          <Link href="/dashboard/community">
            <button className="focus:outline-none">
              <Send size={24} />
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}

