import { Heart } from "lucide-react";

const socialLinks = [
  { label: "YouTube", icon: "▶️", href: "#" },
  { label: "Facebook", icon: "📘", href: "#" },
  { label: "Instagram", icon: "📸", href: "#" },
  { label: "TikTok", icon: "🎵", href: "#" },
  { label: "WhatsApp", icon: "💬", href: "https://wa.me/923164971661" },
  { label: "Telegram", icon: "✈️", href: "#" },
];

const footerLinks = [
  { label: "Services", href: "#services" },
  { label: "Pricing", href: "#pricing" },
  { label: "Reviews", href: "#testimonials" },
  { label: "Contact", href: "#contact" },
];

export default function Footer() {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";
  const caffeineUrl = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`;

  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="relative pt-16 pb-8 mt-8">
      {/* Top border gradient */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      {/* Background */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, transparent 0%, oklch(0.06 0.01 265) 50%)",
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/40 flex items-center justify-center">
                <span className="text-sm font-black text-gradient-green">
                  C
                </span>
              </div>
              <span className="font-display text-xl font-black">
                <span className="text-gradient-green">Code</span>
                <span className="text-foreground">PayOn</span>
              </span>
            </div>
            <p
              className="text-muted-foreground text-sm leading-relaxed"
              dir="rtl"
            >
              پاکستان کی نمبر 1 ڈیجیٹل ایجنسی – مکمل سوشل میڈیا گروتھ اور لائف
              ٹائم کمائی کی سروسز
            </p>
            <p className="text-muted-foreground text-sm mt-2">
              Your Digital Future is Secure – Low Investment, Lifetime Benefits!
              🇵🇰
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-bold text-foreground mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.label}>
                  <button
                    type="button"
                    onClick={() => scrollTo(link.href)}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    → {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-bold text-foreground mb-4">
              Contact
            </h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>📧 codepayon@gmail.com</p>
              <p>📱 +92 316 4971661</p>
              <p>📱 +92 332 3449779</p>
              <p>💳 JazzCash: 03122000372</p>
              <p dir="rtl">👤 محمد سلیم خان (کینیڈا)</p>
            </div>

            {/* Social Icons */}
            <div className="flex gap-2 mt-4">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target={s.href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  title={s.label}
                  className="w-9 h-9 rounded-lg glass-card flex items-center justify-center text-base hover:scale-110 transition-all hover:border-primary/40"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-border mb-6" />

        {/* Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <p>
              © {year}{" "}
              <span className="text-primary font-medium">
                CodePayOn Digital Agency
              </span>
              . All rights reserved.
            </p>
            <a
              href="/admin"
              data-ocid="footer.admin.link"
              className="text-muted-foreground/40 hover:text-muted-foreground transition-colors text-[10px]"
            >
              Admin
            </a>
          </div>
          <p className="flex items-center gap-1">
            Built with{" "}
            <Heart className="w-3 h-3 text-red-400 fill-red-400 inline-block mx-0.5" />{" "}
            using{" "}
            <a
              href={caffeineUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline ml-0.5"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
