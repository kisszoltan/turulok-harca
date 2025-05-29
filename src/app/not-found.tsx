"use client";

import { Link } from "@heroui/link";

import { message, title } from "@/components/primitives";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
      <h2 className={title({ size: "sm" })}>Az Istenekre mondom</h2>
      <p className={message()}>Rossz helyen keresgélsz!</p>
      <Link href="/">Próbáld az elején</Link>
    </div>
  );
}
