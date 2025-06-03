"use client";

import { Button, Card, CardBody, CardHeader, Link } from "@heroui/react";
import { Icon } from "@iconify/react";
import { usePaginatedQuery, useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";
import { Loading } from "@/components/loading";
import { capitalize, format } from "@/shared/utils";
import { message, subtitle } from "@/components/primitives";

export default function ProfilePage() {
  const profile = useQuery(api.users.get, {});
  const balance = useQuery(api.balances.get);
  const {
    results: voteHistory,
    status: voteHistoryStatus,
    loadMore: loadMoreVoteHistory,
  } = usePaginatedQuery(api.votes.listForUser, {}, { initialNumItems: 5 });
  const {
    results: purchases,
    status: purchasesStatus,
    loadMore: loadMorePurchases,
  } = usePaginatedQuery(api.payments.listForUser, {}, { initialNumItems: 5 });
  const {
    results: accepted,
    status: acceptedStatus,
    loadMore: loadMoreAccepted,
  } = usePaginatedQuery(api.questions.listForUser, {}, { initialNumItems: 5 });
  const {
    results: rejected,
    status: rejectedStatus,
    loadMore: loadMoreRejected,
  } = usePaginatedQuery(
    api.questions.listRejectedForUser,
    {},
    { initialNumItems: 5 },
  );

  return profile === undefined ? (
    <Loading />
  ) : (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-10">
      <h1 className="text-3xl font-bold text-center">Profilom</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <Card>
          <CardHeader className="flex flex-row justify-between">
            <div className={subtitle()}>
              <Icon
                className="inline mr-2 text-primary-500"
                icon="mdi:email-outline"
                width={30}
              />{" "}
              Email cím
            </div>
            <Button
              isIconOnly
              as={Link}
              className="absolute right-2"
              href="/auth/signout"
              title="Kilépés"
              variant="light"
            >
              <Icon icon="mdi:exit-run" width={24} />
            </Button>
          </CardHeader>
          <CardBody>
            <p>{profile?.email}</p>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <div className={subtitle()}>
              <Icon
                className="inline mr-2 text-warning-500"
                icon="mdi:star-circle-outline"
                width={30}
              />
              Birtokolt Befolyás
            </div>
          </CardHeader>
          <CardBody>
            {!balance?.value ? (
              <p>
                Még nincs befolyásod. <Link href="/buy">Itt</Link> vásárolhatsz.
              </p>
            ) : (
              <p>
                {balance?.value} Kistanácsi Befolyás -{" "}
                {capitalize(balance?.side ?? "")}
              </p>
            )}
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className={subtitle()}>
            <Icon
              className="inline mr-2 text-secondary-600"
              icon="mdi:history"
              width={30}
            />{" "}
            Szavazási történet
          </div>
        </CardHeader>
        <CardBody className="space-y-2">
          {voteHistory.length === 0 ? (
            <div className={message({ size: "xs" })}>
              Még nem szavaztál. Ha már van Kistanácsi Befolyásod,{" "}
              <Link className="text-xs md:text-sm" href="/list">
                nézd át a kérdéseket
              </Link>{" "}
              és dönt Te arról, hogy mi kerüljön az uralkodó elé.
            </div>
          ) : (
            <>
              {voteHistory.map((vote, i) => (
                <div key={i} className="text-lg text-default-800">
                  <span className="text-sm font-medium">
                    {new Date(vote._creationTime).toLocaleString()}:
                  </span>{" "}
                  {vote.question?.content}
                </div>
              ))}
              <Button
                className="px-8 w-fit mx-auto"
                color="primary"
                endContent={
                  <Icon height={20} icon="mdi:chevron-down" width={20} />
                }
                isDisabled={voteHistoryStatus !== "CanLoadMore"}
                size="sm"
                variant="flat"
                onPress={() => loadMoreVoteHistory(4)}
              >
                Továbbiak betöltése
              </Button>
            </>
          )}
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <div className={subtitle()}>
            <Icon
              className="inline mr-2 text-success-600"
              icon="mdi:credit-card-outline"
              width={30}
            />{" "}
            Vásárlások
          </div>
        </CardHeader>

        <CardBody className="space-y-2">
          {purchases.length === 0 ? (
            <div className={message({ size: "xs" })}>
              Nincs Kistanácsi Befolyásod: Ha szeretnél kérdésekre szavazni,{" "}
              <Link className="text-xs md:text-sm" href="/buy">
                vásárolj Kistanácsi Befolyást
              </Link>
              , és alakítsd Te az eredményeket.
            </div>
          ) : (
            <>
              {purchases.map((purchase, i) => (
                <div
                  key={i}
                  className="flex flex-row gap-1 items-center text-default-800"
                >
                  <span className="text-xm">
                    {new Date(purchase._creationTime).toLocaleString()}
                  </span>
                  <span className="text-xm">-</span>
                  <span className="text-lg font-semibold">
                    {purchase.amount} {capitalize(purchase.side)} Kistanácsi
                    Befolyás
                  </span>
                  <span className="text-xm">({format(purchase.paid)} Ft)</span>
                  <span>
                    {purchase.processed ? (
                      <Icon
                        className="text-success-500"
                        icon="mdi:tick-circle"
                      />
                    ) : (
                      <Icon
                        className="text-danger-500"
                        icon="mdi:progress-alert"
                      />
                    )}
                  </span>
                </div>
              ))}
              <Button
                className="px-8 w-fit mx-auto"
                color="primary"
                endContent={
                  <Icon height={20} icon="mdi:chevron-down" width={20} />
                }
                isDisabled={purchasesStatus !== "CanLoadMore"}
                size="sm"
                variant="flat"
                onPress={() => loadMorePurchases(4)}
              >
                Továbbiak betöltése
              </Button>
            </>
          )}
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <div className={subtitle()}>
            <Icon
              className="inline mr-2 text-success-600"
              icon="mdi:check-circle-outline"
              width={30}
            />{" "}
            Elfogadott kérdések
          </div>
        </CardHeader>
        <CardBody className="space-y-3">
          {accepted.length === 0 ? (
            <div className={message({ size: "xs" })}>
              Még nem küldtél be kérdést, pedig azt bármikor{" "}
              <Link className="text-xs md:text-sm" href="/ask">
                megteheted
              </Link>{" "}
              ingyen, Kistanácsi Befolyás nélkül.
            </div>
          ) : (
            <>
              {accepted.map((q, i) => (
                <div key={i} className="text-sm text-default-800">
                  <div className="font-medium">{q.content}</div>
                  <div className="text-xs text-default-500">
                    Szavazatok - Összesen:{" "}
                    {format((q.votesHungeros ?? 0) + (q.votesWesteria ?? 0))},
                    Hungeros: {format(q.votesHungeros)}, Westeria:{" "}
                    {format(q.votesWesteria)}
                  </div>
                </div>
              ))}
              <Button
                className="px-8 w-fit mx-auto"
                color="primary"
                endContent={
                  <Icon height={20} icon="mdi:chevron-down" width={20} />
                }
                isDisabled={acceptedStatus !== "CanLoadMore"}
                size="sm"
                variant="flat"
                onPress={() => loadMoreAccepted(4)}
              >
                Továbbiak betöltése
              </Button>
            </>
          )}
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <div className={subtitle()}>
            <Icon
              className="inline mr-2 text-danger-600"
              icon="mdi:alert-circle-outline"
              width={30}
            />{" "}
            Elutasított kérdések
          </div>
        </CardHeader>
        <CardBody className="space-y-3">
          {rejected.length === 0 ? (
            <div className={message({ size: "xs" })}>
              Nincsenek elutasított kérdéseid.
            </div>
          ) : (
            <>
              {rejected.map((q, i) => (
                <div
                  key={i}
                  className="text-sm text-default-800 border-l-4 border-danger-400 pl-3"
                >
                  <div className="font-medium">{q.content}</div>
                  <div className="text-xs text-default-500">Ok: {q.reason}</div>
                  <div className="text-xs text-default-500 italic">
                    Javaslat: {q.suggestion}
                  </div>
                </div>
              ))}
              <Button
                className="px-8 w-fit mx-auto"
                color="primary"
                endContent={
                  <Icon height={20} icon="mdi:chevron-down" width={20} />
                }
                isDisabled={rejectedStatus !== "CanLoadMore"}
                size="sm"
                variant="flat"
                onPress={() => loadMoreRejected(4)}
              >
                Továbbiak betöltése
              </Button>
            </>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
