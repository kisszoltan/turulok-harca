import {
  GenericQueryCtx,
  GenericMutationCtx,
  GenericActionCtx,
} from "convex/server";
import { ConvexError } from "convex/values";
import { addDays, differenceInDays } from "date-fns";

import { DataModel, Id } from "./_generated/dataModel";

/**
 * @returns the logged in user, otherwise throws an exception
 */
export const expectUser = async (
  ctx:
    | GenericQueryCtx<DataModel>
    | GenericMutationCtx<DataModel>
    | GenericActionCtx<DataModel>,
): Promise<Id<"users">> => {
  const userId = await assumeUser(ctx);

  if (!userId) throw new ConvexError("User is not authorised");

  return userId as Id<"users">;
};

/**
 * @returns the logged in user, otherwise undefined
 */
export const assumeUser = async (
  ctx:
    | GenericQueryCtx<DataModel>
    | GenericMutationCtx<DataModel>
    | GenericActionCtx<DataModel>,
) => {
  const identity = await ctx.auth.getUserIdentity();

  if (!identity) return;

  return (
    identity.subject.indexOf("|") > 0
      ? identity.subject.split("|")[0]
      : identity.subject
  ) as Id<"users">;
};

export const getVoteCounters = async (
  ctx: GenericQueryCtx<DataModel>,
  userId: string,
  now: number,
) => {
  const lastVote = await ctx.db
    .query("votes")
    .filter((q: any) => q.eq(q.field("userId"), userId))
    .order("desc")
    .first();

  return {
    lastVote: lastVote?._creationTime,
    nextVote: lastVote?._creationTime
      ? Math.max(now, addDays(lastVote._creationTime, 1).getTime())
      : now,
    canVote:
      !lastVote?._creationTime ||
      now > addDays(lastVote._creationTime, 1).getTime(),
  };
};

export const getAskCounters = async (
  ctx: GenericQueryCtx<DataModel>,
  userId: string,
  now: number,
) => {
  const lastQuestion = await ctx.db
    .query("questions")
    .filter((q: any) => q.eq(q.field("owner"), userId))
    .order("desc")
    .first();
  const lastRejects = await ctx.db
    .query("rejects")
    .filter((q: any) => q.eq(q.field("owner"), userId))
    .order("desc")
    .take(3);

  const recentRejects = lastRejects.filter(
    (r: any) => differenceInDays(now, r._creationTime) <= 7,
  );

  const lastRejectTime = recentRejects[0]?._creationTime;

  const questionCooldownEnd = lastQuestion
    ? addDays(lastQuestion._creationTime, 7).getTime()
    : now;

  const rejectCooldownEnd =
    recentRejects.length === 3 && lastRejectTime
      ? addDays(lastRejectTime, 7).getTime()
      : now;

  const nextQuestion = Math.max(now, questionCooldownEnd, rejectCooldownEnd);

  return {
    lastQuestion: lastQuestion?._creationTime,
    nextQuestion,
    canAsk: now >= nextQuestion,
  };
};
