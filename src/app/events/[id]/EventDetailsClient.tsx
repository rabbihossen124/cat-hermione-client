"use client";

import React, { use, useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { getEventVolunteerCount, notifyVolunteerCountChange } from "@/lib/volunteerCount";
import EventCard, { EventItem } from "@/components/events/EventCard";
import { API_BASE_URL } from "@/lib/api";

const fallbackMap: Record<string, EventItem> = {
  "demo-1": {
    _id: "demo-1",
    title: "Winter Clothes & Blanket Drive",
    description:
      "Providing warm blankets and essential winter wear to vulnerable families before the seasonal cold peak. Volunteers assist in sorting sizes, packaging blankets, and serving warm tea during distribution. Help us bring warmth to underprivileged families and street-dwellers ahead of severe winter cold.",
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
      "Distributing textbooks, notebooks, and creative art kits to support informal youth literacy. Volunteers help guide interactive reading sessions, organize craft competitions, and distribute learning supplies to street and informal community children.",
    eventType: "Education",
    thumbnail:
      "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1200&q=80",
    location: "New Market, Khulna",
    eventDate: "2026-12-01T11:00:00.000Z",
    creatorName: "Nusrat Jahan",
    creatorEmail: "nusrat.jahan@example.com",
  },
  "demo-3": {
    _id: "demo-3",
    title: "Riverbank Waste & Plastic Cleanup",
    description:
      "Community environmental cleanup collecting plastic bags, discarded bottles, and non-biodegradable waste along the river shoreline. Volunteers receive safety gloves and bags.",
    eventType: "Cleanup",
    thumbnail:
      "https://images.unsplash.com/photo-1595278069441-2cf29f8005a4?auto=format&fit=crop&w=1200&q=80",
    location: "Bhairab Ghat, Jashore",
    eventDate: "2026-11-20T09:00:00.000Z",
    creatorName: "Tanvir Ahmed",
    creatorEmail: "tanvir.ahmed@example.com",
  },
  "demo-4": {
    _id: "demo-4",
    title: "Coastal Mangrove & Forest Tree Plantation",
    description:
      "Planting fast-growing mangrove and fruit saplings along river embankments to prevent soil erosion and expand natural green canopy. Volunteers dig planting pits and water young saplings.",
    eventType: "Plantation",
    thumbnail:
      "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=1200&q=80",
    location: "Rupsha Riverside, Khulna",
    eventDate: "2026-12-15T08:30:00.000Z",
    creatorName: "Dr. Farhana Islam",
    creatorEmail: "farhana.islam@example.com",
  },
  "demo-5": {
    _id: "demo-5",
    title: "Free Rural Healthcare & Diabetes Screening",
    description:
      "Volunteer medical camp offering general health checkups, blood pressure measurements, and primary prescription support for local villagers without access to nearby clinics.",
    eventType: "Medical Aid",
    thumbnail:
      "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80",
    location: "Pirganj, Rangpur",
    eventDate: "2026-11-12T09:30:00.000Z",
    creatorName: "Red Crescent Volunteers",
    creatorEmail: "rc.rangpur@example.com",
  },
  "demo-6": {
    _id: "demo-6",
    title: "Emergency Food Relief & Grocery Ration Drive",
    description:
      "Preparing and distributing essential food ration bags containing rice, lentils, oil, and dry foods to daily wage earners and flood-impacted households.",
    eventType: "Donation",
    thumbnail:
      "https://images.unsplash.com/photo-1593113646773-028c64a8f1b8?auto=format&fit=crop&w=1200&q=80",
    location: "Dhanmondi, Dhaka",
    eventDate: "2026-11-28T10:00:00.000Z",
    creatorName: "Ahsan Habib",
    creatorEmail: "ahsan.habib@example.com",
  },
};

export default function EventDetailsClient({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();

  const [event, setEvent] = useState<EventItem | null>(() => fallbackMap[id] || null);
  const [joinedVersion, setJoinedVersion] = useState(0);
  const [volunteerCount, setVolunteerCount] = useState<number>(() =>
    getEventVolunteerCount(id)
  );
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    const handleCountUpdate = () => {
      setVolunteerCount(getEventVolunteerCount(id));
    };

    window.addEventListener("unityaid-volunteer-change", handleCountUpdate);
    window.addEventListener("storage", handleCountUpdate);
    return () => {
      window.removeEventListener("unityaid-volunteer-change", handleCountUpdate);
      window.removeEventListener("storage", handleCountUpdate);
    };
  }, [id]);

  // An event is only joined if the user is currently logged in AND their email matches a joined record
  const joined = useMemo(() => {
    if (!user || !user.email) return false;
    if (typeof window === "undefined") return false;
    try {
      const storedJoined = localStorage.getItem("unityaid-joined-events");
      if (storedJoined) {
        const list: { eventId: string; userEmail?: string }[] = JSON.parse(storedJoined);
        return list.some(
          (j) =>
            j.eventId === id &&
            Boolean(j.userEmail && j.userEmail.toLowerCase() === user.email.toLowerCase())
        );
      }
    } catch {
      return false;
    }
    return false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, id, joinedVersion]);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [authWarning, setAuthWarning] = useState(false);

  useEffect(() => {
    // If not found in fallback, try to fetch from backend API
    if (!fallbackMap[id]) {
      const fetchDetail = async () => {
        try {
          const res = await fetch(`${API_BASE_URL}/api/events/${id}`);
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

  const handleJoin = async () => {
    // If user is not logged in, immediately redirect to Login page with redirect back
    if (!user) {
      router.push(`/login?redirect=/events/${id}`);
      return;
    }

    if (joined) return;

    setIsLoading(true);

    const joinRecord = {
      eventId: event?._id || id,
      eventTitle: event?.title || "Community Drive",
      eventDate: event?.eventDate || new Date().toISOString(),
      location: event?.location || "Dhaka",
      eventType: event?.eventType || "Community",
      thumbnail: event?.thumbnail || "",
      userEmail: user.email,
      userName: user.name,
      joinedAt: new Date().toISOString(),
    };

    // 1. Try to send to Express Backend API
    try {
      const token = localStorage.getItem("unityaid_token");
      await fetch(`${API_BASE_URL}/api/joined-events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(joinRecord),
      });
    } catch {
      // Backend may be offline, localStorage persists
    }

    // 2. Persist in localStorage for instant synchronization with Joined Events Page
    try {
      const existing = localStorage.getItem("unityaid-joined-events");
      const list = existing ? JSON.parse(existing) : [];
      list.push(joinRecord);
      localStorage.setItem("unityaid-joined-events", JSON.stringify(list));
    } catch {
      // ignore
    }

    notifyVolunteerCountChange();
    toast.success("Successfully joined event as volunteer! 🎉");
    setJoinedVersion((v) => v + 1);
    setIsLoading(false);
  };

  const handleCancelJoin = async () => {
    if (!user || !user.email) return;
    setIsCancelling(true);

    try {
      const token = localStorage.getItem("unityaid_token");
      await fetch(`${API_BASE_URL}/api/joined-events/${event?._id || id}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
    } catch {
      // Backend offline fallback
    }

    try {
      const existing = localStorage.getItem("unityaid-joined-events");
      if (existing) {
        const list: { eventId: string; userEmail?: string }[] = JSON.parse(existing);
        const filtered = list.filter(
          (j) =>
            !(
              j.eventId === (event?._id || id) &&
              j.userEmail?.toLowerCase() === user.email!.toLowerCase()
            )
        );
        localStorage.setItem("unityaid-joined-events", JSON.stringify(filtered));
      }
    } catch {
      // ignore
    }

    notifyVolunteerCountChange();
    toast.info("Volunteer spot canceled! 👋");
    setJoinedVersion((v) => v + 1);
    setIsCancelling(false);
  };

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Other drives recommendation
  const otherDrives = useMemo(() => {
    return Object.values(fallbackMap)
      .filter((item) => item._id !== id)
      .slice(0, 2);
  }, [id]);

  if (!event) {
    return (
      <div className="py-24 text-center space-y-4 max-w-md mx-auto">
        <div className="w-16 h-16 mx-auto rounded-3xl bg-[var(--accent)] text-[var(--primary)] flex items-center justify-center text-3xl font-black">
          🔍
        </div>
        <h2 className="text-2xl font-black text-[var(--foreground)]">Drive Not Found</h2>
        <p className="text-xs sm:text-sm text-[var(--muted)]">
          The requested community service drive does not exist or has already concluded.
        </p>
        <Link href="/upcoming-events" className="btn-primary text-xs py-2.5 px-6">
          Explore All Drives
        </Link>
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
    <div className="py-6 space-y-10 max-w-4xl mx-auto">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center justify-between text-xs text-[var(--muted)]">
        <div className="flex items-center gap-2 truncate">
          <Link href="/" className="hover:text-[var(--primary)] transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/upcoming-events" className="hover:text-[var(--primary)] transition-colors">
            Upcoming Drives
          </Link>
          <span>/</span>
          <span className="text-[var(--foreground)] font-semibold truncate max-w-[220px]">
            {event.title}
          </span>
        </div>

        {/* Share Button */}
        <button
          type="button"
          onClick={handleCopyLink}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[var(--border)] bg-[var(--card)] text-xs font-semibold hover:border-[var(--primary)] transition-colors cursor-pointer"
        >
          <span>🔗</span>
          <span>{copied ? "Link Copied! ✓" : "Share Drive"}</span>
        </button>
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
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />

          {/* Type Badge */}
          <div className="absolute top-4 left-4">
            <span className="badge-pill bg-[#FF6B00] text-white text-xs font-extrabold shadow-md">
              {event.eventType}
            </span>
          </div>

          {/* Real-time Volunteer Count Badge */}
          <div className="absolute top-4 right-4">
            <span className="badge-pill bg-black/75 backdrop-blur-md text-white text-xs font-extrabold shadow-md flex items-center gap-1.5 border border-white/20">
              <span>👥</span> {volunteerCount} {volunteerCount === 1 ? "Volunteer Joined" : "Volunteers Joined"}
            </span>
          </div>

          {/* Title & Date Overlay */}
          <div className="absolute bottom-4 left-4 right-4 text-white space-y-2">
            <span className="badge-pill bg-white/20 backdrop-blur-md text-white text-xs font-semibold">
              📅 {formattedDate}
            </span>
            <h1 className="text-xl sm:text-3xl font-black leading-tight drop-shadow-sm">
              {event.title}
            </h1>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-10 space-y-8">
          {/* Key Facts Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-2xl bg-[var(--accent)] border border-[var(--border)]">
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
                {joined ? "Volunteer Registered ✓" : "Open for Volunteers"}
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-[var(--muted)] uppercase tracking-wider">
                Volunteers Joined
              </span>
              <p className="text-xs sm:text-sm font-extrabold text-[#FF6B00] flex items-center gap-1">
                <span>👥</span> {volunteerCount} {volunteerCount === 1 ? "Volunteer" : "Volunteers"}
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

          {/* Volunteer Guidelines Hub */}
          <div className="p-5 rounded-2xl bg-[var(--card)] border border-[var(--border)] space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--primary)] flex items-center gap-1.5">
              <span>📋</span> Volunteer Guidelines & Instructions
            </h3>
            <ul className="text-xs text-[var(--muted)] space-y-2 list-disc list-inside">
              <li>Arrive 15 minutes before scheduled start time at the assembly point.</li>
              <li>Wear comfortable footwear and clothing suitable for field volunteering.</li>
              <li>Drinking water and basic volunteer tags will be provided by the organizers.</li>
              <li>Questions? Contact organizer directly via the email listed below.</li>
            </ul>
          </div>

          {/* Organizer Card */}
          <div className="flex items-center gap-4 p-4 rounded-2xl border border-[var(--border)] bg-[var(--accent)]">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#FF6B00] to-[#0D9488] text-white flex items-center justify-center font-bold text-lg shadow-sm">
              {event.creatorName ? event.creatorName[0].toUpperCase() : "U"}
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="text-sm font-extrabold text-[var(--foreground)]">
                  {event.creatorName || "Community Organizer"}
                </span>
                <span className="badge-pill bg-[#0D9488]/15 text-[#0D9488] text-[10px]">
                  Verified Organizer ✓
                </span>
              </div>
              <p className="text-xs text-[var(--muted)]">
                {event.creatorEmail || "community.volunteer@unityaid.org"}
              </p>
            </div>
          </div>

          {/* Auth Warning Alert */}
          {authWarning && !user && (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-400 space-y-2 text-xs">
              <p className="font-bold flex items-center gap-1.5 text-sm">
                <span>⚠️</span> Login Required to Join
              </p>
              <p>
                You must be logged in to register as a volunteer for this community event.
              </p>
              <div className="pt-1 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => router.push("/login")}
                  className="btn-primary text-xs py-1.5 px-4 cursor-pointer"
                >
                  Log In Now
                </button>
                <button
                  type="button"
                  onClick={() => setAuthWarning(false)}
                  className="btn-outline text-xs py-1.5 px-3 cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}

          {/* Action Hub */}
          <div className="pt-6 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-[var(--muted)]">
              {joined ? (
                <span className="text-[#0D9488] font-bold flex items-center gap-1.5 text-sm">
                  ✓ You are registered as an active volunteer for this drive!
                </span>
              ) : (
                <span>Join our grassroots team and make a direct difference in Bangladesh.</span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              {joined ? (
                <>
                  <button
                    type="button"
                    disabled
                    className="w-full sm:w-auto text-xs sm:text-sm py-3 px-6 font-bold rounded-full bg-emerald-600 text-white shadow-md flex items-center justify-center gap-2 cursor-default"
                  >
                    <span>✓</span> Registered as Volunteer
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelJoin}
                    disabled={isCancelling}
                    className="w-full sm:w-auto text-xs sm:text-sm py-3 px-6 font-bold rounded-full bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30 transition-all cursor-pointer shadow-sm whitespace-nowrap"
                  >
                    {isCancelling ? "Canceling..." : "Cancel Volunteer Spot ✕"}
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={handleJoin}
                  disabled={isLoading}
                  className="btn-primary w-full sm:w-auto text-xs sm:text-sm py-3 px-8 font-bold rounded-full transition-all cursor-pointer shadow-md"
                >
                  {isLoading
                    ? "Registering..."
                    : !user
                    ? "Log in to Join Event →"
                    : "Register as Volunteer →"}
                </button>
              )}
              <Link href="/upcoming-events" className="btn-outline text-xs sm:text-sm py-3 px-6 whitespace-nowrap">
                Back to Drives
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* More Community Drives Section */}
      {otherDrives.length > 0 && (
        <div className="space-y-6 pt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-[var(--foreground)]">
              More Upcoming Drives
            </h2>
            <Link
              href="/upcoming-events"
              className="text-xs font-bold text-[var(--primary)] hover:underline"
            >
              View All Drives →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {otherDrives.map((item) => (
              <EventCard key={item._id} event={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
