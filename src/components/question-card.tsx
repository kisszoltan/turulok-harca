import { Button } from "@heroui/button";
import { Card, CardBody, CardFooter } from "@heroui/react";
import { FC } from "react";

import { DataModel } from "@/convex/_generated/dataModel";
import { format, timeAgo } from "@/shared/utils";

export const QuestionCard: FC<{
  question: DataModel["questions"]["document"];
}> = ({ question: q }) => {
  return (
    <Card>
      <CardBody className="text-lg text-default-500">
        <div>
          {q.content}
          <span className="text-default-400 text-sm ">
            {" "}
            - {timeAgo(q._creationTime)} beküldve
          </span>
        </div>
      </CardBody>
      <CardFooter className="flex justify-between items-center text-xs text-default-500">
        <div className="flex gap-4">
          <span className="text-primary-500">
            Összesen: {format((q.votesHungeros ?? 0) + (q.votesWesteria ?? 0))}
          </span>
          <span className="text-orange-500">
            Hungeros: {format(q.votesHungeros)}
          </span>
          <span className="text-green-500">
            Westeria: {format(q.votesWesteria)}
          </span>
        </div>
        <Button size="sm" onPress={() => {}}>
          Szavazok
        </Button>
      </CardFooter>
    </Card>
  );
};
