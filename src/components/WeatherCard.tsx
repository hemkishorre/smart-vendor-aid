import { Cloud, Sun, CloudRain, CloudLightning, Droplets } from "lucide-react";
import { motion } from "framer-motion";

type WeatherType = "sunny" | "rainy" | "cloudy" | "stormy";

interface WeatherCardProps {
  weather: WeatherType;
  temperature: number;
  humidity: number;
  riskLevel: "Low" | "Medium" | "High";
  location: string;
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

const WeatherCard = ({ weather, temperature, humidity, riskLevel, location }: WeatherCardProps) => {
  const config = weatherConfig[weather];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`rounded-2xl p-5 ${weather === "cloudy" ? config.bgClass : ""} ${weather !== "cloudy" ? config.bgClass : ""} text-primary-foreground shadow-elevated`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm opacity-80 font-medium">{location}</p>
          <h3 className="text-4xl font-display font-bold mt-1">{temperature}°C</h3>
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
