import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";

import { Providers } from "./providers";

import { siteConfig } from "@/shared/site";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ConvexAuthNextjsServerProvider>
      <html suppressHydrationWarning lang="en">
        <head />
        <body className="min-h-screen font-serif antialiased">
          <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
            <div className="relative flex flex-col h-screen">
              <Navbar />
              <main className="mx-auto max-w-7xl pt-16 px-6 flex-grow w-full">
                {children}
              </main>
              <Footer />
            </div>
          </Providers>
        </body>
      </html>
    </ConvexAuthNextjsServerProvider>
  );
}
