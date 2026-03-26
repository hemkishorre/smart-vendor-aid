import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Simple in-memory cache (persists across warm invocations)
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { lat, lon, city } = await req.json();
    const API_KEY = Deno.env.get("TOMORROW_IO_API_KEY");
    if (!API_KEY) throw new Error("TOMORROW_IO_API_KEY is not configured");

    let location: string;
    if (lat && lon) {
      // Round coordinates to reduce cache misses
      location = `${parseFloat(lat).toFixed(2)},${parseFloat(lon).toFixed(2)}`;
    } else {
      location = city || "Chennai";
    }

    // Check cache
    const cacheKey = location.toLowerCase();
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return new Response(JSON.stringify(cached.data), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const url = `https://api.tomorrow.io/v4/weather/realtime?location=${encodeURIComponent(location)}&apikey=${API_KEY}&units=metric`;

    // Retry with backoff for rate limits
    let resp: Response | null = null;
    for (let attempt = 0; attempt < 3; attempt++) {
      resp = await fetch(url);
      if (resp.status !== 429) break;
      const delay = Math.pow(2, attempt) * 1000;
      console.warn(`Rate limited, retrying in ${delay}ms (attempt ${attempt + 1}/3)`);
      await new Promise((r) => setTimeout(r, delay));
    }

    if (!resp || !resp.ok) {
      // If rate limited and we have stale cache, return it
      if (resp?.status === 429 && cached) {
        return new Response(JSON.stringify(cached.data), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = resp ? await resp.text() : "No response";
      console.error("Tomorrow.io error:", resp?.status, t);
      throw new Error(`Weather API error: ${resp?.status || "unknown"}`);
    }

    const data = await resp.json();
    const values = data.data?.values || {};

    const weatherCode = values.weatherCode || 1000;
    let weatherType: string;
    if (weatherCode >= 8000) weatherType = "stormy";
    else if (weatherCode >= 4000 && weatherCode < 5000) weatherType = "rainy";
    else if (weatherCode >= 1001 && weatherCode < 2000) weatherType = "cloudy";
    else weatherType = "sunny";

    let riskLevel: string;
    if (weatherType === "stormy") riskLevel = "High";
    else if (weatherType === "rainy") riskLevel = "Medium";
    else riskLevel = "Low";

    const locationName = data.location?.name || city || "Unknown";

    const result = {
      weather: weatherType,
      temperature: Math.round(values.temperature || 0),
      humidity: Math.round(values.humidity || 0),
      riskLevel,
      location: locationName,
      description: weatherType,
      windSpeed: values.windSpeed || 0,
    };

    // Store in cache
    cache.set(cacheKey, { data: result, timestamp: Date.now() });

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("get-weather error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
