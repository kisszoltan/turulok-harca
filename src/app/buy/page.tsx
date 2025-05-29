"use client";

import { Button } from "@heroui/button";
import { motion } from "framer-motion";
import { Link } from "@heroui/link";
import { cn } from "@heroui/theme";
import { ComponentProps, FC, useState } from "react";
import { NumberInput } from "@heroui/react";
import { Authenticated, Unauthenticated } from "convex/react";

import { message, title } from "@/components/primitives";
import { SideType } from "@/convex/_types";
import { capitalize } from "@/shared/utils";

export default function BuyPage() {
  const [side, setSide] = useState<SideType | undefined>();
  const [amount, setAmount] = useState(1);

  return (
    <motion.div
      key="ask"
      animate={{ opacity: 1, scale: 1 }}
      className="text-center max-w-2xl mx-auto p-4"
      exit={{ opacity: 0, scale: 1.05 }}
      initial={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className={title({ size: "sm" })}>
        Mekkora Kistanácsi Befolyásra szeretnél szert tenni?
      </h2>
      <p className={cn(message(), "my-8")}>
        Egy gondolat, vagy egy kérdés bárkiben felmerülhet, még akár egy Selyem
        utcai bordély eldugott kis szobájában is. Viszont csak az tudja
        eljuttatni azt az uralkodó elé, aki elegendő befolyással bír a
        Kistanácsban.
      </p>
      <p className={cn(message(), "my-8")}>
        <b>Kistanácsi Befolyás</b> vásárlásával nem csupán szavazásra való
        jogosultságot szerzel, de egyben lehetőséget kapsz arra is, hogy
        támogatásoddal az általad kedvelt oldal számára fontos kérdést juttasd
        az uralkodó elé.
      </p>
      <p className={cn(message(), "my-8")}>
        A szavazáskor ugyanis minden kérdés +1 szavazatot kap az általad
        választott oldalhoz (Hungeros vagy Westeria), továbbá az adott oldal
        támogatói pontjait annyival növeled, amennyi <b>Kistanácsi Befolyás</b>{" "}
        a birtokodban van a szavazás pillanatában.
      </p>
      <h3 className={title({ size: "xs" })}>Melyik oldalt támogatod?</h3>
      <Unauthenticated>
        <p className={cn(message(), "my-8")}>
          <b>Kistanácsi Befolyás</b> vásárlására, majd azok felhasználására csak
          regisztrált felhasználóknak van lehetősége.
        </p>
        <Button as={Link} color="primary" href="/auth/signin" size="lg">
          Jelentkezz be
        </Button>
      </Unauthenticated>
      <Authenticated>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <SideButton
            currentSide={side}
            side="hungeros"
            slogan="a régi rend védelmezője"
            onPress={() => {
              setSide("hungeros");
            }}
          />
          <SideButton
            currentSide={side}
            side="westeria"
            slogan="az új korszak hírnöke"
            onPress={() => {
              setSide("westeria");
            }}
          />
        </div>
        <NumberInput
          className="mt-6"
          description={
            side &&
            `Jelenleg nincs Kistanácsi Befolyásod. Vásárlásoddal ${amount} befolyásod lesz a ${capitalize(side)} Kistanácsában.`
          }
          label="Vásárolni kívánt mennyiség"
          minValue={1}
          size="lg"
          value={amount}
          onValueChange={setAmount}
        />

        <div className="mt-8 flex flex-col items-center gap-6">
          <div className="flex items-center gap-4">
            <Button
              as={Link}
              className="text-default-400"
              href="/list"
              variant="light"
            >
              Már beküldött kérdések
            </Button>
            <Button color="primary" size="lg" variant="solid">
              Vásárlás
            </Button>
          </div>
        </div>
      </Authenticated>
    </motion.div>
  );
}

const SideButton: FC<
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
        "relative py-6 text-2xl  h-20 flex flex-col gap-1",
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
