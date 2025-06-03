"use client";

import { motion } from "framer-motion";
import { Link, Tab, Tabs } from "@heroui/react";
import { useQuery } from "convex/react";

import { AllTab } from "./_components/all-tab";
import { SideTab } from "./_components/side-tab";

import { message, title } from "@/components/primitives";
import { api } from "@/convex/_generated/api";
import { format } from "@/shared/utils";
import { VotingCounter } from "@/components/voting-counter";

export default function ListPage() {
  const sideVotes = useQuery(api.balances.getVotes);

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
      <VotingCounter />
      <p className={message()}>
        Nem találod azt a kérdést, ami szerinted a legfontosabb?{" "}
        <Link className="text-lg md:text-xl" href="/ask">
          Küldj be
        </Link>{" "}
        Te is egy kérdést, hiszen kérdezni befolyás nélkül is lehet.
      </p>

      <Tabs aria-label="Rendezés">
        <Tab key="all" className="w-full" title="Minden">
          <AllTab />
        </Tab>
        <Tab
          key="hungeros"
          className="w-full"
          title={`Hungeros (${sideVotes && format(sideVotes["hungeros"])})`}
        >
          <SideTab side="hungeros" />
        </Tab>
        <Tab
          key="westeria"
          className="w-full"
          title={`Westeria (${sideVotes && format(sideVotes["westeria"])})`}
        >
          <SideTab side="westeria" />
        </Tab>
      </Tabs>
    </motion.div>
  );
}
