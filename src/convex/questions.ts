import { paginationOptsValidator } from "convex/server";
import { ConvexError, v } from "convex/values";

import { mutation, query } from "./_generated/server";
import { expectUser } from "./_shared";

export const list = query({
  args: {
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, { paginationOpts }) => {
    //const viewerId = await assumeUser(ctx);
    const results = await ctx.db.query("questions").paginate(paginationOpts);

    return {
      ...results,
      page: await Promise.all(
        results.page.map(async (s) => {
          // modify question object if needed
          return s;
        }),
      ),
    };
  },
});

export const create = mutation({
  args: { content: v.string() },
  handler: async (ctx, { content }) => {
    const userId = await expectUser(ctx);

    if (!content || content.length > 200)
      throw new ConvexError("A kérdés hossza nem megfelelő");

    // TODO verify if similar question exists already
    // TODO moderate content with AI
    await ctx.db.insert("questions", { content, owner: userId });
  },
});
