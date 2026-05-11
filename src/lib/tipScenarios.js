// Research-based tip percentages for common situations in the US.
// Sources: Emily Post Institute, Bankrate, NerdWallet, The Knot, AAA tipping guides.
// Each scenario has a recommended range and a "base" (typical/median) rate.
// Flat-rate tips (valet, bellhop, etc.) use type: "flat" with amount in dollars.
//
// venueAware: true  → the Venue Tier selector is shown and its multiplier is applied.
// Base values represent a "mid-range" establishment with average service (rating = 3).

export const TIP_SCENARIOS = [
  // ── Dining & Food ──────────────────────────────────────────────────────────
  // "Restaurant" now covers all sit-down dining; venue tier distinguishes casual→luxury.
  // Standard US sit-down tip is 18–20% at a mid-range spot. Casual diner = 15–16%.
  // Fine dining norm = 20–22%. Luxury tasting-menu = 22–25%.
  { id: "restaurant", label: "Restaurant (Sit-Down)", category: "Dining", type: "percent", min: 15, base: 18, max: 25, note: "Use Venue Setting above to adjust for casual vs. fine dining", venueAware: true },

  // Buffet: self-service; server only refills drinks/clears plates. 10% is the norm.
  { id: "restaurant_buffet", label: "Buffet Restaurant", category: "Dining", type: "percent", min: 5, base: 10, max: 15, note: "Server refills drinks & clears plates — limited table service" },

  // Bartender: $1–2 per drink OR 15–20% of tab. 18% base on a tab is accurate.
  { id: "bartender", label: "Bartender", category: "Dining", type: "percent", min: 15, base: 18, max: 25, note: "$1–2 per drink is also standard for simple orders", venueAware: true },

  // Coffee: counter service. 15% is now the post-pandemic expectation on tablets.
  { id: "barista", label: "Barista / Coffee Shop", category: "Dining", type: "percent", min: 0, base: 15, max: 20, note: "Optional but appreciated; ~$0.50–$1 per drink is common" },

  // Delivery: 15–20% or $3–5 minimum. 15% base is correct per Bankrate.
  { id: "food_delivery", label: "Food Delivery", category: "Dining", type: "percent", min: 10, base: 15, max: 20, note: "Minimum $3–5 regardless of order size; tip more in bad weather" },

  // Takeout: genuinely optional. 10% is generous; 0% is perfectly acceptable.
  { id: "takeout", label: "Takeout / Counter Service", category: "Dining", type: "percent", min: 0, base: 10, max: 15, note: "Truly optional — 10% is a nice gesture for large or complex orders" },

  // Catering: 15% if gratuity not already included in contract (check first).
  { id: "catering", label: "Catering Staff", category: "Dining", type: "percent", min: 10, base: 15, max: 20, note: "Check contract first — gratuity is often already included", venueAware: true },

  // ── Travel & Transport ─────────────────────────────────────────────────────
  // Taxi/Rideshare: Uber/Lyft default prompts are 15–20%; 15% is the median.
  { id: "taxi", label: "Taxi / Rideshare (Uber, Lyft)", category: "Travel", type: "percent", min: 10, base: 15, max: 20, note: "Round up on short rides; 20% for helpful drivers" },

  // Limo/Shuttle: 15–20% is standard per limousine industry norms.
  { id: "shuttle_driver", label: "Shuttle / Limo Driver", category: "Travel", type: "percent", min: 15, base: 18, max: 20, note: "On total fare; 20% for exceptional service", venueAware: true },

  // Valet: $2–5 on pickup is the widely cited standard; luxury hotels $5–10.
  { id: "valet", label: "Valet Parking", category: "Travel", type: "flat", min: 2, base: 5, max: 10, note: "Tip on pickup (not drop-off); use Venue Setting for hotel tier", venueAware: true },

  // Tour guide: $3–5/person for a half-day group tour; $10+/person for full-day private.
  { id: "tour_guide", label: "Tour Guide", category: "Travel", type: "percent", min: 10, base: 15, max: 20, note: "Per person for group tours; more for private/custom tours" },

  // Skycap: $2/bag is the stated standard from major airline guides.
  { id: "airport_skycap", label: "Airport Skycap / Porter", category: "Travel", type: "flat", min: 2, base: 2, max: 5, note: "$2 per bag is standard; $1 extra for heavy bags" },

  // ── Hotels & Lodging ───────────────────────────────────────────────────────
  // Housekeeping: $2–5/night budget, $5–10 upscale per AAA and American Hotel Association.
  { id: "hotel_housekeeping", label: "Hotel Housekeeping", category: "Hotel", type: "flat", min: 2, base: 5, max: 10, note: "Leave daily (staff rotates); $2–3 at budget hotels, $5+ at upscale", venueAware: true },

  // Bellhop: $1–2/bag is the industry standard; $2+ at luxury properties.
  { id: "hotel_bellhop", label: "Bellhop / Porter", category: "Hotel", type: "flat", min: 1, base: 2, max: 5, note: "$1–2 per bag; add $1–2 per bag at luxury properties", venueAware: true },

  // Concierge: $5–10 for dinner reservations; $20+ for hard-to-get tickets.
  { id: "hotel_concierge", label: "Concierge", category: "Hotel", type: "flat", min: 5, base: 10, max: 25, note: "$5–10 for basic requests; $20+ for special arrangements", venueAware: true },

  // Doorman: $1–2 per service (hailing a cab, loading bags).
  { id: "hotel_doorman", label: "Doorman", category: "Hotel", type: "flat", min: 1, base: 2, max: 5, note: "$1–2 per service (hailing cab, unloading bags)", venueAware: true },

  // Room service: 15–20% — but check if a delivery charge or gratuity is already on the bill.
  { id: "room_service", label: "Room Service", category: "Hotel", type: "percent", min: 15, base: 18, max: 20, note: "Check bill first — many hotels add a service charge automatically", venueAware: true },

  // ── Personal Care & Beauty ─────────────────────────────────────────────────
  // Hair stylists: 15–20% is the industry standard; 20% is now widely expected.
  { id: "hairdresser", label: "Hairdresser / Stylist", category: "Personal Care", type: "percent", min: 15, base: 20, max: 25, note: "20% is the current standard; cash tips are preferred by many stylists", venueAware: true },

  // Barber: same norm as hairdresser — 15–20%.
  { id: "barber", label: "Barber", category: "Personal Care", type: "percent", min: 15, base: 20, max: 25, note: "Cash preferred; $3–5 on a typical haircut is a good baseline" },

  // Nails: 15–20% per NAILS Magazine and etiquette experts.
  { id: "nail_tech", label: "Nail Technician / Manicurist", category: "Personal Care", type: "percent", min: 15, base: 20, max: 25, note: "20% is standard; cash ensures the technician keeps the full amount", venueAware: true },

  // Massage: 15–20% unless at a medical/clinical setting (tipping not expected there).
  { id: "massage", label: "Massage Therapist", category: "Personal Care", type: "percent", min: 15, base: 20, max: 25, note: "Skip tipping at medical/clinical settings; 20% at day spas", venueAware: true },

  // Esthetician: same 15–20% norm as other salon services.
  { id: "esthetician", label: "Esthetician (Facial / Waxing)", category: "Personal Care", type: "percent", min: 15, base: 20, max: 25, note: "20% is standard for facials and waxing services", venueAware: true },

  // Tattoo: 15–25%; custom artwork warrants the higher end.
  { id: "tattoo_artist", label: "Tattoo Artist", category: "Personal Care", type: "percent", min: 15, base: 20, max: 25, note: "20% is standard; tip more for custom or complex designs" },

  // Spa: 15–20%; always check if a service charge is already included.
  { id: "spa", label: "Spa Services", category: "Personal Care", type: "percent", min: 15, base: 20, max: 25, note: "Check if gratuity is already included in the service charge", venueAware: true },

  // ── Home Services ──────────────────────────────────────────────────────────
  // Lawn/landscaping: $10–20/visit per HomeAdvisor; not universally expected.
  { id: "lawn_service", label: "Lawn / Landscaping", category: "Home Services", type: "flat", min: 10, base: 20, max: 50, note: "Not always expected; $20/visit or a seasonal cash bonus is common" },

  // House cleaner: 15–20% or one visit's pay as a holiday tip.
  { id: "house_cleaner", label: "House Cleaner", category: "Home Services", type: "percent", min: 10, base: 15, max: 20, note: "Regular cleaner: 15–20% per visit or one session's pay at holidays" },

  // Movers: $20–40 per mover per day is the widely cited standard.
  { id: "mover", label: "Movers", category: "Home Services", type: "flat", min: 20, base: 40, max: 80, note: "$20–40 per mover for a half-day; $40–80 for a full day" },

  // Furniture delivery: $10–20 per person (2 people usually).
  { id: "furniture_delivery", label: "Furniture / Appliance Delivery", category: "Home Services", type: "flat", min: 5, base: 10, max: 20, note: "$5–20 per person; more for heavy or complicated installs" },

  // Handyman: tipping is optional and not standard industry practice.
  { id: "handyman", label: "Handyman / Contractor", category: "Home Services", type: "percent", min: 0, base: 10, max: 15, note: "Not expected for licensed contractors; a tip is a nice gesture on small jobs" },

  // ── Pet Services ───────────────────────────────────────────────────────────
  // Dog groomer: 15–20% per grooming industry standards.
  { id: "dog_groomer", label: "Dog Groomer", category: "Pet Services", type: "percent", min: 15, base: 20, max: 25, note: "20% is standard; more for difficult pets or extra services" },

  // Dog walker: 10–20%; holiday equivalent of one week's pay.
  { id: "dog_walker", label: "Dog Walker", category: "Pet Services", type: "percent", min: 10, base: 15, max: 20, note: "10–20% per walk; one week's pay at the holidays is a nice gift" },

  // Pet sitter: 10–20% for multi-day stays.
  { id: "pet_sitter", label: "Pet Sitter", category: "Pet Services", type: "percent", min: 10, base: 15, max: 20, note: "15–20% for multi-day stays; holiday bonus equal to one visit" },

  // ── Other ──────────────────────────────────────────────────────────────────
  // Babysitter: 10–20% on top of the hourly rate for a good job.
  { id: "babysitter", label: "Babysitter / Nanny", category: "Other", type: "percent", min: 10, base: 15, max: 20, note: "On top of the hourly rate; holiday gift = one week's pay" },

  // Car wash: $2–5 for full-service; nothing expected for self-serve/tunnel.
  { id: "car_wash", label: "Car Wash Attendant", category: "Other", type: "flat", min: 2, base: 5, max: 10, note: "For full-service hand washes only; not needed for tunnel/self-serve" },

  // Golf caddy: $50–100 is cited by PGA etiquette guides; ~50% of the caddy fee.
  { id: "golf_caddy", label: "Golf Caddy", category: "Other", type: "percent", min: 30, base: 50, max: 100, note: "~50% of the caddy fee is the PGA standard; $50–100 per bag per round", venueAware: true },

  // Coat check: $1–2 per coat; standard across venues.
  { id: "coat_check", label: "Coat Check", category: "Other", type: "flat", min: 1, base: 2, max: 3, note: "$1–2 per coat; tip when you pick up", venueAware: true },

  // Restroom attendant: $1–2 if they hand you a towel or offer a product.
  { id: "restroom_attendant", label: "Restroom Attendant", category: "Other", type: "flat", min: 1, base: 2, max: 3, note: "$1–2 if they provide a service; nothing required for a self-service setup" },

  // Wedding vendor: $50–200 per vendor is widely cited by The Knot and Brides.
  { id: "wedding_vendor", label: "Wedding Vendor (DJ, Photographer, etc.)", category: "Other", type: "flat", min: 50, base: 100, max: 200, note: "$50–200 per vendor depending on role; check contracts for included gratuity" },
];

