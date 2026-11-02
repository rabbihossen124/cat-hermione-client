"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { EventItem } from "@/components/events/EventCard";

const sampleImages = [
  {
    label: "Winter Clothes",
    url: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80",
  },
  {
    label: "Tree Plantation",
    url: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=800&q=80",
  },
  {
    label: "Plastic Cleanup",
    url: "https://images.unsplash.com/photo-1595278069441-2cf29f8005a4?auto=format&fit=crop&w=800&q=80",
  },
  {
    label: "Education Drive",
    url: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80",
  },
  {
    label: "Medical Camp",
    url: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80",
  },
];

// React 19 official zero-cascading-render mounted store
const emptySubscribe = () => () => {};
function useMounted() {
  return React.useSyncExternalStore(emptySubscribe, () => true, () => false);
}

export default function CreateEventClient() {
  const router = useRouter();
  const { user, login } = useAuth();
  const mounted = useMounted();

  // Lazy calculate tomorrow's date for strict future date validation (React 19 pure render)
  const [minDateStr] = useState<string>(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  });

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventType, setEventType] = useState("Donation");
  const [thumbnail, setThumbnail] = useState(
    "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80"
  );
  const [location, setLocation] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Demo Login Helper for seamless testing if not logged in yet
  const handleQuickDemoLogin = () => {
    login({
      name: "Tanzim Hasan",
      email: "tanzim.volunteer@unityaid.org",
      photoURL: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!user) {
      setErrorMessage("You must be logged in to host a community event.");
      return;
    }

    if (!title.trim() || title.trim().length < 5) {
      setErrorMessage("Event title must be at least 5 characters long.");
      return;
    }

    if (!description.trim() || description.trim().length < 20) {
      setErrorMessage("Please provide a meaningful description (at least 20 characters).");
      return;
    }

    if (!location.trim()) {
      setErrorMessage("Please specify the event location or assembly point.");
      return;
    }

    if (!thumbnail.trim()) {
      setErrorMessage("Please provide a valid thumbnail image URL.");
      return;
    }

    if (!eventDate) {
      setErrorMessage("Please select a future event date.");
      return;
    }

    // Strict Future-Date Validation
    const selectedTime = new Date(eventDate).getTime();
    const nowTime = Date.now();
    if (isNaN(selectedTime) || selectedTime <= nowTime) {
      setErrorMessage("Event date must be strictly in the future. Past dates are not allowed.");
      return;
    }

    setIsSubmitting(true);

    const newEvent: EventItem = {
      _id: "custom-" + Date.now(),
      title: title.trim(),
      description: description.trim(),
      eventType,
      thumbnail: thumbnail.trim(),
      location: location.trim(),
      eventDate: new Date(eventDate).toISOString(),
      creatorName: user.name,
      creatorEmail: user.email,
    };

    // 1. Send POST request to backend API (Express + MongoDB)
    try {
      const token = localStorage.getItem("unityaid_token");
      await fetch("http://localhost:5000/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(newEvent),
      });
    } catch {
      // Backend may be offline, localStorage persists for complete offline support
    }

    // 2. Save into localStorage so it immediately appears in all client pages
    try {
      const existing = localStorage.getItem("unityaid_custom_events");
      const list: EventItem[] = existing ? JSON.parse(existing) : [];
      list.unshift(newEvent);
      localStorage.setItem("unityaid_custom_events", JSON.stringify(list));
    } catch {
      // ignore
    }

    setSuccessMessage("🎉 Community Event Created Successfully! Redirecting to upcoming directory...");
    setTimeout(() => {
      router.push("/upcoming-events");
    }, 1500);
  };

  // Render consistent placeholder during initial SSR & hydration
  if (!mounted) {
    return (
      <div className="py-24 text-center space-y-4 max-w-md mx-auto">
        <div className="w-10 h-10 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs font-bold text-[var(--muted)]">Loading event creator...</p>
      </div>
    );
  }

  // If user is not logged in, show Auth Gate
  if (!user) {
    return (
      <div className="py-20 max-w-lg mx-auto text-center space-y-6">
        <div className="card-breeds p-8 sm:p-10 bg-[var(--card)] border border-[var(--border)] shadow-md space-y-6">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-[var(--accent)] text-[var(--primary)] flex items-center justify-center text-3xl font-black shadow-inner">
            🔒
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-black text-[var(--foreground)] tracking-tight">
              Host a Community Service Event
            </h1>
            <p className="text-xs sm:text-sm text-[var(--muted)] leading-relaxed">
              To ensure trust, safety, and accountability for all community drives, you must be logged in to create an event.
            </p>
          </div>

          <div className="pt-2 flex flex-col gap-3">
            <Link
              href="/login?redirect=/create-event"
              className="btn-primary w-full text-xs sm:text-sm py-3"
            >
              Sign In to Your Account →
            </Link>
            <button
              type="button"
              onClick={handleQuickDemoLogin}
              className="btn-secondary w-full text-xs sm:text-sm py-3 cursor-pointer"
            >
              ⚡ Quick Demo Organizer Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 space-y-10 max-w-5xl mx-auto">
      {/* Header */}
      <div className="space-y-2 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-[var(--accent)] text-[var(--accent-foreground)] border border-[var(--primary)]/20 shadow-xs">
          <span>🤝 Grassroots Action</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-[var(--foreground)] tracking-tight">
          Host a Community Drive
        </h1>
        <p className="text-xs sm:text-sm text-[var(--muted)] leading-relaxed">
          Mobilize local neighbors in Dhaka, Khulna, or anywhere in Bangladesh for cleanups, warm clothes distributions, or tree plantation.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Form (8 Columns) */}
        <div className="lg:col-span-7 card-breeds p-6 sm:p-8 bg-[var(--card)] border border-[var(--border)] shadow-sm space-y-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Title */}
            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-[var(--foreground)] uppercase tracking-wider">
                Event Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Winter Clothes & Warm Blanket Drive"
                className="w-full px-4 py-3 rounded-2xl bg-[var(--background)] border border-[var(--border)] text-xs sm:text-sm text-[var(--foreground)] outline-none focus:border-[var(--primary)] transition-colors"
              />
            </div>

            {/* Event Category & Date (Grid) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-[var(--foreground)] uppercase tracking-wider">
                  Event Category *
                </label>
                <select
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                  aria-label="Event category"
                  className="w-full px-4 py-3 rounded-2xl bg-[var(--background)] border border-[var(--border)] text-xs sm:text-sm text-[var(--foreground)] outline-none focus:border-[var(--primary)] transition-colors cursor-pointer"
                >
                  <option value="Donation">Donation (Clothes / Food / Funds)</option>
                  <option value="Cleanup">Cleanup (Plastic / River / Street)</option>
                  <option value="Plantation">Plantation (Trees / Mangrove)</option>
                  <option value="Medical Aid">Medical Aid (Health / Eye Camp)</option>
                  <option value="Education">Education (Books / Stationery)</option>
                  <option value="Other">Other Community Cause</option>
                </select>
              </div>

              {/* Event Date (Strict Future Date Validation) */}
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-[var(--foreground)] uppercase tracking-wider flex items-center justify-between">
                  <span>Event Date *</span>
                  <span className="text-[10px] text-[#0D9488] font-bold">Future Dates Only</span>
                </label>
                <input
                  type="date"
                  required
                  min={minDateStr}
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-[var(--background)] border border-[var(--border)] text-xs sm:text-sm text-[var(--foreground)] outline-none focus:border-[var(--primary)] transition-colors cursor-pointer"
                />
              </div>
            </div>

            {/* Location */}
            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-[var(--foreground)] uppercase tracking-wider">
                Location & Assembly Point *
              </label>
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[var(--background)] border border-[var(--border)] focus-within:border-[var(--primary)] transition-colors">
                <span className="text-base">📍</span>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Gulshan 2 Circle, Dhaka"
                  className="w-full text-xs sm:text-sm bg-transparent text-[var(--foreground)] outline-none"
                />
              </div>
            </div>

            {/* Thumbnail Image URL with Quick Selectors */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold text-[var(--foreground)] uppercase tracking-wider flex items-center justify-between">
                <span>Thumbnail Image URL *</span>
                <span className="text-[10px] text-[var(--muted)]">Web image address</span>
              </label>
              <input
                type="url"
                required
                value={thumbnail}
                onChange={(e) => setThumbnail(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-4 py-3 rounded-2xl bg-[var(--background)] border border-[var(--border)] text-xs sm:text-sm text-[var(--foreground)] outline-none focus:border-[var(--primary)] transition-colors"
              />
              {/* Quick Preset Selector Buttons */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[11px] text-[var(--muted)] font-semibold">Presets:</span>
                {sampleImages.map((s, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setThumbnail(s.url)}
                    className="text-[10px] px-2.5 py-1 rounded-full border border-[var(--border)] bg-[var(--accent)] text-[var(--accent-foreground)] hover:border-[var(--primary)] transition-colors cursor-pointer"
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-[var(--foreground)] uppercase tracking-wider">
                Detailed Event Description *
              </label>
              <textarea
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detail what your social drive will accomplish, assembly instructions, volunteer safety precautions, and contact guidelines..."
                className="w-full px-4 py-3 rounded-2xl bg-[var(--background)] border border-[var(--border)] text-xs sm:text-sm text-[var(--foreground)] outline-none focus:border-[var(--primary)] transition-colors resize-none leading-relaxed"
              />
            </div>

            {/* Organizer Info (Readonly for Trust & Transparency) */}
            <div className="p-4 rounded-2xl bg-[var(--accent)] border border-[var(--border)] grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-wider">
                  Event Creator Name 🔒
                </span>
                <p className="font-extrabold text-[var(--foreground)] truncate">
                  {user.name}
                </p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-wider">
                  Contact Email 🔒
                </span>
                <p className="font-extrabold text-[var(--foreground)] truncate">
                  {user.email}
                </p>
              </div>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs font-semibold animate-in fade-in">
                ⚠️ {errorMessage}
              </div>
            )}

            {/* Success Message */}
            {successMessage && (
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold animate-in fade-in">
                {successMessage}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full text-xs sm:text-sm py-3.5 shadow-md font-bold cursor-pointer"
            >
              {isSubmitting ? "Publishing Event Drive..." : "Publish Community Event →"}
            </button>
          </form>
        </div>

        {/* Live Preview Panel (5 Columns) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between text-xs font-bold text-[var(--muted)] uppercase tracking-wider px-1">
            <span>Live Card Preview</span>
            <span className="text-[#0D9488]">Real-time Update</span>
          </div>

          <div className="card-breeds overflow-hidden bg-[var(--card)] border border-[var(--border)] shadow-md">
            {/* Preview Thumbnail */}
            <div className="relative h-48 w-full bg-[var(--accent)]">
              <Image
                src={
                  thumbnail ||
                  "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80"
                }
                alt="Event preview"
                fill
                sizes="(max-width: 768px) 100vw, 400px"
                className="object-cover"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

              <div className="absolute top-3 left-3">
                <span className="badge-pill bg-[#FF6B00] text-white text-[11px] font-extrabold shadow-md">
                  {eventType}
                </span>
              </div>

              <div className="absolute bottom-3 left-3">
                <span className="badge-pill bg-white/95 dark:bg-slate-900/90 text-slate-900 dark:text-slate-100 text-[11px] font-bold shadow-md">
                  📅 {eventDate ? new Date(eventDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Selected Date"}
                </span>
              </div>
            </div>

            {/* Preview Body */}
            <div className="p-5 space-y-3">
              <h3 className="text-base font-extrabold text-[var(--foreground)] line-clamp-2 leading-snug">
                {title.trim() || "Your Event Title Will Appear Here"}
              </h3>
              <p className="text-xs text-[var(--muted)] line-clamp-2 leading-relaxed">
                {description.trim() || "Your community drive description and volunteer instructions will be previewed here."}
              </p>

              <div className="pt-2 border-t border-[var(--border)] flex items-center justify-between text-xs text-[var(--muted)]">
                <span className="truncate max-w-[170px]">
                  📍 {location.trim() || "Event Location"}
                </span>
                <span className="text-[11px] font-semibold text-[var(--secondary)] truncate">
                  by {user.name}
                </span>
              </div>
            </div>

            <div className="p-5 pt-0">
              <div className="btn-primary w-full text-xs py-2 text-center opacity-80 cursor-default">
                View Event Details
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

