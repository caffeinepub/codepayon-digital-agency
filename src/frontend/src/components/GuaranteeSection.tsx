import { CheckCircle2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const guarantees = [
  {
    icon: "✅",
    title: "No Hidden Charges",
    titleUrdu: "کوئی چھپی فیس نہیں",
    desc: "جو قیمت بتائی وہی لیں گے – کوئی اضافی چارج نہیں",
    color: "#00C851",
  },
  {
    icon: "⚡",
    title: "24/7 WhatsApp Support",
    titleUrdu: "چوبیس گھنٹے سپورٹ",
    desc: "رات دن WhatsApp اور Call پر مکمل سپورٹ",
    color: "#25D366",
  },
  {
    icon: "🤖",
    title: "Daily AI Guidance",
    titleUrdu: "روزانہ AI گائیڈنس",
    desc: "روزانہ آرٹیفیشل انٹیلیجنس ٹپس اور گائیڈنس",
    color: "#00B4FF",
  },
  {
    icon: "👥",
    title: "100+ Active Clients",
    titleUrdu: "100+ فعال کلائنٹس",
    desc: "ہمارے ساتھ 100+ کلائنٹس کامیابی سے کام کر رہے ہیں",
    color: "#FFD700",
  },
  {
    icon: "🇨🇦",
    title: "Canada-based Expertise",
    titleUrdu: "کینیڈا والی مہارت",
    desc: "محمد سلیم خان کی زیرنگرانی Canada-based expertise",
    color: "#FF6B35",
  },
  {
    icon: "🛡️",
    title: "Halal & Algorithm Safe",
    titleUrdu: "حلال اور الگورتھم سیف",
    desc: "قانونی، حلال اور 100% platform-safe طریقے",
    color: "#A855F7",
  },
];

interface GuaranteeCardProps {
  icon: string;
  title: string;
  titleUrdu: string;
  desc: string;
  color: string;
  index: number;
}

function GuaranteeCard({
  icon,
  title,
  titleUrdu,
  desc,
  color,
  index,
}: GuaranteeCardProps) {
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

  return (
    <div
      ref={ref}
      className={`glass-card rounded-2xl p-5 group hover:scale-105 transition-all duration-500 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
      style={{
        transitionDelay: `${index * 0.08}s`,
        borderColor: `${color}20`,
      }}
    >
      <div className="flex items-start gap-4">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-110 transition-transform"
          style={{ background: `${color}15`, border: `1px solid ${color}30` }}
        >
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h3 className="font-display text-sm font-bold text-foreground">
              {title}
            </h3>
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color }} />
          </div>
          <p className="text-xs font-medium mb-1" style={{ color }} dir="rtl">
            {titleUrdu}
          </p>
          <p
            className="text-xs text-muted-foreground leading-relaxed"
            dir="rtl"
          >
            {desc}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function GuaranteeSection() {
  return (
    <section className="py-16 sm:py-20 relative">
      {/* Background */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, transparent 0%, oklch(0.10 0.02 145 / 0.3) 50%, transparent 100%)",
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card mb-4">
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">
              Our Guarantee
            </span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-black mb-3">
            <span className="text-gradient-green">گارنٹیڈ</span>{" "}
            <span className="text-foreground">پالیسی + سپورٹ</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm">
            We are 90% cheaper, 200% more supportive – Better than Market Pro
            ($1,000+/month)
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {guarantees.map((g, i) => (
            <GuaranteeCard key={g.title} {...g} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
