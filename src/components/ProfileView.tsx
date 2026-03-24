import { motion } from "framer-motion";
import { Store, MapPin, Languages, ChevronRight, Sparkles } from "lucide-react";

const ProfileView = () => {
  return (
    <div className="space-y-6 max-w-2xl">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h2 className="font-display font-bold text-2xl lg:text-3xl text-foreground">Profile</h2>
        <p className="text-sm text-muted-foreground">Manage your shop settings</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="gradient-purple rounded-2xl p-6 shadow-elevated text-accent-foreground flex items-center gap-5 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/10 -translate-y-12 translate-x-12" />
        <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
          <Store className="w-7 h-7" />
        </div>
        <div>
          <h3 className="font-display font-bold text-xl">My Shop</h3>
          <p className="text-sm opacity-80">Vegetable Vendor</p>
          <div className="flex items-center gap-1 mt-1 text-xs opacity-70">
            <Sparkles className="w-3 h-3" />
            <span>AI-Powered Insights Active</span>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card rounded-2xl shadow-card border border-border overflow-hidden"
      >
        {[
          { icon: Store, label: "Shop Type", value: "Vegetable Vendor", color: "bg-primary/10 text-primary" },
          { icon: MapPin, label: "Location", value: "Chennai, TN", color: "bg-secondary/10 text-secondary" },
          { icon: Languages, label: "Language", value: "Tamil + English", color: "bg-accent/10 text-accent" },
        ].map((item, i) => (
          <button
            key={i}
            className="w-full flex items-center gap-3 px-5 py-4 hover:bg-muted transition-colors border-b border-border last:border-b-0"
          >
            <div className={`w-10 h-10 rounded-lg ${item.color} flex items-center justify-center`}>
              <item.icon className="w-5 h-5" />
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
