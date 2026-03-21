import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IndianRupee, Sparkles, Plus, Trash2, Package } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Product {
  id: number;
  name: string;
  quantity: string;
  unit: string;
  pricePerUnit: string;
}

interface BudgetAndProductsProps {
  onSubmit: (budget: number, products: Product[]) => void;
  isLoading?: boolean;
}

const quickAmounts = [500, 1000, 2000, 5000];
const unitOptions = ["kg", "L", "dozen", "pieces", "bags"];

const BudgetAndProducts = ({ onSubmit, isLoading }: BudgetAndProductsProps) => {
  const [budget, setBudget] = useState("");
  const [products, setProducts] = useState<Product[]>([
    { id: Date.now(), name: "", quantity: "", unit: "kg", pricePerUnit: "" },
  ]);

  const addProduct = () => {
    setProducts((prev) => [...prev, { id: Date.now(), name: "", quantity: "", unit: "kg", pricePerUnit: "" }]);
  };

  const removeProduct = (id: number) => {
    if (products.length <= 1) return;
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const updateProduct = (id: number, field: keyof Product, value: string) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
  };

  const totalEstimate = products.reduce((sum, p) => {
    const qty = parseFloat(p.quantity) || 0;
    const price = parseFloat(p.pricePerUnit) || 0;
    return sum + qty * price;
  }, 0);

  const handleSubmit = () => {
    if (!budget) return;
    onSubmit(Number(budget), products.filter((p) => p.name));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-card rounded-2xl p-5 shadow-card border border-border"
    >
      {/* Budget Section */}
      <h3 className="font-display font-bold text-lg text-foreground mb-1">
        Today's Budget
      </h3>
      <p className="text-sm text-muted-foreground mb-3">Enter your purchasing budget</p>

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

      {/* Divider */}
      <div className="border-t border-border my-4" />

      {/* Products Section */}
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-display font-bold text-lg text-foreground">My Products</h3>
        <Package className="w-5 h-5 text-primary" />
      </div>
      <p className="text-sm text-muted-foreground mb-3">Add products you plan to buy (optional)</p>

      <div className="space-y-3 max-h-60 overflow-y-auto">
        <AnimatePresence>
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
              className="bg-muted rounded-xl p-3 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground">Item {index + 1}</span>
                {products.length > 1 && (
                  <button
                    onClick={() => removeProduct(product.id)}
                    className="text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              <input
                type="text"
                value={product.name}
                onChange={(e) => updateProduct(product.id, "name", e.target.value)}
                placeholder="Product name (e.g. Tomato)"
                className="w-full px-3 py-2 rounded-lg bg-card border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <div className="flex gap-2">
                <input
                  type="number"
                  value={product.quantity}
                  onChange={(e) => updateProduct(product.id, "quantity", e.target.value)}
                  placeholder="Qty"
                  className="flex-1 px-3 py-2 rounded-lg bg-card border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <select
                  value={product.unit}
                  onChange={(e) => updateProduct(product.id, "unit", e.target.value)}
                  className="px-3 py-2 rounded-lg bg-card border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {unitOptions.map((u) => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
                <input
                  type="number"
                  value={product.pricePerUnit}
                  onChange={(e) => updateProduct(product.id, "pricePerUnit", e.target.value)}
                  placeholder="₹/unit"
                  className="w-24 px-3 py-2 rounded-lg bg-card border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <button
        onClick={addProduct}
        className="w-full mt-3 flex items-center justify-center gap-2 py-2 rounded-xl border-2 border-dashed border-border text-muted-foreground hover:border-primary hover:text-primary transition-colors text-sm font-medium"
      >
        <Plus className="w-4 h-4" />
        Add Product
      </button>

      {totalEstimate > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-3 pt-3 border-t border-border flex items-center justify-between"
        >
          <span className="text-sm text-muted-foreground font-medium">Products Total</span>
          <span className="font-display font-bold text-lg text-primary">₹{totalEstimate.toLocaleString()}</span>
        </motion.div>
      )}

      {/* Submit */}
      <Button
        onClick={handleSubmit}
        disabled={!budget || isLoading}
        className="w-full mt-4 gradient-warm text-primary-foreground font-display font-bold text-base py-6 rounded-xl shadow-elevated hover:opacity-90 transition-opacity border-none"
      >
        <Sparkles className="w-5 h-5 mr-2" />
        {isLoading ? "Analyzing..." : "Get Smart Suggestions"}
      </Button>
    </motion.div>
  );
};

export default BudgetAndProducts;
