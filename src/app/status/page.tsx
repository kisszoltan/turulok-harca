"use client";

import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  cn,
  Image,
  Link,
} from "@heroui/react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useQuery } from "convex/react";

import { sides } from "@/types";
import { capitalize, format } from "@/shared/utils";
import { message, title } from "@/components/primitives";
import { api } from "@/convex/_generated/api";
import { sideTypeValue } from "@/convex/_types";

export default function StatusPage() {
  const status = useQuery(api.balances.getStatus);
  const [hungerosPercent, setHungerosPercent] = useState(0);
  const [westeriaPercent, setWesteriaPercent] = useState(0);

  useEffect(() => {
    if (!status) return;
    const hunVotes = status["hungeros"]?.votes ?? 0;
    const wesVotes = status["westeria"]?.votes ?? 0;
    const total = hunVotes + wesVotes;

    setHungerosPercent((hunVotes / total) * 100);
    setWesteriaPercent((wesVotes / total) * 100);
  }, [status]);

  return (
    <section className="px-6">
      <h2 className="text-4xl md:text-5xl leading-9 text-center font-bold mb-6">
        A Jelenlegi Állás
      </h2>
      <motion.div
        initial={{ opacity: 0 }}
        transition={{ duration: 1 }}
        whileInView={{ opacity: 1 }}
      >
        <div className={cn(message(), "max-w-lg mx-auto text-center")}>
          Az eddig leadott szavazatok alapján ilyen arányú Kistanácsi Befolyás
          került érvényesítve a két oldalon.
        </div>

        {/* Progress bar container */}
        <div className="max-w-3xl mx-auto rounded-xl overflow-hidden shadow-lg">
          <div className="flex text-sm font-semibold">
            <motion.div
              animate={{ width: `${hungerosPercent}%` }}
              className="bg-orange-600 py-2 text-left text-white"
              style={{
                width: `${hungerosPercent}%`,
                borderTopLeftRadius: "0.75rem",
                borderBottomLeftRadius: "0.75rem",
              }}
              transition={{ duration: 1 }}
            >
              <span
                className="px-4 overflow-hidden line-clamp-1"
                title={`Hungeros (${hungerosPercent.toFixed(1)}%)`}
              >
                Hungeros ({hungerosPercent.toFixed(1)}%)
              </span>
            </motion.div>
            <motion.div
              animate={{ width: `${westeriaPercent}%` }}
              className="bg-green-600 py-2 text-right text-white"
              style={{
                width: `${westeriaPercent}%`,
                borderTopRightRadius: "0.75rem",
                borderBottomRightRadius: "0.75rem",
              }}
              transition={{ duration: 1 }}
            >
              <span
                className="px-4 overflow-hidden line-clamp-1"
                title={`Westeria (${westeriaPercent.toFixed(1)}%)`}
              >
                Westeria ({westeriaPercent.toFixed(1)}%)
              </span>
            </motion.div>
          </div>
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        whileInView={{ opacity: 1, y: 0 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mt-6">
          {status &&
            sideTypeValue.map((faction) => {
              const avg = !status[faction]
                ? 0
                : (status[faction].balance / status[faction].members).toFixed(
                    1,
                  );

              return (
                <div key={faction}>
                  <Card isFooterBlurred>
                    <CardHeader>
                      <h3 className={title({ size: "xs" })}>
                        {capitalize(faction)} - {format(status[faction]?.votes)}
                      </h3>
                    </CardHeader>
                    <CardBody>
                      <Image src={sides[faction].portrait} />
                    </CardBody>
                    <CardFooter className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 text-center text-default-500 overflow-hidden absolute rounded-large bottom-6 w-[90%] left-1/2 transform -translate-x-1/2  shadow-small z-10">
                      <div>
                        <div className="text-3xl font-bold text-white">
                          {format(status[faction]?.members)}{" "}
                          <span className="text-sm font-thin">fő</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Támogató
                        </div>
                      </div>
                      <div>
                        <div className="text-3xl font-bold text-white">
                          {format(status[faction]?.balance)}{" "}
                          <span className="text-sm font-thin">pont</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Max. befolyás / nap
                        </div>
                      </div>
                      <div>
                        <div className="text-3xl font-bold text-white">
                          {avg} <span className="text-sm font-thin">pont</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Befolyás / fő
                        </div>
                      </div>
                    </CardFooter>
                  </Card>
                </div>
              );
            })}
        </div>
      </motion.div>
      <CTA />
    </section>
  );
}

export const CTA = () => {
  return (
    <div className="bg-gradient-to-r from-primary-700 to-secondary-600 text-default-50 py-4 px-6 rounded-xl shadow-lg max-w-xl mx-auto mt-24">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-center sm:text-left space-y-2">
          <h2 className="text-2xl font-semibold">
            Vásárolj Kistanácsi Befolyást!
          </h2>
          <p>
            Kérdést bárki küldhet be ingyen, de dönteni a kérdésekről csak
            Kistanácsi Befolyás birtokában lehet. Szavazz a legfontosabb
            kérdésekre - te döntöd el, mi jut el az uralkodó elé!
          </p>
        </div>
        <Button
          as={Link}
          className="whitespace-normal sm:py-8"
          color="danger"
          href="/buy"
          size="lg"
        >
          Befolyást vásárolok
        </Button>
      </div>
    </div>
  );
};
