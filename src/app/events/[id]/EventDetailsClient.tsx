"use client";

import React, { use, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { EventItem } from "@/components/events/EventCard";

const fallbackMap: Record<string, EventItem> = {
  "demo-1": {
    _id: "demo-1",
    title: "Winter Clothes & Blanket Drive",
    description:
      "Providing warm blankets and essential winter wear to vulnerable families before the seasonal cold peak. Volunteers assist in sorting sizes, packaging blankets, and serving warm tea during distribution.",
    eventType: "Donation",
    thumbnail:
      "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80",
    location: "Gulshan, Dhaka",
    eventDate: "2026-11-05T10:00:00.000Z",
    creatorName: "Rahim Khan",
    creatorEmail: "rahim.khan@example.com",
  },
  "demo-2": {
    _id: "demo-2",
    title: "Children Education & Stationery Drive",
    description:
      "Distributing textbooks, notebooks, and creative art kits to support informal youth literacy. Volunteers help guide interactive reading sessions and distribute learning supplies.",
    eventType: "Education",
    thumbnail:
      "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1200&q=80",
    location: "New Market, Khulna",
    eventDate: "2026-12-01T11:00:00.000Z",
    creatorName: "Nusrat Jahan",
    creatorEmail: "nusrat.jahan@example.com",
  },
};

export default function EventDetailsClient({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [event, setEvent] = useState<EventItem | null>(() => fallbackMap[id] || null);
  const [joined, setJoined] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // If not found in fallback, try to fetch from backend
    if (!fallbackMap[id]) {
      const fetchDetail = async () => {
        try {
          const res = await fetch(`http://localhost:5000/api/events/${id}`);
          if (res.ok) {
            const data = await res.json();
            setEvent(data);
          }
        } catch {
          // ignore
        }
      };
      fetchDetail();
    }
  }, [id]);

  const handleJoin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setJoined(true);
      setIsLoading(false);
    }, 400);
  };

  if (!event) {
    return (
      <div className="py-20 text-center space-y-4">
        <h2 className="text-2xl font-black text-[var(--foreground)]">Drive Not Found</h2>
        <p className="text-sm text-[var(--muted)]">The requested event could not be retrieved.</p>
        <Link href="/" className="btn-primary text-xs">Return Home</Link>
      </div>
    );
  }

  const dateObj = new Date(event.eventDate);
  const formattedDate = !isNaN(dateObj.getTime())
    ? dateObj.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "Upcoming Date";

  return (
    <div className="py-6 space-y-8 max-w-4xl mx-auto">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-[var(--muted)]">
        <Link href="/" className="hover:text-[var(--primary)] transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link href="/upcoming-events" className="hover:text-[var(--primary)] transition-colors">
          Events
        </Link>
        <span>/</span>
        <span className="text-[var(--foreground)] font-semibold truncate max-w-[200px]">
          {event.title}
        </span>
      </div>

      {/* Main Event Card */}
      <div className="card-breeds overflow-hidden bg-[var(--card)] border border-[var(--border)] shadow-md">
        {/* Banner Image */}
        <div className="relative h-64 sm:h-96 w-full bg-[var(--accent)]">
          <Image
            src={event.thumbnail}
            alt={event.title}
            fill
            sizes="100vw"
            className="object-cover"
            priority
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* Type Badge */}
          <div className="absolute top-4 left-4">
            <span className="badge-pill bg-[#FF6B00] text-white text-xs font-bold shadow-md">
              {event.eventType}
            </span>
          </div>

          {/* Title Overlay on Mobile/Tablet */}
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <span className="badge-pill bg-white/20 backdrop-blur-md text-white text-xs font-semibold mb-2">
              📅 {formattedDate}
            </span>
            <h1 className="text-xl sm:text-3xl font-black leading-tight drop-shadow-sm">
              {event.title}
            </h1>
          </div>
        </div>

        {/* Details Content */}
        <div className="p-6 sm:p-10 space-y-8">
          {/* Key Facts Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-[var(--accent)] border border-[var(--border)]">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-[var(--muted)] uppercase tracking-wider">
                Location
              </span>
              <p className="text-xs sm:text-sm font-extrabold text-[var(--foreground)] flex items-center gap-1">
                <span>📍</span> {event.location}
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-[var(--muted)] uppercase tracking-wider">
                Organized By
              </span>
              <p className="text-xs sm:text-sm font-extrabold text-[var(--foreground)] flex items-center gap-1">
                <span>👤</span> {event.creatorName || "Community Organizer"}
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-[var(--muted)] uppercase tracking-wider">
                Drive Status
              </span>
              <p className="text-xs sm:text-sm font-extrabold text-[#0D9488] flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#0D9488]" />
                Open for Volunteers
              </p>
            </div>
          </div>

          {/* Full Description */}
          <div className="space-y-3">
            <h2 className="text-lg font-black text-[var(--foreground)]">
              About This Community Initiative
            </h2>
            <p className="text-xs sm:text-sm text-[var(--muted)] leading-relaxed whitespace-pre-line">
              {event.description}
            </p>
          </div>

          {/* Action Hub */}
          <div className="pt-6 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-[var(--muted)]">
              {joined ? (
                <span className="text-[#0D9488] font-bold flex items-center gap-1.5 text-sm">
                  ✓ You are registered as a volunteer for this drive!
                </span>
              ) : (
                <span>Join our grassroots team and make a direct difference in Dhaka.</span>
              )}
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleJoin}
                disabled={joined || isLoading}
                className={`w-full sm:w-auto text-xs sm:text-sm py-3 px-8 font-bold rounded-full transition-all cursor-pointer shadow-md ${
                  joined
                    ? "bg-[#0D9488] text-white cursor-default"
                    : "btn-primary"
                }`}
              >
                {isLoading ? "Joining..." : joined ? "Joined Successfully" : "Join This Event"}
              </button>
              <Link href="/" className="btn-outline text-xs sm:text-sm py-3 px-6">
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

