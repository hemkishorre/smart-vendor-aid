import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus, Clock, AlertTriangle, ShieldCheck, Info } from "lucide-react";

interface RecommendationCardProps {
  product: string;
  emoji: string;
  quantity: string;
  estimatedCost: number;
  reason: string;
  trend: "up" | "down" | "stable";
  shelfLife?: string;
  riskLevel?: "Low" | "Medium" | "High";
  tip?: string;
  index: number;
}

const trendConfig = {
  up: { icon: TrendingUp, label: "Demand ↑", gradient: "gradient-fresh", textClass: "text-success" },
  down: { icon: TrendingDown, label: "Demand ↓", gradient: "gradient-warm", textClass: "text-accent" },
  stable: { icon: Minus, label: "Stable", gradient: "gradient-sky", textClass: "text-info" },
};

const riskConfig = {
  Low: { icon: ShieldCheck, className: "bg-green-500/15 text-green-600 border-green-500/30" },
  Medium: { icon: AlertTriangle, className: "bg-yellow-500/15 text-yellow-700 border-yellow-500/30" },
  High: { icon: AlertTriangle, className: "bg-red-500/15 text-red-600 border-red-500/30" },
};

const RecommendationCard = ({ product, emoji, quantity, estimatedCost, reason, trend, shelfLife, riskLevel, tip, index }: RecommendationCardProps) => {
  const trendInfo = trendConfig[trend];
  const TrendIcon = trendInfo.icon;
  const risk = riskLevel ? riskConfig[riskLevel] : null;
  const RiskIcon = risk?.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="bg-card rounded-2xl p-5 shadow-card border border-border hover:shadow-elevated transition-shadow group"
    >
      <div className="flex items-start gap-4">
        <div className={`text-3xl w-14 h-14 rounded-xl ${trendInfo.gradient} flex items-center justify-center flex-shrink-0 shadow-sm group-hover:scale-110 transition-transform`}>
          {emoji}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h4 className="font-display font-bold text-foreground text-base">{product}</h4>
          </div>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span className="font-display font-black text-primary text-lg">{quantity}</span>
            <span className="text-xs text-muted-foreground">• ₹{estimatedCost}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-3 flex-wrap">
        <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full bg-muted ${trendInfo.textClass}`}>
          <TrendIcon className="w-3 h-3" />
          <span className="text-[10px] font-bold">{trendInfo.label}</span>
        </div>
        {shelfLife && (
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span className="text-[10px] font-bold">{shelfLife}</span>
          </div>
        )}
        {risk && RiskIcon && (
          <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full border ${risk.className}`}>
            <RiskIcon className="w-3 h-3" />
            <span className="text-[10px] font-bold">{riskLevel} Risk</span>
          </div>
        )}
      </div>

      <p className="text-xs text-muted-foreground mt-2">{reason}</p>

      {tip && (
        <div className="mt-3 bg-muted rounded-lg px-3 py-2 flex items-start gap-2">
          <Info className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" />
          <p className="text-[11px] text-foreground/80">{tip}</p>
        </div>
      )}
    </motion.div>
  );
};

export default RecommendationCard;
