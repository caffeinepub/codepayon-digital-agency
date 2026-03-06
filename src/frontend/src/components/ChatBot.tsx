import { useCallback, useEffect, useRef, useState } from "react";
import { useAddTestimonial } from "../hooks/useQueries";

// ── Constants ──────────────────────────────────────────────────────
const OWNER_WA = "923164971661";
const SOFIA_IMG = "/assets/generated/sofia-chatbot.dim_400x400.jpg";
const SOFIA_NAME = "Sofia Saleem";

const KB = {
  wa1: "+92 316 4971661",
  wa2: "+92 332 3449779",
  email: "codepayon@gmail.com",
  jazzcash: "03122000372",
  owner: "Muhammad Saleem Khan (Canada)",
};

// ── Language types ─────────────────────────────────────────────────
type Lang = "ur" | "en" | "hi" | "ar";

interface LangOption {
  code: Lang;
  flag: string;
  label: string;
  greeting: string;
}

const LANG_OPTIONS: LangOption[] = [
  {
    code: "ur",
    flag: "🇵🇰",
    label: "اردو",
    greeting: `السلام علیکم! مجھے خوشی ہے کہ آپ نے اردو کا انتخاب کیا 😊\n\nمیں ${SOFIA_NAME} ہوں — CodePayOn Digital Agency کی سینئر ڈیجیٹل اسسٹنٹ 💫\n\nآپ کسی بھی سروس، قیمت، آرڈر، یا کسی بھی چیز کے بارے میں سوال پوچھ سکتے ہیں!\n\nیاد رہے: ہمارے 100+ خوش کلائنٹس ماہانہ $200-$800 کما رہے ہیں! 🚀\n\nکیا جاننا چاہتے ہیں؟ 👇`,
  },
  {
    code: "en",
    flag: "🇬🇧",
    label: "English",
    greeting: `Welcome! Great to have you here! 😊\n\nI'm ${SOFIA_NAME} — Senior Digital Assistant at CodePayOn Digital Agency! 💫\n\nFun fact: Our 100+ happy clients are earning $200-$800+ monthly from their social media! 🚀\n\nAsk me anything about services, prices, orders, or anything else!\n\nWhat would you like to know? 👇`,
  },
  {
    code: "hi",
    flag: "🇮🇳",
    label: "हिंदी",
    greeting: `नमस्ते! हिंदी चुनने के लिए धन्यवाद 😊\n\nमैं ${SOFIA_NAME} हूं — CodePayOn की सीनियर डिजिटल असिस्टेंट 💫\n\nहमारे 100+ खुश ग्राहक हर महीने $200-$800 कमा रहे हैं! 🚀\n\nकुछ भी पूछें — सेवाएं, कीमतें, ऑर्डर!\n\nआप क्या जानना चाहते हैं? 👇`,
  },
  {
    code: "ar",
    flag: "🇸🇦",
    label: "العربية",
    greeting: `أهلاً وسهلاً! شكراً لاختيار العربية 😊\n\nأنا ${SOFIA_NAME} — المساعدة الرقمية الأولى في CodePayOn 💫\n\nعملاؤنا الـ 100+ يكسبون 200-800 دولار شهرياً! 🚀\n\nاسألوني عن أي شيء — الخدمات، الأسعار، الطلبات!\n\nماذا تريدون معرفته؟ 👇`,
  },
];

// ── Chip suggestions per language ─────────────────────────────────
function getChips(lang: Lang) {
  if (lang === "ur")
    return [
      { label: "💰 قیمتیں بتائیں", q: "قیمتیں کیا ہیں؟" },
      { label: "🛒 آرڈر کیسے کریں", q: "آرڈر کیسے کریں؟" },
      { label: "✅ گارنٹی کیا ہے", q: "گارنٹی کیا ہے؟" },
      { label: "💵 کتنا کما سکتے ہیں", q: "کتنا کما سکتے ہیں؟" },
      { label: "📱 رابطہ کریں", q: "رابطہ کا طریقہ بتائیں" },
      { label: "🎥 ویڈیو سروس", q: "ویڈیو سروس کیا ہے؟" },
      { label: "🚀 یوٹیوب مونیٹائز", q: "یوٹیوب مونیٹائزیشن کیا ہے؟" },
      { label: "🤔 کون سا پیکج لوں", q: "مجھے کون سا پیکج لینا چاہیے؟" },
    ];
  if (lang === "hi")
    return [
      { label: "💰 कीमतें बताएं", q: "कीमतें क्या हैं?" },
      { label: "🛒 ऑर्डर कैसे करें", q: "ऑर्डर कैसे करें?" },
      { label: "✅ गारंटी क्या है", q: "गारंटी क्या है?" },
      { label: "💵 कितना कमा सकते हैं", q: "कितना कमा सकते हैं?" },
      { label: "📱 संपर्क करें", q: "संपर्क कैसे करें?" },
    ];
  if (lang === "ar")
    return [
      { label: "💰 الأسعار", q: "ما هي الأسعار؟" },
      { label: "🛒 كيف أطلب", q: "كيف أطلب الخدمة؟" },
      { label: "✅ الضمان", q: "ما هو الضمان؟" },
      { label: "💵 كم يمكن الكسب", q: "كم يمكن الكسب؟" },
      { label: "📱 تواصل معنا", q: "كيف أتواصل معكم؟" },
    ];
  // English default
  return [
    { label: "💰 Prices", q: "What are your prices?" },
    { label: "🛒 How to Order", q: "How do I place an order?" },
    { label: "✅ Guarantee", q: "What is your guarantee?" },
    { label: "💵 How Much Can I Earn", q: "How much can I earn?" },
    { label: "📱 Contact", q: "How can I contact you?" },
    { label: "🎥 Videos", q: "Tell me about video services" },
    { label: "🚀 YouTube", q: "YouTube monetization service" },
    { label: "🤔 Which Package", q: "Which package should I choose?" },
  ];
}

