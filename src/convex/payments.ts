// convex/payments.ts

import { ConvexError, v } from "convex/values";

import { internalMutation } from "./_generated/server";
import { sideTypeSchema } from "./_types";
import { internal } from "./_generated/api";

export const create = internalMutation({
  args: {
    userId: v.id("users"),
    side: v.optional(sideTypeSchema),
    amount: v.number(),
  },
  handler: async (ctx, { amount, side, userId }) => {
    let _side = side;

    if (!_side) {
      const userData = await ctx.db
        .query("balances")
        .filter((q) => q.eq(q.field("userId"), userId))
        .first();

      if (!userData)
        throw new ConvexError(
          "A felhasználó első vásárlásánál kötelező oldalt választani.",
        );
      _side = userData.side;
    }

    return await ctx.db.insert("payments", { userId, side: _side, amount });
  },
});

export const markPending = internalMutation({
  args: {
    paymentId: v.id("payments"),
    stripeId: v.string(),
  },
  handler: async (ctx, { paymentId, stripeId }) => {
    await ctx.db.patch(paymentId, { stripeId });
  },
});

export const fulfill = internalMutation({
  args: { stripeId: v.string() },
  handler: async (ctx, { stripeId }) => {
    const {
      _id: paymentId,
      amount,
      side,
      userId,
    } = (await ctx.db
      .query("payments")
      .withIndex("stripeId", (q) => q.eq("stripeId", stripeId))
      .unique())!;

    await ctx.runMutation(internal.balances.increase, { amount, side, userId });
    await ctx.db.patch(paymentId, { processed: true });
  },
});
