// "use client"

// import { useEffect } from "react"
// import { useRouter, usePathname } from "next/navigation"
// import { useAppStore } from "@/stores/useAppStore"
// import { fetchUserAccount } from "@/lib/api"

// const publicRoutes = ["/login", "/signup"]

// export function AuthProvider({ children }: { children: React.ReactNode }) {
//   const router = useRouter()
//   const pathname = usePathname()
//   const { setUser, user, isAuthenticated } = useAppStore()

//   useEffect(() => {
//     const checkAuth = async () => {
//       // Skip auth check for public routes
//       if (publicRoutes.includes(pathname)) {
//         return
//       }

//       try {
//         const userData = await fetchUserAccount()
//         setUser(userData)
//       } catch (error) {
//         // User not authenticated
//         setUser(null)
//         router.push("/login")
//       }
//     }

//     // Only check auth if user is not already set
//     if (!user) {
//       checkAuth()
//     }
//   }, [pathname, setUser, router, user])

//   // For public routes, always render
//   if (publicRoutes.includes(pathname)) {
//     return <>{children}</>
//   }

//   // For protected routes, only render if authenticated
//   if (!isAuthenticated) {
//     return null
//   }

//   return <>{children}</>
// }

"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAppStore } from "@/stores/useAppStore"
import { fetchUserAccount } from "@/lib/api"

const publicRoutes = ["/login", "/signup"]

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { setUser, user } = useAppStore()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      // If on public route, skip auth check
      if (publicRoutes.includes(pathname)) {
        setIsChecking(false)
        return
      }

      try {
        const userData = await fetchUserAccount()
        setUser(userData)
        setIsChecking(false)
      } catch (error) {
        // User not authenticated
        setUser(null)
        router.push("/login")
        setIsChecking(false)
      }
    }

    checkAuth()
  }, [pathname, setUser, router])

  // For public routes, always render
  if (publicRoutes.includes(pathname)) {
    return <>{children}</>
  }

  // Show loading state while checking auth
  if (isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }

  // For protected routes, only render if authenticated
  if (!user) {
    return null
  }

  return <>{children}</>
}