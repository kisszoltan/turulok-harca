"use client";

import { Spinner } from "@heroui/react";
import { useConvexAuth } from "convex/react";
import { useRouter } from "next/navigation";
import { Suspense, useEffect } from "react";

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

const Loading = () => {
  return (
    <div className="h-full flex items-center justify-center">
      <Spinner size="lg" />
    </div>
  );
};
