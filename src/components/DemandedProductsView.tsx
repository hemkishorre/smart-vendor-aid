import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, CalendarDays, TrendingUp, Loader2, RefreshCw, ArrowUp, ArrowDown, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface DemandedProduct {
  product: string;
  emoji: string;
  demandLevel: string;
  expectedPriceChange: string;
  reason: string;
  suggestedStockUp?: string;
}

interface Festival {
  name: string;
  date: string;
  daysAway: number;
  demandedProducts: DemandedProduct[];
}

interface TrendingProduct {
  product: string;
  emoji: string;
  demandLevel: string;
  reason: string;
  expectedPriceChange: string;
}

const demandColors: Record<string, string> = {
  "Very High": "bg-red-500/15 text-red-600 border-red-500/30",
  "High": "bg-orange-500/15 text-orange-600 border-orange-500/30",
  "Medium": "bg-yellow-500/15 text-yellow-700 border-yellow-500/30",
};

const PriceTag = ({ change }: { change: string }) => {
  if (change.startsWith("+"))
    return <span className="flex items-center gap-0.5 text-red-500 text-xs font-bold"><ArrowUp className="w-3 h-3" />{change}</span>;
  if (change.startsWith("-"))
    return <span className="flex items-center gap-0.5 text-green-500 text-xs font-bold"><ArrowDown className="w-3 h-3" />{change}</span>;
  return <span className="flex items-center gap-0.5 text-muted-foreground text-xs font-bold"><Minus className="w-3 h-3" />Stable</span>;
};

const DemandedProductsView = () => {
  const [festivals, setFestivals] = useState<Festival[]>([]);
  const [trending, setTrending] = useState<TrendingProduct[]>([]);
  const [summary, setSummary] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchDemand = async () => {
    setIsLoading(true);
    try {
      const resp = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/festival-demand`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({}),
        }
      );
      if (!resp.ok) throw new Error("Failed to fetch demand data");
      const data = await resp.json();
      setFestivals(data.festivals || []);
      setTrending(data.generalTrending || []);
      setSummary(data.summary || "");
    } catch (e: any) {
      console.error("Demand fetch error:", e);
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDemand();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Analyzing upcoming festivals & demand...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-start justify-between">
        <div>
          <h2 className="font-display font-black text-2xl lg:text-3xl text-foreground flex items-center gap-2">
            <Flame className="w-7 h-7 text-orange-500" />
            Demanded Products
          </h2>
          <p className="text-sm text-muted-foreground mt-1">Products in high demand for upcoming Indian festivals</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchDemand} className="rounded-xl">
          <RefreshCw className="w-4 h-4 mr-1" /> Refresh
        </Button>
      </motion.div>

      {summary && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="gradient-sunset rounded-xl p-4 text-primary-foreground"
        >
          <p className="text-sm font-medium opacity-90">📊 Market Summary</p>
          <p className="font-display font-bold">{summary}</p>
        </motion.div>
      )}

      {/* Festival sections */}
      <AnimatePresence>
        {festivals.map((festival, fi) => (
          <motion.div
            key={festival.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: fi * 0.1 }}
            className="bg-card rounded-2xl border border-border shadow-card overflow-hidden"
          >
            <div className="gradient-warm p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CalendarDays className="w-6 h-6 text-primary-foreground" />
                <div>
                  <h3 className="font-display font-bold text-lg text-primary-foreground">{festival.name}</h3>
                  <p className="text-xs text-primary-foreground/80">{festival.date}</p>
                </div>
              </div>
              <span className="bg-primary-foreground/20 backdrop-blur rounded-full px-3 py-1 text-xs font-bold text-primary-foreground">
                {festival.daysAway <= 0 ? "🎉 Today!" : `${festival.daysAway} days away`}
              </span>
            </div>

            <div className="p-4 space-y-2">
              {festival.demandedProducts.map((p, pi) => (
                <motion.div
                  key={p.product}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: fi * 0.1 + pi * 0.05 }}
                  className="flex items-center justify-between bg-muted rounded-xl px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{p.emoji}</span>
                    <div>
                      <p className="font-semibold text-foreground text-sm">{p.product}</p>
                      <p className="text-xs text-muted-foreground">{p.reason}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <PriceTag change={p.expectedPriceChange} />
                    <span className={`text-xs font-bold px-2 py-1 rounded-full border ${demandColors[p.demandLevel] || demandColors["Medium"]}`}>
                      {p.demandLevel}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* General trending */}
      {trending.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl border border-border shadow-card overflow-hidden"
        >
          <div className="gradient-fresh p-4 flex items-center gap-3">
            <TrendingUp className="w-6 h-6 text-primary-foreground" />
            <div>
              <h3 className="font-display font-bold text-lg text-primary-foreground">Seasonal Trending</h3>
              <p className="text-xs text-primary-foreground/80">Based on current weather & season</p>
            </div>
          </div>
          <div className="p-4 space-y-2">
            {trending.map((p, i) => (
              <motion.div
                key={p.product}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center justify-between bg-muted rounded-xl px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{p.emoji}</span>
                  <div>
                    <p className="font-semibold text-foreground text-sm">{p.product}</p>
                    <p className="text-xs text-muted-foreground">{p.reason}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <PriceTag change={p.expectedPriceChange} />
                  <span className={`text-xs font-bold px-2 py-1 rounded-full border ${demandColors[p.demandLevel] || demandColors["Medium"]}`}>
                    {p.demandLevel}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default DemandedProductsView;
