import { auth } from "@/lib/auth/auth";
import { dbConnect } from "@/db/dbConnect";
import GCCustomer from "@/db/models/customer/customer.model";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

type GCSessionUser = {
  id: string;
  name: string;
  email: string;
  role?: string | null;
  ccUserId?: string | null;
  phone?: string | null;
};

export default async function AuthCompletePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login?error=no-session");
  }

  const user =
    session.user as typeof session.user &
      GCSessionUser;

  /*
   * OAuth completion is strictly for customers.
   */
  if (user.role !== "customer") {
    redirect("/login?error=customer-required");
  }

  /*
   * A real OAuth customer must have the CC user ID.
   *
   * A local GC admin will not have this.
   */
  if (!user.ccUserId) {
    redirect("/login?error=invalid-customer-account");
  }

  await dbConnect();

  const update: {
    $set: {
      name: string;
      email: string;
      phone?: string;
    };
    $setOnInsert: {
      walletBalance: number;
    };
    $unset?: {
      phone: 1;
    };
  } = {
    $set: {
      name: user.name,
      email: user.email,
    },

    $setOnInsert: {
      walletBalance: 0,
    },
  };

  if (
    typeof user.phone === "string" &&
    user.phone.trim()
  ) {
    update.$set.phone = user.phone.trim();
  } else {
    update.$unset = {
      phone: 1,
    };
  }

  await GCCustomer.findOneAndUpdate(
    {
      ccUserId: user.ccUserId,
    },
    update,
    {
      upsert: true,
      returnDocument: 'after',
      runValidators: true,
      setDefaultsOnInsert: true,
    },
  );

  redirect("/customer");
}