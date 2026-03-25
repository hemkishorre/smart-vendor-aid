import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Upload, Loader2, ScanLine, X, Check, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface DetectedProduct {
  name: string;
  quantity: string;
  unit: string;
  estimatedPricePerUnit: string;
}

interface ImageProductScannerProps {
  onProductsDetected: (products: DetectedProduct[]) => void;
}

const ImageProductScanner = ({ onProductsDetected }: ImageProductScannerProps) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [detectedProducts, setDetectedProducts] = useState<DetectedProduct[]>([]);
  const [summary, setSummary] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast({ title: "Invalid file", description: "Please upload an image", variant: "destructive" });
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast({ title: "File too large", description: "Max 10MB allowed", variant: "destructive" });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
      setDetectedProducts([]);
      setSummary("");
    };
    reader.readAsDataURL(file);
  };

  const analyzeImage = async () => {
    if (!preview) return;
    setIsAnalyzing(true);
    setDetectedProducts([]);

    try {
      const base64 = preview.split(",")[1];

      const resp = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-product-image`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ imageBase64: base64 }),
        }
      );

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        throw new Error(err.error || "Analysis failed");
      }

      const data = await resp.json();
      setDetectedProducts(data.products || []);
      setSummary(data.summary || "");

      if (data.products?.length > 0) {
        toast({ title: "Products detected!", description: `Found ${data.products.length} items` });
      } else {
        toast({ title: "No products found", description: "Try a clearer image", variant: "destructive" });
      }
    } catch (e: any) {
      console.error("Analysis error:", e);
      toast({ title: "Error", description: e.message || "Failed to analyze image", variant: "destructive" });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const addToInventory = () => {
    onProductsDetected(detectedProducts);
    toast({ title: "Added to inventory!", description: `${detectedProducts.length} products added` });
    reset();
  };

  const reset = () => {
    setPreview(null);
    setDetectedProducts([]);
    setSummary("");
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (cameraInputRef.current) cameraInputRef.current.value = "";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 }}
      className="bg-card rounded-2xl p-5 shadow-card border border-border overflow-hidden"
    >
      <div className="flex items-center gap-2 mb-1">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[hsl(var(--chart-4))] to-[hsl(var(--chart-5))] flex items-center justify-center">
          <ScanLine className="w-4 h-4 text-primary-foreground" />
        </div>
        <h3 className="font-display font-bold text-lg text-foreground">Scan Products</h3>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        Upload a photo of your goods — AI detects products & weights instantly
      </p>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
      />

      <AnimatePresence mode="wait">
        {!preview ? (
          <motion.div
            key="upload"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex gap-3"
          >
            <button
              onClick={() => cameraInputRef.current?.click()}
              className="flex-1 flex flex-col items-center gap-2 py-6 rounded-xl border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 transition-all text-muted-foreground hover:text-primary"
            >
              <Camera className="w-8 h-8" />
              <span className="text-sm font-medium">Take Photo</span>
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 flex flex-col items-center gap-2 py-6 rounded-xl border-2 border-dashed border-border hover:border-accent hover:bg-accent/5 transition-all text-muted-foreground hover:text-accent-foreground"
            >
              <Upload className="w-8 h-8" />
              <span className="text-sm font-medium">Upload Image</span>
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-3"
          >
            <div className="relative rounded-xl overflow-hidden border border-border">
              <img src={preview} alt="Product" className="w-full h-48 object-cover" />
              <button
                onClick={reset}
                className="absolute top-2 right-2 w-8 h-8 rounded-full bg-background/80 backdrop-blur flex items-center justify-center text-foreground hover:bg-destructive hover:text-destructive-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              {isAnalyzing && (
                <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex flex-col items-center justify-center gap-2">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  <span className="text-sm font-medium text-foreground">Analyzing products...</span>
                </div>
              )}
            </div>

            {detectedProducts.length === 0 && !isAnalyzing && (
              <Button
                onClick={analyzeImage}
                className="w-full gradient-warm text-primary-foreground font-display font-bold py-5 rounded-xl"
              >
                <ScanLine className="w-5 h-5 mr-2" />
                Detect Products
              </Button>
            )}

            {detectedProducts.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-2"
              >
                {summary && (
                  <p className="text-xs font-medium text-muted-foreground bg-muted rounded-lg px-3 py-2">
                    <ImageIcon className="w-3 h-3 inline mr-1" />
                    {summary}
                  </p>
                )}
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {detectedProducts.map((p, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center justify-between bg-muted rounded-lg px-3 py-2"
                    >
                      <div>
                        <span className="text-sm font-semibold text-foreground">{p.name}</span>
                        <span className="text-xs text-muted-foreground ml-2">
                          {p.quantity} {p.unit}
                        </span>
                      </div>
                      <span className="text-sm font-bold text-primary">
                        ₹{p.estimatedPricePerUnit}/{p.unit}
                      </span>
                    </motion.div>
                  ))}
                </div>
                <div className="flex gap-2 pt-1">
                  <Button
                    onClick={reset}
                    variant="outline"
                    className="flex-1 rounded-xl"
                  >
                    Retake
                  </Button>
                  <Button
                    onClick={addToInventory}
                    className="flex-1 gradient-fresh text-primary-foreground font-bold rounded-xl"
                  >
                    <Check className="w-4 h-4 mr-1" />
                    Add to Inventory
                  </Button>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ImageProductScanner;
