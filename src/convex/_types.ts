import { v } from "convex/values";

export const sideTypeValue = ["hungeros", "westeria"] as const;

export type SideType = (typeof sideTypeValue)[number];

export const sideTypeSchema = v.union(
  ...sideTypeValue.map((sideType) => v.literal(sideType)),
);
