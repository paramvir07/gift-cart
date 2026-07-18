"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth/auth";

function normalizeOrigin(value: string): string {
  const url = new URL(value);

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("GC_APP_URL must use http or https.");
  }

  return url.origin;
}

export async function createGCOAuthClient() {
  const requestHeaders = await headers();

  const session = await auth.api.getSession({
    headers: requestHeaders,
  });

  if (!session) {
    return {
      success: false as const,
      message: "You must be logged in.",
    };
  }

  if (session.user.role !== "admin") {
    return {
      success: false as const,
      message: "Only an admin can create the OAuth client.",
    };
  }

  const gcAppUrl = process.env.GC_APP_URL;

  if (!gcAppUrl) {
    return {
      success: false as const,
      message: "GC_APP_URL is missing from the environment variables.",
    };
  }

  try {
    const origins = [normalizeOrigin(gcAppUrl)];

    if (process.env.GC_LOCAL_APP_URL) {
      origins.push(normalizeOrigin(process.env.GC_LOCAL_APP_URL));
    }

    const redirectUris = [...new Set(origins)].map(
      (origin) =>
        `${origin}/api/auth/oauth2/callback/canadians-cart`,
    );

    const client = await auth.api.adminCreateOAuthClient({
      headers: requestHeaders,
      body: {
        client_name: "Gift Cart",

        redirect_uris: redirectUris,

        token_endpoint_auth_method: "client_secret_basic",

        grant_types: [
          "authorization_code",
          "refresh_token",
        ],

        response_types: ["code"],

        scope: "openid profile email offline_access",

        client_secret_expires_at: 0,

        skip_consent: true,

        enable_end_session: true,
      },
    });

    return {
      success: true as const,
      clientId: client.client_id,
      clientSecret: client.client_secret,
      redirectUris,
    };
  } catch (error) {
    console.error("Failed to create Gift Cart OAuth client:", error);

    return {
      success: false as const,
      message:
        error instanceof Error
          ? error.message
          : "Failed to create the OAuth client.",
    };
  }
}