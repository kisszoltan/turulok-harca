import { FC, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";

const HINTS = [
  "Kérdezni szabad - és ingyenes. A nép mindkét oldalról szavazhat.",
  "Ismétlés nem megengedett - még hasonlóság esetén sem. Használd a keresőt, mielőtt kérdezel.",
  "Minden kérdés uralkodóhoz méltó legyen. Ez nem Bolhavég.",
  "3 sikertelen próbálkozás vagy elfogadott kérdés után - egy hét csend.",
];

export const HintBox: FC = () => {
  const [index, setIndex] = useState(0);

  // Forgatás 8 másodpercenként
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % HINTS.length);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative bg-background/70 border border-default-300 rounded-xl p-4 md:p-5 shadow-md max-w-md mx-auto">
      <div className="flex items-start gap-3">
        <Icon
          className="text-default-400 w-5 h-5 mt-1 shrink-0"
          icon="mdi:sparkles-outline"
        />
        <div className="text-sm md:text-base text-default-foreground font-medium text-left line-clamp-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              initial={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.5 }}
            >
              {HINTS[index]}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
