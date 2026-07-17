import ContinueWithCCButton from "@/components/auth/ContinueWithCCButton";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border bg-background p-6 shadow-sm">
        <h1 className="text-2xl font-bold">
          Sign in to Gift Cart
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Continue using your Canadian&apos;s Cart customer account.
        </p>

        <div className="mt-6">
          <ContinueWithCCButton />
        </div>
      </div>
    </main>
  );
}
