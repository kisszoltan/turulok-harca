import { Button } from "@heroui/button";
import { motion } from "framer-motion";
import { Dispatch, FC, SetStateAction } from "react";
import { Link } from "@heroui/link";
import { cn } from "@heroui/theme";

import { StepType } from "@/types";
import { message, title } from "@/components/primitives";

export const ActionStep: FC<{
  setStep: Dispatch<SetStateAction<StepType>>;
}> = ({ setStep }) => {
  return (
    <motion.div
      key="action"
      animate={{ opacity: 1, scale: 1 }}
      className="text-center max-w-2xl p-4"
      exit={{ opacity: 0, scale: 1.05 }}
      initial={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className={title({ size: "sm" })}>Mi lesz a koronázás után?</h2>
      <p className={cn(message({ isJustified: false }), "my-8")}>
        Hungria hamarosan újra egyesül amikor a két tartomány együttesen
        nyílványítja ki akaratát, hogy melyik vezető legyen az ország
        uralkodója.
      </p>
      <p className={cn(message({ isJustified: false }), "my-8")}>
        Te mit kérdeznél az uralkodótól a koronázása utáni első percben?
      </p>
      <div className="flex flex-row gap-6 mt-8 mb-4 justify-center">
        <Button
          as={Link}
          className="text-lg py-6 w-fit"
          color="primary"
          href="/ask"
          size="lg"
          variant="solid"
        >
          Megmondom
        </Button>
        <Button
          as={Link}
          className="text-lg py-6"
          color="secondary"
          href="/list"
          size="lg"
          variant="light"
        >
          Megnézem mások kérdéseit
        </Button>
      </div>
      <Button
        className="text-default-400"
        variant="light"
        onPress={() => setStep("intro")}
      >
        Újrakezdeném az bevezetőt
      </Button>
    </motion.div>
  );
};
