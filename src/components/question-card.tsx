import { Button } from "@heroui/button";
import {
  Card,
  CardBody,
  CardFooter,
  Link,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Tooltip,
} from "@heroui/react";
import { FC } from "react";
import { Authenticated, Unauthenticated } from "convex/react";

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
        <VoteButton />
      </CardFooter>
    </Card>
  );
};

const VoteButton = () => {
  return (
    <>
      <Authenticated>
        <Popover showArrow placement="right">
          <PopoverTrigger>
            <Button size="sm">Szavazok</Button>
          </PopoverTrigger>
          <PopoverContent>
            <div className="flex flex-col px-1 py-2 font-sans text-default-500">
              <div className="font-bold">
                XY Kistanácsi Befolyás felhasználása
              </div>
              <ul className="ml-4 mb-2">
                <li className="text-small list list-disc">
                  Legközelebb 24 óra múlva szavazhatsz
                </li>
                <li className="text-small list list-disc">
                  [side] kap +1 szavazatot erre a kérdésre
                </li>
                <li className="text-small list list-disc">
                  +XY támogatói pontot kap [side]
                </li>
                <li className="text-small list list-disc">
                  Megmarad az összes Kistanácsi Befolyásod
                </li>
              </ul>
              <div className="flex flex-row gap-2 w-full justify-center">
                <Button
                  as={Link}
                  className="mx-auto"
                  color="secondary"
                  href="/buy"
                  variant="light"
                >
                  Befolyást Vásárolok!
                </Button>
                <Button className="mx-auto" color="primary">
                  Szavazok!
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </Authenticated>
      <Unauthenticated>
        <Tooltip
          content={
            <div className="px-1 py-2">
              <div className="text-small font-bold">Kistanácsi Befolyás</div>
              <div className="text-tiny">
                Szavazni csak bejelentkezés után lehet.
              </div>
            </div>
          }
        >
          <Button as={Link} href="/auth/signin" size="sm">
            Belépek
          </Button>
        </Tooltip>
      </Unauthenticated>
    </>
  );
};
