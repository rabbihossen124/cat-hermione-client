import React from "react";
import Link from "next/link";
import Image from "next/image";

export interface EventItem {
  _id: string;
  title: string;
  description: string;
  eventType: string;
  thumbnail: string;
  location: string;
  eventDate: string | Date;
  creatorName?: string;
  creatorEmail?: string;
}

export default function EventCard({ event }: { event: EventItem }) {
  // Format readable date
  const dateObj = new Date(event.eventDate);
  const formattedDate = !isNaN(dateObj.getTime())
    ? dateObj.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Upcoming Date";

  // Category specific badge styling
  const getBadgeStyle = (type: string) => {
    switch (type.toLowerCase()) {
      case "cleanup":
        return "bg-[#0D9488] text-white";
      case "donation":
        return "bg-[#FF6B00] text-white";
      case "plantation":
        return "bg-emerald-600 text-white";
      case "medical aid":
        return "bg-blue-600 text-white";
      case "education":
        return "bg-purple-600 text-white";
      default:
        return "bg-slate-700 text-white";
    }
  };

  return (
    <div className="card-breeds flex flex-col justify-between h-full overflow-hidden bg-[var(--card)] border border-[var(--border)] group">
      <div>
        {/* Thumbnail Image with Pills Overlay */}
        <div className="relative h-48 w-full overflow-hidden bg-[var(--accent)]">
          <Image
            src={
              event.thumbnail ||
              "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80"
            }
            alt={event.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

          {/* Type Pill Badge */}
          <div className="absolute top-3 left-3">
            <span
              className={`badge-pill text-[11px] font-extrabold shadow-md ${getBadgeStyle(
                event.eventType
              )}`}
            >
              {event.eventType}
            </span>
          </div>

          {/* Date Pill Badge */}
          <div className="absolute bottom-3 left-3">
            <span className="badge-pill bg-white/95 dark:bg-slate-900/90 backdrop-blur-md text-slate-900 dark:text-slate-100 text-[11px] font-bold shadow-md">
              📅 {formattedDate}
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-3">
          <h3 className="text-base font-extrabold text-[var(--foreground)] line-clamp-2 leading-snug group-hover:text-[var(--primary)] transition-colors">
            {event.title}
          </h3>

          <p className="text-xs text-[var(--muted)] line-clamp-2 leading-relaxed">
            {event.description}
          </p>

          <div className="pt-2 border-t border-[var(--border)] flex items-center justify-between text-xs text-[var(--muted)]">
            <span className="flex items-center gap-1 truncate max-w-[190px]">
              <span>📍</span> {event.location}
            </span>
            {event.creatorName && (
              <span className="text-[11px] font-semibold text-[var(--secondary)] truncate">
                by {event.creatorName}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Card Action Button */}
      <div className="p-5 pt-0">
        <Link
          href={`/events/${event._id}`}
          className="btn-primary w-full text-xs py-2.5 text-center shadow-xs"
        >
          View Event Details
        </Link>
      </div>
    </div>
  );
}

