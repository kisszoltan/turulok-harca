import { Button } from "@heroui/button";
import { motion } from "framer-motion";
import { FC, Dispatch, SetStateAction } from "react";
import { cn } from "@heroui/theme";

import { StepType } from "@/types";
import { message, title } from "@/components/primitives";
import { SideButton } from "@/components/side-button";

export const SideStep: FC<{
  setStep: Dispatch<SetStateAction<StepType>>;
}> = ({ setStep }) => {
  return (
    <motion.div
      key="side"
      animate={{ opacity: 1, scale: 1 }}
      className="text-center max-w-2xl p-4"
      exit={{ opacity: 0, scale: 1.05 }}
      initial={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className={title({ size: "sm" })}>Egy ország. Két világ.</h2>
      <p className={cn(message({ isJustified: false }), "my-8")}>
        Árulás, szövetségek és hatalmi játszmák döntik el, ki formálhatja majd a
        birodalom jövőjét.
      </p>
      <div className="flex flex-col md:flex-row gap-6 mt-6 justify-center">
        <SideButton
          side="hungeros"
          onPress={() => {
            setStep("action");
          }}
        />
        <SideButton
          side="westeria"
          onPress={() => {
            setStep("action");
          }}
        />
      </div>
      <Button
        className="mt-4 text-default-400"
        variant="light"
        onPress={() => setStep("intro")}
      >
        Vissza
      </Button>
    </motion.div>
  );
};
