import { useEffect, useRef, useState } from "react";

// ── Config ────────────────────────────────────────────────────────
const OWNER_WA = "923164971661"; // WhatsApp number (no +)
const _OWNER_WA2 = "923323449779";

// ── Knowledge base ────────────────────────────────────────────────
const KB = {
  whatsapp1: "+92 316 4971661",
  whatsapp2: "+92 332 3449779",
  email1: "codepayon@gmail.com",
  email2: "freepremiumapplicationapk@gmail.com",
  jazzcash: "03122000372",
  owner: "محمد سلیم خان (کینیڈا والا)",
};

type Lang = "ur" | "en";

function getAutoReply(input: string, lang: Lang): string {
  const q = input.toLowerCase().trim();

  if (lang === "ur") {
    if (q.match(/نمبر|واٹس ایپ|whatsapp|رابطہ|contact|call|کال/))
      return `📱 ہمارے WhatsApp نمبرز:\n${KB.whatsapp1}\n${KB.whatsapp2}\n\nآپ کا سوال مالک کو بھیج دیا گیا ہے – جلد جواب ملے گا!`;
    if (q.match(/ای میل|email|gmail/))
      return `📧 ای میل:\n${KB.email1}\n${KB.email2}\n\nآپ کا سوال مالک کو بھیج دیا گیا ہے!`;
    if (q.match(/جاز کیش|jazzcash|پیمنٹ|payment/))
      return `💳 JazzCash: ${KB.jazzcash}\n\nپیمنٹ کے بعد screenshot WhatsApp بھیجیں: ${KB.whatsapp1}\nآپ کا سوال مالک کو پہنچ گیا!`;
    if (q.match(/قیمت|price|ریٹ|rate|کتنا/))
      return "💰 سروسز کی قیمتیں:\n1️⃣ سوشل میڈیا سیٹ اپ: PKR 5,000\n2️⃣ ویڈیوز: PKR 1,000/ویڈیو\n3️⃣ Organic Growth: PKR 2 سے\n4️⃣ WhatsApp + Marketing: PKR 3,000\n5️⃣ پریمیم ٹولز: PKR 3,000\n\n✅ آپ کا سوال مالک کو بھی بھیج دیا گیا!";
    if (q.match(/یوٹیوب|youtube|مونیٹائز/))
      return "📌 سوشل میڈیا + مونیٹائزیشن: PKR 5,000\n✅ 80% کلائنٹس 3 مہینے میں مونیٹائز\n✅ YouTube, Facebook, TikTok + 20 پلیٹ فارمز\n\n✅ آپ کا سوال مالک کو بھیج دیا گیا!";
    if (q.match(/ویڈیو|video/))
      return "🎥 کاپی رائٹ فری ویڈیوز: PKR 1,000/ویڈیو\n✅ 15-30 منٹ Ready-to-Upload\n✅ Text-to-Video سافٹ ویئر\n\n✅ آپ کا سوال مالک کو بھیج دیا گیا!";
    if (q.match(/گروتھ|growth|سبسکرائبر|subscriber|لائیک|view/))
      return "🚀 Organic Growth ریٹس:\nSubscribers: PKR 20\nLikes/Views: PKR 2\nComments: PKR 5\n\n✅ آپ کا سوال مالک کو بھیج دیا گیا!";
    if (q.match(/ٹولز|tools|canva|netflix|chatgpt/))
      return "💻 لائف ٹائم پریمیم ٹولز: PKR 3,000\n✅ ChatGPT+, Canva Pro, Netflix, Disney+\n\n✅ آپ کا سوال مالک کو بھیج دیا گیا!";
    if (q.match(/آرڈر|order|خریدنا|buy/))
      return `🛒 آرڈر کریں:\n1️⃣ WhatsApp: ${KB.whatsapp1}\n2️⃣ JazzCash: ${KB.jazzcash}\n3️⃣ Screenshot WhatsApp پر بھیجیں\n\n✅ آپ کا سوال مالک کو بھیج دیا گیا!`;
    if (q.match(/سروس|service/))
      return "🌟 ہماری سروسز:\n1️⃣ سوشل میڈیا + مونیٹائزیشن (PKR 5,000)\n2️⃣ کاپی رائٹ فری ویڈیوز (PKR 1,000)\n3️⃣ Organic Growth\n4️⃣ WhatsApp + Marketing (PKR 3,000)\n5️⃣ پریمیم ٹولز (PKR 3,000)\n6️⃣ فل پیکج\n\n✅ آپ کا سوال مالک کو بھیج دیا گیا!";
    return `شکریہ! آپ کا سوال مالک کو WhatsApp پر بھیج دیا گیا ہے۔ جلد جواب ملے گا!\n\n📱 براہ راست رابطہ: ${KB.whatsapp1}`;
  }

  // English
  if (q.match(/whatsapp|number|contact|call/))
    return `📱 WhatsApp Numbers:\n${KB.whatsapp1}\n${KB.whatsapp2}\n\n✅ Your question has been forwarded to the owner!`;
  if (q.match(/email|gmail/))
    return `📧 Email:\n${KB.email1}\n${KB.email2}\n\n✅ Your question has been forwarded!`;
  if (q.match(/jazzcash|payment|pay/))
    return `💳 JazzCash: ${KB.jazzcash}\n\nSend screenshot to WhatsApp: ${KB.whatsapp1}\n✅ Your question forwarded!`;
  if (q.match(/price|cost|rate|how much/))
    return "💰 Service Prices:\n1️⃣ Social Media Setup: PKR 5,000\n2️⃣ Videos: PKR 1,000/video\n3️⃣ Organic Growth: from PKR 2\n4️⃣ WhatsApp + Marketing: PKR 3,000\n5️⃣ Premium Tools: PKR 3,000\n\n✅ Your question forwarded to owner!";
  if (q.match(/youtube|monetize|channel/))
    return "📌 Social Media + Monetization: PKR 5,000\n✅ 80% clients monetized in 3 months\n✅ YouTube, Facebook, TikTok + 20 platforms\n\n✅ Your question forwarded!";
  if (q.match(/video|copyright/))
    return "🎥 Copyright-Free Videos: PKR 1,000/video\n✅ 15-30 min ready-to-upload\n✅ Text-to-Video tools included\n\n✅ Your question forwarded!";
  if (q.match(/growth|subscriber|like|view/))
    return "🚀 Organic Growth Rates:\nSubscribers: PKR 20\nLikes/Views: PKR 2\nComments: PKR 5\n\n✅ Your question forwarded!";
  if (q.match(/tools|canva|netflix|chatgpt/))
    return "💻 Lifetime Premium Tools: PKR 3,000\n✅ ChatGPT+, Canva Pro, Netflix, Disney+\n\n✅ Your question forwarded!";
  if (q.match(/order|buy|purchase/))
    return `🛒 Place an Order:\n1️⃣ WhatsApp: ${KB.whatsapp1}\n2️⃣ JazzCash: ${KB.jazzcash}\n3️⃣ Send screenshot to WhatsApp\n\n✅ Your question forwarded!`;
  if (q.match(/service|offer|provide/))
    return "🌟 Our Services:\n1️⃣ Social Media + Monetization (PKR 5,000)\n2️⃣ Copyright-Free Videos (PKR 1,000)\n3️⃣ Organic Growth\n4️⃣ WhatsApp + Marketing (PKR 3,000)\n5️⃣ Premium Tools (PKR 3,000)\n6️⃣ Full Package\n\n✅ Your question forwarded!";
  return `Thank you! Your question has been forwarded to the owner on WhatsApp. You'll get a reply soon!\n\n📱 Direct contact: ${KB.whatsapp1}`;
}

