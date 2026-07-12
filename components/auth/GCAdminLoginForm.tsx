"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  adminLoginAction,
  type AdminLoginState,
} from "@/actions/auth/admin-login.action";

const initialState: AdminLoginState = {
  success: false,
  message: "",
};

export default function GCAdminLoginForm() {
  const router = useRouter();

  const [state, formAction, isPending] =
    useActionState(
      adminLoginAction,
      initialState,
    );

  useEffect(() => {
    if (!state.message) {
      return;
    }

    if (state.success) {
      toast.success(state.message);
      router.push(state.redirectTo ?? "/admin");
      router.refresh();
      return;
    }

    toast.error(state.message);
  }, [state, router]);

  return (
    <form
      action={formAction}
      className="space-y-4"
    >
      <Input
        name="email"
        type="email"
        placeholder="Administrator email"
        autoComplete="email"
        required
      />

      <Input
        name="password"
        type="password"
        placeholder="Password"
        autoComplete="current-password"
        required
      />

      <Button
        type="submit"
        disabled={isPending}
        className="w-full"
      >
        {isPending
          ? "Signing in..."
          : "Admin login"}
      </Button>
    </form>
  );
}