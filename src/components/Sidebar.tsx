import { Home, MessageSquare, ShoppingBag, User, Package, Sparkles, Flame, LogOut } from "lucide-react";
import { motion } from "framer-motion";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout?: () => void;
}

const tabs = [
  { id: "home", icon: Home, label: "Dashboard", gradient: "gradient-warm" },
  { id: "demand", icon: Flame, label: "Demanded Products", gradient: "gradient-sunset" },
  { id: "recommend", icon: ShoppingBag, label: "Recommendations", gradient: "gradient-fresh" },
  { id: "chat", icon: MessageSquare, label: "AI Chat", gradient: "gradient-sky" },
  { id: "profile", icon: User, label: "Profile", gradient: "gradient-purple" },
];

const Sidebar = ({ activeTab, onTabChange }: SidebarProps) => {
  return (
    <aside className="w-64 bg-card border-r border-border flex flex-col h-screen sticky top-0">
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl gradient-warm flex items-center justify-center shadow-glow">
            <Package className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-display font-black text-lg text-foreground leading-tight">
              SmartStock <span className="text-primary">AI</span>
            </h1>
            <p className="text-[10px] text-muted-foreground leading-tight">Smart purchasing for smart vendors</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`w-full relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium ${
                isActive
                  ? `${tab.gradient} text-primary-foreground shadow-elevated`
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span>{tab.label}</span>
              {isActive && <Sparkles className="w-3 h-3 ml-auto opacity-70" />}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <div className="gradient-sunset rounded-xl p-3 text-primary-foreground">
          <p className="text-xs opacity-80 font-medium">AI Powered</p>
          <p className="text-sm font-display font-bold">🤖 Smart Insights On</p>
          <p className="text-xs opacity-70 mt-0.5">Weather + Market data</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
