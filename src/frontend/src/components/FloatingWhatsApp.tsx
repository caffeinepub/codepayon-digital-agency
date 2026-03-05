export default function FloatingWhatsApp() {
  return (
    <a
      href="https://wa.me/923164971661"
      target="_blank"
      rel="noopener noreferrer"
      data-ocid="whatsapp.button"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center text-2xl whatsapp-float transition-transform hover:scale-110 cursor-pointer"
      style={{
        background: "linear-gradient(135deg, #25D366, #128C7E)",
        boxShadow: "0 4px 20px rgba(37, 211, 102, 0.5)",
      }}
      aria-label="Chat on WhatsApp"
      title="WhatsApp پر رابطہ کریں"
    >
      💬{/* Ping ring */}
      <span
        className="absolute inset-0 rounded-full"
        style={{
          animation: "pulse-whatsapp 2s ease-in-out infinite",
          border: "2px solid rgba(37, 211, 102, 0.4)",
        }}
      />
    </a>
  );
}
