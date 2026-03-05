import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CheckCircle2,
  MessageSquare,
  RefreshCw,
  ShieldCheck,
  ShoppingBag,
  Star,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Order } from "../backend.d";
import {
  ReferralStatus,
  useApproveTestimonial,
  useApprovedTestimonials,
  useDeleteOrder,
  useDeleteTestimonial,
  useInquiries,
  useOrdersByStatus,
  useUpdateOrderStatus,
} from "../hooks/useQueries";

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
    if (!confirm("Delete this order?")) return;
    try {
      await deleteOrder(order.id);
      toast.success("Order deleted");
    } catch {
      toast.error("Failed to delete order");
    }
  };

  return (
    <TableRow
      data-ocid={`admin.orders.row.${index + 1}`}
      className="border-border hover:bg-muted/20"
    >
      <TableCell className="text-xs text-muted-foreground">
        #{order.id.toString()}
      </TableCell>
      <TableCell className="font-medium text-sm text-foreground">
        {order.name}
      </TableCell>
      <TableCell className="text-sm text-muted-foreground">
        {order.phone}
      </TableCell>
      <TableCell className="text-xs text-muted-foreground max-w-[150px] truncate">
        {order.service}
      </TableCell>
      <TableCell>
        <span
          className="text-xs px-2 py-1 rounded-full font-bold"
          style={{
            background: `${statusColors[order.status]}20`,
            color: statusColors[order.status],
          }}
        >
          {statusLabels[order.status]}
        </span>
      </TableCell>
      <TableCell>
        <Select
          value={order.status}
          onValueChange={handleStatusChange}
          disabled={isUpdating}
        >
          <SelectTrigger className="h-7 text-xs w-32 bg-input border-border">
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
        <Button
          variant="ghost"
          size="icon"
          onClick={handleDelete}
          disabled={isDeleting}
          data-ocid={`admin.orders.delete_button.${index + 1}`}
          className="h-7 w-7 text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </Button>
      </TableCell>
    </TableRow>
  );
}

interface AdminPanelProps {
  onClose: () => void;
}

export default function AdminPanel({ onClose }: AdminPanelProps) {
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
  const { mutateAsync: approveTestimonial } = useApproveTestimonial();
  const { mutateAsync: deleteTestimonial } = useDeleteTestimonial();

  const handleApproveTestimonial = async (id: bigint) => {
    try {
      await approveTestimonial(id);
      toast.success("Testimonial approved");
    } catch {
      toast.error("Failed to approve");
    }
  };

  const handleDeleteTestimonial = async (id: bigint) => {
    if (!confirm("Delete this testimonial?")) return;
    try {
      await deleteTestimonial(id);
      toast.success("Testimonial deleted");
    } catch {
      toast.error("Failed to delete");
    }
  };

  return (
    <div data-ocid="admin.panel" className="min-h-screen pt-20 pb-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-black text-foreground">
                Admin Panel
              </h1>
              <p className="text-sm text-muted-foreground">
                Manage orders, inquiries & reviews
              </p>
            </div>
          </div>
          <Button variant="outline" onClick={onClose} className="border-border">
            ← Back to Site
          </Button>
        </div>

        <Tabs defaultValue="orders">
          <TabsList className="bg-muted/30 border border-border mb-6">
            <TabsTrigger
              value="orders"
              data-ocid="admin.orders.tab"
              className="gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              Orders
            </TabsTrigger>
            <TabsTrigger
              value="inquiries"
              data-ocid="admin.inquiries.tab"
              className="gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              Inquiries
            </TabsTrigger>
            <TabsTrigger
              value="testimonials"
              data-ocid="admin.testimonials.tab"
              className="gap-2"
            >
              <Star className="w-4 h-4" />
              Reviews
            </TabsTrigger>
          </TabsList>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                <h2 className="font-display text-lg font-bold text-foreground">
                  Orders
                </h2>
                <div className="flex items-center gap-2">
                  <Select
                    value={statusFilter}
                    onValueChange={(v) => setStatusFilter(v as ReferralStatus)}
                  >
                    <SelectTrigger
                      className="w-36 bg-input border-border text-sm"
                      data-ocid="admin.orders.select"
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
                        <TableHead className="text-xs text-muted-foreground">
                          ID
                        </TableHead>
                        <TableHead className="text-xs text-muted-foreground">
                          Name
                        </TableHead>
                        <TableHead className="text-xs text-muted-foreground">
                          Phone
                        </TableHead>
                        <TableHead className="text-xs text-muted-foreground">
                          Service
                        </TableHead>
                        <TableHead className="text-xs text-muted-foreground">
                          Status
                        </TableHead>
                        <TableHead className="text-xs text-muted-foreground">
                          Update
                        </TableHead>
                        <TableHead className="text-xs text-muted-foreground">
                          Del
                        </TableHead>
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

          {/* Inquiries Tab */}
          <TabsContent value="inquiries">
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-lg font-bold text-foreground">
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
                <div className="space-y-3">
                  {inquiries.map((inq, i) => (
                    <div
                      key={`${inq.name}-${inq.phone}-${i}`}
                      data-ocid={`admin.inquiries.item.${i + 1}`}
                      className="border border-border rounded-xl p-4 hover:bg-muted/10 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span className="font-medium text-sm text-foreground">
                            {inq.name}
                          </span>
                          <span className="mx-2 text-muted-foreground">·</span>
                          <span className="text-sm text-muted-foreground">
                            {inq.phone}
                          </span>
                        </div>
                      </div>
                      <p
                        className="text-sm text-muted-foreground mt-2 leading-relaxed"
                        dir="rtl"
                      >
                        {inq.message}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <MessageSquare className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">No inquiries yet</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Testimonials Tab */}
          <TabsContent value="testimonials">
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-lg font-bold text-foreground">
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

              {testimonialsLoading ? (
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-16 w-full bg-muted/50" />
                  ))}
                </div>
              ) : testimonials && testimonials.length > 0 ? (
                <div className="space-y-3">
                  {testimonials.map((t, i) => (
                    <div
                      key={t.id.toString()}
                      data-ocid={`admin.testimonials.item.${i + 1}`}
                      className="border border-border rounded-xl p-4 hover:bg-muted/10 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span className="font-medium text-sm text-foreground">
                            {t.name}
                          </span>
                          <span className="mx-2 text-muted-foreground">·</span>
                          <span className="text-xs text-primary">
                            {t.service}
                          </span>
                          <div className="flex gap-0.5 mt-1">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star
                                key={s}
                                className={`w-3 h-3 ${s <= Number(t.rating) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"}`}
                              />
                            ))}
                          </div>
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
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
                          {t.approved && (
                            <Badge className="bg-primary/20 text-primary border-none text-xs">
                              Approved
                            </Badge>
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
                      </div>
                      <p
                        className="text-sm text-muted-foreground mt-2 leading-relaxed"
                        dir="rtl"
                      >
                        "{t.review}"
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Star className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">No reviews yet</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
