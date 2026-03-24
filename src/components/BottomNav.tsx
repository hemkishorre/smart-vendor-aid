import { Home, MessageSquare, ShoppingBag, User } from "lucide-react";
import { motion } from "framer-motion";

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: "home", icon: Home, label: "Home", color: "from-primary to-accent" },
  { id: "recommend", icon: ShoppingBag, label: "Buy", color: "from-secondary to-success" },
  { id: "chat", icon: MessageSquare, label: "Chat", color: "from-info to-accent" },
  { id: "profile", icon: User, label: "Profile", color: "from-accent to-primary" },
];

const BottomNav = ({ activeTab, onTabChange }: BottomNavProps) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/80 backdrop-blur-xl border-t border-border px-2 pb-safe z-50">
      <div className="max-w-lg mx-auto flex items-center justify-around py-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="relative flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl transition-all"
            >
              {isActive && (
                <motion.div
                  layoutId="bottomNavIndicator"
                  className={`absolute inset-0 bg-gradient-to-r ${tab.color} rounded-xl opacity-15`}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                />
              )}
              <tab.icon className={`w-5 h-5 ${isActive ? "text-primary stroke-[2.5]" : "text-muted-foreground"}`} />
              <span className={`text-[10px] font-semibold ${isActive ? "text-primary" : "text-muted-foreground"}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
