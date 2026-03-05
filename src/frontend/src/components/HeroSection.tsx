import { Button } from "@/components/ui/button";
import { ChevronDown, Sparkles, Zap } from "lucide-react";

interface HeroSectionProps {
  onOrderClick: () => void;
}

const socialIcons = [
  {
    emoji: "▶️",
    label: "si-youtube",
    delay: "0s",
    pos: "top-[12%] left-[8%]",
    size: "text-3xl",
    cls: "float-icon-1",
  },
  {
    emoji: "📘",
    label: "si-facebook",
    delay: "0.5s",
    pos: "top-[20%] right-[10%]",
    size: "text-4xl",
    cls: "float-icon-2",
  },
  {
    emoji: "📸",
    label: "si-instagram",
    delay: "1s",
    pos: "top-[55%] left-[5%]",
    size: "text-3xl",
    cls: "float-icon-3",
  },
  {
    emoji: "🎵",
    label: "si-tiktok",
    delay: "1.5s",
    pos: "top-[70%] right-[8%]",
    size: "text-4xl",
    cls: "float-icon-4",
  },
  {
    emoji: "🐦",
    label: "si-twitter",
    delay: "2s",
    pos: "top-[35%] left-[3%]",
    size: "text-2xl",
    cls: "float-icon-5",
  },
  {
    emoji: "💼",
    label: "si-linkedin",
    delay: "2.5s",
    pos: "bottom-[20%] left-[12%]",
    size: "text-3xl",
    cls: "float-icon-6",
  },
  {
    emoji: "💬",
    label: "si-whatsapp",
    delay: "0.3s",
    pos: "top-[15%] right-[20%]",
    size: "text-3xl",
    cls: "float-icon-7",
  },
  {
    emoji: "✈️",
    label: "si-telegram",
    delay: "3s",
    pos: "bottom-[35%] right-[5%]",
    size: "text-2xl",
    cls: "float-icon-8",
  },
  {
    emoji: "🎮",
    label: "si-discord",
    delay: "1.2s",
    pos: "top-[45%] right-[15%]",
    size: "text-3xl",
    cls: "float-icon-9",
  },
  {
    emoji: "👻",
    label: "si-snapchat",
    delay: "4s",
    pos: "bottom-[15%] right-[20%]",
    size: "text-2xl",
    cls: "float-icon-10",
  },
  {
    emoji: "📌",
    label: "si-pinterest",
    delay: "0.8s",
    pos: "top-[80%] left-[20%]",
    size: "text-2xl",
    cls: "float-icon-1",
  },
  {
    emoji: "🤖",
    label: "si-reddit",
    delay: "3.5s",
    pos: "top-[25%] left-[18%]",
    size: "text-2xl",
    cls: "float-icon-2",
  },
  {
    emoji: "🟣",
    label: "si-twitch",
    delay: "2.2s",
    pos: "bottom-[40%] left-[8%]",
    size: "text-2xl",
    cls: "float-icon-3",
  },
  {
    emoji: "🧵",
    label: "si-threads",
    delay: "1.8s",
    pos: "top-[60%] right-[22%]",
    size: "text-xl",
    cls: "float-icon-4",
  },
  {
    emoji: "🎵",
    label: "si-soundcloud",
    delay: "3.8s",
    pos: "bottom-[25%] left-[25%]",
    size: "text-xl",
    cls: "float-icon-5",
  },
  {
    emoji: "🎬",
    label: "si-vimeo",
    delay: "0.6s",
    pos: "top-[88%] right-[12%]",
    size: "text-xl",
    cls: "float-icon-6",
  },
  {
    emoji: "📺",
    label: "si-dailymotion",
    delay: "2.8s",
    pos: "bottom-[10%] left-[38%]",
    size: "text-xl",
    cls: "float-icon-7",
  },
  {
    emoji: "🎨",
    label: "si-behance",
    delay: "4.5s",
    pos: "top-[5%] left-[40%]",
    size: "text-xl",
    cls: "float-icon-8",
  },
  {
    emoji: "📷",
    label: "si-flickr",
    delay: "1.6s",
    pos: "top-[8%] right-[35%]",
    size: "text-xl",
    cls: "float-icon-9",
  },
  {
    emoji: "📊",
    label: "si-analytics",
    delay: "3.2s",
    pos: "top-[48%] left-[22%]",
    size: "text-xl",
    cls: "float-icon-10",
  },
];

