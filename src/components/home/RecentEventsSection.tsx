"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import EventCard, { EventItem } from "@/components/events/EventCard";

// High quality initial seed events matching the assignment prompt examples
const fallbackEvents: EventItem[] = [
  {
    _id: "demo-1",
    title: "Winter Clothes & Blanket Drive",
    description:
      "Providing warm blankets and essential winter wear to vulnerable families before the seasonal cold peak.",
    eventType: "Donation",
    thumbnail:
      "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80",
    location: "Gulshan, Dhaka",
    eventDate: "2026-11-05T10:00:00.000Z",
    creatorName: "Rahim Khan",
  },
  {
    _id: "demo-2",
    title: "Children Education & Stationery Drive",
    description:
      "Distributing textbooks, notebooks, and creative art kits to support informal youth literacy.",
    eventType: "Education",
    thumbnail:
      "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80",
    location: "New Market, Khulna",
    eventDate: "2026-12-01T11:00:00.000Z",
    creatorName: "Nusrat Jahan",
  },
];

export default function RecentEventsSection() {
  const [events, setEvents] = useState<EventItem[]>(fallbackEvents);

  useEffect(() => {
    // Attempt dynamic fetch from Express server (.limit(6))
    const fetchRecent = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/events/recent");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setEvents(data);
          }
        }
      } catch {
        // Fallback already pre-loaded
      }
    };
    fetchRecent();
  }, []);

  return (
    <section className="space-y-8">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--primary)]">
            Verified Social Drives
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-[var(--foreground)] tracking-tight">
            Upcoming Community Drives
          </h2>
          <p className="text-xs sm:text-sm text-[var(--muted)] max-w-xl">
            Explore active volunteer campaigns and join grassroots initiatives making a tangible difference.
          </p>
        </div>

        <Link
          href="/upcoming-events"
          className="btn-outline text-xs sm:text-sm whitespace-nowrap self-start sm:self-auto"
        >
          View All Upcoming Events →
        </Link>
      </div>

      {/* Grid of Events (Up to 6 Cards on Home as required) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.slice(0, 6).map((item) => (
          <EventCard key={item._id} event={item} />
        ))}
      </div>
    </section>
  );
}