// ── Venue tier multipliers ────────────────────────────────────────────────────
// Applied on top of service rating for venueAware scenarios.
// Calibrated so that a 3-star service rating at each tier produces:
//   Everyday  → ~16% (casual diner norm)
//   Mid-Range → ~18% (standard sit-down norm)
//   Upscale   → ~21% (white-tablecloth norm)
//   Luxury    → ~24% (top fine dining/hotel norm)
// Multipliers are intentionally modest — the bulk of variation should come from service rating.
export const VENUE_TIERS = [
  { id: "everyday",  label: "Everyday",   description: "Casual diner, fast-casual, neighborhood spot",  mult: 0.88 },
  { id: "mid",       label: "Mid-Range",  description: "Standard sit-down, solid service expected",      mult: 1.00 },
  { id: "upscale",   label: "Upscale",    description: "White-tablecloth, attentive staff",              mult: 1.15 },
  { id: "luxury",    label: "Luxury",     description: "Five-star, tasting menu, exceptional setting",   mult: 1.30 },
];

// ── Service rating multipliers ────────────────────────────────────────────────
// Applied to the base percent/flat amount.
// Calibrated to realistic US norms:
//   1 (Poor)        → still tip ~10–11% (US norm — withholding tip entirely is rare)
//   2 (Below Avg)   → ~14–15%
//   3 (Average)     → 18% base (unchanged)
//   4 (Great)       → ~20–21%
//   5 (Exceptional) → ~22–24%
export const RATING_MULTIPLIERS = {
  1: { mult: 0.60, label: "Poor",         description: "Significantly below expectations" },
  2: { mult: 0.80, label: "Below Average",description: "Could have been better" },
  3: { mult: 1.00, label: "Average",      description: "Met expectations" },
  4: { mult: 1.15, label: "Great",        description: "Above and beyond" },
  5: { mult: 1.28, label: "Exceptional",  description: "Truly outstanding service" },
};

