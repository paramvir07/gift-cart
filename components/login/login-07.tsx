"use client"

import { useState } from "react"
import { authClient } from "@/lib/auth/auth-client"
import { Button } from "@/components/ui/button"

export default function Login07() {
  const [isPending, setIsPending] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  async function loginWithCanadianCart() {
    try {
      setIsPending(true)
      setErrorMessage("")

      const { error } = await authClient.signIn.oauth2({
        providerId: "canadians-cart",

        callbackURL: "/auth/complete",

        newUserCallbackURL: "/auth/complete?firstLogin=true",

        errorCallbackURL: "/login?error=cc-login-failed",

        scopes: ["openid", "profile", "email", "offline_access"],
      })

      if (error) {
        setErrorMessage(error.message ?? "Could not connect to Candian's Cart.")

        setIsPending(false)
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Could not connect to Candian's Cart."
      )

      setIsPending(false)
    }
  }

  return (
    <div>
      <Button
        type="button"
        disabled={isPending}
        onClick={loginWithCanadianCart}
      >
        {isPending ? "Connecting..." : "Continue with Candian's Cart"}
      </Button>

      {errorMessage && (
        <p className="mt-3 text-sm text-destructive">{errorMessage}</p>
      )}
    </div>
  )
}
