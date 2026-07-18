import { betterAuth } from "better-auth"
import { mongodbAdapter } from "better-auth/adapters/mongodb"
import { nextCookies } from "better-auth/next-js"
import { MongoClient } from "mongodb"
import { admin, genericOAuth } from "better-auth/plugins"

function requireUrl(name: string): string {
  const value = process.env[name]?.trim()

  if (!value) {
    throw new Error(`${name} is missing`)
  }

  const url = new URL(value)

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error(`${name} must use http or https`)
  }

  return url.origin
}

function requireEnv(name: string): string {
  const value = process.env[name]?.trim()

  if (!value) {
    throw new Error(`${name} is missing`)
  }

  return value
}

const mongoUri = requireEnv("GC_MONGODB_URI")
const gcBaseUrl = requireUrl("BETTER_AUTH_URL")
const ccBaseUrl = requireUrl("CC_BASE_URL")
const ccClientId = requireEnv("CC_OAUTH_CLIENT_ID")
const ccClientSecret = requireEnv("CC_OAUTH_CLIENT_SECRET")

const ccIssuer = `${ccBaseUrl}/api/auth`

const gcOAuthCallbackUrl =
  `${gcBaseUrl}/api/auth/oauth2/callback/canadians-cart`

declare global {
  // eslint-disable-next-line no-var
  var _gcAuthMongoClient: MongoClient | undefined
}

const mongoClient =
  global._gcAuthMongoClient ?? new MongoClient(mongoUri)

if (process.env.NODE_ENV === "development") {
  global._gcAuthMongoClient = mongoClient
}

const db = mongoClient.db()

export const auth = betterAuth({
  appName: "Gift Cart",

  baseURL: gcBaseUrl,

  trustedOrigins: [
    gcBaseUrl,
    ccBaseUrl,
  ],

  database: mongodbAdapter(db, {
    client: mongoClient,
  }),

  /*
   * Local email/password login is only for Gift Cart admins.
   */
  emailAndPassword: {
    enabled: true,
    disableSignUp: true,
  },

  user: {
    additionalFields: {
      /*
       * Set only for customers authenticated through
       * Candian's Cart.
       */
      ccUserId: {
        type: "string",
        required: false,
        defaultValue: null,
        input: true,
      },

      phone: {
        type: "string",
        required: false,
        defaultValue: null,
        input: true,
      },
    },
  },

  account: {
    accountLinking: {
      enabled: false,
    },
  },

  plugins: [
    admin({
      defaultRole: "customer",
      adminRoles: ["admin"],
    }),

    genericOAuth({
      config: [
        {
          providerId: "canadians-cart",

          clientId: ccClientId,
          clientSecret: ccClientSecret,

          issuer: ccIssuer,

          authorizationUrl:
            `${ccBaseUrl}/api/auth/oauth2/authorize`,

          tokenUrl:
            `${ccBaseUrl}/api/auth/oauth2/token`,

          userInfoUrl:
            `${ccBaseUrl}/api/auth/oauth2/userinfo`,

          redirectURI: gcOAuthCallbackUrl,

          scopes: [
            "openid",
            "profile",
            "email",
            "offline_access",
          ],

          pkce: true,

          /*
           * Must match the OAuth client registration in
           * Candian's Cart:
           * token_endpoint_auth_method: client_secret_basic
           */
          authentication: "basic",

          /*
           * Update the local Gift Cart user details whenever
           * Candian's Cart returns newer profile information.
           */
          overrideUserInfo: true,

          mapProfileToUser: (profile) => {
            const ccRole =
              typeof profile.gc_role === "string"
                ? profile.gc_role.trim()
                : ""

            if (ccRole !== "customer") {
              throw new Error(
                "Only Candian's Cart customer accounts can access Gift Cart."
              )
            }

            const ccUserId =
              typeof profile.sub === "string"
                ? profile.sub.trim()
                : ""

            const email =
              typeof profile.email === "string"
                ? profile.email.trim().toLowerCase()
                : ""

            const name =
              typeof profile.name === "string" &&
              profile.name.trim()
                ? profile.name.trim()
                : "Gift Cart Customer"

            const phone =
              typeof profile.phone_number === "string" &&
              profile.phone_number.trim()
                ? profile.phone_number.trim()
                : null

            if (!ccUserId) {
              throw new Error(
                "Candian's Cart did not provide a valid user ID."
              )
            }

            if (!email) {
              throw new Error(
                "Candian's Cart did not provide an email address."
              )
            }

            return {
              ccUserId,
              name,
              email,
              phone,
            }
          },
        },
      ],
    }),

    /*
     * Keep this last.
     */
    nextCookies(),
  ],
})

export { db }