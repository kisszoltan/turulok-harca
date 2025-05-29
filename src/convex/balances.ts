import { ConvexError, v } from "convex/values";

import { mutation, query } from "./_generated/server";
import { expectUser } from "./_shared";
import { sideTypeSchema } from "./_types";

export const get = query({
  handler: async (ctx) => {
    const userId = await expectUser(ctx);

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
