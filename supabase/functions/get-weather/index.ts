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
    const API_KEY = Deno.env.get("OPENWEATHER_API_KEY");
    if (!API_KEY) throw new Error("OPENWEATHER_API_KEY is not configured");

    let url: string;
    if (lat && lon) {
      url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
    } else {
      const q = city || "Chennai";
      url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(q)}&units=metric&appid=${API_KEY}`;
    }

    const resp = await fetch(url);
    if (!resp.ok) {
      const t = await resp.text();
      console.error("OpenWeather error:", resp.status, t);
      throw new Error(`Weather API error: ${resp.status}`);
    }

    const data = await resp.json();

    const mainWeather = data.weather?.[0]?.main?.toLowerCase() || "clear";
    let weatherType: string;
    if (mainWeather.includes("thunder") || mainWeather.includes("storm")) {
      weatherType = "stormy";
    } else if (mainWeather.includes("rain") || mainWeather.includes("drizzle")) {
      weatherType = "rainy";
    } else if (mainWeather.includes("cloud") || mainWeather.includes("mist") || mainWeather.includes("fog") || mainWeather.includes("haze")) {
      weatherType = "cloudy";
    } else {
      weatherType = "sunny";
    }

    let riskLevel: string;
    if (weatherType === "stormy") riskLevel = "High";
    else if (weatherType === "rainy") riskLevel = "Medium";
    else riskLevel = "Low";

    const result = {
      weather: weatherType,
      temperature: Math.round(data.main?.temp || 0),
      humidity: data.main?.humidity || 0,
      riskLevel,
      location: `${data.name}, ${data.sys?.country || ""}`,
      description: data.weather?.[0]?.description || "",
      windSpeed: data.wind?.speed || 0,
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
