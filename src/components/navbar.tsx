"use client";

import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarItem,
  NavbarMenuItem,
} from "@heroui/navbar";
import { Link } from "@heroui/link";
import { link as linkStyles } from "@heroui/theme";
import NextLink from "next/link";
import clsx from "clsx";
import { useState } from "react";
import { Icon } from "@iconify/react";

import { Profile } from "./profile";
import { Counter } from "./counter";

import { siteConfig } from "@/shared/site";
import { ThemeSwitch } from "@/components/theme-switch";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <HeroUINavbar
      isMenuOpen={isMenuOpen}
      maxWidth="xl"
      position="sticky"
      onMenuOpenChange={setIsMenuOpen}
    >
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <ul className="hidden lg:flex gap-4 justify-start ml-2">
          {siteConfig.navItems.map((item) => (
            <NavbarItem key={item.href}>
              <NextLink
                className={clsx(
                  linkStyles({ color: "foreground" }),
                  "data-[active=true]:text-primary data-[active=true]:font-medium",
                )}
                color="foreground"
                href={item.href}
              >
                {item.label}
              </NextLink>
            </NavbarItem>
          ))}
        </ul>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex basis-1/5 sm:basis-full">
        <NavbarItem className="hidden sm:flex gap-2">
          <Counter />
        </NavbarItem>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex basis-1/5 sm:basis-full">
        <NavbarItem className="hidden sm:flex gap-2">
          <Link isExternal aria-label="Discord" href={siteConfig.links.discord}>
            <Icon className="text-default-500" icon="simple-icons:discord" />
          </Link>
          <Link isExternal aria-label="Github" href={siteConfig.links.github}>
            <Icon className="text-default-500" icon="simple-icons:github" />
          </Link>
          <ThemeSwitch />
          <Profile />
        </NavbarItem>
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <Link isExternal aria-label="Github" href={siteConfig.links.github}>
          <Icon className="text-default-500" icon="simple-icons:github" />
        </Link>
        <ThemeSwitch />
        <Profile />
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarMenu>
        <div className="mx-4 mt-2 flex flex-col gap-2">
          {siteConfig.navMenuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link
                color={item.isPrimary ? "primary" : "foreground"}
                href={item.href}
                size="lg"
                onPress={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            </NavbarMenuItem>
          ))}
        </div>
      </NavbarMenu>
    </HeroUINavbar>
  );
};
