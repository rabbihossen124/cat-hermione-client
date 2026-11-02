# 🤝 UnityAid — Social Development & Community Events Platform

> **Live Website URL:** [https://unityaid-cat-hermione.vercel.app](https://unityaid-cat-hermione.vercel.app)  
> **Course Track:** B14-A8_Cat-Hermione — Full-Stack Community Event Management Platform

---

## 🌟 About UnityAid

**UnityAid** is a modern, community-driven social welfare platform designed to mobilize citizens across Bangladesh (Dhaka, Khulna, Jashore, Satkhira, Rangpur) to organize, discover, and participate in grassroots volunteer drives. From winter blanket distributions and urban tree plantations to street plastic cleanups and free medical clinics, UnityAid empowers changemakers with transparent event coordination and live volunteer tracking.

---

## ✨ Key Features (Minimum 5 Highlights)

1. **Dual Primary Color Breeds Theme & Dark/Light Mode**:
   - Distinctive visual identity built with Tangerine Orange (`#FF6B00`) and Deep Teal (`#0D9488`), rounded cards (`card-breeds`), and zero-flicker light/dark mode toggling persisted across sessions.
2. **Next.js 16 App Router & BetterAuth Authentication**:
   - Modern authentication powered by `better-auth` with MongoDB Adapter and JWT support. Includes one-click **Google Sign-In Popup** (displaying PC-detected Gmail accounts) and email/password registration with strict validation (minimum 6 characters, 1 uppercase, 1 lowercase).
3. **Strict Future-Date Event Creation & Real-Time Card Preview**:
   - Interactive event creation interface with instant card preview, category selection (Donation, Cleanup, Plantation, Medical Aid, Education), assembly location, and strict client & server future-date validation.
4. **Volunteer Participation & Prevent Duplicate Joining**:
   - Citizens can join grassroots drives with one click. Automatic duplicate detection prevents volunteers from joining the same initiative twice, and volunteers can manage or withdraw their participation anytime with custom confirmation modals (zero native browser alerts).
5. **Interactive Organizer Dashboard & Real-Time Sync**:
   - Private organizer dashboard allowing event hosts to update drive schedules and details via in-app modals or safely delete concluded initiatives with dual-source fallback synchronization.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend Framework** | **Next.js 16.4.3** (App Router, Turbopack, React Compiler) |
| **UI & Styling** | **Tailwind CSS v4**, Geist Font, Custom Breeds Palette, Lucide Icons |
| **Authentication** | **BetterAuth** + MongoDB Adapter + JWT |
| **State & Lifecycle** | React 19 `useSyncExternalStore` for zero-cascading hydration safety |
| **Backend Integration** | Express.js v5 (ES Modules, MongoDB Atlas) |

---

## 🚀 Getting Started (Client Setup)

### 1. Clone & Install Dependencies
```bash
cd client/cat-hermione
npm install
```

### 2. Configure Environment Variables
Create a `.env.local` file in the root of `cat-hermione`:
```env
# MongoDB Atlas Database
MONGODB_URI=your_mongodb_atlas_connection_string

# BetterAuth Configuration
BETTER_AUTH_SECRET=your_super_secret_jwt_key
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Optional: Google OAuth Credentials (for direct production OAuth)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔒 Verification & Code Standards
- **TypeScript Compilation:** `npx tsc --noEmit` — **0 errors**
- **Linting:** `npm run lint` — **0 errors, 0 warnings**
- **No Native Alerts:** Custom in-app animated modals only
- **No Lorem Ipsum:** Authentic, grassroots Bangladesh social service copy only

---

© 2026 UnityAid — Mobilizing Community Action for Bangladesh.
