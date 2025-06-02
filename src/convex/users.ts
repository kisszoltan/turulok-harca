import { v } from "convex/values";
import { addDays } from "date-fns";

import { query } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { assumeUser } from "./_shared";

export const get = query({
  args: {
    id: v.optional(v.string()),
  },
  handler: async (ctx, { id }) => {
    const viewerId = await assumeUser(ctx);
    const userId = id || viewerId;

    if (!userId) return null;

    let user = await ctx.db.get(userId as Id<"users">);

    const self = viewerId && user?._id === viewerId;

    return Object.assign({}, user, {
      self,
      email: self ? user.email : null,
    });
  },
});

export const counters = query({
  handler: async (ctx) => {
    const userId = await assumeUser(ctx);

    if (!userId) return null;

    const lastVote = await ctx.db
      .query("votes")
      .filter((q) => q.eq(q.field("userId"), userId))
      .order("desc")
      .first();
    const lastQuestion = await ctx.db
      .query("questions")
      .filter((q) => q.eq(q.field("owner"), userId))
      .order("desc")
      .first();

    return {
      lastVote: lastVote?._creationTime,
      nextVote: lastVote?._creationTime
        ? Math.max(Date.now(), addDays(lastVote?._creationTime, 1).getTime())
        : Date.now(),
      canVote:
        !lastVote?._creationTime ||
        Date.now() > addDays(lastVote._creationTime, 1).getTime(),
      lastQuestion: lastQuestion?._creationTime,
      nextQuestion: lastQuestion?._creationTime
        ? Math.max(
            Date.now(),
            addDays(lastQuestion?._creationTime, 7).getTime(),
          )
        : Date.now(),
      canAsk:
        !lastQuestion?._creationTime ||
        Date.now() > addDays(lastQuestion._creationTime, 1).getTime(),
    };
  },
});