export default function HeroSection({ onOrderClick }: HeroSectionProps) {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 hero-gradient grid-bg" />

      {/* Glowing orbs */}
      <div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, oklch(0.72 0.22 145), transparent)",
        }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-15 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, oklch(0.82 0.18 85), transparent)",
        }}
      />
      <div
        className="absolute top-1/2 right-1/3 w-64 h-64 rounded-full opacity-10 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, oklch(0.6 0.2 220), transparent)",
        }}
      />

      {/* Floating Social Icons */}
      {socialIcons.map((icon) => (
        <div
          key={icon.label}
          className={`absolute ${icon.pos} ${icon.size} ${icon.cls} select-none pointer-events-none opacity-60`}
          style={{
            animationDelay: icon.delay,
            filter: "drop-shadow(0 0 8px oklch(0.72 0.22 145 / 0.6))",
          }}
          aria-label={icon.label}
        >
          {icon.emoji}
        </div>
      ))}

      {/* Hero Content */}
      <div className="relative z-10 container mx-auto px-4 text-center pt-20 pb-16">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card glow-green mb-6">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold text-primary">
            🇵🇰 Pakistan's #1 Digital Agency
          </span>
          <Sparkles className="w-4 h-4 text-primary" />
        </div>

        {/* Main heading - Urdu */}
        <h1
          className="font-display text-4xl sm:text-5xl md:text-7xl font-black mb-4 leading-tight"
          dir="rtl"
        >
          <span className="text-gradient-green">پاکستان کی نمبر 1</span>
          <br />
          <span className="text-foreground">ڈیجیٹل ایجنسی</span>
        </h1>

        {/* Sub-heading */}
        <div className="mb-4">
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-gradient-gold">
            Build Your Digital Empire
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground mt-2">
            Zero Investment →{" "}
            <span className="text-primary font-bold">$200–$800+</span> Monthly
            Income
          </p>
        </div>

        {/* Description */}
        <p
          className="max-w-2xl mx-auto text-muted-foreground text-base sm:text-lg mb-3 leading-relaxed"
          dir="rtl"
        >
          YouTube, Facebook, Instagram, TikTok, Twitter (X), LinkedIn + 20 سوشل
          پلیٹ فارمز پر حلال، مستقل انٹرنیشنل کمائی – زیرو سے مونیٹائزڈ اکاؤنٹ
          تک مکمل سیٹ اپ
        </p>

        <p className="max-w-xl mx-auto text-muted-foreground text-sm mb-8">
          100+ Active Clients • 500+ Videos Created • 80% Monetized in 3 Months
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            data-ocid="hero.primary_button"
            onClick={onOrderClick}
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold px-10 py-6 text-lg rounded-xl glow-green pulse-glow transition-all transform hover:scale-105"
          >
            <Zap className="w-5 h-5 mr-2" />
            ابھی آرڈر کریں
          </Button>
          <Button
            data-ocid="hero.secondary_button"
            variant="outline"
            size="lg"
            onClick={() => {
              const el = document.querySelector("#services");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            className="border-primary/40 text-primary hover:bg-primary/10 font-bold px-10 py-6 text-lg rounded-xl transition-all"
          >
            تفصیل دیکھیں
            <ChevronDown className="w-5 h-5 ml-2" />
          </Button>
        </div>

        {/* Trust badges */}
        <div className="mt-12 flex flex-wrap gap-3 justify-center">
          {[
            "✅ No Hidden Charges",
            "⚡ 24/7 Support",
            "🔒 Algorithm Safe",
            "🌍 USA/EU IPs",
            "♾️ Lifetime Benefits",
          ].map((badge) => (
            <span
              key={badge}
              className="px-3 py-1.5 glass-card rounded-full text-xs sm:text-sm text-muted-foreground font-medium"
            >
              {badge}
            </span>
          ))}
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 animate-bounce">
          <ChevronDown className="w-5 h-5 text-primary/60" />
          <ChevronDown className="w-4 h-4 text-primary/30" />
        </div>
      </div>
    </section>
  );
}
