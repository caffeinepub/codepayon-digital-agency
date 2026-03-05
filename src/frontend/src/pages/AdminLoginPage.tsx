import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "@tanstack/react-router";
import { AlertCircle, Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";

const ADMIN_USERNAME = "admin07860";
const ADMIN_PASSWORD = "07860";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect
  useEffect(() => {
    if (localStorage.getItem("adminLoggedIn") === "true") {
      void navigate({ to: "/admin/dashboard" });
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Simulate small delay for UX
    await new Promise((r) => setTimeout(r, 600));

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      localStorage.setItem("adminLoggedIn", "true");
      void navigate({ to: "/admin/dashboard" });
    } else {
      setError("غلط یوزرنیم یا پاسورڈ");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div
        className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, oklch(0.72 0.22 145), transparent)",
        }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full opacity-8 blur-3xl pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, oklch(0.82 0.18 85), transparent)",
        }}
      />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/20 border border-primary/40 glow-green mb-4">
            <ShieldCheck className="w-8 h-8 text-primary" />
          </div>
          <h1 className="font-display text-3xl font-black">
            <span className="text-gradient-green">Code</span>
            <span className="text-foreground">PayOn</span>
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            ایڈمن پینل – محفوظ رسائی
          </p>
        </div>

        {/* Login card */}
        <div className="glass-card rounded-2xl p-8">
          <h2 className="font-display text-xl font-bold text-foreground mb-6 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-primary" />
            Admin Login
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div className="space-y-2">
              <Label
                htmlFor="admin-username"
                className="text-sm font-medium text-foreground"
              >
                یوزرنیم
              </Label>
              <Input
                id="admin-username"
                data-ocid="admin.username.input"
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
                className="bg-input border-border focus:border-primary/60 h-11"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label
                htmlFor="admin-password"
                className="text-sm font-medium text-foreground"
              >
                پاسورڈ
              </Label>
              <div className="relative">
                <Input
                  id="admin-password"
                  data-ocid="admin.password.input"
                  type={showPass ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="bg-input border-border focus:border-primary/60 h-11 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPass ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div
                data-ocid="admin.login.error_state"
                className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/30"
              >
                <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0" />
                <p className="text-sm text-destructive" dir="rtl">
                  {error}
                </p>
              </div>
            )}

            {/* Submit */}
            <Button
              type="submit"
              data-ocid="admin.login.submit_button"
              disabled={loading}
              className="w-full h-11 bg-primary text-primary-foreground font-bold glow-green text-base"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  لاگ ان ہو رہے ہیں...
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 mr-2" />
                  Login
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 pt-4 border-t border-border">
            <a
              href="/"
              className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
            >
              ← واپس مین سائٹ پر
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
