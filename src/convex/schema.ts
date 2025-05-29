import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

const questions = defineTable({
  content: v.string(),
  content_norm: v.string(),
  votesWesteria: v.optional(v.number()),
  votesHungeros: v.optional(v.number()),
  owner: v.id("users"),
})
  .index("search_westeria", ["votesWesteria"])
  .index("search_hungeros", ["votesHungeros"])
  .searchIndex("search_content", {
    searchField: "content_norm",
  });

const schema = defineSchema({
  ...authTables,
  questions,
});

export default schema;
