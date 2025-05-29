"use client";

import { Button } from "@heroui/button";
import { cn } from "@heroui/theme";
import { ComponentProps, FC } from "react";

import { SideType } from "@/convex/_types";
import { capitalize } from "@/shared/utils";

export const SideButton: FC<
  ComponentProps<typeof Button> & {
    side: SideType;
    slogan: string;
    currentSide?: SideType;
  }
> = ({ side, slogan, currentSide, className, ...props }) => {
  const disabled = currentSide !== side;
  const color = disabled
    ? "text-default-400 dark:text-default-200"
    : side === "westeria"
      ? "text-white bg-green-500"
      : "text-white bg-orange-500";

  return (
    <Button
      className={cn(
        "w-full md:w-1/2 relative py-6 text-2xl h-20 flex flex-col gap-1",
        color,
        className,
      )}
      size="lg"
      variant="flat"
      {...props}
    >
      <span className="tracking-widest">{capitalize(side)}</span>
      <span className="text-sm">{slogan}</span>
    </Button>
  );
};
