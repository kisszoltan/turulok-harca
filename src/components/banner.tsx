"use client";

import React, { useEffect, useState } from "react";
import { Button, Link } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useQuery } from "convex/react";

import { message } from "./primitives";

import { api } from "@/convex/_generated/api";

const STORAGE_KEY = "hideBanner";

export const Banner = () => {
  const { BANNER_PERIOD_OVER } = useQuery(api.core.config) ?? {};
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const isHidden = localStorage.getItem(STORAGE_KEY);

    setVisible(isHidden !== "true");
  }, []);

  if (!visible || !!BANNER_PERIOD_OVER) return null;

  return (
    <div className="flex w-full items-center gap-x-3 border-b-1 border-divider bg-background/[0.15] px-6 py-2 backdrop-blur-xl sm:px-3.5 sm:before:flex-1">
      <div className={message({ size: "sm", isJustified: false })}>
        Az uralkodójelöltek épp most küldtek hollókat a zászlóhordozóiknak. Amíg
        nem térnek vissza a hollók, addig bárki szerezhet befolyást a
        Kistanácsokban.&nbsp;
      </div>

      <Button
        as={Link}
        className="group relative h-9 overflow-hidden bg-transparent text-small font-normal"
        color="default"
        endContent={
          <Icon
            className="hidden lg:block flex-none outline-none transition-transform group-data-[hover=true]:translate-x-0.5 [&>path]:stroke-[2]"
            icon="solar:arrow-right-linear"
            width={16}
          />
        }
        href="/buy"
        style={{
          border: "solid 2px transparent",
          backgroundImage: `linear-gradient(hsl(var(--heroui-background)), hsl(var(--heroui-background))), linear-gradient(to right, #F871A0, #9353D3)`,
          backgroundOrigin: "border-box",
          backgroundClip: "padding-box, border-box",
        }}
        variant="bordered"
      >
        Megnézem
      </Button>
      <div className="flex flex-1 justify-end">
        <Button
          isIconOnly
          className="-m-1"
          size="sm"
          variant="light"
          onPress={() => {
            localStorage.setItem(STORAGE_KEY, "true");
            setVisible(false);
          }}
        >
          <span className="sr-only">Close Banner</span>
          <Icon className="text-default-500" icon="lucide:x" width={20} />
        </Button>
      </div>
    </div>
  );
};
