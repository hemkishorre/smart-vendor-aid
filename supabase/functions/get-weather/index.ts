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
    const { lat, lon, city } = await req.json();
    const API_KEY = Deno.env.get("TOMORROW_IO_API_KEY");
    if (!API_KEY) throw new Error("TOMORROW_IO_API_KEY is not configured");

    let location: string;
    if (lat && lon) {
      location = `${lat},${lon}`;
    } else {
      location = city || "Chennai";
    }

    const url = `https://api.tomorrow.io/v4/weather/realtime?location=${encodeURIComponent(location)}&apikey=${API_KEY}&units=metric`;

    const resp = await fetch(url);
    if (!resp.ok) {
      const t = await resp.text();
      console.error("Tomorrow.io error:", resp.status, t);
      throw new Error(`Weather API error: ${resp.status}`);
    }

    const data = await resp.json();
    const values = data.data?.values || {};

    const weatherCode = values.weatherCode || 1000;
    let weatherType: string;
    if (weatherCode >= 8000) {
      weatherType = "stormy";
    } else if (weatherCode >= 4000 && weatherCode < 5000) {
      weatherType = "rainy";
    } else if (weatherCode >= 1001 && weatherCode < 2000) {
      weatherType = "cloudy";
    } else {
      weatherType = "sunny";
    }

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
