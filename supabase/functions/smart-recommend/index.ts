import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are SmartStock AI — a loss-prevention purchasing advisor for Indian shopkeepers. Your goal is to create a MINIMUM LOSS buying plan based on weather, shelf life, and demand.

Given a budget, real-time weather, and optionally existing products, recommend EXACT quantities to buy that minimize spoilage and waste.

You MUST respond with valid JSON only. Return this exact structure:
{
  "recommendations": [
    {
      "product": "Product Name",
      "emoji": "🍅",
      "quantity": "30 kg",
      "estimatedCost": 1200,
      "reason": "Short reason with weather/festival/demand context",
      "trend": "up" | "down" | "stable",
      "shelfLife": "2 days",
      "riskLevel": "Low" | "Medium" | "High",
      "tip": "Store in cool dry place, sell within 2 days"
    }
  ],
  "totalEstimate": 3100,
  "insight": "One sentence summary of today's market conditions",
  "lossPrevention": "Key tip to avoid losses today"
}

Rules:
- Total of all estimatedCost should not exceed the budget
- Recommend 4-6 products
- Use realistic Indian market prices (wholesale rates)
- Focus on MINIMIZING LOSS: consider shelf life vs weather conditions
- If weather is hot/humid, recommend LESS of perishables, MORE of dry goods
- If rainy, reduce leafy vegetables, increase items with longer shelf life
- Provide specific quantities in kg/units that balance demand vs spoilage risk
- riskLevel: "High" = likely to spoil quickly in current weather, "Low" = safe to stock
- trend: "up" = demand increasing, "down" = decreasing, "stable" = steady
- tip: one practical storage/selling tip per product
- Keep reasons under 12 words
- lossPrevention: one overall tip based on today's weather`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { budget, existingProducts, weather } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    let userMessage = `My budget is ₹${budget}.`;
    
    if (weather) {
      userMessage += ` Current weather: ${weather.weather} (${weather.description}), temperature: ${weather.temperature}°C, humidity: ${weather.humidity}%, location: ${weather.location}, risk level: ${weather.riskLevel}.`;
    }
    
    if (existingProducts && existingProducts.length > 0) {
      const items = existingProducts
        .filter((p: any) => p.name)
        .map((p: any) => `${p.name} (${p.quantity} ${p.unit} at ₹${p.pricePerUnit}/${p.unit})`)
        .join(", ");
      if (items) {
        userMessage += ` I already plan to buy: ${items}. Suggest additional products with the remaining budget.`;
      }
    }

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: userMessage },
          ],
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limited. Please try again." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(
        JSON.stringify({ error: "AI service error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    // Parse the JSON from AI response
    let parsed;
    try {
      // Strip markdown code fences if present
      const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      parsed = JSON.parse(cleaned);
    } catch {
      console.error("Failed to parse AI response:", content);
      return new Response(
        JSON.stringify({ error: "Failed to parse recommendations" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("smart-recommend error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
