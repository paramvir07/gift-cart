"use client"

import { useState } from "react"
import { authClient } from "@/lib/auth/auth-client"
import { Button } from "@/components/ui/button"

export default function ContinueWithCCButton() {
  const [isPending, setIsPending] = useState(false)

  const [errorMessage, setErrorMessage] = useState("")

  async function handleLogin() {
    try {
      setIsPending(true)
      setErrorMessage("")

      const { error } = await authClient.signIn.oauth2({
        providerId: "canadians-cart",

        callbackURL: "/auth/complete",

        newUserCallbackURL: "/auth/complete",

        errorCallbackURL: "/login?error=cc-login-failed",

        scopes: ["openid", "profile", "email", "offline_access"],
      })

      if (error) {
        setErrorMessage(
          error.message ?? "Could not sign in with Candian's Cart."
        )

        setIsPending(false)
      }
    } catch (error) {
      console.error("Candian's Cart login failed:", error)

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Could not sign in with Candian's Cart."
      )

      setIsPending(false)
    }
  }

  return (
    <div className="space-y-3">
      <Button
        type="button"
        onClick={handleLogin}
        disabled={isPending}
        className="w-full"
      >
        {isPending ? "Connecting..." : "Continue with Candian's Cart"}
      </Button>

      {errorMessage && (
        <p className="text-sm text-destructive">{errorMessage}</p>
      )}
    </div>
  )
}
