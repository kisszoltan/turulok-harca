"use node";

import { v } from "convex/values";
import Stripe from "stripe";

import { internal } from "./_generated/api";
import { action, internalAction } from "./_generated/server";
import { expectUser } from "./_shared";
import { sideTypeSchema } from "./_types";

export const pay = action({
  args: { amount: v.number(), side: v.optional(sideTypeSchema) },
  handler: async (ctx, { amount, side }) => {
    const userId = await expectUser(ctx);
    const domain = process.env.SITE_URL ?? "http://localhost:3000";
    const stripe = new Stripe(process.env.STRIPE_API_KEY!, {
      apiVersion: "2025-05-28.basil",
    });

    const paymentId = await ctx.runMutation(internal.payments.create, {
      userId,
      side,
      amount,
    });

    const session: Stripe.Checkout.Session =
      await stripe.checkout.sessions.create({
        line_items: [
          {
            price: process.env.STRIPE_PRICE_ID,
            quantity: amount,
            adjustable_quantity: { enabled: true, minimum: 1, maximum: 999 },
          },
        ],
        mode: "payment",
        success_url: `${domain}/me?paymentId=${paymentId}`,
        cancel_url: `${domain}/buy`,
      });

    // Keep track of the checkout session ID for fulfillment
    await ctx.runMutation(internal.payments.markPending, {
      paymentId,
      stripeId: session.id,
    });

    // Let the client know the Stripe URL to redirect to
    return session.url;
  },
});

export const fulfill = internalAction({
  args: { signature: v.string(), payload: v.string() },
  handler: async (ctx, { signature, payload }) => {
    const stripe = new Stripe(process.env.STRIPE_API_KEY!, {
      apiVersion: "2025-05-28.basil",
    });

    const webhookSecret = process.env.STRIPE_WEBHOOKS_SECRET as string;

    try {
      const event = stripe.webhooks.constructEvent(
        payload,
        signature,
        webhookSecret,
      );

      if (event.type === "checkout.session.completed") {
        const stripeId = event.data.object.id;
        const paid = Math.round((event.data.object.amount_total ?? 0) / 100);

        await ctx.runMutation(internal.payments.fulfill, { stripeId, paid });
      }

      return { success: true };
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);

      return { success: false };
    }
  },
});
