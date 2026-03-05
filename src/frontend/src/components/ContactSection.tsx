import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  CheckCircle2,
  Loader2,
  Mail,
  MessageCircle,
  Smartphone,
  User,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useSubmitInquiry } from "../hooks/useQueries";

const contactCards = [
  {
    type: "whatsapp",
    icon: "💬",
    label: "WhatsApp",
    value: "+92 316 4971661",
    action: () => window.open("https://wa.me/923164971661", "_blank"),
    color: "#25D366",
    badge: "Primary",
    dataOcid: "contact.whatsapp.primary_button",
  },
  {
    type: "whatsapp",
    icon: "💬",
    label: "WhatsApp",
    value: "+92 332 3449779",
    action: () => window.open("https://wa.me/923323449779", "_blank"),
    color: "#25D366",
    badge: "Secondary",
    dataOcid: "contact.whatsapp.secondary_button",
  },
  {
    type: "email",
    icon: "📧",
    label: "Email",
    value: "codepayon@gmail.com",
    action: () => window.open("mailto:codepayon@gmail.com", "_blank"),
    color: "#00B4FF",
    badge: "Main",
    dataOcid: "contact.email.primary_button",
  },
  {
    type: "email",
    icon: "📧",
    label: "Email",
    value: "freepremiumapplicationapk@gmail.com",
    action: () =>
      window.open("mailto:freepremiumapplicationapk@gmail.com", "_blank"),
    color: "#00B4FF",
    badge: "Alt",
    dataOcid: "contact.email.secondary_button",
  },
  {
    type: "jazzcash",
    icon: "💳",
    label: "JazzCash",
    value: "03122000372",
    action: () => {
      navigator.clipboard.writeText("03122000372");
      toast.success("JazzCash number copied!");
    },
    color: "#FFD700",
    badge: "Payment",
    dataOcid: "contact.jazzcash.button",
  },
  {
    type: "owner",
    icon: "👤",
    label: "Owner",
    value: "محمد سلیم خان (کینیڈا والا)",
    action: () => window.open("https://wa.me/923164971661", "_blank"),
    color: "#A855F7",
    badge: "CEO",
    dataOcid: "contact.owner.button",
  },
];

export default function ContactSection() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const { mutateAsync: submitInquiry, isPending } = useSubmitInquiry();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !message) {
      toast.error("براہ کرم تمام فیلڈز پُر کریں");
      return;
    }
    try {
      await submitInquiry({ name, phone, message });
      setSubmitted(true);
      toast.success("پیغام موصول ہوا! جلد رابطہ کریں گے۔");
    } catch {
      toast.error("پیغام بھیجنے میں خرابی – دوبارہ کوشش کریں");
    }
  };

  return (
    <section id="contact" className="py-16 sm:py-24 relative">
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at bottom center, oklch(0.15 0.04 145 / 0.2) 0%, transparent 70%)",
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card mb-4">
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">
              Get In Touch
            </span>
          </div>
          <h2
            className="font-display text-3xl sm:text-4xl font-black mb-3"
            dir="rtl"
          >
            📞 رابطہ کریں –{" "}
            <span className="text-gradient-green">فوری شروعات</span>
          </h2>
          <p
            className="text-muted-foreground max-w-xl mx-auto text-sm"
            dir="rtl"
          >
            آج ہی رابطہ کریں اور اپنا ڈیجیٹل سفر شروع کریں – 24 گھنٹے میں جواب
            ملے گا
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-5xl mx-auto">
          {/* Contact Cards */}
          <div>
            <h3 className="font-display text-xl font-bold text-foreground mb-6 flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-primary" />
              Direct Contact
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {contactCards.map((card) => (
                <button
                  type="button"
                  key={card.dataOcid}
                  data-ocid={card.dataOcid}
                  onClick={card.action}
                  className="glass-card rounded-xl p-4 text-left hover:scale-105 transition-all duration-200 group w-full"
                  style={{ borderColor: `${card.color}20` }}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-xl flex-shrink-0 group-hover:scale-110 transition-transform"
                      style={{
                        background: `${card.color}15`,
                        border: `1px solid ${card.color}30`,
                      }}
                    >
                      {card.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span
                          className="text-xs font-medium"
                          style={{ color: card.color }}
                        >
                          {card.label}
                        </span>
                        <span
                          className="text-[10px] px-1.5 py-0.5 rounded-full font-bold"
                          style={{
                            background: `${card.color}15`,
                            color: card.color,
                          }}
                        >
                          {card.badge}
                        </span>
                      </div>
                      <p
                        className="text-sm text-foreground font-medium truncate"
                        dir={card.type === "owner" ? "rtl" : "ltr"}
                      >
                        {card.value}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Quick WhatsApp */}
            <div
              className="mt-6 p-4 glass-card rounded-xl"
              style={{ borderColor: "#25D36630" }}
            >
              <p className="text-sm text-muted-foreground mb-3" dir="rtl">
                💳 JazzCash سے پیمنٹ کریں اور WhatsApp پر screenshot بھیجیں
              </p>
              <Button
                onClick={() =>
                  window.open("https://wa.me/923164971661", "_blank")
                }
                className="w-full font-bold"
                style={{ background: "#25D366", color: "#0a0a0a" }}
                data-ocid="contact.primary_button"
              >
                <span className="mr-2">💬</span>
                WhatsApp پر ابھی بات کریں
              </Button>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h3 className="font-display text-xl font-bold text-foreground mb-6 flex items-center gap-2">
              <Mail className="w-5 h-5 text-primary" />
              Quick Message
            </h3>

            {submitted ? (
              <div className="glass-card rounded-2xl p-8 text-center">
                <CheckCircle2 className="w-14 h-14 text-primary mx-auto mb-4 animate-bounce" />
                <h4
                  className="font-display text-xl font-bold text-foreground mb-2"
                  dir="rtl"
                >
                  پیغام موصول ہوا! ✅
                </h4>
                <p className="text-muted-foreground text-sm mb-4" dir="rtl">
                  ہم 24 گھنٹے میں آپ سے رابطہ کریں گے
                </p>
                <Button
                  variant="outline"
                  className="border-primary/40 text-primary"
                  onClick={() => setSubmitted(false)}
                >
                  نیا پیغام بھیجیں
                </Button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="glass-card rounded-2xl p-6 space-y-4"
              >
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-primary" />
                    آپ کا نام *
                  </Label>
                  <Input
                    data-ocid="contact.name.input"
                    placeholder="مثلاً: محمد احمد"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="bg-input border-border focus:border-primary/60"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Smartphone className="w-3.5 h-3.5 text-primary" />
                    فون / WhatsApp *
                  </Label>
                  <Input
                    data-ocid="contact.phone.input"
                    placeholder="+92 xxx xxxxxxx"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="bg-input border-border focus:border-primary/60"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <MessageCircle className="w-3.5 h-3.5 text-primary" />
                    پیغام *
                  </Label>
                  <Textarea
                    data-ocid="contact.message.textarea"
                    placeholder="آپ کو کس چیز میں مدد چاہیے؟"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    rows={4}
                    className="bg-input border-border focus:border-primary/60 resize-none"
                    dir="rtl"
                  />
                </div>

                <Button
                  type="submit"
                  data-ocid="contact.submit_button"
                  disabled={isPending}
                  className="w-full bg-primary text-primary-foreground font-bold glow-green"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      بھیج رہے ہیں...
                    </>
                  ) : (
                    "پیغام بھیجیں →"
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
