export type SiteConfig = typeof siteConfig;

type NavItemType = { href: string; label: string; isPrimary?: boolean };

export const siteConfig = {
  name: "Turulok Harca",
  description: "Két világ. Egy kérdés.",
  company: "Kiss-Hanzsa Kft",
  url: "https://turulok-harca.hu",
  navItems: [
    { href: "/", label: "Bevezető" },
    { href: "/ask", label: "Kérdezek" },
    { href: "/list", label: "Összes kérdés" },
    { href: "/buy", label: "Kistanácsi Befolyás" },
    { href: "/status", label: "Jelenlegi állás" },
  ] as NavItemType[],
  navMenuItems: [
    { href: "/", label: "Bevezető" },
    { href: "/ask", label: "Kérdezek" },
    { href: "/list", label: "Összes kérdés" },
    { href: "/buy", label: "Kistanácsi Befolyás" },
    { href: "/status", label: "Jelenlegi állás" },
  ] as NavItemType[],
  links: {
    github: "https://github.com/kisszoltan/turulok-harca",
    discord: "https://discord.gg/ZUgsutvzNA",
  },
};
