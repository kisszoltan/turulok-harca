/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as _helpers from "../_helpers.js";
import type * as _shared from "../_shared.js";
import type * as _types from "../_types.js";
import type * as auth from "../auth.js";
import type * as core from "../core.js";
import type * as http from "../http.js";
import type * as questions from "../questions.js";
import type * as users from "../users.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  _helpers: typeof _helpers;
  _shared: typeof _shared;
  _types: typeof _types;
  auth: typeof auth;
  core: typeof core;
  http: typeof http;
  questions: typeof questions;
  users: typeof users;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
