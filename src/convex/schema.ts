import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

const questions = defineTable({
  content: v.string(),
  votesWesteria: v.optional(v.number()),
  votesHungeros: v.optional(v.number()),
  owner: v.id("users"),
});
const schema = defineSchema({
  ...authTables,
  questions,
});

export default schema;
