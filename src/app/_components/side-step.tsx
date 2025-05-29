import { Button } from "@heroui/button";
import { motion } from "framer-motion";
import { FC, Dispatch, SetStateAction } from "react";
import { cn } from "@heroui/theme";

import { StepType } from "@/types";
import { message, title } from "@/components/primitives";

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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <Button
          className="py-6 text-2xl bg-orange-500 text-white h-20 flex flex-col gap-1"
          size="lg"
          onPress={() => {
            //setSide("hungeros");
            setStep("action");
          }}
        >
          <span className="tracking-widest">Hungeros</span>
          <span className="text-sm">a régi rend védelmezője</span>
        </Button>
        <Button
          className="py-6 text-2xl bg-green-500 text-white h-20 flex flex-col gap-1"
          size="lg"
          onPress={() => {
            //setSide("westeria");
            setStep("action");
          }}
        >
          <span className="tracking-widest">Westeria</span>
          <span className="text-sm">az új korszak hírnöke</span>
        </Button>
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
