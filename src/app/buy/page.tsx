"use client";

import { Button } from "@heroui/button";
import { motion } from "framer-motion";
import { Link } from "@heroui/link";
import { cn } from "@heroui/theme";
import { useEffect, useState } from "react";
import { addToast, Alert, NumberInput } from "@heroui/react";
import {
  Authenticated,
  Unauthenticated,
  useMutation,
  useQuery,
} from "convex/react";
import { ConvexError } from "convex/values";
import { useRouter } from "next/navigation";

import { message, title } from "@/components/primitives";
import { SideType } from "@/convex/_types";
import { capitalize } from "@/shared/utils";
import { SideButton } from "@/components/side-button";
import { api } from "@/convex/_generated/api";

export default function BuyPage() {
  const router = useRouter();
  const increaseBalance = useMutation(api.balances.increase);
  const currentBalance = useQuery(api.balances.get);
  const [side, setSide] = useState<SideType | undefined>(currentBalance?.side);
  const [amount, setAmount] = useState(1);

  useEffect(() => {
    setSide(currentBalance?.side);
  }, [currentBalance]);

  return (
    <motion.div
      key="ask"
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-2xl mx-auto p-4"
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
        <div className="flex flex-col md:flex-row gap-6 mt-6 justify-center">
          <SideButton
            currentSide={side}
            isDisabled={
              currentBalance?.side && currentBalance.side === "westeria"
            }
            side="hungeros"
            onPress={() => {
              setSide("hungeros");
            }}
          />
          <SideButton
            currentSide={side}
            isDisabled={
              currentBalance?.side && currentBalance.side === "hungeros"
            }
            side="westeria"
            onPress={() => {
              setSide("westeria");
            }}
          />
        </div>
        <NumberInput
          className="my-6"
          description={
            side &&
            `Jelenleg ${currentBalance?.value ? `${currentBalance?.value} Kistanácsi Befolyásod van` : "nincs Kistanácsi Befolyásod"}. Vásárlásoddal ${(currentBalance?.value ?? 0) + amount} befolyásod lesz a ${capitalize(side)} Kistanácsában.`
          }
          label="Vásárolni kívánt mennyiség"
          minValue={1}
          size="lg"
          value={amount}
          onValueChange={setAmount}
        />

        <Alert
          color="warning"
          description={
            <div>
              Ha már egyszer vásároltál befolyást valamelyik oldalhoz, onnantól
              csakis ahhoz az oldalhoz vásárolhatsz majd további befolyást.
            </div>
          }
          title="Vigyázz!"
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
            <Button
              color="primary"
              isDisabled={!side}
              size="lg"
              variant="solid"
              onPress={() => {
                side &&
                  increaseBalance({ side, amount })
                    .then(() => {
                      addToast({
                        title: "Holló érkezett",
                        description: "Sikeres vásárlás",
                        color: "success",
                      });
                      router.push("/list");
                    })
                    .catch((e: ConvexError<string>) =>
                      addToast({
                        color: "danger",
                        title: "Holló érkezett",
                        description: "Sikertelen vásárlás: " + e.data,
                      }),
                    );
              }}
            >
              Vásárlás
            </Button>
          </div>
        </div>
      </Authenticated>
    </motion.div>
  );
}
