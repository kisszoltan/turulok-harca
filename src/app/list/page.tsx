"use client";

import { useState, useMemo, FC } from "react";
import { motion } from "framer-motion";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Card, CardBody, CardFooter } from "@heroui/react";

import { title } from "@/components/primitives";

type Question = {
  id: string;
  text: string;
  votesTotal: number;
  votesHungeros: number;
  votesWesteria: number;
};

const questions: Question[] = [
  {
    id: "1",
    text: "Miért nem számolt el az EU-s pénzekkel a kormány?",
    votesTotal: 148,
    votesHungeros: 90,
    votesWesteria: 58,
  },
  {
    id: "2",
    text: "Hogyan tervezi visszaállítani a sajtószabadságot valamint az összes féket és egyensúlyt a hatalmi rendszerben?",
    votesTotal: 89,
    votesHungeros: 12,
    votesWesteria: 77,
  },
];

type SortBy = "default" | "hungeros" | "westeria";

export default function ListPage() {
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortBy>("default");

  const stats = useMemo(() => {
    let hungerosTop = 0;
    let westeriaTop = 0;

    for (const q of questions) {
      if (q.votesHungeros > hungerosTop) hungerosTop = q.votesHungeros;
      if (q.votesWesteria > westeriaTop) westeriaTop = q.votesWesteria;
    }

    return {
      leader:
        hungerosTop > westeriaTop
          ? "Hungeros"
          : hungerosTop < westeriaTop
            ? "Westeria"
            : "Döntetlen",
      hungerosTop,
      westeriaTop,
    };
  }, [questions]);

  const filtered = useMemo(() => {
    let result = questions.filter((q) =>
      q.text.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    if (sortBy === "hungeros") {
      result.sort((a, b) => b.votesHungeros - a.votesHungeros);
    } else if (sortBy === "westeria") {
      result.sort((a, b) => b.votesWesteria - a.votesWesteria);
    }

    return result;
  }, [questions, searchQuery, sortBy]);

  return (
    <motion.div
      key="list"
      animate={{ opacity: 1, scale: 1 }}
      className="text-center max-w-2xl p-4"
      exit={{ opacity: 0, scale: 1.05 }}
      initial={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className={title({ size: "sm" })}>
        Melyik kérdés szerinted a legizgalmasabb?
      </h2>

      <div className="mt-2 text-sm text-default-500">
        <span className="mr-2">Rendezés:</span>
        <Button
          className="cursor-pointer text-orange-500 hover:underline"
          variant="light"
          onPress={() => setSortBy("hungeros")}
        >
          Hungeros ({stats.hungerosTop})
        </Button>{" "}
        |{" "}
        <Button
          className="cursor-pointer text-green-500 hover:underline"
          variant="light"
          onPress={() => setSortBy("westeria")}
        >
          Westeria ({stats.westeriaTop})
        </Button>{" "}
        |{" "}
        <Button
          className="cursor-pointer text-default-400 hover:underline"
          variant="light"
          onPress={() => setSortBy("default")}
        >
          Időrendben
        </Button>
      </div>

      <div className="mt-6 mb-4 flex gap-2">
        <Input
          className="w-full"
          isClearable={true}
          placeholder="Keresés a kérdések között..."
          value={searchInput}
          onClear={() => {
            setSearchInput("");
            setSearchQuery("");
          }}
          onValueChange={setSearchInput}
        />
        <Button onPress={() => setSearchQuery(searchInput)}>Keresés</Button>
      </div>

      <div className="flex flex-col gap-4 px-1 mb-6">
        {filtered.length === 0 && (
          <p className="text-default-400 text-sm italic">Nincs találat.</p>
        )}
        {filtered.map((q) => (
          <QuestionCard key={q.id} question={q} />
        ))}
      </div>
    </motion.div>
  );
}

const QuestionCard: FC<{ question: Question }> = ({ question: q }) => {
  return (
    <Card key={q.id}>
      <CardBody className="text-sm text-default-foreground">{q.text}</CardBody>
      <CardFooter className="flex justify-between items-center text-xs text-default-500">
        <div className="flex gap-4">
          <span className="text-primary-500">Összesen: {q.votesTotal}</span>
          <span className="text-orange-500">Hungeros: {q.votesHungeros}</span>
          <span className="text-green-500">Westeria: {q.votesWesteria}</span>
        </div>
        <Button size="sm" onPress={() => {}}>
          Szavazok
        </Button>
      </CardFooter>
    </Card>
  );
};
