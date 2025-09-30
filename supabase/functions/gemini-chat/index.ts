import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AIMessage {
  role: "system" | "user" | "assistant";
  content: string;
  images?: string[]; // data URLs (data:image/...;base64,....)
}

function toGeminiContents(messages: AIMessage[]) {
  const contents: any[] = [];
  // Gemini has no system role; include system as first user message if present
  const sys = messages.find((m) => m.role === "system")?.content;
  if (sys) contents.push({ role: "user", parts: [{ text: sys }] });

  for (const m of messages) {
    if (m.role === "system") continue;
    const parts: any[] = [{ text: m.content }];
    if (m.images && m.images.length > 0) {
      for (const img of m.images) {
        const [prefix, base64] = img.split(",");
        const mime = prefix?.match(/data:(.*?);base64/)
          ? prefix.match(/data:(.*?);base64/)![1]
          : "image/jpeg";
        parts.push({ inline_data: { mime_type: mime, data: base64 || img } });
      }
    }
    contents.push({ role: m.role === "assistant" ? "model" : "user", parts });
  }
  return contents;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    if (!Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: "messages array is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const apiKey = Deno.env.get("GEMINI_API_KEY") || 'AIzaSyDZ81CyuQyQ-FPRgiIx5nULrP-pS8ioZfc';

    const contents = toGeminiContents(messages);

    const resp = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents, generationConfig: { temperature: 0.2, maxOutputTokens: 1500 } }),
      }
    );

    if (!resp.ok) {
      const err = await resp.text();
      console.error("Gemini error:", err);
      return new Response(
        JSON.stringify({ error: "Gemini request failed", details: err }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await resp.json();
    const text =
      data?.candidates?.[0]?.content?.parts
        ?.map((p: any) => p.text)
        .filter(Boolean)
        .join("\n") || "";

    return new Response(JSON.stringify({ text }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Function error:", e);
    const errorMessage = e instanceof Error ? e.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
