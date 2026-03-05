import Map "mo:core/Map";
import Array "mo:core/Array";
import Set "mo:core/Set";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // --- Authorization Setup ---
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // --- User Profile ---
  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // --- Data Types ---
  type ReferralStatus = {
    #pending;
    #inProgress;
    #completed;
  };

  type Order = {
    id : Nat;
    name : Text;
    phone : Text;
    whatsapp : Text;
    service : Text;
    message : Text;
    timestamp : Text;
    status : ReferralStatus;
  };

  module OrderModule {
    public func compare(order1 : Order, order2 : Order) : Order.Order {
      Nat.compare(order1.id, order2.id);
    };

    public func compareByStatus(order1 : Order, order2 : Order) : Order.Order {
      switch (Nat.compare(order1.id, order2.id)) {
        case (#equal) { compareStatus(order1.status, order2.status) };
        case (order) { order };
      };
    };

    func compareStatus(status1 : ReferralStatus, status2 : ReferralStatus) : Order.Order {
      func statusToNat(status : ReferralStatus) : Nat {
        switch (status) {
          case (#pending) { 0 };
          case (#inProgress) { 1 };
          case (#completed) { 2 };
        };
      };
      Nat.compare(statusToNat(status1), statusToNat(status2));
    };
  };

  type Stats = {
    totalClients : Nat;
    videosCreated : Nat;
    successRate : Nat;
  };

  type Testimonial = {
    id : Nat;
    name : Text;
    review : Text;
    rating : Nat;
    service : Text;
    approved : Bool;
  };

  module TestimonialModule {
    public func compare(testimonial1 : Testimonial, testimonial2 : Testimonial) : Order.Order {
      Nat.compare(testimonial1.id, testimonial2.id);
    };
  };

  type Inquiry = {
    name : Text;
    phone : Text;
    message : Text;
  };

  // --- Stable Data Structures ---
  let orders = Map.empty<Nat, Order>();
  var nextOrderId = 1;

  let testimonials = Map.empty<Nat, Testimonial>();
  var nextTestimonialId = 1;

  let inquiries = Map.empty<Nat, Inquiry>();
  var nextInquiryId = 1;

  var stats : Stats = {
    totalClients = 0;
    videosCreated = 0;
    successRate = 0;
  };

  // --- Order Management ---
  // Public can submit orders
  public shared ({ caller }) func placeOrder(name : Text, phone : Text, whatsapp : Text, service : Text, message : Text, timestamp : Text) : async Nat {
    let id = nextOrderId;
    let order : Order = {
      id;
      name;
      phone;
      whatsapp;
      service;
      message;
      timestamp;
      status = #pending;
    };
    orders.add(id, order);
    nextOrderId += 1;
    id;
  };

  // Admin only - viewing all orders
  public query ({ caller }) func getOrdersByStatus(status : ReferralStatus) : async [Order] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view orders");
    };
    orders.values().toArray().filter(func(order) { order.status == status });
  };

  // Admin only - update order status
  public shared ({ caller }) func updateOrderStatus(id : Nat, status : ReferralStatus) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update order status");
    };
    switch (orders.get(id)) {
      case (null) { Runtime.trap("Order not found") };
      case (?order) {
        let updatedOrder = { order with status };
        orders.add(id, updatedOrder);
      };
    };
  };

  // Admin only - delete orders
  public shared ({ caller }) func deleteOrder(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete orders");
    };
    switch (orders.get(id)) {
      case (null) { Runtime.trap("Order not found") };
      case (_) {
        orders.remove(id);
      };
    };
  };

  // --- Stats ---
  // Admin only - update stats
  public shared ({ caller }) func updateStats(newStats : Stats) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update stats");
    };
    stats := newStats;
  };

  // Public can view stats
  public query ({ caller }) func getStats() : async Stats {
    stats;
  };

  // --- Testimonials ---
  // Public can submit testimonials
  public shared ({ caller }) func addTestimonial(name : Text, review : Text, rating : Nat, service : Text) : async Nat {
    let id = nextTestimonialId;
    let testimonial : Testimonial = {
      id;
      name;
      review;
      rating;
      service;
      approved = false;
    };
    testimonials.add(id, testimonial);
    nextTestimonialId += 1;
    id;
  };

  // Admin only - approve testimonials
  public shared ({ caller }) func approveTestimonial(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can approve testimonials");
    };
    switch (testimonials.get(id)) {
      case (null) { Runtime.trap("Testimonial not found") };
      case (?testimonial) {
        let updatedTestimonial = { testimonial with approved = true };
        testimonials.add(id, updatedTestimonial);
      };
    };
  };

  // Admin only - delete testimonials
  public shared ({ caller }) func deleteTestimonial(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete testimonials");
    };
    switch (testimonials.get(id)) {
      case (null) { Runtime.trap("Testimonial not found") };
      case (_) {
        testimonials.remove(id);
      };
    };
  };

  // Public can view approved testimonials
  public query ({ caller }) func getApprovedTestimonials() : async [Testimonial] {
    testimonials.values().toArray().filter(func(testimonial) { testimonial.approved });
  };

  // --- Inquiries ---
  // Public can submit inquiries
  public shared ({ caller }) func submitInquiry(name : Text, phone : Text, message : Text) : async () {
    let id = nextInquiryId;
    let inquiry : Inquiry = { name; phone; message };
    inquiries.add(id, inquiry);
    nextInquiryId += 1;
  };

  // Admin only - view inquiries
  public query ({ caller }) func getInquiries() : async [Inquiry] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view inquiries");
    };
    inquiries.values().toArray();
  };
};
