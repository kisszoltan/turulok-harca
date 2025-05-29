"use client";

import { useConvexAuth } from "convex/react";
import { useRouter } from "next/navigation";
import { Suspense, useEffect } from "react";

import { Loading } from "@/components/loading";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isLoading, isAuthenticated } = useConvexAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated) router.replace("/");
  }, [isAuthenticated, isLoading]);

  return isLoading ? (
    <Loading />
  ) : (
    <Suspense fallback={<Loading />}>
      <section className="mt-20 h-full mx-auto max-w-lg">{children}</section>
    </Suspense>
  );
}
