"use client";

import { Button } from "@heroui/button";
import { motion } from "framer-motion";
import { Link } from "@heroui/link";
import { cn } from "@heroui/theme";
import { FC, useEffect, useState } from "react";
import { addToast, Alert, Card, CardBody, NumberInput } from "@heroui/react";
import {
  Authenticated,
  Unauthenticated,
  useAction,
  useMutation,
  useQuery,
} from "convex/react";
import { ConvexError } from "convex/values";
import { useRouter } from "next/navigation";

import { message, title } from "@/components/primitives";
import { SideType } from "@/convex/_types";
import { capitalize, format } from "@/shared/utils";
import { SideButton } from "@/components/side-button";
import { api } from "@/convex/_generated/api";

export default function BuyPage() {
  const { BASE_PRICE } = useQuery(api.core.config) ?? {};
  const currentBalance = useQuery(api.balances.get);
  const [side, setSide] = useState<SideType | undefined>(currentBalance?.side);
  const [amount, setAmount] = useState(1);
  const [totalPrice, setTotalPrice] = useState(BASE_PRICE);
  const pay = useAction(api.stripe.pay);

  useEffect(() => {
    setSide(currentBalance?.side);
  }, [currentBalance]);

  useEffect(() => {
    setTotalPrice((BASE_PRICE ?? 0) * amount);
  }, [BASE_PRICE, amount]);

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
          classNames={{ input: "text-xl", label: "text-lg" }}
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

        <div className="my-8 flex flex-col items-center gap-6">
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
              onPress={async () => {
                if (!side) return;

                pay({ amount, side })
                  .then((paymentUrl) => (window.location.href = paymentUrl!))
                  .catch((e: ConvexError<string>) =>
                    addToast({
                      color: "danger",
                      title: "A hollód visszafordult",
                      description: "Sikertelen vásárlás: " + e.data,
                    }),
                  );
              }}
            >
              Vásárlás ({format(totalPrice)} Ft)
            </Button>
          </div>
        </div>
        <BannerMen side={side} />
      </Authenticated>
    </motion.div>
  );
}

const BannerMen: FC<{ side?: SideType }> = ({ side }) => {
  const router = useRouter();
  const balance = useQuery(api.balances.get);
  const bannerMen = useMutation(api.balances.bannerMen);
  const { BANNER_PERIOD_OVER } = useQuery(api.core.config) ?? {};

  if (!!BANNER_PERIOD_OVER || balance) return null;

  return (
    <Card>
      <CardBody className="flex flex-col items-center gap-2">
        <p className={message({ size: "sm" })}>
          Az uralkodójelöltek mozgósították a zászlóhordozóikat, de amíg a
          hollók nem térnek vissza senki sem tudhatja biztosan ki válaszol. A
          tanácsadók most mindkét oldalon kétségbeesettek. Ha ügyesen
          helyezkedsz, még az is lehet, hogy a Kistanácsból adósoddá tehetsz
          valakit.
        </p>
        <Button
          className="w-fit"
          color="primary"
          isDisabled={!side}
          size="lg"
          variant="solid"
          onPress={async () => {
            if (!side) return;

            bannerMen({ side })
              .then(() => {
                addToast({
                  title: "A hollód megérkezett",
                  description: "Sikeres megszereztél 1 Kistanácsi Befolyást",
                  color: "success",
                });
                router.push("/list");
              })
              .catch((e: ConvexError<string>) =>
                addToast({
                  color: "danger",
                  title: "A hollód visszafordult",
                  description: e.data,
                }),
              );
          }}
        >
          Kérem az 1 Kistanácsi Befolyásomat
        </Button>
        <p className={cn(message({ size: "xs" }), "text-default-400")}>
          Az az ajánlat korlátozott ideig érvényes, így a Kistanácsi Befolyás
          ingyenes megszerzése is véges. Ezen időszak alatt is csak olyan
          felhasználók kaphatnak ingyenes befolyást, akik még nem rendelkeznek
          Kistanácsi Befolyással (egyik oldal felé sem). Az így megszerezhető
          Kistanácsi Befolyás mennyisége pontosan 1 lehet.
        </p>
      </CardBody>
    </Card>
  );
};