export const CATEGORIES = [
  "Dining",
  "Travel",
  "Hotel",
  "Personal Care",
  "Home Services",
  "Pet Services",
  "Other",
];

export function computeTip({ scenario, bill, rating, mode, customPercent, people = 1, venueTier = "mid", budgetMult = 1, locationAdj = 0 }) {
  if (!scenario || !bill || bill <= 0) {
    return { tipAmount: 0, totalAmount: 0, perPerson: 0, effectivePercent: 0, isFlat: false };
  }

  let tipAmount = 0;
  let isFlat = false;
  let effectivePercent = 0;

  if (mode === "custom") {
    const pct = Number(customPercent) || 0;
    tipAmount = (bill * pct) / 100;
    effectivePercent = pct;
  } else {
    const ratingMult = RATING_MULTIPLIERS[rating]?.mult ?? 1;
    const tierMult = scenario.venueAware
      ? (VENUE_TIERS.find((t) => t.id === venueTier)?.mult ?? 1)
      : 1;
    const combinedMult = ratingMult * tierMult;

    if (scenario.type === "flat") {
      tipAmount = scenario.base * combinedMult * budgetMult;
      isFlat = true;
      effectivePercent = (tipAmount / bill) * 100;
    } else {
      const pct = (scenario.base * combinedMult * budgetMult) + locationAdj;
      tipAmount = (bill * pct) / 100;
      effectivePercent = pct;
    }
  }

  const totalAmount = Number(bill) + tipAmount;
  const perPerson = totalAmount / Math.max(1, people);

  return {
    tipAmount,
    totalAmount,
    perPerson,
    effectivePercent,
    isFlat,
  };
}