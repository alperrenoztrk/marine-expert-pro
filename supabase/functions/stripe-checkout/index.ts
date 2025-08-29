import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CreateCheckoutBody {
  priceId?: string;
  successUrl?: string;
  cancelUrl?: string;
  mode?: "payment" | "subscription";
  quantity?: number;
  customerEmail?: string;
}

// Minimal Stripe REST call using fetch to avoid external deps on Deno Edge
async function createStripeCheckoutSession(params: CreateCheckoutBody) {
  const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
  if (!stripeKey) {
    return new Response(
      JSON.stringify({ error: "Missing STRIPE_SECRET_KEY" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  const priceId = params.priceId || Deno.env.get("STRIPE_DEFAULT_PRICE_ID");
  if (!priceId) {
    return new Response(
      JSON.stringify({ error: "Missing priceId or STRIPE_DEFAULT_PRICE_ID" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  const successUrl = params.successUrl || Deno.env.get("STRIPE_SUCCESS_URL") || "https://example.com/success";
  const cancelUrl = params.cancelUrl || Deno.env.get("STRIPE_CANCEL_URL") || "https://example.com/cancel";
  const mode = params.mode || (Deno.env.get("STRIPE_DEFAULT_MODE") as "payment" | "subscription") || "payment";
  const quantity = params.quantity ?? 1;

  const body: any = {
    mode,
    success_url: successUrl,
    cancel_url: cancelUrl,
    line_items: [
      {
        price: priceId,
        quantity,
      },
    ],
  };

  if (params.customerEmail) {
    body.customer_email = params.customerEmail;
  }

  const resp = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${stripeKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams(
      Object.fromEntries(
        Object.entries(body).flatMap(([key, value]) => {
          if (key === "line_items") {
            // Encode nested line_items as line_items[0][price], line_items[0][quantity]
            const items = value as Array<Record<string, unknown>>;
            return items.flatMap((item, index) =>
              Object.entries(item).map(([k, v]) => [
                `line_items[${index}][${k}]`,
                String(v),
              ] as [string, string])
            );
          }
          return [[key, String(value)]] as [string, string][];
        }),
      ),
    ),
  });

  const text = await resp.text();
  if (!resp.ok) {
    console.error("Stripe error:", text);
    return new Response(
      JSON.stringify({ error: "Stripe request failed", details: text }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  return new Response(text, {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Method not allowed" }),
        { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const body = (await req.json().catch(() => ({}))) as CreateCheckoutBody;
    return await createStripeCheckoutSession(body);
  } catch (e) {
    console.error("Function error:", e);
    return new Response(
      JSON.stringify({ error: e?.message || "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});

