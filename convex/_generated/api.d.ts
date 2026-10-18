/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as auth from "../auth.js";
import type * as businessImages from "../businessImages.js";
import type * as businesses from "../businesses.js";
import type * as coupons from "../coupons.js";
import type * as flyers from "../flyers.js";
import type * as qr from "../qr.js";
import type * as redemptions from "../redemptions.js";
import type * as rewardPool from "../rewardPool.js";
import type * as rewards from "../rewards.js";
import type * as serverAuth from "../serverAuth.js";
import type * as settlements from "../settlements.js";
import type * as social from "../social.js";
import type * as users from "../users.js";
import type * as wallets from "../wallets.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  businessImages: typeof businessImages;
  businesses: typeof businesses;
  coupons: typeof coupons;
  flyers: typeof flyers;
  qr: typeof qr;
  redemptions: typeof redemptions;
  rewardPool: typeof rewardPool;
  rewards: typeof rewards;
  serverAuth: typeof serverAuth;
  settlements: typeof settlements;
  social: typeof social;
  users: typeof users;
  wallets: typeof wallets;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
