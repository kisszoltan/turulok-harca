"use client";

import { useQuery } from "convex/react";
import { Link } from "@heroui/link";

import { api } from "@/convex/_generated/api";

export const Profile = () => {
  const user = useQuery(api.users.get, {});

  return user ? (
    <Link href="/me" size="sm" title="Profil">
      {user.email}
    </Link>
  ) : (
    <Link href="/auth/signin" size="sm">
      Belépés
    </Link>
  );
};
