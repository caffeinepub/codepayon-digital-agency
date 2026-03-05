import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Testimonial } from "../backend.d";
import { useApprovedTestimonials } from "../hooks/useQueries";

const staticTestimonials: Testimonial[] = [
  {
    id: 1n,
    name: "احمد خان – لاہور",
    review:
      "کمال سروس ہے! YouTube چینل صرف 2 مہینے میں مونیٹائزڈ ہو گیا۔ محمد سلیم بھائی نے پوری مدد کی اور ہر قدم پر گائیڈ کیا۔ بہت شکریہ!",
    rating: 5n,
    service: "Social Media Setup + Monetization",
    approved: true,
  },
  {
    id: 2n,
    name: "فاطمہ علی – کراچی",
    review:
      "Canva Pro Lifetime خریدا صرف PKR 3,000 میں – مارکیٹ میں یہی PKR 50,000 سے زیادہ کا ہے! بہترین ڈیل۔ ہر کوئی لے لو!",
    rating: 5n,
    service: "Lifetime Premium Tools",
    approved: true,
  },
  {
    id: 3n,
    name: "محمد عمر – اسلام آباد",
    review:
      "پہلے ہفتے میں 10,000 organic views آئے! USA/EU IPs سے real views تھیں۔ چینل کو کوئی مسئلہ نہیں ہوا۔ ماشاء اللہ!",
    rating: 5n,
    service: "100% Human Organic Growth",
    approved: true,
  },
  {
    id: 4n,
    name: "زینب ملک – فیصل آباد",
    review:
      "TikTok اور Instagram دونوں پر مونیٹائزیشن مل گئی۔ ٹیم نے 24/7 مدد کی اور ہر سوال کا جواب دیا۔ بہترین سروس!",
    rating: 5n,
    service: "Social Media Setup + Monetization",
    approved: true,
  },
  {
    id: 5n,
    name: "بلال حسین – ملتان",
    review:
      "USA WhatsApp نمبر ملا اور ڈیجیٹل مارکیٹنگ سیٹ اپ ہوا۔ اب ماہانہ $400+ کما رہا ہوں۔ سب سے بہتر انویسٹمنٹ!",
    rating: 4n,
    service: "WhatsApp + Digital Marketing",
    approved: true,
  },
  {
    id: 6n,
    name: "سارہ قریشی – پشاور",
    review:
      "Netflix Lifetime اور ChatGPT+ صرف PKR 3,000 میں؟ پہلے یقین نہیں آیا مگر سب کچھ سچ نکلا! کمال کی سروس ہے۔",
    rating: 5n,
    service: "Lifetime Premium Tools",
    approved: true,
  },
];

function StarRating({ rating }: { rating: bigint }) {
  const stars = Number(rating);
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`w-4 h-4 ${s <= stars ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"}`}
        />
      ))}
    </div>
  );
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="testimonial-card glass-card rounded-2xl p-6 h-full flex flex-col">
      {/* Stars */}
      <div className="mb-3">
        <StarRating rating={testimonial.rating} />
      </div>

      {/* Review */}
      <blockquote
        className="flex-1 text-sm text-muted-foreground leading-relaxed mb-4"
        dir="rtl"
      >
        "{testimonial.review}"
      </blockquote>

      {/* Footer */}
      <div className="border-t border-border pt-3 flex items-center justify-between">
        <div>
          <div
            className="font-display text-sm font-bold text-foreground"
            dir="rtl"
          >
            {testimonial.name}
          </div>
          <div className="text-xs text-primary mt-0.5">
            {testimonial.service}
          </div>
        </div>
        <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-lg">
          👤
        </div>
      </div>
    </div>
  );
}

export default function TestimonialsSection() {
  const { data: backendTestimonials, isLoading } = useApprovedTestimonials();
  const testimonials =
    backendTestimonials && backendTestimonials.length > 0
      ? backendTestimonials
      : staticTestimonials;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const itemsPerView = 3;
  const maxIndex = Math.max(0, testimonials.length - itemsPerView);

  const goNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
    setTimeout(() => setIsAnimating(false), 400);
  };

  const goPrev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
    setTimeout(() => setIsAnimating(false), 400);
  };

  // Auto-play
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 5000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [maxIndex]);

  const visibleTestimonials = testimonials.slice(
    currentIndex,
    currentIndex + itemsPerView,
  );

  return (
    <section
      id="testimonials"
      className="py-16 sm:py-24 relative overflow-hidden"
    >
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card mb-4">
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">
              Client Reviews
            </span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-black mb-3">
            <span className="text-foreground">کیا کہتے ہیں ہمارے</span>{" "}
            <span className="text-gradient-green">کلائنٹس</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm">
            Real clients, real results. 100+ active clients can't be wrong.
          </p>
        </div>

        {isLoading ? (
          <div
            data-ocid="testimonials.loading_state"
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-card rounded-2xl p-6 space-y-3">
                <Skeleton className="h-4 w-24 bg-muted/50" />
                <Skeleton className="h-20 w-full bg-muted/50" />
                <Skeleton className="h-4 w-32 bg-muted/50" />
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Carousel */}
            <div data-ocid="testimonials.list" className="relative">
              <div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 transition-all duration-400"
                style={{ opacity: isAnimating ? 0.7 : 1 }}
              >
                {visibleTestimonials.map((t) => (
                  <TestimonialCard key={t.id.toString()} testimonial={t} />
                ))}
              </div>

              {/* Navigation */}
              {testimonials.length > itemsPerView && (
                <div className="flex items-center justify-center gap-4 mt-8">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={goPrev}
                    disabled={currentIndex === 0}
                    data-ocid="testimonials.pagination_prev"
                    className="rounded-full border-primary/30 hover:bg-primary/10 hover:border-primary/60 disabled:opacity-30"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>

                  {/* Dots */}
                  <div className="flex gap-1.5">
                    {Array.from({ length: maxIndex + 1 }).map((_, i) => (
                      <button
                        // biome-ignore lint/suspicious/noArrayIndexKey: position-based dots navigation
                        key={i}
                        type="button"
                        onClick={() => setCurrentIndex(i)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          i === currentIndex
                            ? "bg-primary w-6"
                            : "bg-muted-foreground/30 hover:bg-muted-foreground/60"
                        }`}
                      />
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={goNext}
                    disabled={currentIndex >= maxIndex}
                    data-ocid="testimonials.pagination_next"
                    className="rounded-full border-primary/30 hover:bg-primary/10 hover:border-primary/60 disabled:opacity-30"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          </>
        )}

        {/* Overall rating */}
        <div className="mt-10 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 glass-card rounded-full">
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className="w-4 h-4 fill-yellow-400 text-yellow-400"
                />
              ))}
            </div>
            <span className="text-sm font-bold text-foreground">4.9/5</span>
            <span className="text-muted-foreground text-sm">
              from 100+ clients
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
