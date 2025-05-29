import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Icon } from "@iconify/react";
import { usePaginatedQuery } from "convex/react";
import { useState } from "react";

import { api } from "@/convex/_generated/api";
import { QuestionCard } from "@/components/question-card";

export const AllTab = () => {
  const [searchInput, setSearchInput] = useState(""); // refreshes after every character hit
  const [searchQuery, setSearchQuery] = useState(""); // set only when "seach" button is clicked

  const {
    results: questions,
    status,
    loadMore,
  } = usePaginatedQuery(
    api.questions.list,
    {
      searchQuery,
    },
    { initialNumItems: 4 },
  );

  return (
    <>
      <div className="mb-4 flex gap-2">
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
        {questions.length === 0 && (
          <p className="text-default-400 text-sm italic">Nincs találat.</p>
        )}
        {questions.map((q) => (
          <QuestionCard key={q._id} question={q} />
        ))}
      </div>
      <div className="py-12 flex flex-col items-center gap-6">
        <Button
          className="px-8"
          color="primary"
          endContent={<Icon height={20} icon="mdi:chevron-down" width={20} />}
          isDisabled={status !== "CanLoadMore"}
          variant="flat"
          onPress={() => loadMore(4)}
        >
          Továbbiak betöltése
        </Button>
      </div>
    </>
  );
};