// Send question to owner's WhatsApp
function sendToWhatsApp(
  userName: string,
  userPhone: string,
  question: string,
  lang: Lang,
) {
  const header =
    lang === "ur"
      ? `🔔 *نئی ویب سائٹ انکوائری*\n━━━━━━━━━━━━━━━\n👤 نام: ${userName}\n📱 فون: ${userPhone || "نہیں دیا"}\n💬 سوال:`
      : `🔔 *New Website Inquiry*\n━━━━━━━━━━━━━━━\n👤 Name: ${userName}\n📱 Phone: ${userPhone || "Not provided"}\n💬 Question:`;
  const body = `${header}\n${question}\n━━━━━━━━━━━━━━━\n🌐 From: CodePayOn Website Chatbot`;
  const encoded = encodeURIComponent(body);
  window.open(`https://wa.me/${OWNER_WA}?text=${encoded}`, "_blank");
}

// ── Types ─────────────────────────────────────────────────────────
interface Message {
  id: number;
  from: "bot" | "user";
  text: string;
  time: string;
}

function nowTime() {
  return new Date().toLocaleTimeString("en-PK", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

type Step = "lang" | "name" | "phone" | "chat";

// ── Component ─────────────────────────────────────────────────────
export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState<Lang>("ur");
  const [step, setStep] = useState<Step>("lang");
  const [userName, setUserName] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [pulse, setPulse] = useState(true);
  const msgEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const nextId = useRef(1);
  const [nameInput, setNameInput] = useState("");
  const [phoneInput, setPhoneInput] = useState("");

  // Initial lang selection message
  // biome-ignore lint/correctness/useExhaustiveDependencies: addBotMsg is stable
  useEffect(() => {
    if (open && messages.length === 0) {
      addBotMsg(
        "السلام علیکم! 👋 میں *ثمینہ* ہوں، CodePayOn Digital Agency کی سپورٹ اسسٹنٹ۔\n\nHello! I'm *Sameena*, your support assistant.\n\nکس زبان میں بات کریں؟\nWhich language do you prefer?",
        true,
      );
    }
  }, [open]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional scroll on messages/typing
  useEffect(() => {
    msgEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  useEffect(() => {
    const t = setTimeout(() => setPulse(false), 8000);
    return () => clearTimeout(t);
  }, []);

  function addBotMsg(text: string, skipFormat = false) {
    const id = nextId.current++;
    setMessages((prev) => [
      ...prev,
      { id, from: "bot", text: skipFormat ? text : text, time: nowTime() },
    ]);
  }

  function addUserMsg(text: string) {
    const id = nextId.current++;
    setMessages((prev) => [
      ...prev,
      { id, from: "user", text, time: nowTime() },
    ]);
  }

  // Step: language chosen
  function chooseLang(chosen: Lang) {
    setLang(chosen);
    addUserMsg(chosen === "ur" ? "اردو" : "English");
    setStep("name");
    setTimeout(() => {
      addBotMsg(
        chosen === "ur"
          ? "بہت اچھا! 😊\n\nبراہ کرم اپنا نام بتائیں:"
          : "Great! 😊\n\nPlease tell me your name:",
      );
    }, 500);
  }

  // Step: name submitted
  function submitName() {
    const n = nameInput.trim();
    if (!n) return;
    setUserName(n);
    setNameInput("");
    addUserMsg(n);
    setStep("phone");
    setTimeout(() => {
      addBotMsg(
        lang === "ur"
          ? `شکریہ ${n}! 🌸\n\nآپ کا WhatsApp / فون نمبر بتائیں (تاکہ مالک آپ سے براہ راست رابطہ کر سکیں):\n\n*(اختیاری – چھوڑنا چاہیں تو "skip" لکھیں)*`
          : `Thank you ${n}! 🌸\n\nPlease share your WhatsApp/phone number (so the owner can reply to you directly):\n\n*(Optional – type "skip" to skip)*`,
      );
    }, 500);
  }

  // Step: phone submitted
  function submitPhone() {
    const p = phoneInput.trim();
    setUserPhone(p === "skip" || p === "اسکپ" ? "" : p);
    setPhoneInput("");
    addUserMsg(p);
    setStep("chat");
    setTimeout(() => {
      addBotMsg(
        lang === "ur"
          ? `بالکل! اب آپ کوئی بھی سوال پوچھ سکتے ہیں۔ 💬\n\nآپ کا سوال فوری طور پر مالک کے WhatsApp پر بھی بھیج دیا جائے گا تاکہ وہ آپ کو ذاتی طور پر جواب دے سکیں!\n\n📱 مالک کا نمبر: ${KB.whatsapp1}`
          : `All set! You can ask any question now. 💬\n\nYour question will also be forwarded directly to the owner's WhatsApp so they can reply to you personally!\n\n📱 Owner's number: ${KB.whatsapp1}`,
      );
    }, 500);
  }

  // Main chat
  async function handleSend() {
    const trimmed = input.trim();
    if (!trimmed) return;
    setInput("");
    addUserMsg(trimmed);

    // Forward to WhatsApp automatically
    sendToWhatsApp(userName || "Guest", userPhone, trimmed, lang);

    // Auto reply with typing delay
    setTyping(true);
    await new Promise((r) => setTimeout(r, 900 + Math.random() * 500));
    setTyping(false);

    const reply = getAutoReply(trimmed, lang);
    addBotMsg(reply);
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (step === "name") submitName();
      else if (step === "phone") submitPhone();
      else handleSend();
    }
  }

  const placeholderText =
    step === "name"
      ? lang === "ur"
        ? "اپنا نام لکھیں..."
        : "Your name..."
      : step === "phone"
        ? lang === "ur"
          ? "فون نمبر یا skip..."
          : "Phone number or skip..."
        : lang === "ur"
          ? "سوال پوچھیں..."
          : "Ask a question...";

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (step === "name") setNameInput(e.target.value);
    else if (step === "phone") setPhoneInput(e.target.value);
    else setInput(e.target.value);
  }

  function getInputValue() {
    if (step === "name") return nameInput;
    if (step === "phone") return phoneInput;
    return input;
  }

  function handleSubmitStep() {
    if (step === "name") submitName();
    else if (step === "phone") submitPhone();
    else handleSend();
  }

  const quickChips =
    lang === "ur"
      ? [
          { label: "💰 قیمتیں", q: "قیمتیں" },
          { label: "📱 واٹس ایپ", q: "واٹس ایپ نمبر" },
          { label: "🌟 سروسز", q: "سروسز" },
          { label: "🛒 آرڈر", q: "آرڈر کیسے" },
          { label: "🎯 یوٹیوب", q: "یوٹیوب مونیٹائزیشن" },
        ]
      : [
          { label: "💰 Prices", q: "What are the prices?" },
          { label: "📱 WhatsApp", q: "WhatsApp number" },
          { label: "🌟 Services", q: "What services?" },
          { label: "🛒 Order", q: "How to order?" },
          { label: "🎯 YouTube", q: "YouTube monetization" },
        ];

  async function sendQuickChip(q: string) {
    addUserMsg(q);
    sendToWhatsApp(userName || "Guest", userPhone, q, lang);
    setTyping(true);
    await new Promise((r) => setTimeout(r, 800));
    setTyping(false);
    addBotMsg(getAutoReply(q, lang));
  }

  return (
    <>
      {/* ── Floating button ── */}
      <button
        type="button"
        data-ocid="chatbot.open_modal_button"
        onClick={() => {
          setOpen((v) => !v);
          setPulse(false);
        }}
        className="fixed bottom-6 left-6 z-50 flex flex-col items-center gap-1 group"
        aria-label="Open Chat"
      >
        <div className="relative">
          {pulse && (
            <span className="absolute inset-0 rounded-full animate-ping bg-green-400 opacity-40" />
          )}
          <div
            className="w-16 h-16 rounded-full overflow-hidden border-2 border-green-400 shadow-lg group-hover:scale-110 transition-transform duration-200"
            style={{ background: "linear-gradient(135deg, #1a1a2e, #16213e)" }}
          >
            <img
              src="/assets/generated/chatbot-girl-transparent.dim_200x300.png"
              alt="Support"
              className="w-full h-full object-cover object-top"
            />
          </div>
          <span className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-green-400 border-2 border-background" />
        </div>
        <span
          className="text-[10px] font-bold text-green-400 bg-background/80 px-1.5 py-0.5 rounded-full border border-green-400/30"
          style={{ backdropFilter: "blur(4px)" }}
        >
          ثمینہ
        </span>
      </button>

      {/* ── Chat panel ── */}
      {open && (
        <div
          data-ocid="chatbot.panel"
          className="fixed bottom-28 left-4 z-50 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
          style={{
            width: "min(360px, calc(100vw - 32px))",
            height: "520px",
            background: "oklch(0.12 0.02 250)",
            border: "1px solid oklch(0.25 0.08 145 / 0.5)",
          }}
        >
          {/* Header */}
          <div
            className="flex items-center gap-3 px-4 py-3 flex-shrink-0"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.18 0.06 145 / 0.95), oklch(0.15 0.04 250 / 0.95))",
              borderBottom: "1px solid oklch(0.25 0.08 145 / 0.4)",
            }}
          >
            <div className="relative w-10 h-10 rounded-full overflow-hidden border border-green-400/60 flex-shrink-0">
              <img
                src="/assets/generated/chatbot-girl-transparent.dim_200x300.png"
                alt="Sameena"
                className="w-full h-full object-cover object-top"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm text-white">ثمینہ | Sameena</p>
              <p className="text-[11px] text-green-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block animate-pulse" />
                Online – CodePayOn Support
              </p>
            </div>
            {/* WhatsApp direct button */}
            <button
              type="button"
              onClick={() => window.open(`https://wa.me/${OWNER_WA}`, "_blank")}
              title="Direct WhatsApp"
              className="w-8 h-8 rounded-lg flex items-center justify-center text-base hover:scale-110 transition-transform"
              style={{ background: "#25D36620", border: "1px solid #25D36640" }}
            >
              💬
            </button>
            <button
              type="button"
              data-ocid="chatbot.close_button"
              onClick={() => setOpen(false)}
              className="text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10 ml-1"
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          {/* WhatsApp forward notice */}
          {step === "chat" && (
            <div
              className="px-4 py-1.5 text-[11px] text-center flex-shrink-0"
              style={{
                background: "oklch(0.55 0.18 145 / 0.12)",
                borderBottom: "1px solid oklch(0.55 0.18 145 / 0.2)",
                color: "oklch(0.75 0.15 145)",
              }}
            >
              {lang === "ur"
                ? "📲 آپ کے سوالات مالک کے WhatsApp پر فوری پہنچتے ہیں"
                : "📲 Your questions are forwarded instantly to the owner's WhatsApp"}
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2 ${msg.from === "user" ? "flex-row-reverse" : "flex-row"}`}
              >
                {msg.from === "bot" && (
                  <div className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0 border border-green-400/40 mt-1">
                    <img
                      src="/assets/generated/chatbot-girl-transparent.dim_200x300.png"
                      alt="bot"
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                )}
                <div
                  className={`max-w-[78%] rounded-2xl px-3 py-2 text-sm whitespace-pre-wrap leading-relaxed ${
                    msg.from === "user" ? "rounded-tr-sm" : "rounded-tl-sm"
                  }`}
                  dir="auto"
                  style={{
                    background:
                      msg.from === "user"
                        ? "oklch(0.52 0.18 145)"
                        : "oklch(0.2 0.03 250)",
                    color: "#f0f0f0",
                  }}
                >
                  {msg.text}
                  <div
                    className={`text-[10px] mt-1 opacity-50 ${msg.from === "user" ? "text-right" : "text-left"}`}
                  >
                    {msg.time}
                  </div>
                </div>
              </div>
            ))}

            {typing && (
              <div className="flex gap-2 items-end">
                <div className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0 border border-green-400/40">
                  <img
                    src="/assets/generated/chatbot-girl-transparent.dim_200x300.png"
                    alt="bot"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div
                  className="rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1"
                  style={{ background: "oklch(0.2 0.03 250)" }}
                >
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="w-2 h-2 rounded-full bg-green-400 animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
              </div>
            )}
            <div ref={msgEndRef} />
          </div>

          {/* Language chooser buttons */}
          {step === "lang" && (
            <div
              className="px-4 py-3 flex gap-3 flex-shrink-0"
              style={{ borderTop: "1px solid oklch(0.2 0.04 250 / 0.5)" }}
            >
              <button
                type="button"
                data-ocid="chatbot.lang_ur.button"
                onClick={() => chooseLang("ur")}
                className="flex-1 py-2.5 rounded-xl font-bold text-sm transition-all hover:scale-105"
                style={{
                  background: "oklch(0.52 0.18 145)",
                  color: "#0a0a0a",
                }}
              >
                🇵🇰 اردو
              </button>
              <button
                type="button"
                data-ocid="chatbot.lang_en.button"
                onClick={() => chooseLang("en")}
                className="flex-1 py-2.5 rounded-xl font-bold text-sm transition-all hover:scale-105"
                style={{
                  background: "oklch(0.38 0.1 250)",
                  color: "#fff",
                }}
              >
                🇬🇧 English
              </button>
            </div>
          )}

          {/* Quick chips – only in chat step */}
          {step === "chat" && (
            <div
              className="px-3 py-2 flex gap-2 overflow-x-auto scrollbar-none flex-shrink-0"
              style={{ borderTop: "1px solid oklch(0.2 0.04 250 / 0.4)" }}
            >
              {quickChips.map((chip) => (
                <button
                  key={chip.q}
                  type="button"
                  onClick={() => sendQuickChip(chip.q)}
                  className="flex-shrink-0 text-xs px-3 py-1.5 rounded-full font-medium transition-all hover:scale-105"
                  style={{
                    background: "oklch(0.22 0.06 145 / 0.5)",
                    border: "1px solid oklch(0.4 0.12 145 / 0.4)",
                    color: "oklch(0.78 0.15 145)",
                  }}
                >
                  {chip.label}
                </button>
              ))}
            </div>
          )}

          {/* Input row – shown in name/phone/chat steps */}
          {step !== "lang" && (
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
                type={step === "phone" ? "tel" : "text"}
                value={getInputValue()}
                onChange={onInputChange}
                onKeyDown={handleKey}
                placeholder={placeholderText}
                dir="auto"
                className="flex-1 rounded-xl px-3 py-2 text-sm outline-none placeholder-gray-500 text-white"
                style={{
                  background: "oklch(0.18 0.03 250)",
                  border: "1px solid oklch(0.28 0.06 145 / 0.4)",
                }}
              />
              <button
                type="button"
                data-ocid="chatbot.submit_button"
                onClick={handleSubmitStep}
                disabled={getInputValue().trim() === "" && step === "chat"}
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:scale-110 disabled:opacity-40"
                style={{ background: "oklch(0.52 0.18 145)" }}
                aria-label="Send"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-4 h-4 fill-black"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  focusable="false"
                >
                  <title>Send</title>
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
