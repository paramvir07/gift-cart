import nextEnv from "@next/env";

const { loadEnvConfig } = nextEnv;

loadEnvConfig(process.cwd());

async function createGiftCartAdmin() {
  const adminName =
    process.env.GC_ADMIN_NAME?.trim();

  const adminEmail =
    process.env.GC_ADMIN_EMAIL
      ?.trim()
      .toLowerCase();

  const adminPassword =
    process.env.GC_ADMIN_PASSWORD;

  if (!adminName) {
    throw new Error(
      "GC_ADMIN_NAME is missing from .env.local",
    );
  }

  if (!adminEmail) {
    throw new Error(
      "GC_ADMIN_EMAIL is missing from .env.local",
    );
  }

  if (!adminPassword) {
    throw new Error(
      "GC_ADMIN_PASSWORD is missing from .env.local",
    );
  }

  if (adminPassword.length < 8) {
    throw new Error(
      "GC_ADMIN_PASSWORD must be at least 8 characters.",
    );
  }

  /*
   * These imports must happen after loadEnvConfig(),
   * because auth.ts reads environment variables when imported.
   */
  const { auth, db } =
    await import("../lib/auth/auth");

  /*
   * Better Auth's MongoDB adapter uses the `user`
   * collection by default.
   *
   * This check makes the script safe to run twice.
   */
  const existingUser =
    await db.collection("user").findOne({
      email: adminEmail,
    });

  if (existingUser) {
    if (existingUser.role === "admin") {
      console.log(
        `Admin already exists: ${adminEmail}`,
      );

      process.exit(0);
    }

    throw new Error(
      `A non-admin user already exists with the email ${adminEmail}.`,
    );
  }

  const createdUser =
    await auth.api.createUser({
      body: {
        name: adminName,
        email: adminEmail,
        password: adminPassword,
        role: "admin",

        /*
         * Local GC admins are not connected to CC.
         */
        data: {
          ccUserId: null,
          phone: null,
        },
      },
    });

  console.log("Gift Cart admin created successfully.");
  console.log(`Name: ${createdUser.user.name}`);
  console.log(`Email: ${createdUser.user.email}`);
  console.log(`Role: ${createdUser.user.role}`);

  process.exit(0);
}

createGiftCartAdmin().catch((error: unknown) => {
  console.error("Failed to create Gift Cart admin:");

  if (error instanceof Error) {
    console.error(error.message);
  } else {
    console.error(error);
  }

  process.exit(1);
});