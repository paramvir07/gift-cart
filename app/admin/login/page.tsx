import { getCurrentSession } from "@/actions/auth/getUserSession.actions";
import GCAdminLoginForm from "@/components/auth/GCAdminLoginForm"
import { redirect } from "next/navigation"

export default async function AdminLoginPage() {
  const session = await getCurrentSession()

  if (session) {
    const user = session.user as typeof session.user & {
      role?: string | null
      ccUserId?: string | null
    }

    if (user.role === "admin") {
      redirect("/admin")
    }

    if (user.role === "customer" && user.ccUserId) {
      redirect("/customer")
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border bg-background p-6 shadow-sm">
        <h1 className="text-2xl font-bold">Gift Cart Administration</h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Sign in using your Gift Cart administrator credentials.
        </p>

        <div className="mt-6">
          <GCAdminLoginForm />
        </div>
      </div>
    </main>
  )
}