// ── Knowledge-base response engine ────────────────────────────────
// Returns { text, showWA } so we can control WhatsApp CTA precisely
function getResponse(
  msg: string,
  lang: Lang,
): { text: string; showWA: boolean } {
  const q = msg.toLowerCase();

  // Helper: wrap in result shape
  function r(text: string, showWA = false): { text: string; showWA: boolean } {
    return { text, showWA };
  }

  // ── URDU ─────────────────────────────────────────────────────────
  if (lang === "ur") {
    // Scam / real / trust doubts
    if (q.match(/فراڈ|scam|جھوٹ|اصلی|real|fake|trust|بھروسہ|یقین|کیا سچ/))
      return r(
        `بالکل اصلی! 💯\n\nمیں ${SOFIA_NAME} آپ کو یقین دلاتی ہوں:\n\n✅ 100+ فعال کلائنٹس — آپ چاہیں تو ہم آپ کو پرانے کلائنٹس سے بات کروا سکتے ہیں\n✅ Muhammad Saleem Khan کینیڈا سے کام کرتے ہیں — ہر کلائنٹ کو ذاتی توجہ\n✅ 3 سال سے زیادہ کا تجربہ\n✅ JazzCash سے محفوظ ادائیگی — کام مکمل ہونے پر\n✅ کوئی advance payment کا دباؤ نہیں\n\n🏆 ہمارے کلائنٹس کے reviews ہماری ویب سائٹ پر موجود ہیں!\n\nکیا آپ ہمارے کسی پرانے کلائنٹ سے بات کرنا چاہیں گے؟`,
        true,
      );

    // Expensive / can't afford
    if (q.match(/مہنگا|مہنگی|afford|بجٹ|کم پیسے|غریب|پیسے نہیں/))
      return r(
        "میں سمجھتی ہوں آپ کی بات، لیکن ذرا سوچیں 🤔\n\nPKR 5,000 لگائیں → ماہانہ PKR 50,000-80,000 کمائیں!\n\n📊 ROI حساب:\n• سرمایہ: صرف PKR 5,000\n• مہینہ 1: $200 = PKR 56,000\n• مہینہ 3: $400-$800 = PKR 112,000-224,000\n\n🤯 یہ ایک بار کی انویسٹمنٹ ہے — لائف ٹائم کمائی!\n\nمارکیٹ میں یہی سروس PKR 40,000-150,000 میں ملتی ہے۔ ہم 90% سستے ہیں!\n\n⚡ یہ آفر محدود وقت کے لیے ہے — آج ہی فیصلہ کریں!\n\nکیا میں آپ کو ابھی Muhammad Saleem Khan سے ملاؤں؟",
        true,
      );

    // Will think about it / maybe later
    if (q.match(/سوچتا|سوچوں گا|سوچتی|بعد میں|later|think|maybe/))
      return r(
        "بالکل! لیکن کیا میں آپ کو ایک بات بتا سکتی ہوں؟ 😊\n\nہر دن جو آپ انتظار کرتے ہیں، آپ کا حریف آگے بڑھ رہا ہے!\n\n⏳ ہمارے کلائنٹس جنہوں نے آج فیصلہ کیا:\n• 3 مہینے بعد → YouTube مونیٹائزڈ\n• 6 مہینے بعد → $400-$800/ماہ کمائی\n• 1 سال بعد → مکمل آنلائن کاروبار\n\n🎯 آج آرڈر کریں، کل سے کمائی شروع!\n\nصرف یہ بتائیں — آپ کا مقصد YouTube سے کمائی ہے یا سوشل میڈیا گروتھ؟ میں آپ کے لیے بہترین پیکج suggest کروں گی! 💫",
        false,
      );

    // Which package to choose
    if (q.match(/کون سا پیکج|کیا لوں|کس سروس|suggest|recommend|بتائیں کیا/))
      return r(
        "بہت اچھا سوال! 😊 مجھے بتائیں آپ کا مقصد کیا ہے:\n\n🎯 آپ کا مقصد بتائیں:\n\n1️⃣ YouTube سے ماہانہ کمائی چاہیے\n   → Social Media Setup (PKR 5,000) + Organic Growth\n\n2️⃣ سوشل میڈیا followers بڑھانے ہیں\n   → Organic Growth + Premium Tools (PKR 6,000 combo)\n\n3️⃣ AI ٹولز اور پریمیم سبسکرپشنز چاہیے\n   → Premium Tools Pack (PKR 3,000 صرف!)\n\n4️⃣ مکمل ڈیجیٹل موجودگی چاہیے\n   → Full Package (سب سے بہترین value!)\n\n🏆 سب سے مقبول: Social Media Setup + Organic Growth combo!\n\nآپ کا مقصد کیا ہے؟ میں آپ کے لیے personalized plan بناؤں گی! 💫",
        false,
      );

    // Greetings
    if (q.match(/ہیلو|سلام|ہائے|hello|hi |hey|آداب|مرحبا/))
      return r(
        `السلام علیکم! 👋\n\nمیں ${SOFIA_NAME} ہوں — آپ کی خدمت میں حاضر ہوں! 💫\n\nہمارے 100+ خوش کلائنٹس ماہانہ $200-$800 کما رہے ہیں — کیا آپ بھی یہ سفر شروع کرنا چاہتے ہیں؟\n\n💰 قیمتیں | 🌟 سروسز | 🛒 آرڈر | 📱 رابطہ`,
        false,
      );

    // Pricing
    if (q.match(/قیمت|price|ریٹ|rate|کتنا|cost|charges|فیس|مہنگ|سست/))
      return r(
        "💰 ہماری تمام سروسز کی قیمتیں:\n\n1️⃣ سوشل میڈیا سیٹ اپ + مونیٹائزیشن\n   ✦ صرف PKR 5,000 ⚡\n   ✦ مارکیٹ ریٹ: PKR 40,000-150,000!\n\n2️⃣ کاپی رائٹ فری ویڈیوز\n   ✦ PKR 1,000 فی 15 منٹ ویڈیو\n\n3️⃣ Organic Growth (100% Real)\n   ✦ Subscribers: PKR 20 | Likes/Views: PKR 2\n\n4️⃣ WhatsApp مارکیٹنگ\n   ✦ صرف PKR 3,000 (لائف ٹائم!)\n\n5️⃣ پریمیم ٹولز (ChatGPT+, Canva, Netflix)\n   ✦ صرف PKR 3,000 (لائف ٹائم!)\n\n✨ مارکیٹ سے 90% سستے ریٹس!\n⚡ یہ آفر محدود وقت کے لیے ہے!\n\nکون سی سروس آپ کو سب سے زیادہ پسند آئی؟ 😊",
        false,
      );

    // Social Media / YouTube / Monetize
    if (
      q.match(
        /سوشل میڈیا|یوٹیوب|youtube|facebook|tiktok|instagram|مونیٹائز|monetize|چینل|channel/,
      )
    )
      return r(
        "📱 سوشل میڈیا + مونیٹائزیشن پیکج — PKR 5,000\n\nاس پیکج میں شامل ہے:\n✅ YouTube, Facebook, Instagram, TikTok + 20 پلیٹ فارمز\n✅ مکمل SEO (Titles, Tags, Descriptions)\n✅ الگورتھم سیف سٹرکچر\n✅ مونیٹائزیشن گائیڈنس\n✅ 24/7 سپورٹ\n\n🏆 ہماری کامیابی:\n• 80% کلائنٹس 3 مہینے میں مونیٹائز!\n• ماہانہ $200-$800+ کمائی\n• 100+ خوش کلائنٹس\n\n💡 Smart Combo: اس کے ساتھ Organic Growth + Premium Tools لیں\n   صرف PKR 11,000 میں مکمل ڈیجیٹل empire!\n\nمارکیٹ ریٹ PKR 150,000+ → ہم صرف PKR 5,000! 🤯\n\n⚡ آج آرڈر کریں، کل سے کمائی شروع!\nکیا آپ ابھی شروع کرنا چاہتے ہیں؟",
        true,
      );

    // Videos
    if (q.match(/ویڈیو|video|کلپ|ریلز|reels|کنٹینٹ|content/))
      return r(
        "🎥 کاپی رائٹ فری ویڈیو سروس — PKR 1,000/ویڈیو\n\n✅ 15-30 منٹ Ready-to-Upload ویڈیوز\n✅ Text-to-Video سافٹ ویئر access\n✅ واچ ٹائم 10x بڑھانے کا فارمولہ\n\n📊 ہماری expertise:\n• 500+ ویڈیوز بنا چکے ہیں\n• InVideo, CapCut Pro tools included\n\n💡 Cross-sell tip: ویڈیوز + Organic Growth لیں\n   → views تیزی سے بڑھیں گے اور جلد مونیٹائز ہوں گے!\n\nضرور! نمونہ ویڈیو چاہیے؟ WhatsApp کریں! 😊",
        true,
      );

    // Organic Growth
    if (
      q.match(
        /گروتھ|growth|سبسکرائبر|subscriber|لائیک|like|ویو|view|فالور|follower|بڑھانا/,
      )
    )
      return r(
        "🚀 Organic Growth — 100% Real Humans\n\n📊 ریٹ لسٹ:\n• Subscribers: PKR 20 فی\n• Likes: PKR 2 فی\n• Views: PKR 2 فی\n• Comments: PKR 5 فی\n• Shares: PKR 10 فی\n\n🌍 ٹریفک:\n• USA, Canada, Europe کے اصلی لوگ\n• Phased delivery (الگورتھم سیف)\n\n💡 یاد رکھیں: Subscribers بڑھیں گے تو YouTube جلد مونیٹائز ہوگا!\nSocial Media Setup + Organic Growth combo = تیز ترین راستہ! 🚀\n\nمارکیٹ ریٹ PKR 30,000/ماہ — ہم 80% سستے! ✨\n\nکتنے subscribers چاہیے؟ بتائیں، میں plan بناتی ہوں!",
        false,
      );

    // Tools
    if (
      q.match(
        /ٹولز|tool|canva|netflix|chatgpt|grok|disney|capcut|invideo|ai tools/,
      )
    )
      return r(
        "💻 لائف ٹائم پریمیم ٹولز — صرف PKR 3,000\n\n🤖 AI ٹولز:\n• ChatGPT Plus\n• Grok AI\n• InVideo (Text-to-Video)\n\n🎨 ڈیزائن:\n• Canva Pro (تمام templates)\n• CapCut Pro\n\n🎬 Entertainment:\n• Netflix + Disney+ + Amazon Prime\n\n🎁 ایک بار خریدیں — لائف ٹائم استعمال!\nمارکیٹ ریٹ PKR 50,000+ → ہم صرف PKR 3,000! 🤯\n\n💡 Best combo: Social Media Setup + Premium Tools = PKR 8,000\n   → YouTube + AI tools = unstoppable combination!\n\nکون سا ٹول سب سے زیادہ چاہیے؟",
        false,
      );

    // WhatsApp Marketing
    if (q.match(/واٹس ایپ مارکیٹنگ|whatsapp marketing|بزنس|business setup/))
      return r(
        "📲 WhatsApp + ڈیجیٹل مارکیٹنگ — PKR 3,000 (لائف ٹائم)\n\n✅ USA/Canada/Europe نمبرز\n✅ WhatsApp Business مکمل سیٹ اپ\n✅ Backlinks, SEO, PPC\n✅ روزانہ AI گائیڈنس\n\nمارکیٹ ریٹ PKR 70,000+ → ہم صرف PKR 3,000! 🚀\n\nکیا آپ بزنس کو آنلائن لانا چاہتے ہیں؟",
        true,
      );

    // Full Package
    if (q.match(/فل پیکج|full package|مکمل پیکج|پوری سروس|all services/))
      return r(
        `🎯 فل ڈیجیٹل مارکیٹنگ پیکج — سب سے بہترین value!\n\n✅ سوشل میڈیا سیٹ اپ (20+ پلیٹ فارمز)\n✅ کاپی رائٹ فری ویڈیوز\n✅ Organic Growth\n✅ WhatsApp مارکیٹنگ\n✅ پریمیم ٹولز (ChatGPT+, Canva, Netflix)\n✅ SEO, SMM, PPC, Content Strategy\n✅ لائف ٹائم سپورٹ\n\nمارکیٹ ریٹ PKR 200,000+/ماہ!\nہم کم انویسٹمنٹ میں لائف ٹائم پروفٹ دیتے ہیں!\n\n📱 آج ہی WhatsApp کریں: ${KB.wa1}\nآپ ایک قدم دور ہیں اپنے ڈیجیٹل سفر سے! کیا ابھی شروع کریں؟ 🚀`,
        true,
      );

    // Order / How to order
    if (q.match(/آرڈر|order|خریدنا|buy|کیسے|how|شروع|start/))
      return r(
        `🛒 آرڈر کرنا بالکل آسان ہے!\n\nصرف 4 قدم:\n\n1️⃣ WhatsApp کریں: ${KB.wa1}\n2️⃣ سروس بتائیں جو چاہیے\n3️⃣ JazzCash کریں: ${KB.jazzcash}\n4️⃣ Screenshot WhatsApp پر بھیجیں\n\n✅ 24 گھنٹے میں ڈیلیوری شروع!\n\nکوئی hidden charges نہیں 💪\n\nآپ ایک قدم دور ہیں اپنے ڈیجیٹل سفر سے! کیا ابھی شروع کریں؟ 🚀`,
        true,
      );

    // Payment
    if (
      q.match(/پیمنٹ|payment|ادائیگی|جازکیش|jazzcash|easypaisa|bank|پیسے کیسے/)
    )
      return r(
        `💳 بہت آسان! ادائیگی کا طریقہ:\n\n• JazzCash: ${KB.jazzcash} (Muhammad Saleem Khan)\n• EasyPaisa: رابطے پر پوچھیں\n• Bank Transfer: دستیاب\n\n📸 پیمنٹ کے بعد:\nScreenshot لیں اور WhatsApp کریں: ${KB.wa1}\nفوری کام شروع! ⚡\n\nکوئی hidden charges نہیں — 100% گارنٹی کے ساتھ! ✅`,
        true,
      );

    // Delivery time
    if (q.match(/وقت|time|delivery|کب|when|کتنے دن|جلدی|fast/))
      return r(
        "⏱️ سوشل میڈیا سیٹ اپ 24-48 گھنٹے میں مکمل!\nویڈیوز 3-5 دن میں!\n\n📋 مکمل ٹائم لائن:\n• سوشل میڈیا سیٹ اپ: 24-48 گھنٹے ✅\n• ویڈیوز: 3-5 دن\n• Organic Growth: فوری شروع\n• پریمیم ٹولز: 1-2 گھنٹے (instant!)\n• WhatsApp سیٹ اپ: 24 گھنٹے\n\n🚀 ہم پاکستان کی سب سے تیز ڈیجیٹل ایجنسی ہیں!\n\nکیا آج ہی شروع کرنا ہے؟",
        false,
      );

    // Contact
    if (q.match(/رابطہ|contact|نمبر|number|call|کال|ای میل|email/))
      return r(
        `📞 ہم سے رابطہ کریں:\n\n📱 WhatsApp/Call:\n• ${KB.wa1}\n• ${KB.wa2}\n\n📧 Email: ${KB.email}\n💳 JazzCash: ${KB.jazzcash}\n👤 مالک: Muhammad Saleem Khan (Canada)\n\n⏰ 24/7 دستیاب!\n\nضرور رابطہ کریں — ہم آپ کا انتظار کر رہے ہیں! 🌟`,
        true,
      );

    // Guarantee
    if (q.match(/گارنٹی|guarantee|محفوظ|safe|trust|بھروسہ|یقین/))
      return r(
        "✅ ہماری مکمل گارنٹی — 100% یقین دہانی:\n\n🔒 مالی:\n• کوئی hidden charges نہیں\n• نتیجہ نہ ملے تو support جاری\n\n🏆 کامیابی:\n• 100+ فعال کلائنٹس\n• 80% 3 مہینے میں مونیٹائز\n• ماہانہ $200-$800+ کمائی گارنٹی\n\n🛡️ قانونی:\n• حلال، قانونی طریقہ\n• الگورتھم سیف — اکاؤنٹ محفوظ\n• Canada-based expert team\n\n⭐ 24/7 سپورٹ!\n\nآپ کی ڈیجیٹل کامیابی ہماری ذمہ داری! 🤝",
        false,
      );

    // Earnings / income
    if (q.match(/کمائی|income|earn|پیسے|money|profit|فائدہ|کتنا کما/))
      return r(
        "💵 ہمارے کلائنٹس ماہانہ $200 سے $800+ کما رہے ہیں!\n80% کلائنٹس 3 مہینے میں YouTube monetize ہو گئے! 🏆\n\n📊 اوسط کمائی:\n• مہینہ 1-3: $200-$400/ماہ\n• مہینہ 3-6: $400-$800/ماہ\n• 6 مہینے بعد: $800-$2,000+/ماہ\n\n✅ کمائی کہاں سے:\n• YouTube AdSense\n• Brand deals\n• Affiliate marketing\n• Sponsored content\n\nآپ کتنا کمانا چاہتے ہیں؟ 😊\n\nآپ ایک قدم دور ہیں اپنے ڈیجیٹل سفر سے! کیا ابھی شروع کریں؟ 🚀",
        true,
      );

    // Owner / Company
    if (q.match(/مالک|owner|سلیم|saleem|کینیڈا|canada|کمپنی|company/))
      return r(
        `👤 ہمارے بارے میں:\n\n🏢 کمپنی: CodePayOn Digital Agency\n👨‍💼 مالک: Muhammad Saleem Khan\n🌍 بیس: Canada\n📱 WhatsApp: ${KB.wa1}\n\n🏆 ہماری خصوصیات:\n• Canada-based expertise\n• 100+ فعال کلائنٹس\n• پاکستان کی نمبر 1 ڈیجیٹل ایجنسی\n• 24/7 ذاتی سپورٹ\n\nوہ خود آپ سے بات کر سکتے ہیں! 🌟`,
        true,
      );

    // Thanks
    if (q.match(/شکریہ|thanks|thank|جزاک/))
      return r(
        `آپ کا بہت شکریہ! 🌸\n\nآپ سے بات کر کے خوشی ہوئی! 😊 کیا کوئی اور سوال ہے؟\n\nاور اگر ہماری سروس پسند آئی تو ⭐⭐⭐⭐⭐ rating ضرور دیں — اس سے ہمیں بہت حوصلہ ملتا ہے!\n\nاللہ آپ کو کامیاب کرے! 🤲\n💚 آپ کا دوست: ${SOFIA_NAME}`,
        false,
      );

    // Default fallback
    return r(
      `یہ سوال میں نوٹ کر لیتی ہوں! 📝\n\nمیں آپ کا یہ سوال Muhammad Saleem Khan تک پہنچا دیتی ہوں — وہ جلد جواب دیں گے۔\n\n📱 براہ راست رابطہ: ${KB.wa1}\n\nکیا آپ WhatsApp پر بھی بات کر سکتے ہیں؟ 😊`,
      true,
    );
  }

  // ── ENGLISH ─────────────────────────────────────────────────────
  if (lang === "en") {
    // Scam / trust
    if (q.match(/scam|fake|real|legit|trust|genuine|proof/))
      return r(
        `100% Legitimate! 💯\n\nI'm ${SOFIA_NAME} and I guarantee:\n\n✅ 100+ active clients — we can connect you with previous clients!\n✅ Muhammad Saleem Khan works from Canada — personal attention to every client\n✅ 3+ years of experience\n✅ Secure JazzCash payment\n✅ No pressure for advance payment\n\n🏆 Our client reviews are on our website!\n\nWould you like to speak with one of our previous clients?`,
        true,
      );

    // Expensive
    if (q.match(/expensive|costly|afford|budget|too much/))
      return r(
        `I understand your concern! But think about this 🤔\n\nInvest PKR 5,000 → Earn PKR 50,000-80,000/month!\n\n📊 ROI Calculation:\n• Investment: only PKR 5,000\n• Month 1: $200 = PKR 56,000\n• Month 3: $400-$800 = PKR 112,000-224,000\n\n🤯 ONE-TIME investment — LIFETIME earnings!\n\nCompetitors charge PKR 40,000-150,000 for the same service. We're 90% cheaper!\n\n⚡ Limited time offer — decide today!\n\nShall I connect you with Muhammad Saleem Khan right now?`,
        true,
      );

    // Will think / later
    if (q.match(/think|maybe|later|not sure|consider/))
      return r(
        `Absolutely! But let me share something important 😊\n\nEvery day you wait, your competitors are moving ahead!\n\n⏳ Clients who decided TODAY:\n• 3 months later → YouTube monetized\n• 6 months later → $400-$800/month\n• 1 year later → Complete online business\n\n🎯 Order today, start earning tomorrow!\n\nJust tell me — is your goal YouTube earnings or social media growth? I'll suggest the perfect package! 💫`,
        false,
      );

    // Which package
    if (q.match(/which package|what should i|recommend|suggest|best for me/))
      return r(
        `Great question! 😊 Tell me your goal:\n\n1️⃣ Monthly earnings from YouTube\n   → Social Media Setup (PKR 5,000) + Organic Growth\n\n2️⃣ Grow social media followers fast\n   → Organic Growth + Premium Tools (PKR 6,000 combo)\n\n3️⃣ Need AI tools and premium subscriptions\n   → Premium Tools Pack (only PKR 3,000!)\n\n4️⃣ Complete digital presence\n   → Full Package (best value!)\n\n🏆 Most popular: Social Media Setup + Organic Growth combo!\n\nWhat's your main goal? I'll create a personalized plan! 💫`,
        false,
      );

    // Greetings
    if (q.match(/hello|hi |hey|greet|good morning|good evening/))
      return r(
        `Hello! 👋 Welcome to CodePayOn!\n\nI'm ${SOFIA_NAME} — Senior Digital Assistant 💫\n\nOur 100+ happy clients earn $200-$800+ monthly — want to join them? 🚀\n\n💰 Prices | 🌟 Services | 🛒 Order | 📱 Contact`,
        false,
      );

    // Pricing
    if (q.match(/price|cost|rate|how much|charges|fee|expensive|cheap/))
      return r(
        "💰 Our Complete Price List:\n\n1️⃣ Social Media Setup + Monetization\n   ✦ Only PKR 5,000 ⚡\n   ✦ Market rate: PKR 40,000-150,000!\n\n2️⃣ Copyright-Free Videos\n   ✦ PKR 1,000 per 15-min video\n\n3️⃣ Organic Growth (100% Real)\n   ✦ Subscribers: PKR 20 | Likes/Views: PKR 2\n\n4️⃣ WhatsApp Marketing\n   ✦ PKR 3,000 (Lifetime!)\n\n5️⃣ Premium Tools (ChatGPT+, Canva, Netflix)\n   ✦ PKR 3,000 (Lifetime!)\n\n✨ 90% cheaper than market rates!\n⚡ Limited time offer!\n\nWhich service interests you most? 😊",
        false,
      );

    // Social Media / YouTube
    if (
      q.match(/youtube|facebook|tiktok|instagram|social media|monetize|channel/)
    )
      return r(
        "📱 Social Media + Monetization Package — PKR 5,000\n\n✅ YouTube, Facebook, Instagram, TikTok + 20 platforms\n✅ Full SEO (Titles, Tags, Descriptions)\n✅ Algorithm-safe structure\n✅ 24/7 support\n\n🏆 Track record:\n• 80% clients monetized in 3 months!\n• Monthly $200-$800+ earnings\n• 100+ happy clients\n\n💡 Smart Combo: Add Organic Growth + Premium Tools\n   Just PKR 11,000 for a complete digital empire!\n\nMarket rate PKR 150,000+ → We offer PKR 5,000! 🤯\n\n⚡ Order today, start earning tomorrow!\nReady to get started?",
        true,
      );

    // Videos
    if (q.match(/video|copyright|clip|reels|content/))
      return r(
        "🎥 Copyright-Free Video Service — PKR 1,000/video\n\n✅ 15-30 min ready-to-upload videos\n✅ Text-to-Video software access\n✅ 10x watch time formula\n• 500+ videos created\n\n💡 Pro tip: Videos + Organic Growth = faster monetization!\n\nWant to see samples? Contact us on WhatsApp! 😊",
        true,
      );

    // Growth
    if (q.match(/growth|subscriber|like|view|follower|increase/))
      return r(
        "🚀 Organic Growth Rates (100% Real Humans)\n\n📊 Rate List:\n• Subscribers: PKR 20 each\n• Likes/Views: PKR 2 each\n• Comments: PKR 5 each\n\n🌍 Real people from USA, Canada, Europe\nPhased delivery — algorithm-safe, zero risk!\n\n💡 More subscribers = faster YouTube monetization!\nSocial Media Setup + Organic Growth = fastest path to earnings! 🚀\n\nHow many subscribers do you need?",
        false,
      );

    // Tools
    if (q.match(/tools|canva|netflix|chatgpt|grok|disney|capcut|invideo|ai/))
      return r(
        "💻 Lifetime Premium Tools — only PKR 3,000\n\n🤖 AI: ChatGPT Plus • Grok AI • InVideo\n🎨 Design: Canva Pro • CapCut Pro\n🎬 Entertainment: Netflix • Disney+ • Amazon Prime\n\n🎁 Buy once — use forever!\nMarket value PKR 50,000+ → Just PKR 3,000! 🤯\n\n💡 Best combo: Social Media Setup + Premium Tools = PKR 8,000\n   YouTube + AI tools = unstoppable!\n\nWhich tool interests you most?",
        false,
      );

    // Order
    if (q.match(/order|buy|purchase|how to|get started|start/))
      return r(
        `🛒 Ordering is super simple!\n\n1️⃣ WhatsApp: ${KB.wa1}\n2️⃣ Tell us which service\n3️⃣ Pay via JazzCash: ${KB.jazzcash}\n4️⃣ Send screenshot to WhatsApp\n\n✅ Delivery starts within 24 hours!\nNo hidden charges 💪\n\nYou're just one step away from your digital journey! Shall we start now? 🚀`,
        true,
      );

    // Payment
    if (q.match(/payment|pay|jazzcash|easypaisa|bank|transfer|how to pay/))
      return r(
        `💳 Super easy!\n\n• JazzCash: ${KB.jazzcash} (Muhammad Saleem Khan)\n• EasyPaisa: ask on contact\n• Bank Transfer: available\n\nAfter payment: screenshot → WhatsApp: ${KB.wa1}\nWork starts immediately! ⚡\n\n100% guarantee — no hidden charges! ✅`,
        true,
      );

    // Delivery time
    if (q.match(/delivery|time|when|how long|days|fast/))
      return r(
        `⏱️ Social Media Setup: 24-48 hours!\nVideos: 3-5 days!\n\n• Organic Growth: starts immediately\n• Premium Tools: instant (1-2 hours)\n• WhatsApp Setup: 24 hours\n\n🚀 Pakistan's fastest digital agency!\n\nReady to start today?`,
        false,
      );

    // Contact
    if (q.match(/contact|number|call|email|reach|whatsapp/))
      return r(
        `📞 Contact Us:\n\n📱 WhatsApp/Call:\n• ${KB.wa1}\n• ${KB.wa2}\n📧 Email: ${KB.email}\n💳 JazzCash: ${KB.jazzcash}\n👤 Owner: Muhammad Saleem Khan (Canada)\n\n⏰ Available 24/7!\n\nWe're always here for you! 🌟`,
        true,
      );

    // Guarantee
    if (q.match(/guarantee|safe|trust|secure|risk/))
      return r(
        "✅ Our 100% Guarantee:\n\n🔒 No hidden charges\n🔒 Ongoing support after delivery\n🏆 100+ active clients\n🏆 80% monetized in 3 months\n🏆 $200-$800+/month earnings guaranteed\n🛡️ Halal, legal, algorithm-safe\n🛡️ Canada-based expert team\n\nYour digital success is our responsibility! 🤝",
        false,
      );

    // Earnings
    if (q.match(/earn|income|money|profit|revenue|how much can i make/))
      return r(
        `💵 Our clients earn $200-$800+ monthly!\n80% monetized within 3 months! 🏆\n\n📊 Average earnings:\n• Month 1-3: $200-$400/month\n• Month 3-6: $400-$800/month\n• After 6 months: $800-$2,000+/month\n\n✅ From: YouTube AdSense, Brand deals, Affiliate marketing\n\nYou're one step away from your digital journey! Shall we start now? 🚀`,
        true,
      );

    // Thanks
    if (q.match(/thank|thanks|great|awesome|amazing/))
      return r(
        `Thank you so much! 🌸\n\nIt was a pleasure helping you! 😊 Any more questions?\n\nAnd if you liked our service, please give us a ⭐⭐⭐⭐⭐ rating — it means the world to us!\n\nWishing you tremendous success! 🤲\n💚 Your friend: ${SOFIA_NAME}`,
        false,
      );

    return r(
      `I've noted your question! 📝\n\nI'll forward this to Muhammad Saleem Khan right away.\n\n📱 Direct contact: ${KB.wa1}\n\nWould you like to chat on WhatsApp? 😊`,
      true,
    );
  }

  // ── HINDI ──────────────────────────────────────────────────────
  if (lang === "hi") {
    if (q.match(/scam|fake|real|असली|सच|भरोसा/))
      return r(
        "बिल्कुल असली! 💯\n\n✅ 100+ खुश ग्राहक\n✅ Muhammad Saleem Khan कनाडा से काम करते हैं\n✅ 3+ साल का अनुभव\n✅ JazzCash से सुरक्षित भुगतान\n\nहम आपको पुराने ग्राहकों से मिलवा सकते हैं! 🏆",
        true,
      );

    if (q.match(/महंगा|afford|बजट|पैसे नहीं/))
      return r(
        "समझ में आता है! लेकिन सोचें 🤔\n\nPKR 5,000 लगाएं → महीने में PKR 50,000+ कमाएं!\n\n🤯 एक बार की इन्वेस्टमेंट — लाइफटाइम कमाई!\n\nबाज़ार में यही सेवा PKR 150,000+ में मिलती है। हम 90% सस्ते!\n\n⚡ सीमित समय का ऑफर!\nक्या आप अभी शुरू करना चाहते हैं?",
        true,
      );

    if (q.match(/price|कीमत|रेट|दाम|cost|कितना/))
      return r(
        "💰 हमारी सेवाओं की कीमतें:\n\n1️⃣ सोशल मीडिया सेटअप + मोनेटाइज़ेशन: PKR 5,000 ⚡\n   (बाज़ार दर: PKR 150,000!)\n2️⃣ वीडियो (15 मिनट): PKR 1,000\n3️⃣ Organic Growth: PKR 2 से शुरू\n4️⃣ WhatsApp मार्केटिंग: PKR 3,000\n5️⃣ प्रीमियम टूल्स: PKR 3,000\n\n✨ बाज़ार से 90% सस्ते!\n⚡ सीमित समय का ऑफर!\n\nकोई और जानकारी चाहिए? 😊",
        false,
      );

    if (q.match(/youtube|social|monetize|channel/))
      return r(
        "📱 सोशल मीडिया + मोनेटाइज़ेशन: PKR 5,000\n\n✅ YouTube, Facebook, TikTok + 20 प्लेटफ़ॉर्म\n✅ 80% ग्राहक 3 महीने में मोनेटाइज़!\n✅ $200-$800+/महीना कमाई\n\n💡 Smart combo: यह + Organic Growth + Premium Tools!\nआज ऑर्डर करें, कल से कमाई शुरू! 🚀",
        true,
      );

    if (q.match(/earn|कमाई|income|profit|कितना कमा/))
      return r(
        "💵 हमारे ग्राहक $200-$800+ मासिक कमा रहे हैं!\n80% ग्राहक 3 महीने में YouTube monetize! 🏆\n\nPKR 5,000 लगाएं → हर महीने PKR 50,000+ कमाएं!\n\nआप एक कदम दूर हैं अपने डिजिटल सफर से! अभी शुरू करें? 🚀",
        true,
      );

    if (q.match(/order|खरीदना|buy|कैसे|शुरू/))
      return r(
        `🛒 ऑर्डर बहुत आसान है!\n\n1️⃣ WhatsApp: ${KB.wa1}\n2️⃣ सेवा बताएं\n3️⃣ JazzCash: ${KB.jazzcash}\n4️⃣ Screenshot भेजें\n\n✅ 24 घंटे में डिलीवरी!\n\nआप एक कदम दूर हैं! अभी शुरू करें? 🚀`,
        true,
      );

    if (q.match(/guarantee|गारंटी|safe|trust/))
      return r(
        "✅ 100% गारंटी:\n\n• कोई छिपे हुए चार्ज नहीं\n• 24/7 WhatsApp सपोर्ट\n• 100+ खुश ग्राहक\n• 80% ग्राहक 3 महीने में मोनेटाइज़\n• लीगल, हलाल तरीके\n\nआपकी डिजिटल सफलता हमारी ज़िम्मेदारी! 🏆",
        false,
      );

    if (q.match(/contact|संपर्क|number|नंबर/))
      return r(
        `📞 संपर्क:\n\n📱 WhatsApp: ${KB.wa1}\n📧 Email: ${KB.email}\n\n24/7 उपलब्ध! 🌟`,
        true,
      );

    if (q.match(/thank|धन्यवाद|शुक्रिया/))
      return r(
        `धन्यवाद! 🌸\n\nआपकी मदद करके खुशी हुई! 😊 कोई सवाल हो तो ज़रूर पूछें!\n\nहमें ⭐⭐⭐⭐⭐ rating दें — बहुत मायने रखती है!\n💚 आपका दोस्त: ${SOFIA_NAME}`,
        false,
      );

    return r(
      `आपके सवाल के लिए धन्यवाद! 📝\n\nMuhammad Saleem Khan को भेज रही हूं।\n\n📱 WhatsApp: ${KB.wa1}\n\nWhatsApp पर बात कर सकते हैं? 😊`,
      true,
    );
  }

  // ── ARABIC ─────────────────────────────────────────────────────
  if (lang === "ar") {
    if (q.match(/نصب|احتيال|أصيل|حقيقي|ثقة/))
      return r(
        "حقيقي 100%! 💯\n\n✅ 100+ عميل سعيد\n✅ محمد سليم خان يعمل من كندا\n✅ 3+ سنوات من الخبرة\n\nيمكننا ربطك بعملائنا السابقين! 🏆",
        true,
      );

    if (q.match(/price|سعر|تكلفة|كم|أسعار/))
      return r(
        "💰 أسعار خدماتنا:\n\n1️⃣ إعداد التواصل الاجتماعي: 5,000 روبية ⚡\n   (السعر في السوق: 150,000 روبية!)\n2️⃣ الفيديوهات: 1,000 روبية\n3️⃣ النمو العضوي: من روبيتين\n4️⃣ تسويق واتساب: 3,000 روبية\n5️⃣ أدوات مدى الحياة: 3,000 روبية\n\n✨ أرخص بنسبة 90%!\n⚡ عرض لفترة محدودة!\n\nأي خدمة تريد؟ 😊",
        false,
      );

    if (q.match(/earn|كسب|دخل|ربح|كم يمكن/))
      return r(
        "💵 عملاؤنا يكسبون 200-800 دولار شهرياً!\n80% حققوا الدخل خلال 3 أشهر! 🏆\n\nاستثمر 5,000 روبية → اكسب 50,000+ شهرياً!\n\nأنت خطوة واحدة من رحلتك الرقمية! هل نبدأ الآن؟ 🚀",
        true,
      );

    if (q.match(/youtube|social|monetize|قناة|يوتيوب/))
      return r(
        "📱 إعداد التواصل الاجتماعي: 5,000 روبية\n\n✅ يوتيوب، فيسبوك، تيك توك + 20 منصة\n✅ 80% يحققون الدخل خلال 3 أشهر!\n✅ 200-800 دولار/شهرياً\n\nاطلب اليوم، ابدأ الكسب غداً! 🚀",
        true,
      );

    if (q.match(/order|طلب|شراء|كيف|ابدأ/))
      return r(
        `🛒 الطلب بسيط!\n\n1️⃣ واتساب: ${KB.wa1}\n2️⃣ أخبرنا بالخدمة\n3️⃣ JazzCash: ${KB.jazzcash}\n4️⃣ أرسل لقطة الشاشة\n\n✅ التسليم خلال 24 ساعة!\n\nأنت خطوة واحدة من رحلتك! هل نبدأ؟ 🚀`,
        true,
      );

    if (q.match(/guarantee|ضمان|أمان|ثقة/))
      return r(
        "✅ ضمان 100%:\n\n• لا رسوم خفية\n• دعم 24/7\n• 100+ عميل سعيد\n• طرق قانونية وحلال\n\nنجاحك مسؤوليتنا! 🏆",
        false,
      );

    if (q.match(/contact|تواصل|رقم|اتصال/))
      return r(
        `📞 تواصل معنا:\n\n📱 واتساب: ${KB.wa1}\n📧 البريد: ${KB.email}\n\n24/7! 🌟`,
        true,
      );

    if (q.match(/شكر|thank/))
      return r(
        `شكراً جزيلاً! 🌸\n\nكان من دواعي سروري! 😊 أعطنا تقييم ⭐⭐⭐⭐⭐!\n💚 صديقتك: ${SOFIA_NAME}`,
        false,
      );

    return r(
      `شكراً! 📝\n\nسأوصل سؤالك لمحمد سليم خان فوراً.\n📱 واتساب: ${KB.wa1}`,
      true,
    );
  }

  return r(
    `Thank you! 📝\n\nForwarding to Muhammad Saleem Khan.\n📱 WhatsApp: ${KB.wa1}`,
    true,
  );
}

