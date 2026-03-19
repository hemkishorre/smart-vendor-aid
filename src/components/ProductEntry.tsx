import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Package } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Product {
  id: number;
  name: string;
  quantity: string;
  unit: string;
  pricePerUnit: string;
}

interface ProductEntryProps {
  onProductsChange?: (products: Product[]) => void;
}

const unitOptions = ["kg", "L", "dozen", "pieces", "bags"];

const ProductEntry = ({ onProductsChange }: ProductEntryProps) => {
  const [products, setProducts] = useState<Product[]>([
    { id: Date.now(), name: "", quantity: "", unit: "kg", pricePerUnit: "" },
  ]);

  const addProduct = () => {
    const updated = [...products, { id: Date.now(), name: "", quantity: "", unit: "kg", pricePerUnit: "" }];
    setProducts(updated);
    onProductsChange?.(updated);
  };

  const removeProduct = (id: number) => {
    if (products.length <= 1) return;
    const updated = products.filter((p) => p.id !== id);
    setProducts(updated);
    onProductsChange?.(updated);
  };

  const updateProduct = (id: number, field: keyof Product, value: string) => {
    const updated = products.map((p) => (p.id === id ? { ...p, [field]: value } : p));
    setProducts(updated);
    onProductsChange?.(updated);
  };

  const totalEstimate = products.reduce((sum, p) => {
    const qty = parseFloat(p.quantity) || 0;
    const price = parseFloat(p.pricePerUnit) || 0;
    return sum + qty * price;
  }, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-card rounded-2xl p-5 shadow-card border border-border"
    >
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-display font-bold text-lg text-foreground">My Products</h3>
        <Package className="w-5 h-5 text-primary" />
      </div>
      <p className="text-sm text-muted-foreground mb-4">Add products you plan to buy</p>

      <div className="space-y-3">
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
        className="w-full mt-3 flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-dashed border-border text-muted-foreground hover:border-primary hover:text-primary transition-colors text-sm font-medium"
      >
        <Plus className="w-4 h-4" />
        Add Product
      </button>

      {totalEstimate > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 pt-3 border-t border-border flex items-center justify-between"
        >
          <span className="text-sm text-muted-foreground font-medium">Estimated Total</span>
          <span className="font-display font-bold text-xl text-primary">₹{totalEstimate.toLocaleString()}</span>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ProductEntry;
