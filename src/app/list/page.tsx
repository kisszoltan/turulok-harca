"use client";

import { motion } from "framer-motion";
import { Tab, Tabs } from "@heroui/react";

import { AllTab } from "./_components/all-tab";
import { SideTab } from "./_components/side-tab";

import { title } from "@/components/primitives";

export default function ListPage() {
  return (
    <motion.div
      key="list"
      animate={{ opacity: 1, scale: 1 }}
      className="text-center max-w-2xl mx-auto p-4 flex flex-col justify-center items-center gap-4"
      exit={{ opacity: 0, scale: 1.05 }}
      initial={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className={title({ size: "sm" })}>
        Melyik kérdés szerinted a legizgalmasabb?
      </h2>

      <Tabs aria-label="Rendezés">
        <Tab key="all" title="Minden">
          <AllTab />
        </Tab>
        <Tab key="hungeros" title="Hungeros">
          <SideTab side="hungeros" />
        </Tab>
        <Tab key="westeria" title="Westeria">
          <SideTab side="westeria" />
        </Tab>
      </Tabs>
    </motion.div>
  );
}
