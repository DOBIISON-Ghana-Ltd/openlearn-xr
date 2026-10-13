import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { env } from "@/lib/config/env";

/**
 * Paystack Webhook Handler
 * Webhook docs: https://paystack.com/docs/payments/webhooks/
 */
export async function POST(req: NextRequest) {
  try {
    const secret = env.PAYSTACK_SECRET_KEY;
    if (!secret) {
      console.error("[Paystack Webhook] PAYSTACK_SECRET_KEY is not configured.");
      return new NextResponse("Server misconfigured", { status: 500 });
    }

    // 1. Read raw body text for signature verification
    const rawBody = await req.text();
    const signature = req.headers.get("x-paystack-signature");

    if (!signature) {
      return new NextResponse("Missing x-paystack-signature header", { status: 400 });
    }

    // 2. Validate HMAC SHA512 signature
    const hash = crypto
      .createHmac("sha512", secret)
      .update(rawBody)
      .digest("hex");

    if (hash !== signature) {
      console.warn("[Paystack Webhook] Invalid signature received.");
      return new NextResponse("Invalid signature", { status: 401 });
    }

    // 3. Parse JSON event payload
    const body = JSON.parse(rawBody);

    console.log(`[Paystack Webhook] Processing event: ${body.event}`);

    switch (body.event) {
      case "charge.success": {
        // update transaction
        // update or create subscription
        break;
      }

      case "subscription.create": {
        // update subs for when [subscriptionCode == subs code] with current periodEnd and emailtoken
        break;
      }

      case "invoice.update": {
        // create transaction table
        // update subscription and return orgId / userId
        break;
      }

      case "subscription.disable": {
        // update subscription to cancelled
        break;
      }

      default: {
        console.log(`[Paystack Webhook] Unhandled event type: ${body.event}`);
        break;
      }
    }

    return new NextResponse("OK", { status: 200 });
  } catch (error) {
    console.error("[Paystack Webhook Error]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
