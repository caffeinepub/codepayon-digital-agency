import { Globe, TrendingUp, Users, Video } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useStats } from "../hooks/useQueries";

interface StatCardProps {
  icon: React.ReactNode;
  value: number;
  suffix: string;
  label: string;
  sublabel: string;
  color: string;
  index: number;
}

function useCountUp(target: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    const startTime = Date.now();
    const step = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - (1 - progress) ** 3;
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

function StatCard({
  icon,
  value,
  suffix,
  label,
  sublabel,
  color,
  index,
}: StatCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const count = useCountUp(value, 2000 + index * 200, visible);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.3 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="glass-card rounded-2xl p-6 sm:p-8 text-center group hover:scale-105 transition-all duration-300"
      style={{
        borderColor: `${color}30`,
        animationDelay: `${index * 0.1}s`,
        boxShadow: `0 0 30px ${color}15, inset 0 0 30px ${color}05`,
      }}
    >
      {/* Icon */}
      <div className="flex justify-center mb-4">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center"
          style={{ background: `${color}15`, border: `1px solid ${color}30` }}
        >
          <div style={{ color }}>{icon}</div>
        </div>
      </div>

      {/* Number */}
      <div
        className="font-display text-4xl sm:text-5xl font-black mb-2 stat-number"
        style={{ color }}
      >
        {count}
        {suffix}
      </div>

      {/* Label */}
      <div className="text-foreground font-bold text-lg mb-1">{label}</div>
      <div className="text-muted-foreground text-sm">{sublabel}</div>
    </div>
  );
}

const statConfig = [
  {
    icon: <Users className="w-6 h-6" />,
    value: 100,
    suffix: "+",
    label: "Active Clients",
    sublabel: "فعال کلائنٹس",
    color: "#00C851",
  },
  {
    icon: <Video className="w-6 h-6" />,
    value: 500,
    suffix: "+",
    label: "Videos Created",
    sublabel: "ویڈیوز بنائی گئیں",
    color: "#FFD700",
  },
  {
    icon: <TrendingUp className="w-6 h-6" />,
    value: 80,
    suffix: "%",
    label: "Monetized in 3 Months",
    sublabel: "3 مہینے میں مونیٹائزڈ",
    color: "#00B4FF",
  },
  {
    icon: <Globe className="w-6 h-6" />,
    value: 20,
    suffix: "+",
    label: "Social Platforms",
    sublabel: "سوشل پلیٹ فارمز",
    color: "#FF6B35",
  },
];

export default function StatsSection() {
  const { data: stats } = useStats();

  const resolvedStats = statConfig.map((s, i) => {
    if (i === 0 && stats) return { ...s, value: Number(stats.totalClients) };
    if (i === 1 && stats) return { ...s, value: Number(stats.videosCreated) };
    if (i === 2 && stats) return { ...s, value: Number(stats.successRate) };
    return s;
  });

  return (
    <section className="py-16 sm:py-20 relative">
      <div className="absolute inset-0 grid-bg opacity-50" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card mb-4">
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">
              Our Numbers
            </span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-black text-foreground">
            Results That <span className="text-gradient-green">Speak</span>
          </h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {resolvedStats.map((stat, i) => (
            <StatCard key={stat.label} {...stat} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
