import { Button } from "@/components/ui/button";
import { LogIn, LogOut, Menu, User, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

interface NavbarProps {
  onOrderClick: () => void;
}

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Services", href: "#services" },
  { label: "Pricing", href: "#pricing" },
  { label: "Reviews", href: "#testimonials" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar({ onOrderClick }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { login, clear, identity, isLoggingIn, isInitializing } =
    useInternetIdentity();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const isLoggedIn = !!identity;
  const principalShort = isLoggedIn
    ? `${identity.getPrincipal().toString().slice(0, 8)}…`
    : null;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/95 backdrop-blur-xl border-b border-border shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="#home" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/40 flex items-center justify-center glow-green group-hover:scale-110 transition-transform">
            <span className="text-sm font-black text-gradient-green">C</span>
          </div>
          <span className="font-display text-xl font-black">
            <span className="text-gradient-green">Code</span>
            <span className="text-foreground">PayOn</span>
          </span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <button
              type="button"
              key={link.href}
              data-ocid="nav.link"
              onClick={() => handleNavClick(link.href)}
              className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/30 rounded-lg transition-all duration-200"
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Right side actions */}
        <div className="hidden md:flex items-center gap-2">
          {/* Internet Identity Login/User */}
          {isInitializing ? null : isLoggedIn ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 glass-card rounded-lg text-xs text-muted-foreground">
                <User className="w-3.5 h-3.5 text-primary" />
                <span className="font-mono">{principalShort}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={clear}
                data-ocid="nav.logout.button"
                className="text-muted-foreground hover:text-foreground gap-1.5 text-xs"
              >
                <LogOut className="w-3.5 h-3.5" />
                Logout
              </Button>
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={login}
              disabled={isLoggingIn}
              data-ocid="nav.login.button"
              className="border-primary/30 text-primary hover:bg-primary/10 gap-1.5 text-xs"
            >
              <LogIn className="w-3.5 h-3.5" />
              {isLoggingIn ? "Connecting…" : "Login"}
            </Button>
          )}

          <Button
            data-ocid="nav.primary_button"
            onClick={onOrderClick}
            className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold px-6 glow-green transition-all"
          >
            Order Now
          </Button>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          className="md:hidden p-2 text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-background/98 backdrop-blur-xl border-b border-border px-4 pb-4">
          {navLinks.map((link) => (
            <button
              type="button"
              key={link.href}
              data-ocid="nav.link"
              onClick={() => handleNavClick(link.href)}
              className="block w-full text-left px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/30 rounded-lg transition-all"
            >
              {link.label}
            </button>
          ))}
          <div className="mt-3 flex flex-col gap-2">
            {!isInitializing &&
              (isLoggedIn ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    clear();
                    setMobileOpen(false);
                  }}
                  className="w-full border-border text-muted-foreground gap-1.5"
                  data-ocid="nav.logout.button"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Logout ({principalShort})
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    login();
                    setMobileOpen(false);
                  }}
                  disabled={isLoggingIn}
                  className="w-full border-primary/30 text-primary gap-1.5"
                  data-ocid="nav.login.button"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  {isLoggingIn ? "Connecting…" : "Login"}
                </Button>
              ))}
            <Button
              data-ocid="nav.primary_button"
              onClick={() => {
                onOrderClick();
                setMobileOpen(false);
              }}
              className="w-full bg-primary text-primary-foreground font-bold glow-green"
            >
              ابھی آرڈر کریں
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
