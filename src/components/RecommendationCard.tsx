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
  up: { icon: TrendingUp, label: "Demand ↑", gradient: "gradient-fresh", textClass: "text-success" },
  down: { icon: TrendingDown, label: "Demand ↓", gradient: "gradient-warm", textClass: "text-accent" },
  stable: { icon: Minus, label: "Stable", gradient: "gradient-sky", textClass: "text-info" },
};

const RecommendationCard = ({ product, emoji, quantity, reason, trend, index }: RecommendationCardProps) => {
  const trendInfo = trendConfig[trend];
  const TrendIcon = trendInfo.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="bg-card rounded-xl p-4 shadow-card border border-border flex items-center gap-4 hover:shadow-elevated transition-shadow group"
    >
      <div className={`text-3xl w-12 h-12 rounded-xl ${trendInfo.gradient} flex items-center justify-center flex-shrink-0 shadow-sm group-hover:scale-110 transition-transform`}>
        {emoji}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h4 className="font-display font-bold text-foreground">{product}</h4>
          <span className="font-display font-bold text-primary text-lg">{quantity}</span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full bg-muted ${trendInfo.textClass}`}>
            <TrendIcon className="w-3 h-3" />
            <span className="text-[10px] font-bold">{trendInfo.label}</span>
          </div>
          <p className="text-xs text-muted-foreground truncate">{reason}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default RecommendationCard;
