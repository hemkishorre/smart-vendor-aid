import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import WeatherCard from "@/components/WeatherCard";
import BudgetInput from "@/components/BudgetInput";
import RecommendationCard from "@/components/RecommendationCard";
import ProductEntry from "@/components/ProductEntry";
import DailyInsight from "@/components/DailyInsight";
import Sidebar from "@/components/Sidebar";
import BottomNav from "@/components/BottomNav";
import ChatView from "@/components/ChatView";
import ProfileView from "@/components/ProfileView";
import { ShoppingBag } from "lucide-react";
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
  const isMobile = useIsMobile();
  const productsRef = useRef<Product[]>([]);

  const handleProductsChange = (products: Product[]) => {
    productsRef.current = products;
  };

  const handleBudgetSubmit = async (budget: number) => {
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
            existingProducts: productsRef.current.filter((p) => p.name),
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
        <WeatherCard
          weather="rainy"
          temperature={28}
          humidity={82}
          riskLevel="Medium"
          location="Chennai, Tamil Nadu"
        />
        <DailyInsight
          bestProduct="Milk"
          bestEmoji="🥛"
          insight={insight || "Festival week — dairy demand is high!"}
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BudgetInput onSubmit={handleBudgetSubmit} isLoading={isLoading} />
        <ProductEntry onProductsChange={handleProductsChange} />
      </div>

      <AnimatePresence>
        {recommendations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2 pt-2">
              <ShoppingBag className="w-5 h-5 text-primary" />
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BudgetInput onSubmit={handleBudgetSubmit} isLoading={isLoading} />
        <ProductEntry onProductsChange={handleProductsChange} />
      </div>
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
