import { Link } from "@heroui/link";

import { siteConfig } from "@/shared/site";

export const Footer = () => {
  return (
    <footer className="mt-24 text-xs w-full p-4 flex flex-col md:flex-row items-center justify-between gap-4 bg-background border-t border-default-200">
      <div className="text-default-500 text-center md:text-left">
        © {new Date().getFullYear()} {siteConfig.name || "Your App"}. Minden
        jog fenntartva.
      </div>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Link
          className="text-xs text-default-500 hover:text-primary transition-colors"
          href="/legal/terms"
        >
          Felhasználási feltételek
        </Link>
        <Link
          className="text-xs text-default-500 hover:text-primary transition-colors"
          href="/legal/privacy"
        >
          Adatkezelési tájékoztató
        </Link>
        <Link
          className="text-xs text-default-500 hover:text-primary transition-colors"
          href="/legal/cookies"
        >
          Cookie szabályzat
        </Link>
      </div>
    </footer>
  );
};
