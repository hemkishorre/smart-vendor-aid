import { Cloud, Sun, CloudRain, CloudLightning, Droplets, MapPin, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";

type WeatherType = "sunny" | "rainy" | "cloudy" | "stormy";

interface WeatherCardProps {
  weather: WeatherType;
  temperature: number;
  humidity: number;
  riskLevel: "Low" | "Medium" | "High";
  location: string;
  onCityChange?: (city: string) => void;
}

const weatherConfig = {
  sunny: { icon: Sun, label: "Sunny", bgClass: "gradient-warm" },
  rainy: { icon: CloudRain, label: "Rainy", bgClass: "gradient-sky" },
  cloudy: { icon: Cloud, label: "Cloudy", bgClass: "bg-muted" },
  stormy: { icon: CloudLightning, label: "Stormy", bgClass: "gradient-sky" },
};

const riskColors = {
  Low: "bg-success text-success-foreground",
  Medium: "bg-warning text-warning-foreground",
  High: "bg-destructive text-destructive-foreground",
};

const popularCities = [
  "Chennai", "Mumbai", "Delhi", "Bangalore", "Hyderabad",
  "Kolkata", "Pune", "Ahmedabad", "Coimbatore", "Madurai",
  "Jaipur", "Lucknow", "Kochi", "Vizag", "Trichy",
];

const WeatherCard = ({ weather, temperature, humidity, riskLevel, location, onCityChange }: WeatherCardProps) => {
  const config = weatherConfig[weather];
  const Icon = config.icon;
  const [showSelector, setShowSelector] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowSelector(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const filtered = popularCities.filter(c =>
    c.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (city: string) => {
    setShowSelector(false);
    setSearch("");
    onCityChange?.(city);
  };

  const handleCustomSubmit = () => {
    if (search.trim()) {
      handleSelect(search.trim());
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`rounded-2xl p-5 ${config.bgClass} text-primary-foreground shadow-elevated relative`}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowSelector(!showSelector)}
              className="flex items-center gap-1 text-sm opacity-90 hover:opacity-100 transition-opacity font-medium bg-white/15 rounded-full px-3 py-1 backdrop-blur-sm"
            >
              <MapPin className="w-3.5 h-3.5" />
              {location}
              <ChevronDown className="w-3 h-3" />
            </button>

            {showSelector && (
              <div className="absolute top-9 left-0 z-50 w-56 bg-popover text-popover-foreground rounded-xl shadow-lg border border-border overflow-hidden">
                <div className="p-2">
                  <input
                    autoFocus
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleCustomSubmit()}
                    placeholder="Search or type city..."
                    className="w-full px-3 py-2 text-sm rounded-lg bg-muted border-none outline-none placeholder:text-muted-foreground"
                  />
                </div>
                <div className="max-h-48 overflow-y-auto">
                  {filtered.map((city) => (
                    <button
                      key={city}
                      onClick={() => handleSelect(city)}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-accent transition-colors"
                    >
                      {city}
                    </button>
                  ))}
                  {filtered.length === 0 && search.trim() && (
                    <button
                      onClick={handleCustomSubmit}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-accent transition-colors text-primary font-medium"
                    >
                      Search "{search}"
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
          <h3 className="text-4xl font-display font-bold mt-2">{temperature}°C</h3>
          <p className="text-sm mt-1 opacity-90">{config.label}</p>
        </div>
        <Icon className="w-12 h-12 opacity-90" />
      </div>
      <div className="flex items-center gap-4 mt-4">
        <div className="flex items-center gap-1 text-sm opacity-80">
          <Droplets className="w-4 h-4" />
          {humidity}%
        </div>
        <span className={`text-xs font-bold px-3 py-1 rounded-full ${riskColors[riskLevel]}`}>
          Risk: {riskLevel}
        </span>
      </div>
    </motion.div>
  );
};

export default WeatherCard;
