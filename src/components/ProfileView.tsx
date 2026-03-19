import { motion } from "framer-motion";
import { Store, MapPin, Languages, ChevronRight } from "lucide-react";

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
        className="bg-card rounded-2xl p-6 shadow-card border border-border flex items-center gap-5"
      >
        <div className="w-16 h-16 rounded-full gradient-warm flex items-center justify-center shadow-elevated flex-shrink-0">
          <Store className="w-7 h-7 text-primary-foreground" />
        </div>
        <div>
          <h3 className="font-display font-bold text-xl text-foreground">My Shop</h3>
          <p className="text-sm text-muted-foreground">Vegetable Vendor</p>
        </div>
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
            className="w-full flex items-center gap-3 px-5 py-4 hover:bg-muted transition-colors border-b border-border last:border-b-0"
          >
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
              <item.icon className="w-5 h-5 text-primary" />
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
