# Specification

## Summary
**Goal:** Update checkout flow branding and add required address confirmation and payment detail collection steps for Bolt Now.

**Planned changes:**
- Replace all instances of “Volt Now”/“VOLTNOW” with “Bolt Now” (case-insensitive) on the `/payment-success` page while keeping all user-facing text in English.
- Add a new address/location confirmation step after product selection on `/buy-now` and before `/payment-options`, allowing users to either request browser geolocation (GPS permission prompt) or manually enter an address.
- Register the new address confirmation route in the TanStack Router and update navigation/search-parameter handling so `/payment-options` can receive `productId` plus confirmed address/location data, with a reasonable fallback when opened directly without address data.
- On `/payment-options`, require method-specific inputs before proceeding: card number/expiry/CVV for “Credit/Debit Card”, and phone number for “Mobile Payment”, with basic validation and English-only labels/messages.

**User-visible outcome:** Users see “Bolt Now” on the payment success page, are prompted to confirm an address or share GPS location after selecting a product, and must enter required card or mobile payment details before continuing to the payment success step.
