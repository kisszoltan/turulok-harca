"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";

import { ActionStep } from "./_components/action-step";
import { IntroStep } from "./_components/intro-step";
import { SideStep } from "./_components/side-step";

import { StepType, SideType } from "@/types";

export default function Home() {
  const [step, setStep] = useState<StepType>("intro");
  const [, setSide] = useState<SideType>(null);

  return (
    <div className="w-full h-full flex items-center justify-center">
      <AnimatePresence mode="wait">
        {step === "intro" && <IntroStep setStep={setStep} />}
        {step === "side" && <SideStep setSide={setSide} setStep={setStep} />}
        {step === "action" && <ActionStep setStep={setStep} />}
      </AnimatePresence>
    </div>
  );
}
