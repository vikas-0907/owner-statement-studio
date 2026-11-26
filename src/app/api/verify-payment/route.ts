import { NextRequest, NextResponse } from "next/server";

const SINGLE_PRODUCT_ID = "pdt_0NsmNPqCSRRSTda6Wo1Ms";
const MONTHLY_PRODUCT_ID = "pdt_0NsmTUOzTTGlH1NxwbzNA";
const ANNUAL_PRODUCT_ID = "pdt_0NsmTZigzfV2c16JHvPRK";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const paymentId = searchParams.get("payment_id");
  const subscriptionId = searchParams.get("subscription_id");

  const apiKey = process.env.DODO_PAYMENTS_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { verified: false, error: "Server missing DODO_PAYMENTS_API_KEY" },
      { status: 500 }
    );
  }

  const baseUrl =
    process.env.DODO_ENV === "test"
      ? "https://test.dodopayments.com"
      : "https://live.dodopayments.com";

  try {
    if (paymentId) {
      const res = await fetch(`${baseUrl}/payments/${encodeURIComponent(paymentId)}`, {
        headers: { Authorization: `Bearer ${apiKey}` },
        cache: "no-store",
      });
      if (!res.ok) {
        return NextResponse.json({ verified: false }, { status: 400 });
      }
      const data = await res.json();
      if (data.status === "succeeded") {
        const productId =
          data.product_cart?.[0]?.product_id || data.product_id || "";
        const tier =
          productId === MONTHLY_PRODUCT_ID || productId === ANNUAL_PRODUCT_ID
            ? "pro"
            : productId === SINGLE_PRODUCT_ID
            ? "single"
            : "single";

        return NextResponse.json({
          verified: true,
          tier,
          txId: paymentId,
        });
      }
    }

    if (subscriptionId) {
      const res = await fetch(
        `${baseUrl}/subscriptions/${encodeURIComponent(subscriptionId)}`,
        {
          headers: { Authorization: `Bearer ${apiKey}` },
          cache: "no-store",
        }
      );
      if (!res.ok) {
        return NextResponse.json({ verified: false }, { status: 400 });
      }
      const data = await res.json();
      if (data.status === "active" || data.status === "succeeded") {
        return NextResponse.json({
          verified: true,
          tier: "pro",
          txId: subscriptionId,
        });
      }
    }

    return NextResponse.json({ verified: false }, { status: 400 });
  } catch {
    return NextResponse.json({ verified: false }, { status: 500 });
  }
}
