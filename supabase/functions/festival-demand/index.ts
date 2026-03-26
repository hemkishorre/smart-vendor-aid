import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const { location } = await req.json().catch(() => ({}));

    const today = new Date();
    const month = today.toLocaleString("en-IN", { month: "long" });
    const year = today.getFullYear();

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `You are an Indian grocery market demand expert. Given the current date and upcoming Indian festivals, return a list of GROCERY ITEMS (food, spices, cooking ingredients, dairy, vegetables, fruits, dry goods, snacks, sweets ingredients) that will be in high demand.

You MUST respond with valid JSON only. Return this exact structure:
{
  "festivals": [
    {
      "name": "Festival Name",
      "date": "Approximate date",
      "daysAway": number,
      "demandedProducts": [
        {
          "product": "Grocery Item Name",
          "emoji": "🎉",
          "demandLevel": "Very High" | "High" | "Medium",
          "expectedPriceChange": "+15%" | "-5%" | "stable",
          "reason": "Short reason why demand increases",
          "suggestedStockUp": "2 weeks before",
          "category": "Spices" | "Dairy" | "Vegetables" | "Fruits" | "Dry Goods" | "Oils" | "Sweets" | "Snacks" | "Grains" | "Beverages"
        }
      ]
    }
  ],
  "generalTrending": [
    {
      "product": "Grocery Item Name",
      "emoji": "🍅",
      "demandLevel": "High",
      "reason": "Seasonal/weather reason",
      "expectedPriceChange": "+10%",
      "category": "Vegetables" | "Fruits" | "Dairy" | "Spices" | "Grains" | "Oils" | "Beverages" | "Dry Goods"
    }
  ],
  "summary": "One line summary of upcoming grocery demand trends"
}

Rules:
- ONLY include grocery/food items (no electronics, clothing, decorations)
- Include festivals in the next 60 days
- 3-6 grocery products per festival (e.g. ghee, sugar, rice, dal, specific spices, dry fruits, milk, paneer, specific vegetables/fruits used in festival cooking)
- 3-5 general trending grocery products based on season
- Use realistic Indian wholesale market prices and contexts
- Include major festivals: Diwali, Holi, Pongal, Eid, Navratri, Christmas, Onam, Ganesh Chaturthi, Raksha Bandhan, etc.
- Also consider regional food preferences based on location if provided
- Focus on items kirana stores and grocery vendors would stock`,
          },
          {
            role: "user",
            content: `Today is ${today.toLocaleDateString("en-IN")} (${month} ${year}). ${location ? `Location: ${location}.` : ""} What products will be in high demand for upcoming Indian festivals and seasonal trends?`,
          },
        ],
      }),
    });

    if (!response.ok) {
      const t = await response.text();
      console.error("AI error:", response.status, t);
      return new Response(
        JSON.stringify({ error: "AI service error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    let parsed;
    try {
      const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      parsed = JSON.parse(cleaned);
    } catch {
      console.error("Parse error:", content);
      return new Response(
        JSON.stringify({ error: "Failed to parse demand data" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("festival-demand error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
