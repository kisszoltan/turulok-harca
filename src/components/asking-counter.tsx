import { cn, Tooltip } from "@heroui/react";
import { useEffect, useState } from "react";
import { useQuery } from "convex/react";

import { message } from "./primitives";

import { timeRemaining } from "@/shared/utils";
import { api } from "@/convex/_generated/api";

export const AskingCounter = () => {
  const userCounter = useQuery(api.users.counters);
  const [nextAsk, setNextAsk] = useState({
    value: "",
    text: "",
  });

  useEffect(() => {
    if (!userCounter?.lastQuestion) return;
    const target = new Date(userCounter?.nextQuestion);
    const updateCountdown = () => {
      const result = timeRemaining(target, [
        "days",
        "hours",
        "minutes",
        "seconds",
      ]);

      setNextAsk(result);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [userCounter]);

  return !userCounter || userCounter.canAsk ? (
    <div className={message()}>
      Bárki kérdezhet ha a megfelelő tartalmi követelményeket betartja, de a
      Kistanács védelme érdekében, 3 sikertelen próbálkozás, vagy egy sikeresen
      feltett kérdés után a kérdezőnek 7 napot várni kell.
    </div>
  ) : (
    <>
      <div className={cn(message(), "my-8")}>
        A nép kíváncsi a hangodra, de az sem jó, ha csak téged hallanak. Korábbi
        próbálkozásaid miatt most várnod kell egy keveset.
      </div>
      <div className={cn(message(), "flex flex-row gap-1")}>
        Legközelebb ennyi idő múlva tehetsz fel kérdést:
        <Tooltip
          content={
            <div>
              <div className="text-medium">
                Ennyi idő múlva kérdezhetsz újra.
              </div>
              <div className="text-lg text-center font-bold">
                {nextAsk.text}
              </div>
            </div>
          }
        >
          {nextAsk.value}
        </Tooltip>
      </div>
    </>
  );
};
