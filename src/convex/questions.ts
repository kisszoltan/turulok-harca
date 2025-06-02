import { OrderedQuery, paginationOptsValidator } from "convex/server";
import { ConvexError, v } from "convex/values";
import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";

import {
  action,
  internalMutation,
  internalQuery,
  query,
} from "./_generated/server";
import { expectUser, getAskCounters } from "./_shared";
import { DataModel } from "./_generated/dataModel";
import { normalizeString } from "./_helpers";
import { sideTypeSchema } from "./_types";
import { _config } from "./core";
import { internal } from "./_generated/api";

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

export const create = action({
  args: { content: v.string() },
  handler: async (ctx, { content }) => {
    const canAsk = await ctx.runQuery(internal.questions._canAsk, { content });

    if (canAsk) {
      // TODO verify if similar question exists already

      const { object } = await generateObject({
        model: google("models/gemini-2.0-flash-lite"),
        schema: z.object({
          accepted: z.boolean(),
          reason: z.string(),
          suggestion: z.string().optional(),
        }),
        system: `Te vagy egy moderátor, aki eldönti, hogy egy magyar nyelvű kérdés megjelenhet-e egy nyilvános, politikai témájú platformon, ahol a felhasználók kérdést tehetnek fel egy még ismeretlen, leendő miniszterelnöknek vagy uralkodónak.
A moderálási szempontok:

- A kérdés ne legyen gyűlöletkeltő, obszcén vagy lejárató.
- Ne tartalmazzon személyes utalást, ne szóljon konkrét személyhez (pl. ne említsen nevet, becenevet, vagy közvetlen megszólítást).
- A kérdés általános jellegű legyen, és a jövőbeli vezetőhöz szóljon.
- Röviden indokold meg, hogy elfogadható-e vagy sem.
- Ha lehet, javasolj egy átfogalmazott változatot, amely megfelel a szabályoknak.`,

        prompt: `Ez a beküldött kérdés: "${content}".
Megjelenhet ez a kérdés nyilvánosan? Válaszolj magyarul az alábbi struktúrában: accepted (boolean), reason (string), suggestion (opcionális string).`,
      });

      if (object.accepted) {
        await ctx.runMutation(internal.questions._create, { content });
      } else {
        await ctx.runMutation(internal.questions._reject, {
          content,
          reason: object.reason,
          suggestion: object.suggestion,
        });
        throw new ConvexError("Ezzel a kérdéssel nem megyünk az uralkodó elé.");
      }
    }
  },
});

export const _reject = internalMutation({
  args: {
    content: v.string(),
    reason: v.string(),
    suggestion: v.optional(v.string()),
  },
  handler: async (ctx, { content, reason, suggestion }) => {
    const userId = await expectUser(ctx);

    await ctx.db.insert("rejects", {
      owner: userId,
      content,
      reason,
      suggestion,
    });
  },
});

export const _canAsk = internalQuery({
  args: { content: v.string() },
  handler: async (ctx, { content }) => {
    const userId = await expectUser(ctx);

    if (!content || content.length > 200)
      throw new ConvexError("A kérdés hossza nem megfelelő");

    const askCounters = await getAskCounters(ctx, userId, Date.now());

    if (askCounters && !askCounters.canAsk) {
      throw new ConvexError(
        "Legyen akármekkora befolyásod, a nép hangjának is vannak korlátai. Hetente csak egy kérdést küldhetsz be.",
      );
    }

    return true;
  },
});

export const _create = internalMutation({
  args: { content: v.string() },
  handler: async (ctx, { content }) => {
    const userId = await expectUser(ctx);

    await ctx.db.insert("questions", {
      content,
      content_norm: normalizeString(content),
      owner: userId,
    });
  },
});
