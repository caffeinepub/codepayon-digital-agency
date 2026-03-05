# CodePayOn Digital Agency

## Current State
New project — no existing code.

## Requested Changes (Diff)

### Add
- Full digital marketing agency landing page in Urdu/English bilingual style
- Hero section with animated gradient background, floating icons (YouTube, Facebook, Instagram, TikTok, etc.)
- 6 service packages with pricing cards (animated on hover):
  1. Social Media Accounts + Setup + Monetization (5,000 PKR)
  2. Copyright-Free Videos + Text-to-Video + Growth Tools (1,000 PKR/video)
  3. 100% Human Organic Growth USA/EU IPs (custom pricing)
  4. Worldwide WhatsApp + Digital Marketing (3,000 PKR)
  5. Lifetime Premium Tools + Subscriptions (3,000 PKR)
  6. Full Digital Marketing Package (custom)
- Moving/animated social media platform icons floating in background
- Order placement form (name, phone, whatsapp, selected service, message)
- Orders stored in backend with admin view
- Contact section with WhatsApp buttons (+92 316 4971661, +92 332 3449779)
- Stats counter section (100+ clients, 500+ videos, 80% monetized in 3 months)
- Testimonials/trust section
- Sticky header with navigation
- WhatsApp floating button

### Modify
- Nothing (new project)

### Remove
- Nothing (new project)

## Implementation Plan
1. Backend: Order model with fields (name, phone, whatsapp, service, message, timestamp, status). Admin can view all orders.
2. Frontend Hero: Full-screen animated gradient, floating social media icons with CSS keyframe animations, Pakistani flag colors (green/white), call-to-action buttons
3. Services section: 6 animated cards with pricing, features list, order button per card
4. Order modal/form: when clicking order on any service, opens form pre-filled with service name
5. Stats section: animated counters
6. Contact section: WhatsApp deeplinks, email links
7. Sticky nav with smooth scroll
8. Floating WhatsApp button (always visible)
9. Admin panel to view submitted orders (protected by simple token)
