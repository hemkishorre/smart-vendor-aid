import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import WeatherCard from "@/components/WeatherCard";
import BudgetInput from "@/components/BudgetInput";
import RecommendationCard from "@/components/RecommendationCard";
import DailyInsight from "@/components/DailyInsight";
import BottomNav from "@/components/BottomNav";
import ChatView from "@/components/ChatView";
import ProfileView from "@/components/ProfileView";
import { ShoppingBag } from "lucide-react";

const mockRecommendations = [
  { product: "Tomato", emoji: "🍅", quantity: "30 kg", reason: "Rain expected → demand may drop", trend: "down" as const },
  { product: "Onion", emoji: "🧅", quantity: "25 kg", reason: "Stable demand, good shelf life", trend: "stable" as const },
  { product: "Milk", emoji: "🥛", quantity: "50 L", reason: "Festival week → high demand!", trend: "up" as const },
  { product: "Banana", emoji: "🍌", quantity: "15 dozen", reason: "Festival pooja demand ↑", trend: "up" as const },
  { product: "Potato", emoji: "🥔", quantity: "40 kg", reason: "Everyday staple, steady sales", trend: "stable" as const },
];

const Index = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleBudgetSubmit = (budget: number) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowRecommendations(true);
    }, 1200);
  };

  const renderHome = () => (
    <div className="px-4 py-4 space-y-4 pb-24">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="font-display font-black text-2xl text-foreground">
          SmartStock <span className="text-primary">AI</span>
        </h1>
        <p className="text-sm text-muted-foreground">Smart purchasing for smart vendors</p>
      </motion.div>

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
        insight="Festival week — dairy demand is high!"
      />

      <BudgetInput onSubmit={handleBudgetSubmit} isLoading={isLoading} />

      <AnimatePresence>
        {showRecommendations && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3"
          >
            <div className="flex items-center gap-2 pt-2">
              <ShoppingBag className="w-5 h-5 text-primary" />
              <h3 className="font-display font-bold text-lg text-foreground">
                Recommendations
              </h3>
            </div>
            {mockRecommendations.map((rec, i) => (
              <RecommendationCard key={rec.product} {...rec} index={i} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  const renderRecommend = () => (
    <div className="px-4 py-4 space-y-4 pb-24">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h2 className="font-display font-bold text-xl text-foreground">Smart Recommendations</h2>
        <p className="text-sm text-muted-foreground mb-4">Based on weather, festivals & trends</p>
      </motion.div>
      <BudgetInput onSubmit={handleBudgetSubmit} isLoading={isLoading} />
      {showRecommendations && (
        <div className="space-y-3">
          {mockRecommendations.map((rec, i) => (
            <RecommendationCard key={rec.product} {...rec} index={i} />
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background max-w-lg mx-auto relative">
      <div className="h-[calc(100vh-60px)] overflow-y-auto">
        {activeTab === "home" && renderHome()}
        {activeTab === "recommend" && renderRecommend()}
        {activeTab === "chat" && <ChatView />}
        {activeTab === "profile" && <ProfileView />}
      </div>
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
