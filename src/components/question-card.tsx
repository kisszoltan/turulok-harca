import { Card, CardBody, CardFooter } from "@heroui/react";
import { FC } from "react";

import { VoteButton } from "./vote-button";
import { VoteChart } from "./vote-chart";

import { DataModel } from "@/convex/_generated/dataModel";
import { timeAgo } from "@/shared/utils";

export const QuestionCard: FC<{
  question: DataModel["questions"]["document"];
}> = ({ question: q }) => {
  return (
    <Card className="overflow-visible z-30">
      <CardBody className="text-lg text-default-500">
        <div>
          {q.content}
          <span className="text-default-400 text-sm ">
            {" "}
            - {timeAgo(q._creationTime)} beküldve
          </span>
        </div>
      </CardBody>
      <CardFooter className="flex justify-between items-center text-xs text-default-500 overflow-visible">
        <VoteChart {...q} />

        <VoteButton questionId={q._id} />
      </CardFooter>
    </Card>
  );
};
