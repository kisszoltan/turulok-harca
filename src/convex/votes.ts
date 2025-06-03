import { paginationOptsValidator } from "convex/server";

import { query } from "./_generated/server";
import { expectUser } from "./_shared";

export const listForUser = query({
  args: {
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, { paginationOpts }) => {
    const userId = await expectUser(ctx);
    const results = await ctx.db
      .query("votes")
      .filter((q) => q.eq(q.field("userId"), userId))
      .order("desc")
      .paginate(paginationOpts);

    return {
      ...results,
      page: await Promise.all(
        results.page.map(async (v) => {
          const question = await ctx.db.get(v.questionId);

          return Object.assign({}, v, { question });
        }),
      ),
    };
  },
});
