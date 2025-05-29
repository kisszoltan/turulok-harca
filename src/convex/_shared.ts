import {
  GenericQueryCtx,
  GenericMutationCtx,
  GenericActionCtx,
} from "convex/server";
import { ConvexError } from "convex/values";

import { DataModel, Id } from "./_generated/dataModel";

/**
 * @returns the logged in user, otherwise throws an exception
 */
export const expectUser = async (
  ctx:
    | GenericQueryCtx<DataModel>
    | GenericMutationCtx<DataModel>
    | GenericActionCtx<DataModel>,
): Promise<Id<"users">> => {
  const userId = await assumeUser(ctx);

  if (!userId) throw new ConvexError("User is not authorised");

  return userId as Id<"users">;
};

/**
 * @returns the logged in user, otherwise undefined
 */
export const assumeUser = async (
  ctx:
    | GenericQueryCtx<DataModel>
    | GenericMutationCtx<DataModel>
    | GenericActionCtx<DataModel>,
) => {
  const identity = await ctx.auth.getUserIdentity();

  if (!identity) return;

  return (
    identity.subject.indexOf("|") > 0
      ? identity.subject.split("|")[0]
      : identity.subject
  ) as Id<"users">;
};
