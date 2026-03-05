import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  type Inquiry,
  type Order,
  ReferralStatus,
  type Stats,
  type Testimonial,
} from "../backend.d";
import { useActor } from "./useActor";

// ── Testimonials ──────────────────────────────────────────────
export function useApprovedTestimonials() {
  const { actor, isFetching } = useActor();
  return useQuery<Testimonial[]>({
    queryKey: ["testimonials"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getApprovedTestimonials();
    },
    enabled: !!actor && !isFetching,
  });
}

// ── Stats ──────────────────────────────────────────────────────
export function useStats() {
  const { actor, isFetching } = useActor();
  return useQuery<Stats>({
    queryKey: ["stats"],
    queryFn: async () => {
      if (!actor)
        return { successRate: 80n, videosCreated: 500n, totalClients: 100n };
      return actor.getStats();
    },
    enabled: !!actor && !isFetching,
  });
}

// ── Orders (Admin) ─────────────────────────────────────────────
export function useOrdersByStatus(status: ReferralStatus) {
  const { actor, isFetching } = useActor();
  return useQuery<Order[]>({
    queryKey: ["orders", status],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getOrdersByStatus(status);
    },
    enabled: !!actor && !isFetching,
  });
}

// ── Inquiries (Admin) ──────────────────────────────────────────
export function useInquiries() {
  const { actor, isFetching } = useActor();
  return useQuery<Inquiry[]>({
    queryKey: ["inquiries"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getInquiries();
    },
    enabled: !!actor && !isFetching,
  });
}

// ── Admin Check ────────────────────────────────────────────────
export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

// ── Place Order ────────────────────────────────────────────────
export function usePlaceOrder() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      name: string;
      phone: string;
      whatsapp: string;
      service: string;
      message: string;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      const timestamp = new Date().toISOString();
      return actor.placeOrder(
        data.name,
        data.phone,
        data.whatsapp,
        data.service,
        data.message,
        timestamp,
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}

// ── Submit Inquiry ─────────────────────────────────────────────
export function useSubmitInquiry() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      name: string;
      phone: string;
      message: string;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.submitInquiry(data.name, data.phone, data.message);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["inquiries"] });
    },
  });
}

// ── Update Order Status ────────────────────────────────────────
export function useUpdateOrderStatus() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: { id: bigint; status: ReferralStatus }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.updateOrderStatus(data.id, data.status);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}

// ── Delete Order ───────────────────────────────────────────────
export function useDeleteOrder() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.deleteOrder(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}

// ── Add Testimonial ────────────────────────────────────────────
export function useAddTestimonial() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      name: string;
      review: string;
      rating: bigint;
      service: string;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.addTestimonial(
        data.name,
        data.review,
        data.rating,
        data.service,
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["testimonials"] });
    },
  });
}

// ── Approve Testimonial ────────────────────────────────────────
export function useApproveTestimonial() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.approveTestimonial(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["testimonials"] });
    },
  });
}

// ── Delete Testimonial ─────────────────────────────────────────
export function useDeleteTestimonial() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.deleteTestimonial(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["testimonials"] });
    },
  });
}

export { ReferralStatus };
