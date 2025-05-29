"use client";

import { Button } from "@heroui/button";
import { Textarea } from "@heroui/input";
import { motion } from "framer-motion";
import { useState } from "react";
import { Link } from "@heroui/link";
import { cn } from "@heroui/theme";

import { message, title } from "@/components/primitives";
import { HintBox } from "@/components/hint-box";

const maxLength = 200;

export default function AskPage() {
  const [question, setQuestion] = useState("");

  const handleSubmit = () => {
    if (question.trim().length > 0) {
    }
  };

  return (
    <motion.div
      key="ask"
      animate={{ opacity: 1, scale: 1 }}
      className="text-center max-w-2xl mx-auto p-4"
      exit={{ opacity: 0, scale: 1.05 }}
      initial={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className={title({ size: "sm" })}>Mit szeretnél kérdezni?</h2>
      <p className={cn(message(), "my-8")}>
        Fogalmazd meg a kérdésed, amit egy uralkodótól kérdeznél a kikiáltását
        követő első beszélgetésben. Kérdésed legyen méltó mind stílusában, mind
        tartalmában egy ilyen beszélgetéshez. Kerüld a személyes utalásokat,
        hiszen az uralkodó személye, akit kérdezel még ismeretlen.
      </p>
      <div className="mt-6">
        <Textarea
          className="w-full max-w-md mx-auto"
          description={`${question?.trim().length ?? 0}/${maxLength}`}
          minRows={5}
          placeholder="Írd ide a kérdésed..."
          rows={5}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
      </div>

      <div className="mt-8 flex flex-col items-center gap-6">
        <HintBox />

        <div className="flex gap-4">
          <Button
            as={Link}
            className="text-default-400"
            href="/list"
            variant="light"
          >
            Már feltett kérdések
          </Button>
          <Button
            color="primary"
            isDisabled={
              question.trim().length === 0 || question.trim().length > maxLength
            }
            variant="solid"
            onPress={handleSubmit}
          >
            Kérdés beküldése
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
