import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query } = await req.json();
    
    if (!query || typeof query !== "string") {
      return new Response(
        JSON.stringify({ error: "query string is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const apiKey = Deno.env.get("WOLFRAM_API_KEY");
    if (!apiKey) {
      console.error("WOLFRAM_API_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "Wolfram API key not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Calling Wolfram API with query:", query);

    const response = await fetch(
      `https://api.wolframalpha.com/v2/query?appid=${apiKey}&input=${encodeURIComponent(query)}&format=plaintext&output=json`
    );

    if (!response.ok) {
      const err = await response.text();
      console.error("Wolfram API error:", response.status, err);
      return new Response(
        JSON.stringify({ error: "Wolfram request failed", details: err }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();

    if (data.queryresult && data.queryresult.pods) {
      const resultPod = data.queryresult.pods.find(
        (pod: any) => pod.id === "Result" || pod.title === "Result" || pod.primary
      );

      if (resultPod && resultPod.subpods && resultPod.subpods[0]) {
        const result = resultPod.subpods[0].plaintext;
        console.log("Wolfram result:", result);
        return new Response(JSON.stringify({ result }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    console.log("No result found in Wolfram response");
    return new Response(
      JSON.stringify({ error: "No calculation result found" }),
      { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("Function error:", e);
    const errorMessage = e instanceof Error ? e.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
