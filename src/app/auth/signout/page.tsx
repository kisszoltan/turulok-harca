"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { useEffect } from "react";

export default function SignOutPage() {
  const { signOut } = useAuthActions();

  useEffect(() => {
    signOut();
  }, []);
}
