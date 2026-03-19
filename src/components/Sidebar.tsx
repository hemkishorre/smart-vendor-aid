import { Home, MessageSquare, ShoppingBag, User, Package } from "lucide-react";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: "home", icon: Home, label: "Dashboard" },
  { id: "recommend", icon: ShoppingBag, label: "Recommendations" },
  { id: "chat", icon: MessageSquare, label: "AI Chat" },
  { id: "profile", icon: User, label: "Profile" },
];

const Sidebar = ({ activeTab, onTabChange }: SidebarProps) => {
  return (
    <aside className="w-64 bg-card border-r border-border flex flex-col h-screen sticky top-0">
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl gradient-warm flex items-center justify-center">
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
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium ${
                isActive
                  ? "gradient-warm text-primary-foreground shadow-elevated"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <div className="bg-muted rounded-xl p-3">
          <p className="text-xs text-muted-foreground">Today's Weather</p>
          <p className="text-sm font-display font-bold text-foreground">🌧️ Rainy, 28°C</p>
          <p className="text-xs text-muted-foreground mt-0.5">Risk: Medium</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
