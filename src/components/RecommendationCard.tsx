import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface RecommendationCardProps {
  product: string;
  emoji: string;
  quantity: string;
  reason: string;
  trend: "up" | "down" | "stable";
  index: number;
}

const trendConfig = {
  up: { icon: TrendingUp, label: "Demand ↑", className: "text-success" },
  down: { icon: TrendingDown, label: "Demand ↓", className: "text-accent" },
  stable: { icon: Minus, label: "Stable", className: "text-muted-foreground" },
};

const RecommendationCard = ({ product, emoji, quantity, reason, trend, index }: RecommendationCardProps) => {
  const trendInfo = trendConfig[trend];
  const TrendIcon = trendInfo.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="bg-card rounded-xl p-4 shadow-card border border-border flex items-center gap-4"
    >
      <div className="text-3xl w-12 h-12 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
        {emoji}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h4 className="font-display font-bold text-foreground">{product}</h4>
          <span className="font-display font-bold text-primary text-lg">{quantity}</span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <TrendIcon className={`w-3.5 h-3.5 ${trendInfo.className}`} />
          <p className="text-xs text-muted-foreground truncate">{reason}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default RecommendationCard;
