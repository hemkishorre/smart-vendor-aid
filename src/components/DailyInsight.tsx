import { motion } from "framer-motion";
import { Lightbulb } from "lucide-react";

interface DailyInsightProps {
  bestProduct: string;
  bestEmoji: string;
  insight: string;
}

const DailyInsight = ({ bestProduct, bestEmoji, insight }: DailyInsightProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-card rounded-2xl p-4 shadow-card border border-border"
    >
      <div className="flex items-center gap-2 mb-2">
        <Lightbulb className="w-4 h-4 text-primary" />
        <span className="text-xs font-semibold text-primary uppercase tracking-wider">Today's Tip</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-2xl">{bestEmoji}</span>
        <div>
          <p className="font-display font-bold text-foreground">Best Product: {bestProduct}</p>
          <p className="text-sm text-muted-foreground">{insight}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default DailyInsight;
