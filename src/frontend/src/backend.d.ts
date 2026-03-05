import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Stats {
    successRate: bigint;
    videosCreated: bigint;
    totalClients: bigint;
}
export interface Inquiry {
    name: string;
    message: string;
    phone: string;
}
export interface Order {
    id: bigint;
    service: string;
    status: ReferralStatus;
    name: string;
    whatsapp: string;
    message: string;
    timestamp: string;
    phone: string;
}
export interface UserProfile {
    name: string;
}
export interface Testimonial {
    id: bigint;
    service: string;
    review: string;
    name: string;
    approved: boolean;
    rating: bigint;
}
export enum ReferralStatus {
    pending = "pending",
    completed = "completed",
    inProgress = "inProgress"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addTestimonial(name: string, review: string, rating: bigint, service: string): Promise<bigint>;
    approveTestimonial(id: bigint): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteOrder(id: bigint): Promise<void>;
    deleteTestimonial(id: bigint): Promise<void>;
    getApprovedTestimonials(): Promise<Array<Testimonial>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getInquiries(): Promise<Array<Inquiry>>;
    getOrdersByStatus(status: ReferralStatus): Promise<Array<Order>>;
    getStats(): Promise<Stats>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    placeOrder(name: string, phone: string, whatsapp: string, service: string, message: string, timestamp: string): Promise<bigint>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitInquiry(name: string, phone: string, message: string): Promise<void>;
    updateOrderStatus(id: bigint, status: ReferralStatus): Promise<void>;
    updateStats(newStats: Stats): Promise<void>;
}
