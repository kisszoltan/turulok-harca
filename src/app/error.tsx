"use client";

import { Button } from "@heroui/button";
import { useEffect } from "react";

import { message, title } from "@/components/primitives";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
      <h2 className={title({ size: "sm" })}>Az Istenekre mondom</h2>
      <p className={message()}>Valami nem stimmel!</p>
      <Button onPress={() => reset()}>Próbáld újra</Button>
    </div>
  );
}
