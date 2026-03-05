import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "@tanstack/react-router";
import {
  BarChart3,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Loader2,
  LogOut,
  Megaphone,
  MessageSquare,
  Plus,
  RefreshCw,
  Save,
  ShieldCheck,
  ShoppingBag,
  Star,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { Order } from "../backend.d";
import { useActor } from "../hooks/useActor";
import {
  ReferralStatus,
  useAddTestimonial,
  useApproveTestimonial,
  useApprovedTestimonials,
  useDeleteOrder,
  useDeleteTestimonial,
  useInquiries,
  useOrdersByStatus,
  useStats,
  useUpdateOrderStatus,
} from "../hooks/useQueries";

// ── Auth guard ─────────────────────────────────────────────────
function useAdminGuard() {
  const navigate = useNavigate();
  useEffect(() => {
    if (localStorage.getItem("adminLoggedIn") !== "true") {
      void navigate({ to: "/admin" });
    }
  }, [navigate]);
}

// ── Status config ──────────────────────────────────────────────
const statusColors: Record<string, string> = {
  pending: "#FFD700",
  inProgress: "#00B4FF",
  completed: "#00C851",
};
const statusLabels: Record<string, string> = {
  pending: "Pending",
  inProgress: "In Progress",
  completed: "Completed",
};

// ── Order Row ──────────────────────────────────────────────────
function OrderRow({ order, index }: { order: Order; index: number }) {
  const { mutateAsync: updateStatus, isPending: isUpdating } =
    useUpdateOrderStatus();
  const { mutateAsync: deleteOrder, isPending: isDeleting } = useDeleteOrder();

  const handleStatusChange = async (status: string) => {
    try {
      await updateStatus({ id: order.id, status: status as ReferralStatus });
      toast.success("Status updated");
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async () => {
    if (!confirm("اس آرڈر کو ڈیلیٹ کریں؟")) return;
    try {
      await deleteOrder(order.id);
      toast.success("Order deleted");
    } catch {
      toast.error("Failed to delete order");
    }
  };

  const waText = encodeURIComponent(
    `آپ کا آرڈر موصول ہوا!\nسروس: ${order.service}\nنام: ${order.name}\nہم جلد رابطہ کریں گے۔`,
  );
  const waPhone = order.whatsapp || order.phone;
  const cleanPhone = waPhone.replace(/\D/g, "");
  const waUrl = `https://wa.me/${cleanPhone.startsWith("92") ? cleanPhone : `92${cleanPhone.replace(/^0/, "")}`}?text=${waText}`;

  return (
    <TableRow
      data-ocid={`admin.orders.row.${index + 1}`}
      className="border-border hover:bg-muted/20"
    >
      <TableCell className="text-xs text-muted-foreground font-mono">
        #{order.id.toString()}
      </TableCell>
      <TableCell className="font-medium text-sm text-foreground">
        {order.name}
      </TableCell>
      <TableCell className="text-sm text-muted-foreground">
        {order.phone}
      </TableCell>
      <TableCell className="text-xs text-muted-foreground">
        {order.whatsapp || "—"}
      </TableCell>
      <TableCell
        className="text-xs text-muted-foreground max-w-[120px] truncate"
        title={order.service}
      >
        {order.service}
      </TableCell>
      <TableCell
        className="text-xs text-muted-foreground max-w-[100px] truncate"
        title={order.message}
      >
        {order.message || "—"}
      </TableCell>
      <TableCell className="text-xs text-muted-foreground">
        {order.timestamp ? new Date(order.timestamp).toLocaleDateString() : "—"}
      </TableCell>
      <TableCell>
        <span
          className="text-xs px-2 py-1 rounded-full font-bold whitespace-nowrap"
          style={{
            background: `${statusColors[order.status] ?? "#888"}20`,
            color: statusColors[order.status] ?? "#888",
          }}
        >
          {statusLabels[order.status] ?? order.status}
        </span>
      </TableCell>
      <TableCell>
        <Select
          value={order.status}
          onValueChange={handleStatusChange}
          disabled={isUpdating}
        >
          <SelectTrigger
            data-ocid={`admin.order.status.select.${index + 1}`}
            className="h-7 text-xs w-28 bg-input border-border"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-popover border-border">
            <SelectItem value={ReferralStatus.pending}>Pending</SelectItem>
            <SelectItem value={ReferralStatus.inProgress}>
              In Progress
            </SelectItem>
            <SelectItem value={ReferralStatus.completed}>Completed</SelectItem>
          </SelectContent>
        </Select>
      </TableCell>
      <TableCell>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.open(waUrl, "_blank")}
            className="h-7 px-2 text-[#25D366] hover:bg-[#25D36620] text-xs"
            title="WhatsApp Message"
          >
            💬
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
            disabled={isDeleting}
            data-ocid={`admin.order.delete_button.${index + 1}`}
            className="h-7 w-7 text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

// ── Ad Network Card ────────────────────────────────────────────
interface AdNetworkConfig {
  id: string;
  name: string;
  icon: string;
  color: string;
  fields: { key: string; label: string; placeholder: string }[];
  instructions: string;
  ocid: string;
}

const adNetworks: AdNetworkConfig[] = [
  {
    id: "admob",
    name: "AdMob (Google)",
    icon: "🔵",
    color: "#4285F4",
    ocid: "admin.admob.toggle",
    fields: [
      {
        key: "publisherId",
        label: "Publisher ID",
        placeholder: "ca-app-pub-XXXXXXXXXXXXXXXX",
      },
      {
        key: "bannerAdUnitId",
        label: "Banner Ad Unit ID",
        placeholder: "ca-app-pub-XXXXX/XXXXXXXX",
      },
      {
        key: "interstitialAdUnitId",
        label: "Interstitial Ad Unit ID",
        placeholder: "ca-app-pub-XXXXX/XXXXXXXX",
      },
    ],
    instructions:
      "AdMob صرف موبائل ایپس میں کام کرتا ہے۔ اپنی Android/iOS ایپ میں AdMob SDK شامل کریں۔",
  },
  {
    id: "unity",
    name: "Unity Ads",
    icon: "⬛",
    color: "#333333",
    ocid: "admin.unity.toggle",
    fields: [
      { key: "gameId", label: "Game ID", placeholder: "1234567" },
      {
        key: "bannerPlacementId",
        label: "Banner Placement ID",
        placeholder: "Banner_Android",
      },
      {
        key: "interstitialPlacementId",
        label: "Interstitial Placement ID",
        placeholder: "Interstitial_Android",
      },
      {
        key: "rewardedPlacementId",
        label: "Rewarded Placement ID",
        placeholder: "Rewarded_Android",
      },
    ],
    instructions:
      "Unity Ads گیمز اور ایپس کے لیے بہترین ہے۔ Unity Dashboard سے Game ID حاصل کریں۔",
  },
  {
    id: "meta",
    name: "Meta Audience Network",
    icon: "🔷",
    color: "#1877F2",
    ocid: "admin.meta.toggle",
    fields: [
      { key: "appId", label: "App ID", placeholder: "123456789012345" },
      {
        key: "bannerPlacementId",
        label: "Banner Placement ID",
        placeholder: "123456789012345_123456789012346",
      },
      {
        key: "interstitialPlacementId",
        label: "Interstitial Placement ID",
        placeholder: "123456789012345_123456789012347",
      },
    ],
    instructions:
      "Facebook Meta Audience Network سے monetize کریں۔ Meta Business Manager پر App register کریں۔",
  },
  {
    id: "applovin",
    name: "AppLovin MAX",
    icon: "🔴",
    color: "#E8372C",
    ocid: "admin.applovin.toggle",
    fields: [
      { key: "sdkKey", label: "SDK Key", placeholder: "YOUR_SDK_KEY_HERE" },
      {
        key: "bannerAdUnitId",
        label: "Banner Ad Unit ID",
        placeholder: "XXXXXXXXXXXXXXXX",
      },
      {
        key: "interstitialAdUnitId",
        label: "Interstitial Ad Unit ID",
        placeholder: "XXXXXXXXXXXXXXXX",
      },
      {
        key: "rewardedAdUnitId",
        label: "Rewarded Ad Unit ID",
        placeholder: "XXXXXXXXXXXXXXXX",
      },
    ],
    instructions:
      "AppLovin MAX ایک mediation platform ہے جو سب سے زیادہ revenue دیتا ہے۔",
  },
  {
    id: "ironsource",
    name: "ironSource (Unity LevelPlay)",
    icon: "🟣",
    color: "#8B5CF6",
    ocid: "admin.ironsource.toggle",
    fields: [
      { key: "appKey", label: "App Key", placeholder: "YOUR_APP_KEY" },
      {
        key: "bannerAdUnitId",
        label: "Banner Ad Unit ID",
        placeholder: "BANNER_AD_UNIT",
      },
      {
        key: "interstitialAdUnitId",
        label: "Interstitial Ad Unit ID",
        placeholder: "INTERSTITIAL_AD_UNIT",
      },
      {
        key: "rewardedAdUnitId",
        label: "Rewarded Video Ad Unit ID",
        placeholder: "REWARDED_AD_UNIT",
      },
    ],
    instructions:
      "ironSource اب Unity LevelPlay کا حصہ ہے۔ LevelPlay dashboard سے App Key لیں۔",
  },
  {
    id: "inmobi",
    name: "InMobi",
    icon: "🟢",
    color: "#00C853",
    ocid: "admin.inmobi.toggle",
    fields: [
      { key: "accountId", label: "Account ID", placeholder: "YOUR_ACCOUNT_ID" },
      {
        key: "bannerSiteId",
        label: "Banner Site ID",
        placeholder: "BANNER_SITE_ID",
      },
      {
        key: "interstitialSiteId",
        label: "Interstitial Site ID",
        placeholder: "INTERSTITIAL_SITE_ID",
      },
    ],
    instructions:
      "InMobi Asia-Pacific region کے لیے بہترین ہے۔ inmobi.com پر account بنائیں۔",
  },
];

type AdSettings = Record<
  string,
  { enabled: boolean; values: Record<string, string> }
>;

function loadAdSettings(): AdSettings {
  try {
    const stored = localStorage.getItem("adSettings");
    if (stored) return JSON.parse(stored) as AdSettings;
  } catch {}
  const defaults: AdSettings = {};
  for (const n of adNetworks) {
    defaults[n.id] = { enabled: false, values: {} };
  }
  return defaults;
}

function AdNetworkCard({ network }: { network: AdNetworkConfig }) {
  const [settings, setSettings] = useState<AdSettings>(loadAdSettings);
  const [expanded, setExpanded] = useState(false);

  const networkSettings = settings[network.id] ?? {
    enabled: false,
    values: {},
  };

  const updateSettings = (updated: AdSettings) => {
    setSettings(updated);
    localStorage.setItem("adSettings", JSON.stringify(updated));
  };

  const handleToggle = (checked: boolean) => {
    const updated = {
      ...settings,
      [network.id]: { ...networkSettings, enabled: checked },
    };
    updateSettings(updated);
    toast.success(`${network.name} ${checked ? "enabled" : "disabled"}`);
  };

  const handleFieldChange = (key: string, value: string) => {
    const updated = {
      ...settings,
      [network.id]: {
        ...networkSettings,
        values: { ...networkSettings.values, [key]: value },
      },
    };
    setSettings(updated);
  };

  const handleSave = () => {
    localStorage.setItem("adSettings", JSON.stringify(settings));
    toast.success(`${network.name} settings saved!`);
  };

  return (
    <div
      className="glass-card rounded-xl overflow-hidden"
      style={{ borderColor: `${network.color}20` }}
    >
      {/* Header row */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{network.icon}</span>
          <div>
            <h4 className="font-display text-sm font-bold text-foreground">
              {network.name}
            </h4>
            <span
              className="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
              style={{ background: `${network.color}15`, color: network.color }}
            >
              {networkSettings.enabled ? "Active" : "Inactive"}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Switch
            data-ocid={network.ocid}
            checked={networkSettings.enabled}
            onCheckedChange={handleToggle}
          />
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="p-1 text-muted-foreground hover:text-foreground transition-colors"
          >
            {expanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Expandable settings */}
      {expanded && (
        <div className="px-4 pb-4 border-t border-border pt-4 space-y-4">
          {/* Instructions */}
          <div
            className="p-3 rounded-lg text-xs leading-relaxed"
            style={{
              background: `${network.color}08`,
              borderLeft: `3px solid ${network.color}`,
            }}
            dir="rtl"
          >
            💡 {network.instructions}
          </div>

          {/* Fields */}
          <div className="space-y-3">
            {network.fields.map((field) => (
              <div key={field.key} className="space-y-1">
                <Label className="text-xs font-medium text-muted-foreground">
                  {field.label}
                </Label>
                <Input
                  value={networkSettings.values[field.key] ?? ""}
                  onChange={(e) => handleFieldChange(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  className="h-8 text-xs bg-input border-border font-mono"
                />
              </div>
            ))}
          </div>

          <Button
            type="button"
            size="sm"
            onClick={handleSave}
            className="w-full gap-2 font-bold"
            style={{ background: network.color, color: "#fff" }}
          >
            <Save className="w-3.5 h-3.5" />
            Save {network.name} Settings
          </Button>
        </div>
      )}
    </div>
  );
}

// ── Add Testimonial Form ───────────────────────────────────────
function AddTestimonialForm() {
  const [name, setName] = useState("");
  const [review, setReview] = useState("");
  const [rating, setRating] = useState("5");
  const [service, setService] = useState("");
  const { mutateAsync: addTestimonial, isPending } = useAddTestimonial();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !review || !service) {
      toast.error("تمام فیلڈز ضروری ہیں");
      return;
    }
    try {
      await addTestimonial({ name, review, rating: BigInt(rating), service });
      toast.success("Testimonial added!");
      setName("");
      setReview("");
      setRating("5");
      setService("");
    } catch {
      toast.error("Failed to add testimonial");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="glass-card rounded-xl p-4 space-y-3 mb-6"
    >
      <h3 className="font-display text-sm font-bold text-foreground flex items-center gap-2">
        <Plus className="w-4 h-4 text-primary" />
        نیا ریویو شامل کریں
      </h3>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label className="text-xs">Client Name</Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="نام"
            className="h-8 text-xs bg-input border-border"
            required
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Rating</Label>
          <Select value={rating} onValueChange={setRating}>
            <SelectTrigger className="h-8 text-xs bg-input border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              {[5, 4, 3, 2, 1].map((r) => (
                <SelectItem key={r} value={String(r)}>
                  {"⭐".repeat(r)} ({r})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-1">
        <Label className="text-xs">Service</Label>
        <Input
          value={service}
          onChange={(e) => setService(e.target.value)}
          placeholder="سروس کا نام"
          className="h-8 text-xs bg-input border-border"
          required
        />
      </div>
      <div className="space-y-1">
        <Label className="text-xs">Review</Label>
        <Textarea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder="ریویو لکھیں..."
          rows={3}
          className="text-xs bg-input border-border resize-none"
          required
          dir="rtl"
        />
      </div>
      <Button
        type="submit"
        size="sm"
        disabled={isPending}
        className="w-full bg-primary text-primary-foreground font-bold gap-2"
      >
        {isPending ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          <Plus className="w-3.5 h-3.5" />
        )}
        شامل کریں
      </Button>
    </form>
  );
}

// ── Main Dashboard ─────────────────────────────────────────────
export default function AdminDashboardPage() {
  useAdminGuard();
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<ReferralStatus>(
    ReferralStatus.pending,
  );

  const {
    data: orders,
    isLoading: ordersLoading,
    refetch: refetchOrders,
  } = useOrdersByStatus(statusFilter);
  const {
    data: inquiries,
    isLoading: inquiriesLoading,
    refetch: refetchInquiries,
  } = useInquiries();
  const {
    data: testimonials,
    isLoading: testimonialsLoading,
    refetch: refetchTestimonials,
  } = useApprovedTestimonials();
  const { data: stats } = useStats();
  const { actor } = useActor();
  const { mutateAsync: approveTestimonial } = useApproveTestimonial();
  const { mutateAsync: deleteTestimonial } = useDeleteTestimonial();

  // Stats editing
  const [totalClients, setTotalClients] = useState("");
  const [videosCreated, setVideosCreated] = useState("");
  const [successRate, setSuccessRate] = useState("");
  const [statsSaving, setStatsSaving] = useState(false);

  useEffect(() => {
    if (stats) {
      setTotalClients(stats.totalClients.toString());
      setVideosCreated(stats.videosCreated.toString());
      setSuccessRate(stats.successRate.toString());
    }
  }, [stats]);

  const handleSaveStats = async () => {
    if (!actor) {
      toast.error("Actor not ready");
      return;
    }
    setStatsSaving(true);
    try {
      await actor.updateStats({
        totalClients: BigInt(totalClients || "0"),
        videosCreated: BigInt(videosCreated || "0"),
        successRate: BigInt(successRate || "0"),
      });
      toast.success("Stats updated!");
    } catch {
      toast.error("Failed to update stats");
    } finally {
      setStatsSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminLoggedIn");
    void navigate({ to: "/admin" });
    toast.success("Logged out successfully");
  };

  const handleApproveTestimonial = async (id: bigint) => {
    try {
      await approveTestimonial(id);
      toast.success("Testimonial approved");
    } catch {
      toast.error("Failed to approve");
    }
  };

  const handleDeleteTestimonial = async (id: bigint) => {
    if (!confirm("ڈیلیٹ کریں؟")) return;
    try {
      await deleteTestimonial(id);
      toast.success("Testimonial deleted");
    } catch {
      toast.error("Failed to delete");
    }
  };

  return (
    <div
      data-ocid="admin.panel"
      className="min-h-screen bg-background text-foreground"
    >
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-xl border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/40 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-primary" />
            </div>
            <div>
              <span className="font-display text-lg font-black">
                <span className="text-gradient-green">Code</span>
                <span className="text-foreground">PayOn</span>
              </span>
              <span className="text-xs text-muted-foreground ml-2">
                Admin Dashboard
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="/"
              className="text-xs text-muted-foreground hover:text-primary transition-colors px-3 py-1 rounded-lg hover:bg-muted/20"
            >
              ← Main Site
            </a>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              data-ocid="admin.logout.button"
              className="border-destructive/30 text-destructive hover:bg-destructive/10 gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="orders">
          {/* Tab list */}
          <TabsList className="bg-muted/30 border border-border mb-6 flex-wrap h-auto gap-1 p-1">
            <TabsTrigger
              value="orders"
              data-ocid="admin.orders.tab"
              className="gap-1.5 text-xs"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              Orders
            </TabsTrigger>
            <TabsTrigger
              value="inquiries"
              data-ocid="admin.inquiries.tab"
              className="gap-1.5 text-xs"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              Inquiries
            </TabsTrigger>
            <TabsTrigger
              value="testimonials"
              data-ocid="admin.testimonials.tab"
              className="gap-1.5 text-xs"
            >
              <Star className="w-3.5 h-3.5" />
              Reviews
            </TabsTrigger>
            <TabsTrigger
              value="ads"
              data-ocid="admin.ads.tab"
              className="gap-1.5 text-xs"
            >
              <Megaphone className="w-3.5 h-3.5" />
              Ads
            </TabsTrigger>
            <TabsTrigger
              value="stats"
              data-ocid="admin.stats.tab"
              className="gap-1.5 text-xs"
            >
              <BarChart3 className="w-3.5 h-3.5" />
              Stats
            </TabsTrigger>
          </TabsList>

          {/* ── Tab: Orders ───────────────────────────────── */}
          <TabsContent value="orders">
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
                <h2 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-primary" />
                  Orders
                </h2>
                <div className="flex items-center gap-2">
                  <Select
                    value={statusFilter}
                    onValueChange={(v) => setStatusFilter(v as ReferralStatus)}
                  >
                    <SelectTrigger
                      className="w-36 bg-input border-border text-sm"
                      data-ocid="admin.orders.filter.select"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      <SelectItem value={ReferralStatus.pending}>
                        Pending
                      </SelectItem>
                      <SelectItem value={ReferralStatus.inProgress}>
                        In Progress
                      </SelectItem>
                      <SelectItem value={ReferralStatus.completed}>
                        Completed
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => refetchOrders()}
                    className="border-border"
                    data-ocid="admin.orders.refresh_button"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {ordersLoading ? (
                <div
                  data-ocid="admin.orders.loading_state"
                  className="space-y-2"
                >
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-12 w-full bg-muted/50" />
                  ))}
                </div>
              ) : orders && orders.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table data-ocid="admin.orders.table">
                    <TableHeader>
                      <TableRow className="border-border">
                        {[
                          "ID",
                          "Name",
                          "Phone",
                          "WhatsApp",
                          "Service",
                          "Message",
                          "Date",
                          "Status",
                          "Update",
                          "Actions",
                        ].map((h) => (
                          <TableHead
                            key={h}
                            className="text-xs text-muted-foreground whitespace-nowrap"
                          >
                            {h}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((order, i) => (
                        <OrderRow
                          key={order.id.toString()}
                          order={order}
                          index={i}
                        />
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div
                  data-ocid="admin.orders.empty_state"
                  className="text-center py-12 text-muted-foreground"
                >
                  <ShoppingBag className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">No {statusFilter} orders found</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* ── Tab: Inquiries ────────────────────────────── */}
          <TabsContent value="inquiries">
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-primary" />
                  Inquiries
                </h2>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => refetchInquiries()}
                  className="border-border"
                >
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>

              {inquiriesLoading ? (
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-16 w-full bg-muted/50" />
                  ))}
                </div>
              ) : inquiries && inquiries.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table data-ocid="admin.inquiries.table">
                    <TableHeader>
                      <TableRow className="border-border">
                        <TableHead className="text-xs text-muted-foreground">
                          Name
                        </TableHead>
                        <TableHead className="text-xs text-muted-foreground">
                          Phone
                        </TableHead>
                        <TableHead className="text-xs text-muted-foreground">
                          Message
                        </TableHead>
                        <TableHead className="text-xs text-muted-foreground">
                          WA
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {inquiries.map((inq, i) => {
                        const cleanPhone = inq.phone.replace(/\D/g, "");
                        const waPhone = cleanPhone.startsWith("92")
                          ? cleanPhone
                          : `92${cleanPhone.replace(/^0/, "")}`;
                        const waText = encodeURIComponent(
                          `السلام علیکم ${inq.name}!\nآپ کی انکوائری موصول ہوئی ہے۔ ہم جلد رابطہ کریں گے۔`,
                        );
                        return (
                          <TableRow
                            key={`${inq.name}-${inq.phone}-${i}`}
                            data-ocid={`admin.inquiries.row.${i + 1}`}
                            className="border-border hover:bg-muted/20"
                          >
                            <TableCell className="font-medium text-sm">
                              {inq.name}
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {inq.phone}
                            </TableCell>
                            <TableCell
                              className="text-sm text-muted-foreground max-w-xs"
                              dir="rtl"
                            >
                              {inq.message}
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  window.open(
                                    `https://wa.me/${waPhone}?text=${waText}`,
                                    "_blank",
                                  )
                                }
                                className="h-7 px-2 text-[#25D366] hover:bg-[#25D36620]"
                              >
                                💬
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <MessageSquare className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">No inquiries yet</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* ── Tab: Testimonials ─────────────────────────── */}
          <TabsContent value="testimonials">
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
                  <Star className="w-5 h-5 text-primary" />
                  Reviews
                </h2>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => refetchTestimonials()}
                  className="border-border"
                >
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>

              <AddTestimonialForm />

              {testimonialsLoading ? (
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-16 w-full bg-muted/50" />
                  ))}
                </div>
              ) : testimonials && testimonials.length > 0 ? (
                <Table data-ocid="admin.testimonials.table">
                  <TableHeader>
                    <TableRow className="border-border">
                      <TableHead className="text-xs text-muted-foreground">
                        Name
                      </TableHead>
                      <TableHead className="text-xs text-muted-foreground">
                        Service
                      </TableHead>
                      <TableHead className="text-xs text-muted-foreground">
                        Rating
                      </TableHead>
                      <TableHead className="text-xs text-muted-foreground">
                        Review
                      </TableHead>
                      <TableHead className="text-xs text-muted-foreground">
                        Status
                      </TableHead>
                      <TableHead className="text-xs text-muted-foreground">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {testimonials.map((t, i) => (
                      <TableRow
                        key={t.id.toString()}
                        data-ocid={`admin.testimonials.row.${i + 1}`}
                        className="border-border hover:bg-muted/20"
                      >
                        <TableCell className="font-medium text-sm" dir="rtl">
                          {t.name}
                        </TableCell>
                        <TableCell className="text-xs text-primary">
                          {t.service}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star
                                key={s}
                                className={`w-3 h-3 ${s <= Number(t.rating) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"}`}
                              />
                            ))}
                          </div>
                        </TableCell>
                        <TableCell
                          className="text-xs text-muted-foreground max-w-xs truncate"
                          dir="rtl"
                        >
                          {t.review}
                        </TableCell>
                        <TableCell>
                          {t.approved ? (
                            <Badge className="bg-primary/20 text-primary border-none text-xs">
                              Approved
                            </Badge>
                          ) : (
                            <Badge className="bg-yellow-500/20 text-yellow-500 border-none text-xs">
                              Pending
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {!t.approved && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleApproveTestimonial(t.id)}
                                className="h-7 text-xs border-primary/40 text-primary hover:bg-primary/10"
                                data-ocid={`admin.testimonials.confirm_button.${i + 1}`}
                              >
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                Approve
                              </Button>
                            )}
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleDeleteTestimonial(t.id)}
                              className="h-7 w-7 text-destructive hover:bg-destructive/10"
                              data-ocid={`admin.testimonials.delete_button.${i + 1}`}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Star className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">No reviews yet</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* ── Tab: Ads ──────────────────────────────────── */}
          <TabsContent value="ads">
            <div className="space-y-4">
              <div className="glass-card rounded-2xl p-6">
                <h2 className="font-display text-lg font-bold text-foreground flex items-center gap-2 mb-2">
                  <Megaphone className="w-5 h-5 text-primary" />
                  Advertisement Settings
                </h2>
                <p className="text-sm text-muted-foreground mb-6" dir="rtl">
                  تمام اشتہار نیٹ ورکس کو یہاں سے منیج کریں۔ ہر نیٹ ورک کو
                  enable/disable کریں اور IDs محفوظ کریں۔
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {adNetworks.map((network) => (
                    <AdNetworkCard key={network.id} network={network} />
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* ── Tab: Stats ────────────────────────────────── */}
          <TabsContent value="stats">
            <div className="glass-card rounded-2xl p-6 max-w-xl">
              <h2 className="font-display text-lg font-bold text-foreground flex items-center gap-2 mb-6">
                <BarChart3 className="w-5 h-5 text-primary" />
                Site Statistics
              </h2>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    👥 Total Clients
                  </Label>
                  <Input
                    type="number"
                    value={totalClients}
                    onChange={(e) => setTotalClients(e.target.value)}
                    placeholder="e.g. 100"
                    className="bg-input border-border focus:border-primary/60"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    🎬 Videos Created
                  </Label>
                  <Input
                    type="number"
                    value={videosCreated}
                    onChange={(e) => setVideosCreated(e.target.value)}
                    placeholder="e.g. 500"
                    className="bg-input border-border focus:border-primary/60"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    📈 Success Rate (%)
                  </Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={successRate}
                    onChange={(e) => setSuccessRate(e.target.value)}
                    placeholder="e.g. 80"
                    className="bg-input border-border focus:border-primary/60"
                  />
                </div>
                <Button
                  type="button"
                  onClick={handleSaveStats}
                  disabled={statsSaving}
                  data-ocid="admin.stats.save_button"
                  className="w-full bg-primary text-primary-foreground font-bold glow-green gap-2"
                >
                  {statsSaving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {statsSaving ? "Saving..." : "Save Stats"}
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
