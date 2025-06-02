import { cn, Tooltip } from "@heroui/react";
import { useEffect, useState } from "react";
import { useQuery } from "convex/react";

import { message } from "./primitives";

import { timeRemaining } from "@/shared/utils";
import { api } from "@/convex/_generated/api";

export const VotingCounter = () => {
  const userCounter = useQuery(api.users.counters);
  const [nextVote, setNextVote] = useState({
    value: "",
    text: "",
  });

  useEffect(() => {
    if (!userCounter?.lastVote) return;
    const target = new Date(userCounter?.nextVote);
    const updateCountdown = () => {
      const result = timeRemaining(target, ["hours", "minutes", "seconds"]);

      setNextVote(result);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [userCounter]);

  return !userCounter || userCounter.canVote ? (
    <div className={message()}>
      Használd a Kistanácsi Befolyásod valamelyik kérdés és egyben az általad
      támogatott oldal erősítésére, de jól gondold meg hova szavazol, mert a
      következő szavazatod csak 24 óra múlva teheted majd meg.
    </div>
  ) : (
    <>
      <div className={message()}>
        Ne használd túl sokat a befolyásodat, mert könnyen ellenségeket
        szerezhetsz a Kistanácsban.
      </div>
      <div className={cn(message(), "flex flex-row gap-1")}>
        Legközelebb ennyi idő múlva szavazhatsz:
        <Tooltip
          content={
            <div>
              <div className="text-medium">
                Ennyi idő múlva újra szavazhatsz.
              </div>
              <div className="text-lg text-center font-bold">
                {nextVote.text}
              </div>
            </div>
          }
        >
          {nextVote.value}
        </Tooltip>
      </div>
    </>
  );
};
