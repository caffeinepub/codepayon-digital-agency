# CodePayOn Digital Agency

## Current State
- Full website with Hero, Services, Stats, Testimonials, Contact, Footer sections
- Admin panel at /admin with login (admin07860 / 07860)
- WhatsApp floating button
- Order modal with WhatsApp integration
- 6 advertisement network options in admin

## Requested Changes (Diff)

### Add
- ChatBot component: floating chat button on bottom-left (opposite side from WhatsApp)
- ChatBot avatar: Pakistani girl image wearing phone headset
- ChatBot name: "ثمینہ" (Sameena) - Pakistani Urdu name
- Language selection prompt on first open (Urdu / English / any language)
- Full knowledge base of project services, pricing, contact info, and FAQs
- Multilingual responses (Urdu, English, and other languages as requested)
- Friendly Pakistani female assistant persona - polite, warm, professional
- Animated chat bubble with typing indicator
- Chat history within session

### Modify
- App.tsx: Add ChatBot component to MainSitePage

### Remove
- Nothing removed

## Implementation Plan
1. Create `ChatBot.tsx` component with:
   - Floating button with girl avatar
   - Slide-up chat panel
   - Language selection screen on first message
   - Knowledge base with all project info (services, prices, contact, WhatsApp, Gmail, social media)
   - Smart response engine matching questions to answers
   - Typing animation indicator
   - Multilingual support (Urdu/English primarily)
   - Pakistani female persona named ثمینہ
2. Add ChatBot to App.tsx MainSitePage
