"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { EventItem } from "@/components/events/EventCard";

// React 19 official zero-cascading-render mounted store
const emptySubscribe = () => () => {};
function useMounted() {
  return React.useSyncExternalStore(emptySubscribe, () => true, () => false);
}

const defaultOrganizerDrives: EventItem[] = [
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
    creatorName: "Tanzim Hasan",
    creatorEmail: "tanzim.volunteer@unityaid.org",
  },
];

export default function ManageEventsClient() {
  const { user } = useAuth();
  const mounted = useMounted();

  const [events, setEvents] = useState<EventItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Edit State
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editType, setEditType] = useState("Donation");
  const [isUpdating, setIsUpdating] = useState(false);

  // Delete State
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Future Date constraint for update modal
  const [minDateStr] = useState<string>(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  });

  // Load User Created Events
  useEffect(() => {
    if (!user) return;
    let ignore = false;

    const loadEvents = async () => {
      try {
        const token = localStorage.getItem("unityaid_token");
        const res = await fetch("http://localhost:5000/api/events/my-events", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0 && !ignore) {
            setEvents(data);
            setIsLoading(false);
            return;
          }
        }
      } catch {
        // Fallback to local storage
      }

      if (ignore) return;

      // Check localStorage custom created events
      try {
        const local = localStorage.getItem("unityaid_custom_events");
        const list: EventItem[] = local ? JSON.parse(local) : [];
        const userCreated = list.filter(
          (e) => e.creatorEmail === user.email || e.creatorName === user.name
        );
        if (userCreated.length > 0) {
          setEvents(userCreated);
        } else {
          // If no custom events yet, show default organizer drives for seamless demonstration
          setEvents(defaultOrganizerDrives);
        }
      } catch {
        setEvents(defaultOrganizerDrives);
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    };

    loadEvents();
    return () => {
      ignore = true;
    };
  }, [user]);

  // Open Edit Modal
  const handleOpenEdit = (item: EventItem) => {
    setEditingEvent(item);
    setEditTitle(item.title);
    setEditDescription(item.description);
    setEditLocation(item.location);
    setEditType(item.eventType);
    const dateFormatted = new Date(item.eventDate).toISOString().split("T")[0];
    setEditDate(dateFormatted);
  };

  // Submit Update
  const handleSaveUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent) return;

    setIsUpdating(true);

    const updatedItem: EventItem = {
      ...editingEvent,
      title: editTitle.trim(),
      description: editDescription.trim(),
      location: editLocation.trim(),
      eventType: editType,
      eventDate: new Date(editDate).toISOString(),
    };

    // 1. Send PUT request to Express Backend
    try {
      const token = localStorage.getItem("unityaid_token");
      await fetch(`http://localhost:5000/api/events/${editingEvent._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(updatedItem),
      });
    } catch {
      // Backend offline, fallback in memory & localStorage
    }

    // 2. Update localStorage
    try {
      const local = localStorage.getItem("unityaid_custom_events");
      if (local) {
        const list: EventItem[] = JSON.parse(local);
        const idx = list.findIndex((x) => x._id === editingEvent._id);
        if (idx !== -1) {
          list[idx] = updatedItem;
          localStorage.setItem("unityaid_custom_events", JSON.stringify(list));
        }
      }
    } catch {
      // ignore
    }

    // 3. Update component state
    setEvents((prev) =>
      prev.map((ev) => (ev._id === editingEvent._id ? updatedItem : ev))
    );

    setIsUpdating(false);
    setEditingEvent(null);
  };

  // Confirm and Execute Delete
  const handleExecuteDelete = async () => {
    if (!deletingId) return;

    setIsDeleting(true);

    // 1. Send DELETE to Express Backend
    try {
      const token = localStorage.getItem("unityaid_token");
      await fetch(`http://localhost:5000/api/events/${deletingId}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
    } catch {
      // Backend offline
    }

    // 2. Remove from localStorage
    try {
      const local = localStorage.getItem("unityaid_custom_events");
      if (local) {
        const list: EventItem[] = JSON.parse(local);
        const filtered = list.filter((x) => x._id !== deletingId);
        localStorage.setItem("unityaid_custom_events", JSON.stringify(filtered));
      }
    } catch {
      // ignore
    }

    // 3. Update component state
    setEvents((prev) => prev.filter((ev) => ev._id !== deletingId));

    setIsDeleting(false);
    setDeletingId(null);
  };

  // SSR Hydration Guard
  if (!mounted) {
    return (
      <div className="py-24 text-center space-y-4 max-w-md mx-auto">
        <div className="w-10 h-10 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs font-bold text-[var(--muted)]">Loading manage dashboard...</p>
      </div>
    );
  }

  // Auth Guard
  if (!user) {
    return (
      <div className="py-20 max-w-lg mx-auto text-center space-y-6">
        <div className="card-breeds p-8 sm:p-10 bg-[var(--card)] border border-[var(--border)] shadow-md space-y-6">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-[var(--accent)] text-[var(--primary)] flex items-center justify-center text-3xl font-black shadow-inner">
            🔒
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-black text-[var(--foreground)] tracking-tight">
              Organizer Dashboard Access
            </h1>
            <p className="text-xs sm:text-sm text-[var(--muted)] leading-relaxed">
              You must be logged in to manage, edit, or remove your hosted community drives.
            </p>
          </div>
          <Link
            href="/login?redirect=/manage-events"
            className="btn-primary w-full text-xs sm:text-sm py-3"
          >
            Sign In to Dashboard →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-[var(--accent)] text-[var(--accent-foreground)]">
            <span>🛠️ Organizer Controls</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-[var(--foreground)] tracking-tight">
            Manage Your Community Drives
          </h1>
          <p className="text-xs sm:text-sm text-[var(--muted)]">
            Update event dates, modify instructions, or delete drives you have organized.
          </p>
        </div>

        <Link
          href="/create-event"
          className="btn-primary text-xs sm:text-sm py-2.5 px-5 self-start sm:self-auto shadow-sm"
        >
          ➕ Host New Drive
        </Link>
      </div>

      {/* Events Table / Card List */}
      {isLoading ? (
        <div className="py-24 text-center space-y-4">
          <div className="w-10 h-10 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-bold text-[var(--muted)]">Loading your events...</p>
        </div>
      ) : events.length === 0 ? (
        <div className="card-breeds p-12 text-center space-y-4 bg-[var(--card)] border border-[var(--border)] max-w-lg mx-auto shadow-xs">
          <div className="text-4xl">🌱</div>
          <h2 className="text-lg font-black text-[var(--foreground)]">No Drives Hosted Yet</h2>
          <p className="text-xs text-[var(--muted)] leading-relaxed">
            You have not organized any community service events yet. Launch your first drive to mobilize volunteers in your area!
          </p>
          <Link href="/create-event" className="btn-primary text-xs py-2.5 px-6 inline-block">
            Create Your First Event →
          </Link>
        </div>
      ) : (
        <div className="card-breeds overflow-hidden bg-[var(--card)] border border-[var(--border)] shadow-sm">
          {/* Desktop Table View */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[var(--foreground)]">
              <thead className="bg-[var(--accent)] text-[var(--muted)] uppercase font-extrabold text-[10px] tracking-wider border-b border-[var(--border)]">
                <tr>
                  <th scope="col" className="p-4 sm:px-6">Drive Info</th>
                  <th scope="col" className="p-4 sm:px-6">Category</th>
                  <th scope="col" className="p-4 sm:px-6">Scheduled Date</th>
                  <th scope="col" className="p-4 sm:px-6">Location</th>
                  <th scope="col" className="p-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {events.map((item) => {
                  const dateObj = new Date(item.eventDate);
                  const formattedDate = !isNaN(dateObj.getTime())
                    ? dateObj.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "Upcoming";

                  return (
                    <tr
                      key={item._id}
                      className="hover:bg-[var(--background)] transition-colors group"
                    >
                      {/* Drive Info with Thumbnail */}
                      <td className="p-4 sm:px-6 flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-[var(--accent)] shrink-0 border border-[var(--border)]">
                          <Image
                            src={
                              item.thumbnail ||
                              "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=400&q=80"
                            }
                            alt={item.title}
                            fill
                            sizes="48px"
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                        <div className="space-y-0.5 max-w-xs">
                          <Link
                            href={`/events/${item._id}`}
                            className="font-extrabold text-xs sm:text-sm text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors line-clamp-1"
                          >
                            {item.title}
                          </Link>
                          <p className="text-[11px] text-[var(--muted)] line-clamp-1">
                            {item.description}
                          </p>
                        </div>
                      </td>

                      {/* Category Badge */}
                      <td className="p-4 sm:px-6 whitespace-nowrap">
                        <span className="badge-pill bg-[#0D9488]/15 text-[#0D9488] font-bold text-[10px]">
                          {item.eventType}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="p-4 sm:px-6 whitespace-nowrap font-medium text-[var(--muted)]">
                        📅 {formattedDate}
                      </td>

                      {/* Location */}
                      <td className="p-4 sm:px-6 whitespace-nowrap font-medium text-[var(--muted)]">
                        📍 {item.location}
                      </td>

                      {/* Actions */}
                      <td className="p-4 sm:px-6 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(item)}
                            className="px-3 py-1.5 rounded-full border border-[var(--border)] bg-[var(--card)] hover:border-[var(--primary)] hover:text-[var(--primary)] text-xs font-semibold transition-colors cursor-pointer"
                          >
                            ✏️ Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeletingId(item._id)}
                            className="px-3 py-1.5 rounded-full border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 hover:bg-red-100 text-xs font-semibold transition-colors cursor-pointer"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Custom Edit Modal (No Browser Default Alert) */}
      {editingEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="card-breeds max-w-lg w-full p-6 sm:p-8 bg-[var(--card)] border border-[var(--border)] shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
              <h2 className="text-base font-black text-[var(--foreground)]">
                ✏️ Update Community Drive
              </h2>
              <button
                type="button"
                onClick={() => setEditingEvent(null)}
                className="text-[var(--muted)] hover:text-[var(--foreground)] text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveUpdate} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-extrabold text-[var(--foreground)] uppercase">
                  Event Title
                </label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)] outline-none focus:border-[var(--primary)]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-extrabold text-[var(--foreground)] uppercase">
                    Category
                  </label>
                  <select
                    value={editType}
                    onChange={(e) => setEditType(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)] outline-none focus:border-[var(--primary)] cursor-pointer"
                  >
                    <option value="Donation">Donation</option>
                    <option value="Cleanup">Cleanup</option>
                    <option value="Plantation">Plantation</option>
                    <option value="Medical Aid">Medical Aid</option>
                    <option value="Education">Education</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-extrabold text-[var(--foreground)] uppercase">
                    Event Date
                  </label>
                  <input
                    type="date"
                    required
                    min={minDateStr}
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)] outline-none focus:border-[var(--primary)] cursor-pointer"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-extrabold text-[var(--foreground)] uppercase">
                  Location
                </label>
                <input
                  type="text"
                  required
                  value={editLocation}
                  onChange={(e) => setEditLocation(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)] outline-none focus:border-[var(--primary)]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-extrabold text-[var(--foreground)] uppercase">
                  Description
                </label>
                <textarea
                  rows={3}
                  required
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)] outline-none focus:border-[var(--primary)] resize-none"
                />
              </div>

              <div className="pt-3 border-t border-[var(--border)] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingEvent(null)}
                  className="btn-outline text-xs py-2 px-4 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="btn-primary text-xs py-2 px-5 cursor-pointer font-bold"
                >
                  {isUpdating ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Custom Delete Confirmation Modal (Strictly No Browser alert()/confirm()) */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="card-breeds max-w-sm w-full p-6 text-center bg-[var(--card)] border border-[var(--border)] shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center text-2xl font-bold">
              🗑️
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-black text-[var(--foreground)]">
                Delete Community Drive?
              </h3>
              <p className="text-xs text-[var(--muted)] leading-relaxed">
                Are you sure you want to delete this drive? This action cannot be undone and will remove it from the public directory.
              </p>
            </div>

            <div className="pt-2 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setDeletingId(null)}
                className="btn-outline text-xs py-2 px-4 w-full cursor-pointer"
              >
                Keep Event
              </button>
              <button
                type="button"
                onClick={handleExecuteDelete}
                disabled={isDeleting}
                className="btn-primary bg-red-600 hover:bg-red-700 text-white text-xs py-2 px-4 w-full cursor-pointer font-bold"
              >
                {isDeleting ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
