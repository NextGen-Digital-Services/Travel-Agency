# Roamora Travels — Luxury Travel Agency & Admin Panel

> *"Your Journey. Our Expertise."*

Roamora Travels is a complete, production-quality React application featuring a high-end luxury travel agency website and a fully working admin management panel. Designed with an **Italian Riviera Luxury** aesthetic (inspired by the Amalfi Coast, Tuscan villas, and Venetian palazzos).

---

## 🌟 Key Features

### 🏛️ Public Luxury Website
- **Hero & Search Bar**: Tabbed destination, date, and traveler search bar routing to filtered packages.
- **Animated Statistics**: Counter numbers using custom `useCounter` for happy travelers, destinations, packages, and experience.
- **Featured Destinations**: High-resolution Unsplash photo cards with hover zoom effects.
- **Signature Packages**: Complete listing with day-by-day itinerary accordions, inclusions/exclusions, price boxes, and direct booking forms.
- **Concierge Services**: Flight booking, 5-star hotels, visa assistance, corporate retreats, travel insurance, and airport transfers.
- **About Roamora**: Story, mission/vision, leadership team grid, and milestones timeline.
- **Photo Gallery**: Masonry grid with category filter tabs and an interactive lightbox supporting keyboard arrow navigation.
- **Travel Journal**: Editorial articles with category filters, live search, and article views.
- **Guest Reviews**: Testimonials list and an interactive review submission form.
- **Interactive FAQ**: Categorized accordion items.
- **Contact & Map**: Working contact form saving instantly to admin, site settings placeholders, and embedded map section.
- **Global "Plan My Journey" Modal**: Reusable enquiry modal available across the entire site.

### 💼 Working Admin Panel (`/admin`)
- **Authentication**: Protected routes with session persistence and "Remember Me".
  - **Demo Admin Credentials**: `admin@roamora.com` / `Admin@123`
- **Dashboard**:
  - Live Stat Cards with animated `useCounter`.
  - Recharts Line Chart (Enquiries over time), Bar Chart (Bookings by destination), and Donut Chart (Status breakdown).
  - Recent Enquiries table & Quick Action shortcuts.
- **Packages Management**: Full CRUD, FileReader image upload to base64 preview, itinerary builder, inclusions/exclusions, featured & active toggles.
- **Destinations Management**: Full CRUD with region tags, highlights, and best time to visit.
- **Enquiries Management**: Table with status assignment (New / Contacted / Follow-up / Confirmed / Lost), internal notes drawer, delete, and CSV export.
- **Bookings Management**: Create/edit client bookings, payment status (Paid / Partial / Pending), and invoice printable view (`window.print()`).
- **Customer Directory**: Aggregated list of clients showing total lifetime spend, enquiries, and booking history.
- **Testimonials Management**: CRUD with approve/hide status toggle and star ratings.
- **Travel Journal Management**: CRUD with formatting toolbar (headers, bold, quotes).
- **Photo Gallery Management**: Image upload, categorization, and deletion.
- **Team & FAQ Management**: Full CRUD for leadership profiles and FAQ items.
- **Newsletter Subscribers**: View list and export CSV.
- **Global Site Settings**: Edit company name, logo text, tagline, bracket phone/email/address placeholders, hero headlines, and SEO meta descriptions with instant live site synchronization.

---

## 🎨 Design System: "Italian Riviera Luxury"

- **Palette**:
  - `--ivory`: `#F7F1E5` (Main background)
  - `--cream`: `#EFE6D2` (Alternate section background)
  - `--adriatic`: `#0E2A47` (Deep navy headers & footer)
  - `--terracotta`: `#B5573A` (Primary CTA buttons)
  - `--gold`: `#C2993F` (Luxury accents & ratings)
  - `--olive`: `#6B7040` (Secondary accent & success)
  - `--espresso`: `#2A1F1A` (Body text)
  - `--sage`: `#E4E2CF` (Soft cards & borders)
  - `--white`: `#FFFFFF`
- **Typography**:
  - Headings: *Cormorant Garamond* (Serif)
  - Body & UI: *Jost* (Sans-Serif)
- **Signature Details**: Thin gold hairline dividers, arched image frames (`border-radius: 200px 200px 0 0`), clean solid luxury elements.

---

## 🚀 Getting Started

### 1. Installation
```bash
npm install
```

### 2. Development Server
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

### 3. Build for Production
```bash
npm run build
```

---

## 🔐 Admin Credentials

- **URL**: `http://localhost:3000/admin/login`
- **Email**: `admin@roamora.com`
- **Password**: `Admin@123`

---

## 🔌 Connecting Supabase (or Real Backend) Later

The entire data architecture is decoupled inside `src/services/api.js`. Every function is `async` and returns standard Promises:

```js
// Example in src/services/api.js
export const api = {
  getPackages: async () => {
    // Current: Reads from LocalStorage
    // To Swap to Supabase:
    // const { data, error } = await supabase.from('packages').select('*');
    // return data;
  }
};
```
Because the UI components only interact with `api.*` methods, you can plug in Supabase, Firebase, or a custom Node/Python backend by modifying only `src/services/api.js` without touching a single component or page in the application!
