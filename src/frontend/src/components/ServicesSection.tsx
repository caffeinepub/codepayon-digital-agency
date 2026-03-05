import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Check,
  Flame,
  Infinity as InfinityIcon,
  ShoppingCart,
  Star,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface ServiceCardProps {
  icon: string;
  title: string;
  titleUrdu: string;
  price: string;
  marketPrice: string;
  features: string[];
  badge?: string;
  badgeColor?: string;
  accentColor: string;
  index: number;
  onOrder: () => void;
  priceTable?: { label: string; value: string }[];
  dataOcid: string;
  orderOcid: string;
}

function ServiceCard({
  icon,
  title,
  titleUrdu,
  price,
  marketPrice,
  features,
  badge,
  badgeColor,
  accentColor,
  index,
  onOrder,
  priceTable,
  dataOcid,
  orderOcid,
}: ServiceCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.1 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const badgeIcons: Record<string, React.ReactNode> = {
    "BEST SELLER": <Star className="w-3 h-3" />,
    HOT: <Flame className="w-3 h-3" />,
    LIFETIME: <InfinityIcon className="w-3 h-3" />,
    PREMIUM: <Zap className="w-3 h-3" />,
  };

  return (
    <div
      ref={ref}
      data-ocid={dataOcid}
      className={`service-card glass-card rounded-2xl p-6 flex flex-col transition-all duration-500 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={{
        transitionDelay: `${index * 0.1}s`,
        borderColor: `${accentColor}20`,
      }}
    >
      {/* Card header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
            style={{
              background: `${accentColor}15`,
              border: `1px solid ${accentColor}30`,
            }}
          >
            {icon}
          </div>
          <div>
            <h3 className="font-display text-base font-bold text-foreground leading-tight">
              {title}
            </h3>
            <p className="text-xs text-muted-foreground" dir="rtl">
              {titleUrdu}
            </p>
          </div>
        </div>
        {badge && (
          <span
            className="badge-pulse inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold"
            style={{
              background: `${badgeColor || accentColor}20`,
              color: badgeColor || accentColor,
              border: `1px solid ${badgeColor || accentColor}40`,
            }}
          >
            {badgeIcons[badge]}
            {badge}
          </span>
        )}
      </div>

      {/* Price */}
      <div
        className="mb-4 p-3 rounded-xl"
        style={{
          background: `${accentColor}08`,
          border: `1px solid ${accentColor}15`,
        }}
      >
        <div className="flex items-baseline gap-2 flex-wrap">
          <span
            className="font-display text-2xl font-black"
            style={{ color: accentColor }}
          >
            {price}
          </span>
          {marketPrice && (
            <span className="text-xs text-muted-foreground line-through">
              {marketPrice}
            </span>
          )}
        </div>
      </div>

      {/* Price table (for Service 3) */}
      {priceTable && (
        <div className="mb-4 grid grid-cols-2 gap-2">
          {priceTable.map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between p-2 rounded-lg"
              style={{ background: `${accentColor}08` }}
            >
              <span className="text-xs text-muted-foreground">
                {item.label}
              </span>
              <span
                className="text-xs font-bold"
                style={{ color: accentColor }}
              >
                {item.value}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Features */}
      <ul className="space-y-2 flex-1 mb-5">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-sm">
            <Check
              className="w-4 h-4 mt-0.5 flex-shrink-0"
              style={{ color: accentColor }}
            />
            <span className="text-muted-foreground leading-snug">
              {feature}
            </span>
          </li>
        ))}
      </ul>

      {/* Order button */}
      <Button
        data-ocid={orderOcid}
        onClick={onOrder}
        className="w-full font-bold rounded-xl transition-all hover:scale-105 gap-2"
        style={{
          background: `${accentColor}`,
          color: "#0a0a0a",
        }}
      >
        <ShoppingCart className="w-4 h-4" />
        آرڈر کریں
      </Button>
    </div>
  );
}

interface ServicesSectionProps {
  onOrderClick: (service: string) => void;
}

const services: Omit<
  ServiceCardProps,
  "onOrder" | "index" | "dataOcid" | "orderOcid"
>[] = [
  {
    icon: "📌",
    title: "Social Media Setup + Monetization",
    titleUrdu: "سوشل میڈیا سیٹ اپ + مونیٹائزیشن",
    price: "PKR 5,000",
    marketPrice: "Market: PKR 40,000-150,000",
    badge: "BEST SELLER",
    badgeColor: "#FFD700",
    accentColor: "#00C851",
    features: [
      "YouTube (مونیٹائزڈ چینلز), Facebook, Instagram, TikTok + 20 Platforms",
      "مکمل SEO: Titles, Tags, Descriptions",
      "Algorithm Safe Structure",
      "24/7 Guidance – 80% clients monetized in 3 months",
      "International monetization setup",
    ],
  },
  {
    icon: "🎥",
    title: "Copyright-Free Videos + Text-to-Video",
    titleUrdu: "کاپی رائٹ فری ویڈیوز + ٹیکسٹ ٹو ویڈیو",
    price: "PKR 1,000/video",
    marketPrice: "Market: PKR 15,000-50,000/month",
    accentColor: "#FF6B35",
    features: [
      "15-30 min Ready-to-Upload Videos",
      "Text-to-Video Software (InVideo/CapCut prompts)",
      "Organic Growth Tools (Subs/Likes/Comments)",
      "500+ videos created, Watch Time 10x boost",
      "Professional editing included",
    ],
  },
  {
    icon: "🚀",
    title: "100% Human Organic Growth (USA/EU)",
    titleUrdu: "آرگینک گروتھ – امریکا/یورپ",
    price: "From PKR 2",
    marketPrice: "Market: PKR 30,000-80,000/month",
    badge: "HOT",
    badgeColor: "#FF4444",
    accentColor: "#00B4FF",
    features: [
      "Millions of International Views (USA/Canada/Europe)",
      "Phased Delivery, 100% Algorithm Safe",
      "80% cheaper than market rate",
      "پاورفل ٹیم – کلائنٹس کے چینلز محفوظ",
    ],
    priceTable: [
      { label: "Subscribers", value: "PKR 20" },
      { label: "Likes", value: "PKR 2" },
      { label: "Views", value: "PKR 2" },
      { label: "Comments", value: "PKR 5" },
      { label: "Shares", value: "PKR 10" },
      { label: "Website Views", value: "PKR 2" },
    ],
  },
  {
    icon: "📱",
    title: "WhatsApp + Digital Marketing",
    titleUrdu: "واٹس ایپ + ڈیجیٹل مارکیٹنگ",
    price: "PKR 3,000 Lifetime",
    marketPrice: "Market: PKR 70,000+",
    accentColor: "#25D366",
    features: [
      "USA/Canada/Europe numbers (Direct Call/VoIP)",
      "WhatsApp Channels + Business Setup",
      "Backlinks, SEO, PPC, Email Strategy",
      "Content Strategy across all platforms",
      "Lifetime Support + Daily Tips",
    ],
  },
  {
    icon: "💻",
    title: "Lifetime Premium Tools",
    titleUrdu: "لائف ٹائم پریمیم ٹولز",
    price: "PKR 3,000 Lifetime",
    marketPrice: "Market: PKR 10,000-50,000",
    badge: "LIFETIME",
    badgeColor: "#A855F7",
    accentColor: "#A855F7",
    features: [
      "AI: ChatGPT+, Grok, Text-to-Video (InVideo/CapCut)",
      "Design: Canva Pro (Lifetime)",
      "Streaming: Netflix, Disney+, Amazon Prime (Lifetime!)",
      "Free Training for all tools",
      "Regular updates included",
    ],
  },
  {
    icon: "🔥",
    title: "Full Digital Marketing Package",
    titleUrdu: "فل ڈیجیٹل مارکیٹنگ پیکج",
    price: "کم انویسٹمنٹ، لائف ٹائم پروفٹس",
    marketPrice: "Market: PKR 100,000-200,000+/month",
    badge: "PREMIUM",
    badgeColor: "#FFD700",
    accentColor: "#FFD700",
    features: [
      "SEO, SMM, PPC, Influencer Marketing",
      "Blog Optimization – All Platforms",
      "YouTube-style package for every platform",
      "100+ Active Clients, Lifetime ROI",
      "10x better results than competitors",
    ],
  },
];

export default function ServicesSection({
  onOrderClick,
}: ServicesSectionProps) {
  return (
    <section id="services" className="py-16 sm:py-24 relative">
      <div className="absolute inset-0 grid-bg opacity-30" />

      {/* Background glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] rounded-full opacity-5 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, oklch(0.72 0.22 145), transparent)",
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card mb-4">
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">
              Our Services
            </span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black mb-4">
            <span className="text-gradient-green">Premium</span>{" "}
            <span className="text-foreground">Digital Services</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto" dir="rtl">
            پاکستان کی ٹاپ ایجنسیز سے 90% سستے – مگر 200% زیادہ سپورٹ اور بہتر
            نتائج
          </p>
        </div>

        <div
          id="pricing"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {services.map((service, i) => (
            <ServiceCard
              key={service.title}
              {...service}
              index={i}
              dataOcid={`service.item.${i + 1}`}
              orderOcid={`service.order_button.${i + 1}`}
              onOrder={() => onOrderClick(service.title)}
            />
          ))}
        </div>

        {/* Market comparison note */}
        <div className="mt-10 glass-card rounded-2xl p-6 text-center max-w-3xl mx-auto">
          <p className="text-sm text-muted-foreground">
            <span className="text-primary font-bold">🔥 مارکیٹ موازنہ:</span>{" "}
            پاکستان کی ٹاپ ایجنسیز (Market Pro, RankingGrow, DigiTroopers)
            ماہانہ PKR 50,000-200,000+ چارج کرتی ہیں۔ ہماری آفرز{" "}
            <span className="text-primary font-bold">90% سستی</span> – PKR
            3,000-5,000 میں لائف ٹائم!
          </p>
        </div>
      </div>
    </section>
  );
}
