import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { useState } from "react";
import ChatBot from "./components/ChatBot";
import ContactSection from "./components/ContactSection";
import FloatingWhatsApp from "./components/FloatingWhatsApp";
import Footer from "./components/Footer";
import GuaranteeSection from "./components/GuaranteeSection";
import HeroSection from "./components/HeroSection";
import Navbar from "./components/Navbar";
import OrderModal from "./components/OrderModal";
import ServicesSection from "./components/ServicesSection";
import StatsSection from "./components/StatsSection";
import TestimonialsSection from "./components/TestimonialsSection";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminLoginPage from "./pages/AdminLoginPage";

// ── Root layout ────────────────────────────────────────────────
function RootLayout() {
  return (
    <>
      <Outlet />
      <Toaster richColors position="top-right" />
    </>
  );
}

// ── Main site page ─────────────────────────────────────────────
function MainSitePage() {
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [preSelectedService, setPreSelectedService] = useState("");

  const openOrderModal = (service = "") => {
    setPreSelectedService(service);
    setOrderModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar onOrderClick={() => openOrderModal()} />
      <HeroSection onOrderClick={() => openOrderModal()} />
      <StatsSection />
      <ServicesSection onOrderClick={openOrderModal} />
      <GuaranteeSection />
      <TestimonialsSection />
      <ContactSection />
      <Footer />
      <OrderModal
        open={orderModalOpen}
        onOpenChange={setOrderModalOpen}
        preSelectedService={preSelectedService}
      />
      <FloatingWhatsApp />
      <ChatBot />
    </div>
  );
}

// ── Routes ─────────────────────────────────────────────────────
const rootRoute = createRootRoute({ component: RootLayout });

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: MainSitePage,
});

const adminLoginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminLoginPage,
});

const adminDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/dashboard",
  component: AdminDashboardPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  adminLoginRoute,
  adminDashboardRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
