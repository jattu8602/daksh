import { redirect } from "next/navigation"

export default function CommunityLayout({ children }) {
  // Redirect to friends tab by default
  if (typeof window !== "undefined" && window.location.pathname === "/dashboard/community") {
    redirect("/dashboard/community/friends")
  }

  return (
    <div className="">
      {children}
    </div>
  )
}




