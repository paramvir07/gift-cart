"use server";

import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";

export type AdminLoginState = {
  success: boolean;
  message: string;
  redirectTo?: string;
};

export async function adminLoginAction(
  previousState: AdminLoginState,
  formData: FormData,
): Promise<AdminLoginState> {
  try {
    const emailValue = formData.get("email");
    const passwordValue =
      formData.get("password");

    const email =
      typeof emailValue === "string"
        ? emailValue.trim().toLowerCase()
        : "";

    const password =
      typeof passwordValue === "string"
        ? passwordValue
        : "";

    if (!email || !password) {
      return {
        success: false,
        message:
          "Email and password are required.",
      };
    }

    const requestHeaders = await headers();

    const result =
      await auth.api.signInEmail({
        body: {
          email,
          password,
          rememberMe: true,
        },
        headers: requestHeaders,
      });

    if (!result?.user) {
      return {
        success: false,
        message:
          "Unable to load the administrator account.",
      };
    }

    const role = result.user.role;

    /*
     * Only local GC administrators may use this page.
     */
    if (role !== "admin") {
      await auth.api.signOut({
        headers: requestHeaders,
      });

      return {
        success: false,
        message:
          "This account is not a Gift Cart administrator.",
      };
    }

    return {
      success: true,
      message: "Logged in successfully.",
      redirectTo: "/admin",
    };
  } catch (error: unknown) {
    console.error(
      "Gift Cart admin login failed:",
      error,
    );

    const authError = error as {
      body?: {
        message?: string;
      };
    };

    return {
      success: false,
      message:
        authError.body?.message ??
        "Invalid administrator email or password.",
    };
  }
}