import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

import { sideTypeSchema } from "./_types";

const questionEmbeddings = defineTable({
  embedding: v.array(v.float64()),
}).vectorIndex("by_embedding", {
  vectorField: "embedding",
  dimensions: 768,
});

const questions = defineTable({
  content: v.string(),
  content_norm: v.string(),
  votesWesteria: v.optional(v.number()),
  votesHungeros: v.optional(v.number()),
  owner: v.id("users"),
  embeddingId: v.optional(v.id("questionEmbeddings")),
})
  .index("search_westeria", ["votesWesteria"])
  .index("search_hungeros", ["votesHungeros"])
  .searchIndex("search_content", {
    searchField: "content_norm",
  });

const rejects = defineTable({
  content: v.string(),
  owner: v.id("users"),
  reason: v.string(),
  suggestion: v.optional(v.string()),
});

const balances = defineTable({
  userId: v.id("users"),
  value: v.number(),
  side: sideTypeSchema,
});

const purchases = defineTable({
  userId: v.id("users"),
  amount: v.number(),
});

const votes = defineTable({
  userId: v.id("users"),
  questionId: v.id("questions"),
});

const sides = defineTable({
  side: sideTypeSchema,
  balance: v.number(), // available tickets
  votes: v.number(), // tickets used for voting
  members: v.number(),
});

const schema = defineSchema({
  ...authTables,
  questionEmbeddings,
  questions,
  rejects,
  balances,
  purchases,
  votes,
  sides,
});

export default schema;
