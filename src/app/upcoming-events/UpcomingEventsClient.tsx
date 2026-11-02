"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import EventCard, { EventItem } from "@/components/events/EventCard";

const initialUpcomingEvents: EventItem[] = [
  {
    _id: "demo-1",
    title: "Winter Clothes & Blanket Drive",
    description:
      "Providing warm blankets and essential winter wear to vulnerable families before the seasonal cold peak. Volunteers help sort clothing packages and assist distribution.",
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
      "Distributing textbooks, notebooks, and creative art kits to support informal youth literacy and primary learning.",
    eventType: "Education",
    thumbnail:
      "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80",
    location: "New Market, Khulna",
    eventDate: "2026-12-01T11:00:00.000Z",
    creatorName: "Nusrat Jahan",
  },
];

const categoryOptions = [
  "All",
  "Donation",
  "Cleanup",
  "Plantation",
  "Medical Aid",
  "Education",
];

export default function UpcomingEventsClient() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  const initialType = searchParams.get("type") || "All";

  const [events, setEvents] = useState<EventItem[]>(initialUpcomingEvents);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialType);
  const [sortBy, setSortBy] = useState<"date-asc" | "date-desc" | "title">("date-asc");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Attempt dynamic fetch from Express server
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("http://localhost:5000/api/events");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setEvents(data);
            return;
          }
        }
      } catch {
        // Fallback to pre-seeded drives
      } finally {
        setIsLoading(false);
      }

      // Check localStorage for user-created custom events
      try {
        const local = localStorage.getItem("unityaid_custom_events");
        if (local) {
          const parsed = JSON.parse(local);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setEvents([...initialUpcomingEvents, ...parsed]);
          }
        }
      } catch {
        // ignore
      }
    };
    fetchEvents();
  }, []);

  // Filter & Sort
  const filteredEvents = useMemo(() => {
    return events
      .filter((ev) => {
        // Only future events
        const eventTimestamp = new Date(ev.eventDate).getTime();
        // Compare with a baseline date or today
        if (isNaN(eventTimestamp)) return true;

        // Search match (title, location, description)
        const query = searchTerm.toLowerCase().trim();
        const matchesSearch =
          !query ||
          ev.title.toLowerCase().includes(query) ||
          ev.location.toLowerCase().includes(query) ||
          ev.description.toLowerCase().includes(query);

        // Category match
        const matchesCategory =
          selectedCategory === "All" ||
          ev.eventType.toLowerCase() === selectedCategory.toLowerCase();

        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        if (sortBy === "date-asc") {
          return new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime();
        }
        if (sortBy === "date-desc") {
          return new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime();
        }
        if (sortBy === "title") {
          return a.title.localeCompare(b.title);
        }
        return 0;
      });
  }, [events, searchTerm, selectedCategory, sortBy]);

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("All");
    setSortBy("date-asc");
  };

  return (
    <div className="py-6 space-y-10">
      {/* Page Header */}
      <div className="space-y-3 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-[var(--accent)] text-[var(--accent-foreground)] border border-[var(--primary)]/20 shadow-xs">
          <span>📅 Community Directory</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-[var(--foreground)] tracking-tight">
          Explore Upcoming Social Service Drives
        </h1>
        <p className="text-xs sm:text-sm text-[var(--muted)] leading-relaxed">
          Find and join grassroots community drives across Dhaka, Khulna, Jashore, and Rangpur. Every drive is organized by verified local volunteers.
        </p>
      </div>

      {/* Breeds Signature Search & Filter Bar */}
      <div className="card-breeds p-4 sm:p-6 bg-[var(--card)] border border-[var(--border)] shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row items-center gap-3">
          {/* Search Input */}
          <div className="flex-1 flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-[var(--background)] border border-[var(--border)] w-full">
            <span className="text-sm">🔍</span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by drive title, neighborhood, or keywords..."
              className="w-full text-xs sm:text-sm bg-transparent outline-none text-[var(--foreground)] placeholder-[var(--muted)]"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="text-xs text-[var(--muted)] hover:text-[var(--foreground)] cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          {/* Category Dropdown */}
          <div className="flex items-center gap-2 w-full lg:w-auto">
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[var(--background)] border border-[var(--border)] w-full lg:w-auto">
              <span className="text-xs">📂</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                aria-label="Filter events by category"
                className="text-xs sm:text-sm bg-transparent outline-none text-[var(--foreground)] cursor-pointer pr-4 w-full"
              >
                {categoryOptions.map((cat) => (
                  <option
                    key={cat}
                    value={cat}
                    className="bg-[var(--card)] text-[var(--foreground)]"
                  >
                    {cat === "All" ? "All Categories" : cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[var(--background)] border border-[var(--border)] w-full lg:w-auto">
              <span className="text-xs">⇅</span>
              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(e.target.value as "date-asc" | "date-desc" | "title")
                }
                aria-label="Sort events"
                className="text-xs sm:text-sm bg-transparent outline-none text-[var(--foreground)] cursor-pointer pr-4 w-full"
              >
                <option value="date-asc" className="bg-[var(--card)] text-[var(--foreground)]">
                  Date: Earliest First
                </option>
                <option value="date-desc" className="bg-[var(--card)] text-[var(--foreground)]">
                  Date: Latest First
                </option>
                <option value="title" className="bg-[var(--card)] text-[var(--foreground)]">
                  Title: A to Z
                </option>
              </select>
            </div>
          </div>
        </div>

        {/* Quick Filter Pill Chips */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[var(--border)] text-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[var(--muted)] font-semibold mr-1">Quick Filter:</span>
            {categoryOptions.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-[var(--primary)] text-white shadow-xs"
                    : "bg-[var(--accent)] text-[var(--accent-foreground)] hover:border-[var(--primary)] border border-transparent"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="text-[var(--muted)] font-semibold">
            Showing <strong className="text-[var(--foreground)]">{filteredEvents.length}</strong> verified drives
          </div>
        </div>
      </div>

      {/* Events Grid / Empty State */}
      {isLoading ? (
        <div className="py-24 text-center space-y-4">
          <div className="w-10 h-10 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-bold text-[var(--muted)]">Loading verified community drives...</p>
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="card-breeds p-12 text-center space-y-4 bg-[var(--card)] border border-[var(--border)] max-w-lg mx-auto">
          <div className="text-4xl">🔍</div>
          <h2 className="text-lg font-black text-[var(--foreground)]">No Drives Found</h2>
          <p className="text-xs text-[var(--muted)] leading-relaxed">
            No upcoming social service drives matched your search query or selected category.
          </p>
          <button
            type="button"
            onClick={handleResetFilters}
            className="btn-primary text-xs py-2.5 px-6 cursor-pointer"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}

