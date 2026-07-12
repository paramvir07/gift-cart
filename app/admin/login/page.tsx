import GCAdminLoginForm from "@/components/auth/GCAdminLoginForm";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function AdminLoginPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (
    session &&
    session.user.role === "admin"
  ) {
    redirect("/admin");
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border p-6 shadow-sm">
        <h1 className="text-2xl font-bold">
          Gift Cart Administration
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Sign in using your Gift Cart administrator
          credentials.
        </p>

        <div className="mt-6">
          <GCAdminLoginForm />
        </div>
      </div>
    </main>
  );
}