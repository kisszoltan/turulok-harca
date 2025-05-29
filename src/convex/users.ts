import { v } from "convex/values";

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
