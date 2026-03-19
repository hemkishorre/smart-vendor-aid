import { useState } from "react";
import { motion } from "framer-motion";
import { IndianRupee, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BudgetInputProps {
  onSubmit: (budget: number) => void;
  isLoading?: boolean;
}

const quickAmounts = [500, 1000, 2000, 5000];

const BudgetInput = ({ onSubmit, isLoading }: BudgetInputProps) => {
  const [budget, setBudget] = useState("");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-card rounded-2xl p-5 shadow-card border border-border"
    >
      <h3 className="font-display font-bold text-lg text-foreground mb-1">
        Today's Budget
      </h3>
      <p className="text-sm text-muted-foreground mb-4">Enter your purchasing budget</p>

      <div className="relative mb-3">
        <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="number"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          placeholder="Enter amount"
          className="w-full pl-10 pr-4 py-3 rounded-xl bg-muted border-none text-foreground font-display font-bold text-xl placeholder:text-muted-foreground placeholder:font-normal placeholder:text-base focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div className="flex gap-2 mb-4 flex-wrap">
        {quickAmounts.map((amount) => (
          <button
            key={amount}
            onClick={() => setBudget(String(amount))}
            className="px-3 py-1.5 rounded-lg bg-muted text-sm font-medium text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            ₹{amount.toLocaleString()}
          </button>
        ))}
      </div>

      <Button
        onClick={() => budget && onSubmit(Number(budget))}
        disabled={!budget || isLoading}
        className="w-full gradient-warm text-primary-foreground font-display font-bold text-base py-6 rounded-xl shadow-elevated hover:opacity-90 transition-opacity border-none"
      >
        <Sparkles className="w-5 h-5 mr-2" />
        {isLoading ? "Analyzing..." : "Get Smart Suggestions"}
      </Button>
    </motion.div>
  );
};

export default BudgetInput;
