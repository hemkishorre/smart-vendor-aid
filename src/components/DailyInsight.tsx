import { motion } from "framer-motion";
import { Lightbulb, TrendingUp } from "lucide-react";

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
      className="gradient-fresh rounded-2xl p-5 shadow-elevated text-success-foreground relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-white/10 -translate-y-8 translate-x-8" />
      <div className="absolute bottom-0 left-0 w-16 h-16 rounded-full bg-white/10 translate-y-6 -translate-x-6" />
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center backdrop-blur-sm">
            <Lightbulb className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider opacity-90">Today's Tip</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-3xl">{bestEmoji}</span>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-display font-bold text-lg">Best: {bestProduct}</p>
              <TrendingUp className="w-4 h-4 opacity-80" />
            </div>
            <p className="text-sm opacity-90">{insight}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DailyInsight;
