import { Button } from "@heroui/button";
import { motion } from "framer-motion";
import { FC, Dispatch, SetStateAction } from "react";
import { cn } from "@heroui/theme";
import { Link } from "@heroui/link";

import { StepType } from "@/types";
import { message, title } from "@/components/primitives";

export const IntroStep: FC<{
  setStep: Dispatch<SetStateAction<StepType>>;
}> = ({ setStep }) => {
  return (
    <motion.div
      key="intro"
      animate={{ opacity: 1, y: 0 }}
      className="text-center max-w-xl p-4"
      exit={{ opacity: 0, y: -50 }}
      initial={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.6 }}
    >
      <p className={cn(message({ isJustified: false }), "mb-8")}>
        Az ismert világ megszűnt, Hungria szétszakadt.
      </p>
      <h1 className={title({ color: "yellow" })}>Két világ. Egy kérdés.</h1>
      <p className={cn(message({ isJustified: false }), "my-8")}>
        Hungria most kíváncsi a hangodra.
      </p>
      <div className="flex flex-row gap-2 items-center justify-center">
        <Button
          className="text-lg"
          color="primary"
          size="lg"
          onPress={() => setStep("side")}
        >
          Kezdjük
        </Button>
        <Button
          as={Link}
          className="text-lg"
          color="secondary"
          href="/list"
          size="lg"
          variant="light"
        >
          Lássuk mások hangját
        </Button>
      </div>
    </motion.div>
  );
};
