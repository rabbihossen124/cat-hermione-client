# 🤝 UnityAid — Social Development & Community Events Platform

> **🌐 Live Website URL:** [https://unityaid-cat-hermione.vercel.app](https://unityaid-cat-hermione.vercel.app)  
> *(Note: Replace with your final Vercel deployment URL)*  
> **Course Track:** B14-A8_Cat-Hermione — Community-Driven Social Service Platform

---

## 🌟 About UnityAid

**UnityAid** is a community-driven event management platform designed to empower citizens across Bangladesh (Dhaka, Khulna, Jashore, Satkhira, Rangpur) to organize, discover, and join grassroots social service initiatives — from winter blanket distributions and urban tree plantations to neighborhood cleanups and free medical clinics.

---

## ✨ Key Features (Platform Highlights)

1. **Dual Primary Color Breeds Theme & Zero-Flicker Dark Mode**:
   - Distinctive visual styling with Tangerine Orange (`#FF6B00`) and Deep Teal (`#0D9488`), rounded cards (`card-breeds`), and persistent light/dark mode toggling.
2. **Next.js 16 App Router & BetterAuth Authentication**:
   - Modern authentication with BetterAuth, MongoDB Adapter, and JWT support. Includes one-click **Google Sign-In Popup** and email/password registration with strict validation (minimum 6 characters, uppercase, and lowercase letters).
3. **Strict Future-Date Event Creation & Real-Time Card Preview**:
   - Interactive event creation interface with instant live card preview, category selection (Donation, Cleanup, Plantation, Medical Aid, Education), and strict future-date validation.
4. **Volunteer Participation & Duplicate Prevention**:
   - Citizens can register for grassroots drives with a single click. Intelligent duplicate detection prevents double registrations, and volunteers can manage or withdraw their spots anytime without native browser alerts.
5. **Private Organizer & Volunteer Management Dashboards**:
   - Dedicated organizer dashboard allowing users to update their hosted drives via in-app modals or safely delete initiatives, plus a Joined Events page sorted chronologically by event date.

---

## 🛠️ Technology Stack

- **Frontend:** Next.js 16.4.3 (App Router, Turbopack), React 19, TypeScript
- **Styling:** Tailwind CSS v4, Custom Breeds Palette
- **Authentication:** BetterAuth + MongoDB Adapter + JWT
- **Backend:** Express.js v5 (ES Modules, MongoDB Atlas)

---

## 🚀 Deployment (Vercel)

1. Connect this repository to your **Vercel** account.
2. Set the Root Directory to `client/cat-hermione`.
3. Add your environment variables in Vercel Project Settings (`MONGODB_URI`, `BETTER_AUTH_SECRET`, etc.).
4. Click **Deploy** to go live!

---

© 2026 UnityAid — Community Service & Social Development Platform.
