import { auth } from "@/lib/auth/auth"
import { headers } from "next/headers"
import { cache } from "react"

export const getCurrentSession = cache(async () => {
  try {
    return await auth.api.getSession({
      headers: await headers(),
    })
  } catch (error) {
    console.error("Error fetching user session:", error)
    return null
  }
})

export const getUserSession = cache(async () => {
  const session = await getCurrentSession()

  if (!session) {
    const { redirect } = await import("next/navigation")
    redirect("/login")
  }

  return session
})

export const isLoggedIn = cache(async () => {
  const session = await getCurrentSession()
  return Boolean(session)
})
