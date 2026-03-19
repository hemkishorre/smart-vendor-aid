import { motion } from "framer-motion";
import { Store, MapPin, Languages, ChevronRight } from "lucide-react";

const ProfileView = () => {
  return (
    <div className="px-4 py-6 space-y-5">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="w-20 h-20 rounded-full gradient-warm mx-auto flex items-center justify-center shadow-elevated mb-3">
          <Store className="w-9 h-9 text-primary-foreground" />
        </div>
        <h2 className="font-display font-bold text-xl text-foreground">My Shop</h2>
        <p className="text-sm text-muted-foreground">Vegetable Vendor</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card rounded-2xl shadow-card border border-border overflow-hidden"
      >
        {[
          { icon: Store, label: "Shop Type", value: "Vegetable Vendor" },
          { icon: MapPin, label: "Location", value: "Chennai, TN" },
          { icon: Languages, label: "Language", value: "Tamil + English" },
        ].map((item, i) => (
          <button
            key={i}
            className="w-full flex items-center gap-3 px-4 py-4 hover:bg-muted transition-colors border-b border-border last:border-b-0"
          >
            <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center">
              <item.icon className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-xs text-muted-foreground">{item.label}</p>
              <p className="text-sm font-semibold text-foreground">{item.value}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
        ))}
      </motion.div>
    </div>
  );
};

export default ProfileView;
