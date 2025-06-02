"use client";

import { Button } from "@heroui/button";
import { Textarea } from "@heroui/input";
import { motion } from "framer-motion";
import { useState } from "react";
import { Link } from "@heroui/link";
import { cn } from "@heroui/theme";
import { useMutation, useQuery } from "convex/react";
import { addToast } from "@heroui/react";
import { ConvexError } from "convex/values";
import { useRouter } from "next/navigation";

import { message, title } from "@/components/primitives";
import { HintBox } from "@/components/hint-box";
import { api } from "@/convex/_generated/api";
import { Loading } from "@/components/loading";

export default function AskPage() {
  const router = useRouter();
  const [sending, setSending] = useState(false);
  const [question, setQuestion] = useState("");
  const { MAX_QUESTION_LENGTH } = useQuery(api.core.config) ?? {};
  const submitQuestion = useMutation(api.questions.create);

  const handleSubmit = () => {
    if (question.trim().length > 0) {
      setSending(true);
      submitQuestion({ content: question })
        .then(() => {
          addToast({
            title: "A hollód megérkezett",
            description: "Kérdés sikeresen beküldve",
            color: "success",
          });
          router.push("/list");
        })
        .catch((e: ConvexError<string>) =>
          addToast({
            title: "A hollód visszafordult",
            description: e.data,
            color: "danger",
          }),
        )
        .finally(() => setSending(false));
    }
  };

  return MAX_QUESTION_LENGTH === undefined ? (
    <Loading />
  ) : (
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
          description={`${question?.trim().length ?? 0}/${MAX_QUESTION_LENGTH}`}
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
            Már beküldött kérdések
          </Button>
          <Button
            color="primary"
            isDisabled={
              sending ||
              question.trim().length === 0 ||
              question.trim().length > MAX_QUESTION_LENGTH
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
