"use client";

import type { ThemeProviderProps } from "next-themes";

import * as React from "react";
import { HeroUIProvider } from "@heroui/system";
import { useRouter } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ConvexAuthNextjsProvider } from "@convex-dev/auth/nextjs";
import { ConvexReactClient } from "convex/react";
import { ToastProvider } from "@heroui/toast";
import Clarity from "@microsoft/clarity";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

declare module "@react-types/shared" {
  interface RouterConfig {
    routerOptions: NonNullable<
      Parameters<ReturnType<typeof useRouter>["push"]>[1]
    >;
  }
}
const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export function Providers({ children, themeProps }: ProvidersProps) {
  const router = useRouter();

  React.useEffect(() => {
    const firebaseConfig = process.env.NEXT_PUBLIC_GOOGLE_FIREBASE;

    if (!!firebaseConfig) {
      getAnalytics(initializeApp(JSON.parse(firebaseConfig)));
    }

    const clarityId = process.env.NEXT_PUBLIC_MICROSOFT_CLARITY;

    if (!!clarityId) {
      Clarity.init(clarityId);
    }
  }, []);

  return (
    <ConvexAuthNextjsProvider client={convex}>
      <HeroUIProvider navigate={router.push}>
        <ToastProvider />
        <NextThemesProvider {...themeProps}>{children}</NextThemesProvider>
      </HeroUIProvider>
    </ConvexAuthNextjsProvider>
  );
}
