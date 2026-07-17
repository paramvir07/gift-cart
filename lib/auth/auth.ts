import { betterAuth } from "better-auth"
import { mongodbAdapter } from "better-auth/adapters/mongodb"
import { nextCookies } from "better-auth/next-js"
import { MongoClient } from "mongodb"
import { admin, genericOAuth } from "better-auth/plugins"

const mongoUri = process.env.GC_MONGODB_URI
const ccBaseUrl = process.env.CC_BASE_URL
const ccClientId = process.env.CC_OAUTH_CLIENT_ID
const ccClientSecret = process.env.CC_OAUTH_CLIENT_SECRET

if (!mongoUri) {
  throw new Error("GC_MONGODB_URI is missing")
}

if (!ccBaseUrl) {
  throw new Error("CC_BASE_URL is missing")
}

if (!ccClientId) {
  throw new Error("CC_OAUTH_CLIENT_ID is missing")
}

if (!ccClientSecret) {
  throw new Error("CC_OAUTH_CLIENT_SECRET is missing")
}

declare global {
  // eslint-disable-next-line no-var
  var _gcAuthMongoClient: MongoClient | undefined
}

const mongoClient = global._gcAuthMongoClient ?? new MongoClient(mongoUri)

if (process.env.NODE_ENV === "development") {
  global._gcAuthMongoClient = mongoClient
}

const db = mongoClient.db()

export const auth = betterAuth({
  appName: "Gift Cart",

  baseURL: process.env.BETTER_AUTH_URL,

  trustedOrigins: [process.env.NEXT_PUBLIC_APP_URL!, ccBaseUrl],

  database: mongodbAdapter(db, {
    client: mongoClient,
  }),

  /*
   * Used only by Gift Cart administrators.
   *
   * Public registration is disabled, so customers cannot
   * create local email/password accounts.
   */
  emailAndPassword: {
    enabled: true,
    disableSignUp: true,
  },

  user: {
    additionalFields: {
      /*
       * Present only for customers who entered through CC.
       * Local GC admins will have null here.
       */
      ccUserId: {
        type: "string",
        required: false,
        defaultValue: null,
        input: true,
      },

      /*
       * Present only for CC customers when available.
       * GC administrators do not require a phone.
       */
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
    /*
     * OAuth-created users become customer by default.
     * Separately created GC administrators receive admin.
     */
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

          discoveryUrl: `${ccBaseUrl}/api/auth/.well-known/openid-configuration`,

          scopes: ["openid", "profile", "email", "offline_access"],

          pkce: true,
          requireIssuerValidation: true,
          authentication: "basic",
          overrideUserInfo: true,

          mapProfileToUser: (profile) => {
            /*
             * Candian's Cart must send this signed claim.
             */
            const ccRole = profile.gc_role

            /*
             * Customer OAuth is customer-only.
             *
             * Admin, store, cashier, immigration, and every
             * other CC role are rejected before GC creates
             * a local user.
             */
            if (ccRole !== "customer") {
              throw new Error(
                "Only Candian's Cart customer accounts can access Gift Cart."
              )
            }

            const ccUserId =
              typeof profile.sub === "string" ? profile.sub.trim() : ""

            const email =
              typeof profile.email === "string"
                ? profile.email.trim().toLowerCase()
                : ""

            const name =
              typeof profile.name === "string" && profile.name.trim()
                ? profile.name.trim()
                : "Gift Cart Customer"

            if (!ccUserId) {
              throw new Error("Candian's Cart did not provide a valid user ID.")
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

              phone:
                typeof profile.phone_number === "string" &&
                profile.phone_number.trim()
                  ? profile.phone_number.trim()
                  : null,
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
