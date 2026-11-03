"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { API_BASE_URL } from "@/lib/api";

// React 19 zero-cascading-render mounted store
const emptySubscribe = () => () => {};
function useMounted() {
  return React.useSyncExternalStore(emptySubscribe, () => true, () => false);
}

export interface JoinedRecord {
  _id?: string;
  eventId: string;
  eventTitle: string;
  eventDate: string;
  location: string;
  eventType: string;
  thumbnail: string;
  userEmail: string;
  userName: string;
  joinedAt: string;
}


export default function JoinedEventsClient() {
  const { user } = useAuth();
  const mounted = useMounted();

  const [joinedList, setJoinedList] = useState<JoinedRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Leave / Cancel modal state
  const [leavingRecord, setLeavingRecord] = useState<JoinedRecord | null>(null);
  const [isLeaving, setIsLeaving] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");

  useEffect(() => {
    if (!user) return;
    let ignore = false;

    const loadJoined = async () => {
      try {
        const token = localStorage.getItem("unityaid_token");
        const res = await fetch(`${API_BASE_URL}/api/joined-events/my`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0 && !ignore) {
            // Sort by eventDate ascending
            const sorted = data.sort(
              (a: JoinedRecord, b: JoinedRecord) =>
                new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime()
            );
            setJoinedList(sorted);
            setIsLoading(false);
            return;
          }
        }
      } catch {
        // Fallback to local storage
      }

      if (ignore) return;

      try {
        const local = localStorage.getItem("unityaid-joined-events");
        const list: JoinedRecord[] = local ? JSON.parse(local) : [];
        const userJoined = list.filter(
          (j) =>
            Boolean(j.userEmail && user.email) &&
            j.userEmail.toLowerCase() === user.email.toLowerCase()
        );

        const sorted = userJoined.sort(
          (a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime()
        );
        setJoinedList(sorted);
      } catch {
        setJoinedList([]);
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    };

    loadJoined();

    return () => {
      ignore = true;
    };
  }, [user]);

  // Execute cancel volunteer registration
  const handleConfirmLeave = async () => {
    if (!leavingRecord) return;
    setIsLeaving(true);

    const recordToLeave = leavingRecord;

    // 1. Send DELETE to backend
    try {
      const token = localStorage.getItem("unityaid_token");
      await fetch(
        `${API_BASE_URL}/api/joined-events/${recordToLeave._id || recordToLeave.eventId}`,
        {
          method: "DELETE",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );
    } catch {
      // Backend offline, fallback to localStorage
    }

    // 2. Remove from localStorage
    try {
      const local = localStorage.getItem("unityaid-joined-events");
      if (local) {
        const list: JoinedRecord[] = JSON.parse(local);
        const filtered = list.filter(
          (j) =>
            !(
              j.eventId === recordToLeave.eventId &&
              j.userEmail.toLowerCase() === (user?.email || "").toLowerCase()
            )
        );
        localStorage.setItem("unityaid-joined-events", JSON.stringify(filtered));
      }
    } catch {
      // ignore
    }

    // 3. Update local state
    setJoinedList((prev) => prev.filter((j) => j.eventId !== recordToLeave.eventId));
    setFeedbackMessage(
      `You have withdrawn your volunteer registration for "${recordToLeave.eventTitle}".`
    );
    setIsLeaving(false);
    setLeavingRecord(null);

    setTimeout(() => {
      setFeedbackMessage("");
    }, 4000);
  };

  // SSR Hydration Guard
  if (!mounted) {
    return (
      <div className="py-24 text-center space-y-4 max-w-md mx-auto">
        <div className="w-10 h-10 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs font-bold text-[var(--muted)]">Loading your joined drives...</p>
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
              Volunteer Registry Access
            </h1>
            <p className="text-xs sm:text-sm text-[var(--muted)] leading-relaxed">
              You must be logged in to review and manage the social welfare events you have joined.
            </p>
          </div>
          <Link
            href="/login?redirect=/joined-events"
            className="btn-primary w-full text-xs sm:text-sm py-3"
          >
            Sign In to View Joined Events →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border)] pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold bg-[var(--accent)] text-[var(--accent-foreground)] border border-[var(--primary)]/20 shadow-2xs">
            <span>🤝 Active Volunteer Engagements</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-[var(--foreground)] tracking-tight">
            My Joined Events
          </h1>
          <p className="text-xs sm:text-sm text-[var(--muted)]">
            Review the community drives you have signed up for across Bangladesh, sorted by upcoming event date.
          </p>
        </div>

        <Link
          href="/upcoming-events"
          className="btn-primary text-xs sm:text-sm py-2.5 px-5 self-start sm:self-auto shrink-0"
        >
          Explore More Drives →
        </Link>
      </div>

      {/* Feedback Toast Banner */}
      {feedbackMessage && (
        <div className="p-4 rounded-2xl bg-[#0D9488]/10 border border-[#0D9488]/30 text-[#0D9488] text-xs font-semibold flex items-center justify-between gap-3 animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <span className="text-base">✓</span>
            <span>{feedbackMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedbackMessage("")}
            className="text-[var(--muted)] hover:text-[var(--foreground)] p-1 text-sm font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Loading Skeleton */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="card-breeds p-5 bg-[var(--card)] border border-[var(--border)] animate-pulse flex flex-col sm:flex-row gap-5 items-center"
            >
              <div className="w-full sm:w-44 h-32 bg-[var(--border)] rounded-2xl shrink-0" />
              <div className="flex-1 space-y-3 w-full">
                <div className="h-5 bg-[var(--border)] rounded-md w-3/4" />
                <div className="h-4 bg-[var(--border)] rounded-md w-1/2" />
                <div className="h-4 bg-[var(--border)] rounded-md w-1/4" />
              </div>
            </div>
          ))}
        </div>
      ) : joinedList.length === 0 ? (
        /* Empty State */
        <div className="py-20 text-center space-y-5 max-w-md mx-auto card-breeds p-8 bg-[var(--card)] border border-[var(--border)] shadow-xs">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-[var(--accent)] text-[var(--primary)] flex items-center justify-center text-3xl font-black">
            🌱
          </div>
          <div className="space-y-1.5">
            <h2 className="text-xl font-black text-[var(--foreground)]">
              No Joined Events Yet
            </h2>
            <p className="text-xs text-[var(--muted)] leading-relaxed">
              You haven&apos;t joined any community service drives yet. Find a local cleanup, tree plantation, or winter clothes drive to get involved!
            </p>
          </div>
          <Link
            href="/upcoming-events"
            className="btn-primary inline-flex text-xs py-2.5 px-6 shadow-sm"
          >
            Browse Upcoming Drives →
          </Link>
        </div>
      ) : (
        /* Joined Events List (Chronologically sorted) */
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-[var(--muted)] px-1">
            <span>
              Showing <strong className="text-[var(--foreground)]">{joinedList.length}</strong> active registration{joinedList.length > 1 ? "s" : ""}
            </span>
            <span className="text-[11px] font-semibold text-[#0D9488]">
              Sorted by Event Date (Earliest First)
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {joinedList.map((record) => {
              const eventDateObj = new Date(record.eventDate);
              const formattedDate = !isNaN(eventDateObj.getTime())
                ? eventDateObj.toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : "Upcoming Date";

              const joinedDateObj = new Date(record.joinedAt);
              const formattedJoined = !isNaN(joinedDateObj.getTime())
                ? joinedDateObj.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                : "Recently";

              return (
                <div
                  key={`${record.eventId}-${record.joinedAt}`}
                  className="card-breeds p-4 sm:p-5 bg-[var(--card)] border border-[var(--border)] shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between group"
                >
                  {/* Thumbnail & Main Info */}
                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center flex-1 min-w-0">
                    <div className="relative w-full sm:w-36 h-28 sm:h-24 rounded-2xl overflow-hidden shrink-0 bg-[var(--muted)]/10 border border-[var(--border)]">
                      {record.thumbnail ? (
                        <Image
                          src={record.thumbnail}
                          alt={record.eventTitle}
                          fill
                          sizes="(max-width: 640px) 100vw, 150px"
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl">
                          🤝
                        </div>
                      )}
                      <span className="absolute top-2 left-2 badge-pill bg-black/60 text-white backdrop-blur-xs text-[10px] font-bold">
                        {record.eventType || "Cause"}
                      </span>
                    </div>

                    {/* Text Details */}
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <Link
                        href={`/events/${record.eventId}`}
                        className="text-base sm:text-lg font-bold text-[var(--foreground)] hover:text-[var(--primary)] transition-colors line-clamp-1"
                      >
                        {record.eventTitle}
                      </Link>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[var(--muted)]">
                        <span className="flex items-center gap-1 font-medium text-[var(--foreground)]">
                          📅 {formattedDate}
                        </span>
                        <span className="flex items-center gap-1">
                          📍 {record.location}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 pt-0.5 text-[11px] text-[var(--muted)]">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span>Registered as volunteer on {formattedJoined}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex sm:flex-col items-center sm:items-end gap-2 w-full sm:w-auto shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-[var(--border)]">
                    <Link
                      href={`/events/${record.eventId}`}
                      className="flex-1 sm:flex-initial btn-outline text-xs py-2 px-4 text-center whitespace-nowrap"
                    >
                      View Drive Details
                    </Link>
                    <button
                      type="button"
                      onClick={() => setLeavingRecord(record)}
                      className="flex-1 sm:flex-initial text-xs py-2 px-3 text-red-500 hover:text-red-600 hover:bg-red-500/10 rounded-xl transition-colors font-semibold cursor-pointer whitespace-nowrap"
                    >
                      Cancel Volunteer Spot
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Leave Event Confirmation Modal (In-App Custom Modal) */}
      {leavingRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="card-breeds max-w-md w-full bg-[var(--card)] border border-[var(--border)] shadow-2xl p-6 sm:p-8 space-y-6 animate-in zoom-in-95 duration-150">
            <div className="w-14 h-14 mx-auto rounded-3xl bg-red-500/10 text-red-500 flex items-center justify-center text-2xl font-bold shadow-inner">
              🚪
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-xl font-black text-[var(--foreground)] tracking-tight">
                Cancel Volunteer Registration?
              </h3>
              <p className="text-xs text-[var(--muted)] leading-relaxed">
                Are you sure you want to withdraw from{" "}
                <strong className="text-[var(--foreground)]">
                  &ldquo;{leavingRecord.eventTitle}&rdquo;
                </strong>
                ? The organizer will be informed so another community member can take your spot.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setLeavingRecord(null)}
                disabled={isLeaving}
                className="flex-1 py-2.5 px-4 rounded-xl border border-[var(--border)] text-xs font-bold text-[var(--foreground)] hover:bg-[var(--accent)] transition-colors cursor-pointer"
              >
                Keep My Spot
              </button>
              <button
                type="button"
                onClick={handleConfirmLeave}
                disabled={isLeaving}
                className="flex-1 py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-sm transition-colors cursor-pointer disabled:opacity-60"
              >
                {isLeaving ? "Withdrawing..." : "Yes, Withdraw"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

