import { OrderedQuery, paginationOptsValidator } from "convex/server";
import { ConvexError, v } from "convex/values";

import { mutation, query } from "./_generated/server";
import { expectUser } from "./_shared";
import { DataModel } from "./_generated/dataModel";
import { normalizeString } from "./_helpers";
import { sideTypeSchema } from "./_types";
import { _config } from "./core";

export const list = query({
  args: {
    paginationOpts: paginationOptsValidator,
    searchQuery: v.optional(v.string()),
  },
  handler: async (ctx, { paginationOpts, searchQuery }) => {
    //const viewerId = await assumeUser(ctx);
    const _query = ctx.db.query("questions");
    let q: OrderedQuery<DataModel["questions"]>;

    if (searchQuery) {
      q = _query.withSearchIndex("search_content", (q) =>
        q.search("content_norm", normalizeString(searchQuery)),
      );
    } else {
      q = _query.order("desc");
    }

    const results = await q.paginate(paginationOpts);

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

export const listForSide = query({
  args: {
    side: sideTypeSchema,
  },
  handler: async (ctx, { side }) => {
    //const viewerId = await assumeUser(ctx);
    const { TOP_LIST_LENGTH } = _config();
    const _query = ctx.db.query("questions");
    let q: OrderedQuery<DataModel["questions"]>;

    if (side === "hungeros") {
      q = _query.withIndex("search_hungeros").order("desc");
    } else if (side === "westeria") {
      q = _query.withIndex("search_westeria").order("desc");
    } else {
      q = _query;
    }

    return await q.take(TOP_LIST_LENGTH);
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
    await ctx.db.insert("questions", {
      content,
      content_norm: normalizeString(content),
      owner: userId,
    });
  },
});
