import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, Loader2, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { usePlaceOrder } from "../hooks/useQueries";

interface OrderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preSelectedService: string;
}

const serviceOptions = [
  "Social Media Setup + Monetization (PKR 5,000)",
  "Copyright-Free Videos + Text-to-Video (PKR 1,000/video)",
  "100% Human Organic Growth USA/EU (From PKR 2)",
  "WhatsApp + Digital Marketing (PKR 3,000 Lifetime)",
  "Lifetime Premium Tools (PKR 3,000 Lifetime)",
  "Full Digital Marketing Package",
];

export default function OrderModal({
  open,
  onOpenChange,
  preSelectedService,
}: OrderModalProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [service, setService] = useState(preSelectedService || "");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const { mutateAsync: placeOrder, isPending } = usePlaceOrder();

  // Sync preSelectedService when modal opens
  const handleOpenChange = (val: boolean) => {
    if (val) {
      setService(preSelectedService || "");
      setSubmitted(false);
    } else {
      // Reset on close
      setTimeout(() => {
        setName("");
        setPhone("");
        setWhatsapp("");
        setService("");
        setMessage("");
        setSubmitted(false);
      }, 300);
    }
    onOpenChange(val);
  };

  const openWhatsAppOrder = (
    n: string,
    p: string,
    wa: string,
    svc: string,
    msg: string,
  ) => {
    const text = encodeURIComponent(
      `🛒 نیا آرڈر!\nنام: ${n}\nفون: ${p}\nWhatsApp: ${wa || p}\nسروس: ${svc}\nپیغام: ${msg || "—"}`,
    );
    window.open(`https://wa.me/923164971661?text=${text}`, "_blank");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !service) {
      toast.error("براہ کرم تمام ضروری فیلڈز پُر کریں");
      return;
    }
    try {
      await placeOrder({ name, phone, whatsapp, service, message });
      setSubmitted(true);
      toast.success(
        "آپ کا آرڈر محفوظ ہو گیا! WhatsApp پر بھی پیغام بھیجا جا رہا ہے۔",
      );
      // Slight delay so toast shows before browser opens WhatsApp
      setTimeout(
        () => openWhatsAppOrder(name, phone, whatsapp, service, message),
        800,
      );
    } catch {
      toast.error("آرڈر بھیجنے میں خرابی – دوبارہ کوشش کریں");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        data-ocid="order.dialog"
        className="sm:max-w-md bg-card border-border max-h-[90vh] overflow-y-auto"
      >
        <DialogHeader>
          <DialogTitle className="font-display text-xl font-black text-foreground flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-primary" />
            آرڈر فارم
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            تمام فیلڈز پُر کریں – ہم 24 گھنٹے میں رابطہ کریں گے
          </DialogDescription>
        </DialogHeader>

        {submitted ? (
          <div data-ocid="order.success_state" className="py-10 text-center">
            <CheckCircle2 className="w-16 h-16 text-primary mx-auto mb-4 animate-bounce" />
            <h3 className="font-display text-2xl font-bold text-foreground mb-2">
              آرڈر موصول ہوا! ✅
            </h3>
            <p className="text-muted-foreground mb-2">
              آپ کا آرڈر کامیابی سے رجسٹر ہو گیا ہے۔
            </p>
            <p className="text-sm text-primary font-medium mb-6">
              ہم جلد WhatsApp یا Call کے ذریعے رابطہ کریں گے۔
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                variant="outline"
                className="border-primary/40 text-primary hover:bg-primary/10"
                onClick={() =>
                  window.open("https://wa.me/923164971661", "_blank")
                }
              >
                WhatsApp پر رابطہ
              </Button>
              <Button
                className="bg-primary text-primary-foreground"
                onClick={() => handleOpenChange(false)}
              >
                بند کریں
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div className="space-y-1.5">
              <Label
                htmlFor="order-name"
                className="text-sm font-medium text-foreground"
              >
                آپ کا نام <span className="text-destructive">*</span>
              </Label>
              <Input
                id="order-name"
                data-ocid="order.name.input"
                placeholder="مثلاً: محمد احمد"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="bg-input border-border focus:border-primary/60"
              />
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <Label
                htmlFor="order-phone"
                className="text-sm font-medium text-foreground"
              >
                فون نمبر <span className="text-destructive">*</span>
              </Label>
              <Input
                id="order-phone"
                data-ocid="order.phone.input"
                placeholder="+92 xxx xxxxxxx"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="bg-input border-border focus:border-primary/60"
              />
            </div>

            {/* WhatsApp */}
            <div className="space-y-1.5">
              <Label
                htmlFor="order-whatsapp"
                className="text-sm font-medium text-foreground"
              >
                واٹس ایپ نمبر
              </Label>
              <Input
                id="order-whatsapp"
                data-ocid="order.whatsapp.input"
                placeholder="+92 xxx xxxxxxx (اگر فون سے مختلف ہو)"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="bg-input border-border focus:border-primary/60"
              />
            </div>

            {/* Service */}
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-foreground">
                سروس منتخب کریں <span className="text-destructive">*</span>
              </Label>
              <Select value={service} onValueChange={setService} required>
                <SelectTrigger
                  data-ocid="order.service.select"
                  className="bg-input border-border"
                >
                  <SelectValue placeholder="سروس چُنیں..." />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  {serviceOptions.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Message */}
            <div className="space-y-1.5">
              <Label
                htmlFor="order-message"
                className="text-sm font-medium text-foreground"
              >
                پیغام (اختیاری)
              </Label>
              <Textarea
                id="order-message"
                data-ocid="order.message.textarea"
                placeholder="کوئی خاص ہدایات یا سوالات..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                className="bg-input border-border focus:border-primary/60 resize-none"
              />
            </div>

            {/* Submit */}
            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1 border-border"
                onClick={() => handleOpenChange(false)}
                data-ocid="order.cancel_button"
              >
                منسوخ
              </Button>
              <Button
                type="submit"
                data-ocid="order.submit_button"
                disabled={isPending}
                className="flex-1 bg-primary text-primary-foreground font-bold glow-green"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    بھیج رہے ہیں...
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    آرڈر بھیجیں
                  </>
                )}
              </Button>
            </div>

            <p className="text-xs text-muted-foreground text-center pt-1">
              📞 فوری رابطہ: +92 316 4971661 (WhatsApp)
            </p>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
