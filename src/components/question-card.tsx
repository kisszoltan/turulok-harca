import { Button } from "@heroui/button";
import {
  addToast,
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
import {
  Authenticated,
  Unauthenticated,
  useMutation,
  useQuery,
} from "convex/react";
import { ConvexError } from "convex/values";

import { DataModel, Id } from "@/convex/_generated/dataModel";
import { capitalize, format, timeAgo } from "@/shared/utils";
import { api } from "@/convex/_generated/api";

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
        <VoteButton questionId={q._id} />
      </CardFooter>
    </Card>
  );
};

const VoteButton: FC<{ questionId: Id<"questions"> }> = ({ questionId }) => {
  const submitVote = useMutation(api.balances.vote);
  const currentBalance = useQuery(api.balances.get);

  return (
    <>
      <Authenticated>
        <Popover showArrow placement="right">
          <PopoverTrigger>
            <Button size="sm">Szavazok</Button>
          </PopoverTrigger>
          <PopoverContent>
            <div className="flex flex-col px-1 py-2 font-sans text-default-500">
              {currentBalance ? (
                <>
                  <div className="font-bold">
                    {currentBalance.value} Kistanácsi Befolyás felhasználása
                  </div>
                  <ul className="ml-4 mb-2">
                    <li className="text-small list list-disc">
                      24 óra múlva újra szavazhatsz
                    </li>
                    <li className="text-small list list-disc">
                      {capitalize(currentBalance.side)} kap +1 szavazatot erre a
                      kérdésre
                    </li>
                    <li className="text-small list list-disc">
                      +{currentBalance.value} támogatói pontot kap{" "}
                      <b>{capitalize(currentBalance.side)}</b>
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
                    <Button
                      className="mx-auto"
                      color="primary"
                      onPress={() => {
                        submitVote({ question: questionId })
                          .then(() => {
                            addToast({
                              title: "Holló érkezett",
                              description: "Szavazatod megkaptuk",
                              color: "success",
                            });
                          })
                          .catch((e: ConvexError<string>) =>
                            addToast({
                              title: "Holló érkezett",
                              description: e.data,
                              color: "danger",
                            }),
                          );
                      }}
                    >
                      Szavazok!
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="font-bold mb-4">
                    Nincs Kistanácsi Befolyásod
                  </div>
                  <Button
                    as={Link}
                    className="mx-auto"
                    color="primary"
                    href="/buy"
                  >
                    Vásárolok Befolyást!
                  </Button>
                </>
              )}
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
