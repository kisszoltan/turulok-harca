import { Tooltip } from "@heroui/react";
import { useEffect, useState } from "react";

import { timeRemaining } from "@/shared/utils";

export const Counter = () => {
  const [votesClose, setVotesClose] = useState({
    value: "",
    text: "",
  });

  useEffect(() => {
    const target = new Date("2026-04-12T23:59:59");
    const updateCountdown = () => {
      const result = timeRemaining(target, [
        "months",
        "days",
        "hours",
        "minutes",
        "seconds",
      ]);

      setVotesClose(result);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Tooltip
      content={
        <div>
          <div className="text-medium">
            Ennyi idő van hátra a következő koronázásig.
          </div>
          <div className="text-lg text-center font-bold">{votesClose.text}</div>
        </div>
      }
    >
      <div className="text-xl text-danger animate-pulse font-bold">
        {votesClose.value}
      </div>
    </Tooltip>
  );
};
