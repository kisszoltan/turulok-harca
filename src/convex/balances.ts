import { ConvexError, v } from "convex/values";
import { addDays } from "date-fns";

import { internalMutation, mutation, query } from "./_generated/server";
import { assumeUser, expectUser } from "./_shared";
import { SideType, sideTypeSchema } from "./_types";
import { _config } from "./core";

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

export const bannerMen = mutation({
  args: { side: sideTypeSchema },
  handler: async (ctx, { side }) => {
    const { BANNER_PERIOD_OVER } = _config();

    if (BANNER_PERIOD_OVER) {
      throw new ConvexError("Már visszaérkeztek a hollók a zászlóhordozóktól.");
    }

    const userId = await expectUser(ctx);

    const balance = await ctx.db
      .query("balances")
      .filter((q) => q.eq(q.field("userId"), userId))
      .unique();

    if (balance) {
      throw new ConvexError("Csak új felhasználók lehetnek zászlóhordozók.");
    }
    await ctx.db.insert("balances", { userId, value: 1, side });

    const sideRecord = await ctx.db
      .query("sides")
      .filter((q) => q.eq(q.field("side"), side))
      .unique();

    if (!sideRecord) {
      await ctx.db.insert("sides", {
        balance: 1,
        side,
        votes: 0,
        members: 1,
      });
    } else {
      await ctx.db.patch(sideRecord._id, {
        balance: (sideRecord.balance ?? 0) + 1,
        members: (sideRecord.members ?? 0) + 1,
      });
    }

    await ctx.db.insert("payments", {
      userId,
      side,
      amount: 1,
      processed: true,
      paid: 0,
    });
  },
});

export const increase = internalMutation({
  args: { userId: v.id("users"), amount: v.number(), side: sideTypeSchema },
  handler: async (ctx, { userId, amount, side }) => {
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

    const sideRecord = await ctx.db
      .query("sides")
      .filter((q) => q.eq(q.field("side"), side))
      .unique();

    if (!sideRecord) {
      await ctx.db.insert("sides", {
        balance: amount,
        side,
        votes: 0,
        members: 1,
      });
    } else {
      // increase member count only if user is a first-time buyer (aka did not have balance yet)
      const members = balance
        ? (sideRecord.members ?? 0)
        : (sideRecord.members ?? 0) + 1;

      await ctx.db.patch(sideRecord._id, {
        balance: (sideRecord.balance ?? 0) + amount,
        members,
      });
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

export const getStatus = query({
  handler: async (ctx) => {
    return (await ctx.db.query("sides").collect()).reduce(
      (acc, { side, votes, members, balance }) => {
        acc[side] = { votes, members, balance };

        return acc;
      },
      {} as Record<
        SideType,
        { votes: number; members: number; balance: number }
      >,
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
        balance: balance.value,
        side: balance.side,
        votes: balance.value,
        members: 1,
      });
    } else {
      await ctx.db.patch(side._id, { votes: side.votes + balance.value });
    }
  },
});
