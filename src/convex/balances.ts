import { ConvexError, v } from "convex/values";
import { addDays } from "date-fns";

import { mutation, query } from "./_generated/server";
import { assumeUser, expectUser } from "./_shared";
import { sideTypeSchema } from "./_types";

export const get = query({
  handler: async (ctx) => {
    const userId = await assumeUser(ctx);

    if (!userId) return null;

    return await ctx.db
      .query("balances")
      .filter((q) => q.eq(q.field("userId"), userId))
      .unique();
  },
});

export const increase = mutation({
  args: { amount: v.number(), side: sideTypeSchema },
  handler: async (ctx, { amount, side }) => {
    const userId = await expectUser(ctx);

    if (amount <= 0) throw new ConvexError("Érvénytelen mennyiség");

    const balance = await ctx.db
      .query("balances")
      .filter((q) => q.eq(q.field("userId"), userId))
      .unique();

    if (!balance) {
      await ctx.db.insert("balances", { userId, value: amount, side });
    } else {
      if (balance.side !== side)
        throw new ConvexError(
          "A felhasználó már rendelkezik befolyással a másik oldalon",
        );
      await ctx.db.patch(balance._id, { value: balance.value + amount });
    }
  },
});

export const getVotes = query({
  handler: async (ctx) => {
    return (await ctx.db.query("sides").collect()).reduce(
      (acc, { side, votes }) => ({ ...acc, [side]: (acc[side] ?? 0) + votes }),
      { hungeros: 0, westeria: 0 },
    );
  },
});

export const vote = mutation({
  args: { question: v.id("questions") },
  handler: async (ctx, { question }) => {
    const userId = await expectUser(ctx);

    const balance = await ctx.db
      .query("balances")
      .filter((q) => q.eq(q.field("userId"), userId))
      .unique();

    if (!balance || balance.value === 0)
      throw new ConvexError("Nincs Kistanácsi Befolyásod");

    const lastVote = await ctx.db
      .query("votes")
      .filter((q) => q.eq(q.field("userId"), userId))
      .order("desc")
      .first();

    if (lastVote && addDays(lastVote._creationTime, 1) > new Date()) {
      throw new ConvexError(
        "Ne használd túl gyakran a befolyásod, még a végén valakinek szemet szúr.",
      );
    }

    const questionData = await ctx.db.get(question);

    if (!questionData)
      throw new ConvexError("Biztosan létezik a kérdés amire szavaznál?");

    if (balance.side === "hungeros") {
      await ctx.db.patch(questionData._id, {
        votesHungeros: (questionData.votesHungeros ?? 0) + 1,
      });
    } else {
      await ctx.db.patch(questionData._id, {
        votesWesteria: (questionData.votesWesteria ?? 0) + 1,
      });
    }

    await ctx.db.insert("votes", { questionId: question, userId });

    const side = await ctx.db
      .query("sides")
      .filter((q) => q.eq(q.field("side"), balance.side))
      .unique();

    if (!side) {
      await ctx.db.insert("sides", {
        side: balance.side,
        votes: balance.value,
      });
    } else {
      await ctx.db.patch(side._id, { votes: side.votes + balance.value });
    }
  },
});