// ── Types ─────────────────────────────────────────────────────────
type ConvStep = "lang" | "chat" | "rating" | "review_text" | "done";

interface Message {
  id: number;
  from: "bot" | "user";
  text: string;
  time: string;
  showWhatsApp?: boolean;
  showRating?: boolean;
}

function nowTime() {
  return new Date().toLocaleTimeString("en-PK", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ── Star rating subcomponent ───────────────────────────────────────
function StarRating({ onRate }: { onRate: (stars: number) => void }) {
  const [hovered, setHovered] = useState(0);
  const [selected, setSelected] = useState(0);

  function pick(n: number) {
    setSelected(n);
    onRate(n);
  }

  return (
    <div className="flex gap-1 mt-2">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          data-ocid={`chatbot.rating.${n}`}
          onMouseEnter={() => setHovered(n)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => pick(n)}
          className="text-2xl transition-all duration-150 hover:scale-125"
          style={{
            filter:
              n <= (hovered || selected) ? "drop-shadow(0 0 6px gold)" : "none",
            color: n <= (hovered || selected) ? "#FACC15" : "#4B5563",
          }}
          aria-label={`${n} stars`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────
export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState<Lang>("ur");
  const [step, setStep] = useState<ConvStep>("lang");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [pulse, setPulse] = useState(true);
  const [msgCount, setMsgCount] = useState(0);
  const [ratingValue, setRatingValue] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const msgEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const nextId = useRef(1);
  const inactivityTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const ratingShown = useRef(false);

  const addTestimonial = useAddTestimonial();

  // Focus input when chat opens
  useEffect(() => {
    if (open && step !== "lang") {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open, step]);

  // Scroll to latest message
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional scroll
  useEffect(() => {
    msgEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  // Pulse stops after 10s
  useEffect(() => {
    const t = setTimeout(() => setPulse(false), 10000);
    return () => clearTimeout(t);
  }, []);

  // Initial greeting on open
  // biome-ignore lint/correctness/useExhaustiveDependencies: addBotMsg stable ref
  useEffect(() => {
    if (open && messages.length === 0) {
      addBotMsg(
        `السلام علیکم! 👋\nمیں ${SOFIA_NAME} ہوں — CodePayOn کی سینئر ڈیجیٹل اسسٹنٹ 💫\n\nHello! I'm ${SOFIA_NAME}, Senior Digital Assistant at CodePayOn!\n\nآپ کس زبان میں بات کرنا چاہتے ہیں؟\nWhich language would you like to chat in?`,
      );
    }
  }, [open]);

  const addBotMsg = useCallback((text: string, extras?: Partial<Message>) => {
    const id = nextId.current++;
    setMessages((prev) => [
      ...prev,
      { id, from: "bot", text, time: nowTime(), ...extras },
    ]);
  }, []);

  function addUserMsg(text: string) {
    const id = nextId.current++;
    setMessages((prev) => [
      ...prev,
      { id, from: "user", text, time: nowTime() },
    ]);
  }

  // Reset inactivity nudge timer
  const resetInactivity = useCallback(() => {
    if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    if (step !== "chat") return;
    inactivityTimer.current = setTimeout(() => {
      const nudge =
        lang === "ur"
          ? "کیا میں آپ کی مزید مدد کر سکتی ہوں؟ 😊\n\nآپ ایک قدم دور ہیں اپنے ڈیجیٹل سفر سے!"
          : lang === "hi"
            ? "क्या मैं आपकी और मदद कर सकती हूं? 😊"
            : lang === "ar"
              ? "هل يمكنني مساعدتك أكثر؟ 😊"
              : "Can I help you with anything else? 😊\n\nYou're just one step away from your digital journey!";
      addBotMsg(nudge);
    }, 30000);
  }, [step, lang, addBotMsg]);

  // Clean up inactivity timer
  useEffect(() => {
    return () => {
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    };
  }, []);

  // Language chosen
  function chooseLang(chosen: Lang) {
    setLang(chosen);
    const option = LANG_OPTIONS.find((o) => o.code === chosen)!;
    addUserMsg(`${option.flag} ${option.label}`);
    setStep("chat");
    setTimeout(() => {
      addBotMsg(option.greeting);
    }, 600);
  }

  // Forward to WhatsApp
  function openWhatsApp(question?: string) {
    const text = question
      ? `💬 CodePayOn سے رابطہ (Sofia Saleem Chatbot):\n${question}`
      : `💬 CodePayOn سے رابطہ — ${SOFIA_NAME} AI Chatbot`;
    window.open(
      `https://wa.me/${OWNER_WA}?text=${encodeURIComponent(text)}`,
      "_blank",
    );
  }

  // Main send logic
  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    setInput("");
    addUserMsg(trimmed);
    const newCount = msgCount + 1;
    setMsgCount(newCount);
    resetInactivity();

    setTyping(true);
    await new Promise((r) => setTimeout(r, 800 + Math.random() * 500));
    setTyping(false);

    const { text: reply, showWA } = getResponse(trimmed, lang);
    addBotMsg(reply, { showWhatsApp: showWA });

    // After 4 user messages, ask for rating (only once)
    if (newCount >= 4 && step === "chat" && !ratingShown.current) {
      ratingShown.current = true;
      setTimeout(() => {
        setStep("rating");
        const ratingAsk =
          lang === "ur"
            ? "آپ کا تجربہ کیسا رہا؟ 😊\n\nکیا آپ ہمیں ⭐ rating دینا چاہیں گے؟"
            : lang === "hi"
              ? "आपका अनुभव कैसा रहा? 😊\n\nक्या आप हमें ⭐ रेटिंग देना चाहेंगे?"
              : lang === "ar"
                ? "كيف كانت تجربتك؟ 😊\n\nهل تريد إعطاءنا تقييماً ⭐؟"
                : "How was your experience? 😊\n\nWould you like to give us a ⭐ rating?";
        addBotMsg(ratingAsk, { showRating: true });
      }, 1200);
    }
  }

  // Handle Enter key
  function handleKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (step === "chat" || step === "done") sendMessage(input);
      else if (step === "review_text") submitReview();
    }
  }

  // Star picked
  async function handleRating(stars: number) {
    setRatingValue(stars);
    setStep("review_text");
    setTyping(true);
    await new Promise((r) => setTimeout(r, 600));
    setTyping(false);
    const emoji = ["😢", "😐", "🙂", "😊", "🤩"][stars - 1];
    const msg =
      lang === "ur"
        ? `${emoji} شکریہ! آپ نے ${stars} ستارے دیے!\n\nکیا آپ ایک مختصر ریویو لکھنا چاہیں گے؟\n(اختیاری — چھوڑنا چاہیں تو Enter دبائیں)`
        : lang === "hi"
          ? `${emoji} धन्यवाद! आपने ${stars} स्टार दिए!\n\nएक छोटी समीक्षा लिखना चाहेंगे? (वैकल्पिक)`
          : lang === "ar"
            ? `${emoji} شكراً! أعطيت ${stars} نجوم!\n\nهل تريد كتابة مراجعة قصيرة؟ (اختياري)`
            : `${emoji} Thank you! You gave us ${stars} stars!\n\nWould you like to write a quick review? (Optional — press Enter to skip)`;
    addBotMsg(msg);
  }

  // Submit review
  async function submitReview() {
    const text = reviewText.trim();
    if (text) addUserMsg(text);
    else
      addUserMsg(
        lang === "ur"
          ? "(چھوڑ دیا)"
          : lang === "hi"
            ? "(छोड़ा)"
            : lang === "ar"
              ? "(تخطي)"
              : "(skipped)",
      );

    if (text && ratingValue > 0) {
      try {
        await addTestimonial.mutateAsync({
          name: `${SOFIA_NAME} Chat User`,
          review: text,
          rating: BigInt(ratingValue),
          service: "Digital Services",
        });
      } catch {
        // Silently fail
      }
    }

    setReviewText("");
    setStep("done");
    setTyping(true);
    await new Promise((r) => setTimeout(r, 800));
    setTyping(false);

    const doneMsg =
      lang === "ur"
        ? "بہت بہت شکریہ! 🌸\n\nآپ کا ریویو موصول ہو گیا — یہ ہمارے لیے بہت قیمتی ہے!\n\nکوئی اور سوال ہو تو ضرور پوچھیں۔ میں ہمیشہ یہاں ہوں! 💚\n\nآپ ایک قدم دور ہیں اپنے ڈیجیٹل سفر سے! 🚀"
        : lang === "hi"
          ? "बहुत बहुत धन्यवाद! 🌸\n\nसमीक्षा मिल गई! कोई सवाल हो तो पूछें! 💚\n\nआप एक कदम दूर हैं अपने डिजिटल सफर से! 🚀"
          : lang === "ar"
            ? "شكراً جزيلاً! 🌸\n\nتم استلام مراجعتك! لا تتردد! 💚\n\nأنت خطوة واحدة من رحلتك الرقمية! 🚀"
            : "Thank you so much! 🌸\n\nYour review is received — it means everything to us!\n\nFeel free to ask anything else. I'm always here! 💚\n\nYou're one step away from your digital journey! 🚀";
    addBotMsg(doneMsg, { showWhatsApp: true });
  }

  const placeholder =
    step === "review_text"
      ? lang === "ur"
        ? "ریویو لکھیں یا Enter دبائیں..."
        : lang === "hi"
          ? "समीक्षा लिखें..."
          : lang === "ar"
            ? "اكتب مراجعتك..."
            : "Write your review or press Enter to skip..."
      : lang === "ur"
        ? "سوال پوچھیں..."
        : lang === "hi"
          ? "सवाल पूछें..."
          : lang === "ar"
            ? "اطرح سؤالك..."
            : "Ask anything...";

  const chips = getChips(lang);
  const canType = step === "chat" || step === "review_text" || step === "done";

  // ── Render ──────────────────────────────────────────────────────
  return (
    <>
      {/* Floating launcher */}
      <button
        type="button"
        data-ocid="chatbot.open_modal_button"
        onClick={() => {
          setOpen((v) => !v);
          setPulse(false);
        }}
        className="fixed bottom-6 left-6 z-50 flex flex-col items-center gap-1 group"
        aria-label={`Chat with ${SOFIA_NAME}`}
      >
        <div className="relative">
          {pulse && (
            <span className="absolute inset-0 rounded-full animate-ping bg-emerald-400 opacity-35 pointer-events-none" />
          )}
          <div
            className="w-16 h-16 rounded-full overflow-hidden border-2 border-emerald-400 shadow-xl group-hover:scale-110 transition-transform duration-200"
            style={{ boxShadow: "0 0 22px oklch(0.6 0.18 145 / 0.4)" }}
          >
            <img
              src={SOFIA_IMG}
              alt={SOFIA_NAME}
              className="w-full h-full object-cover object-top"
            />
          </div>
          <span className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-[#0a0a0a]" />
        </div>
        <span
          className="text-[10px] font-bold text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-400/30"
          style={{
            background: "oklch(0.1 0.02 250 / 0.85)",
            backdropFilter: "blur(6px)",
          }}
        >
          Sofia Saleem
        </span>
      </button>

      {/* Chat window */}
      {open && (
        <div
          data-ocid="chatbot.panel"
          className="fixed bottom-28 left-4 z-50 rounded-2xl overflow-hidden flex flex-col"
          style={{
            width: "min(380px, calc(100vw - 24px))",
            height: "580px",
            background: "oklch(0.10 0.02 250)",
            border: "1px solid oklch(0.28 0.1 145 / 0.45)",
            boxShadow:
              "0 30px 70px oklch(0.06 0.02 250 / 0.95), 0 0 0 1px oklch(0.3 0.12 145 / 0.15)",
          }}
        >
          {/* Header */}
          <div
            className="flex items-center gap-3 px-4 py-3 flex-shrink-0"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.18 0.07 145 / 0.98), oklch(0.13 0.04 250 / 0.98))",
              borderBottom: "1px solid oklch(0.3 0.1 145 / 0.35)",
            }}
          >
            <div
              className="relative w-11 h-11 rounded-full overflow-hidden flex-shrink-0 border-2 border-emerald-400/70"
              style={{ boxShadow: "0 0 14px oklch(0.6 0.2 145 / 0.45)" }}
            >
              <img
                src={SOFIA_IMG}
                alt={SOFIA_NAME}
                className="w-full h-full object-cover object-top"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-bold text-sm text-white">{SOFIA_NAME}</p>
                <span
                  className="text-[9px] px-1.5 py-0.5 rounded-full font-semibold"
                  style={{
                    background: "oklch(0.52 0.18 145 / 0.25)",
                    color: "oklch(0.78 0.16 145)",
                    border: "1px solid oklch(0.52 0.18 145 / 0.3)",
                  }}
                >
                  AI
                </span>
              </div>
              <p className="text-[11px] text-emerald-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
                Online • Senior Digital Assistant
              </p>
            </div>
            <button
              type="button"
              onClick={() => window.open(`https://wa.me/${OWNER_WA}`, "_blank")}
              title="Direct WhatsApp"
              className="w-8 h-8 rounded-lg flex items-center justify-center text-sm transition-all hover:scale-110"
              style={{ background: "#25D36620", border: "1px solid #25D36640" }}
              aria-label="Open WhatsApp"
            >
              💬
            </button>
            <button
              type="button"
              data-ocid="chatbot.close_button"
              onClick={() => setOpen(false)}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all ml-1 text-sm"
              aria-label="Close chat"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div
            className="flex-1 overflow-y-auto px-3 py-3 space-y-3"
            style={{ scrollbarWidth: "none" }}
          >
            {messages.map((msg) => (
              <div key={msg.id}>
                <div
                  className={`flex gap-2 ${msg.from === "user" ? "flex-row-reverse" : "flex-row"}`}
                >
                  {msg.from === "bot" && (
                    <div
                      className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0 mt-1 border border-emerald-400/35"
                      style={{ boxShadow: "0 0 7px oklch(0.6 0.18 145 / 0.3)" }}
                    >
                      <img
                        src={SOFIA_IMG}
                        alt={SOFIA_NAME}
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                  )}
                  <div
                    className={`max-w-[82%] rounded-2xl px-3 py-2.5 text-sm whitespace-pre-wrap leading-relaxed ${msg.from === "user" ? "rounded-tr-sm" : "rounded-tl-sm"}`}
                    dir="auto"
                    style={{
                      background:
                        msg.from === "user"
                          ? "oklch(0.50 0.18 145)"
                          : "oklch(0.18 0.03 260)",
                      color: msg.from === "user" ? "#0a0a0a" : "#eeeef0",
                    }}
                  >
                    {msg.text}
                    <div
                      className={`text-[9px] mt-1 opacity-40 ${msg.from === "user" ? "text-right" : "text-left"}`}
                    >
                      {msg.time}
                    </div>
                  </div>
                </div>

                {/* Star rating UI */}
                {msg.showRating && step === "rating" && (
                  <div className="ml-9 mt-2">
                    <StarRating onRate={handleRating} />
                  </div>
                )}

                {/* WhatsApp CTA */}
                {msg.showWhatsApp && (
                  <div className="ml-9 mt-2">
                    <button
                      type="button"
                      data-ocid="chatbot.whatsapp.button"
                      onClick={() => openWhatsApp()}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all hover:scale-105"
                      style={{
                        background: "#25D36618",
                        border: "1px solid #25D36640",
                        color: "#25D366",
                      }}
                    >
                      <span className="text-base">💬</span>
                      {lang === "ur"
                        ? "WhatsApp پر بات کریں"
                        : lang === "hi"
                          ? "WhatsApp पर बात करें"
                          : lang === "ar"
                            ? "تحدث على واتساب"
                            : "Chat on WhatsApp"}
                    </button>
                  </div>
                )}
              </div>
            ))}

            {/* Typing dots */}
            {typing && (
              <div className="flex gap-2 items-end">
                <div
                  className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0 border border-emerald-400/35"
                  style={{ boxShadow: "0 0 7px oklch(0.6 0.18 145 / 0.3)" }}
                >
                  <img
                    src={SOFIA_IMG}
                    alt={SOFIA_NAME}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div
                  className="rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5"
                  style={{ background: "oklch(0.18 0.03 260)" }}
                >
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce"
                      style={{ animationDelay: `${i * 0.18}s` }}
                    />
                  ))}
                </div>
              </div>
            )}
            <div ref={msgEndRef} />
          </div>

          {/* Language picker */}
          {step === "lang" && (
            <div
              className="px-3 py-3 grid grid-cols-2 gap-2 flex-shrink-0"
              style={{ borderTop: "1px solid oklch(0.2 0.05 250 / 0.5)" }}
            >
              {LANG_OPTIONS.map((opt) => {
                const colors: Record<Lang, { bg: string; color: string }> = {
                  ur: { bg: "oklch(0.50 0.18 145)", color: "#0a0a0a" },
                  en: { bg: "oklch(0.40 0.12 255)", color: "#fff" },
                  hi: { bg: "oklch(0.55 0.15 35)", color: "#fff" },
                  ar: { bg: "oklch(0.48 0.14 80)", color: "#fff" },
                };
                const c = colors[opt.code];
                return (
                  <button
                    key={opt.code}
                    type="button"
                    data-ocid={`chatbot.lang_${opt.code}.button`}
                    onClick={() => chooseLang(opt.code)}
                    className="py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all hover:scale-105 hover:brightness-110"
                    style={{ background: c.bg, color: c.color }}
                  >
                    <span className="text-base">{opt.flag}</span>
                    <span>{opt.label}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Quick chips (chat mode) */}
          {step === "chat" && (
            <div
              className="px-3 py-2 flex gap-2 overflow-x-auto flex-shrink-0"
              style={{
                scrollbarWidth: "none",
                borderTop: "1px solid oklch(0.18 0.04 250 / 0.4)",
              }}
            >
              {chips.map((c) => (
                <button
                  key={c.q}
                  type="button"
                  data-ocid="chatbot.chip.button"
                  onClick={() => sendMessage(c.q)}
                  className="flex-shrink-0 text-[11px] px-3 py-1.5 rounded-full font-medium transition-all hover:scale-105 whitespace-nowrap"
                  style={{
                    background: "oklch(0.20 0.06 145 / 0.55)",
                    border: "1px solid oklch(0.42 0.14 145 / 0.4)",
                    color: "oklch(0.80 0.16 145)",
                  }}
                >
                  {c.label}
                </button>
              ))}
            </div>
          )}

          {/* Text input */}
          {canType && (
            <div
              className="px-3 pb-3 pt-2 flex gap-2 flex-shrink-0"
              style={{
                borderTop:
                  step === "chat"
                    ? "none"
                    : "1px solid oklch(0.18 0.04 250 / 0.5)",
              }}
            >
              <input
                ref={inputRef}
                data-ocid="chatbot.input"
                type="text"
                value={step === "review_text" ? reviewText : input}
                onChange={(e) =>
                  step === "review_text"
                    ? setReviewText(e.target.value)
                    : setInput(e.target.value)
                }
                onKeyDown={handleKey}
                placeholder={placeholder}
                dir="auto"
                className="flex-1 rounded-xl px-3 py-2.5 text-sm outline-none text-white placeholder-gray-600"
                style={{
                  background: "oklch(0.16 0.03 260)",
                  border: "1px solid oklch(0.30 0.08 145 / 0.4)",
                }}
              />
              <button
                type="button"
                data-ocid="chatbot.submit_button"
                onClick={() => {
                  if (step === "review_text") submitReview();
                  else sendMessage(input);
                }}
                disabled={step !== "review_text" && input.trim() === ""}
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:scale-110 disabled:opacity-35"
                style={{ background: "oklch(0.52 0.18 145)" }}
                aria-label="Send"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-4 h-4 fill-black"
                  aria-hidden="true"
                >
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
