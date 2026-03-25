import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import WeatherCard from "@/components/WeatherCard";
import BudgetAndProducts from "@/components/BudgetAndProducts";
import ImageProductScanner from "@/components/ImageProductScanner";
import RecommendationCard from "@/components/RecommendationCard";
import DailyInsight from "@/components/DailyInsight";
import Sidebar from "@/components/Sidebar";
import BottomNav from "@/components/BottomNav";
import ChatView from "@/components/ChatView";
import ProfileView from "@/components/ProfileView";
import { ShoppingBag, Loader2 } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "@/hooks/use-toast";

interface Recommendation {
  product: string;
  emoji: string;
  quantity: string;
  estimatedCost: number;
  reason: string;
  trend: "up" | "down" | "stable";
}

interface WeatherData {
  weather: "sunny" | "rainy" | "cloudy" | "stormy";
  temperature: number;
  humidity: number;
  riskLevel: "Low" | "Medium" | "High";
  location: string;
  description: string;
  windSpeed: number;
}

interface Product {
  id: number;
  name: string;
  quantity: string;
  unit: string;
  pricePerUnit: string;
}

const Index = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [insight, setInsight] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [scannedProducts, setScannedProducts] = useState<Product[]>([]);
  const isMobile = useIsMobile();

  useEffect(() => {
    fetchWeather();
  }, []);

  const fetchWeather = async (lat?: number, lon?: number) => {
    setWeatherLoading(true);
    try {
      const body: any = {};
      if (lat && lon) {
        body.lat = lat;
        body.lon = lon;
      } else {
        body.city = "Chennai";
      }

      const resp = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/get-weather`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify(body),
        }
      );

      if (!resp.ok) throw new Error("Weather fetch failed");
      const data = await resp.json();
      setWeatherData(data);
    } catch (e) {
      console.error("Weather error:", e);
      // Fallback
      setWeatherData({
        weather: "cloudy",
        temperature: 30,
        humidity: 70,
        riskLevel: "Low",
        location: "Chennai, IN",
        description: "partly cloudy",
        windSpeed: 3,
      });
    } finally {
      setWeatherLoading(false);
    }
  };

  // Try geolocation on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => fetchWeather(pos.coords.latitude, pos.coords.longitude),
        () => {} // silently fall back to default city
      );
    }
  }, []);

  const handleCityChange = (city: string) => {
    fetchWeatherByCity(city);
  };

  const fetchWeatherByCity = async (city: string) => {
    setWeatherLoading(true);
    try {
      const resp = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/get-weather`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ city }),
        }
      );
      if (!resp.ok) throw new Error("Weather fetch failed");
      const data = await resp.json();
      setWeatherData(data);
    } catch (e) {
      console.error("Weather error:", e);
      toast({ title: "Error", description: "Could not fetch weather for that city", variant: "destructive" });
    } finally {
      setWeatherLoading(false);
    }
  };

  const handleBudgetSubmit = async (budget: number, products: Product[]) => {
    setIsLoading(true);
    setRecommendations([]);
    try {
      const resp = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/smart-recommend`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            budget,
            existingProducts: products,
            weather: weatherData,
          }),
        }
      );

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        throw new Error(err.error || `Error ${resp.status}`);
      }

      const data = await resp.json();
      setRecommendations(data.recommendations || []);
      setInsight(data.insight || "");
    } catch (e: any) {
      console.error("Recommend error:", e);
      toast({ title: "Error", description: e.message || "Failed to get recommendations", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const renderHome = () => (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h2 className="font-display font-black text-2xl lg:text-3xl text-foreground">
          Dashboard
        </h2>
        <p className="text-sm text-muted-foreground">Overview of today's market intelligence</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {weatherLoading ? (
          <div className="rounded-2xl p-5 gradient-sky text-primary-foreground shadow-elevated flex items-center justify-center min-h-[140px]">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        ) : weatherData ? (
          <WeatherCard
            weather={weatherData.weather}
            temperature={weatherData.temperature}
            humidity={weatherData.humidity}
            riskLevel={weatherData.riskLevel}
            location={weatherData.location}
            onCityChange={handleCityChange}
          />
        ) : null}
        <DailyInsight
          bestProduct="Milk"
          bestEmoji="🥛"
          insight={insight || "Festival week — dairy demand is high!"}
        />
      </div>

      <BudgetAndProducts onSubmit={handleBudgetSubmit} isLoading={isLoading} />

      <AnimatePresence>
        {recommendations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2 pt-2">
              <div className="w-8 h-8 rounded-lg gradient-sunset flex items-center justify-center">
                <ShoppingBag className="w-4 h-4 text-primary-foreground" />
              </div>
              <h3 className="font-display font-bold text-lg text-foreground">
                AI Recommendations
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {recommendations.map((rec, i) => (
                <RecommendationCard key={rec.product} {...rec} index={i} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  const renderRecommend = () => (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h2 className="font-display font-bold text-2xl lg:text-3xl text-foreground">Smart Recommendations</h2>
        <p className="text-sm text-muted-foreground mb-4">Powered by AI — based on weather, festivals & trends</p>
      </motion.div>
      <BudgetAndProducts onSubmit={handleBudgetSubmit} isLoading={isLoading} />
      {recommendations.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {recommendations.map((rec, i) => (
            <RecommendationCard key={rec.product} {...rec} index={i} />
          ))}
        </div>
      )}
    </div>
  );

  if (isMobile) {
    return (
      <div className="min-h-screen bg-background max-w-lg mx-auto relative">
        <div className="h-[calc(100vh-60px)] overflow-y-auto px-4 py-4 pb-24">
          {activeTab === "home" && renderHome()}
          {activeTab === "recommend" && renderRecommend()}
          {activeTab === "chat" && <ChatView />}
          {activeTab === "profile" && <ProfileView />}
        </div>
        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="flex-1 overflow-y-auto h-screen">
        <div className="max-w-5xl mx-auto p-8">
          {activeTab === "home" && renderHome()}
          {activeTab === "recommend" && renderRecommend()}
          {activeTab === "chat" && <ChatView />}
          {activeTab === "profile" && <ProfileView />}
        </div>
      </main>
    </div>
  );
};

export default Index;
