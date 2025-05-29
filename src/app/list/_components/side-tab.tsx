import { cn } from "@heroui/theme";
import { FC } from "react";
import { useQuery } from "convex/react";

import { message } from "@/components/primitives";
import { capitalize } from "@/shared/utils";
import { SideType } from "@/convex/_types";
import { api } from "@/convex/_generated/api";
import { Loading } from "@/components/loading";
import { QuestionCard } from "@/components/question-card";

export const SideTab: FC<{ side: SideType }> = ({ side }) => {
  const questions = useQuery(api.questions.listForSide, { side });
  const { TOP_LIST_LENGTH } = useQuery(api.core.config) ?? {};

  return (
    <>
      <p className={cn(message({ size: "sm", isJustified: false }), "mb-4")}>
        {capitalize(side)} oldal támogatói az alábbi {TOP_LIST_LENGTH}{" "}
        kérdéseket részesítenék előnyben.
      </p>
      {questions === undefined ? (
        <Loading />
      ) : (
        <div className="flex flex-col gap-4 px-1 mb-6">
          {questions.length === 0 ? (
            <p className="text-default-400 text-sm italic">Nincs találat.</p>
          ) : (
            questions.map((q) => <QuestionCard key={q._id} question={q} />)
          )}
        </div>
      )}
    </>
  );
};
