/**
 * UnityAid Volunteer Counter Utility
 * Dynamically computes real-time volunteer count per event
 */

const BASE_VOLUNTEER_COUNTS: Record<string, number> = {
  "demo-1": 1,
  "demo-2": 2,
  "demo-3": 1,
  "demo-4": 3,
  "demo-5": 2,
  "demo-6": 1,
};

export function getEventVolunteerCount(eventId: string): number {
  if (typeof window === "undefined") {
    return BASE_VOLUNTEER_COUNTS[eventId] ?? 0;
  }
  try {
    const stored = localStorage.getItem("unityaid-joined-events");
    const list: { eventId: string; userEmail?: string }[] = stored ? JSON.parse(stored) : [];
    const eventJoins = list.filter((j) => j.eventId === eventId);

    // Count unique user emails joined on this client
    const uniqueUserEmails = new Set(
      eventJoins.map((j) => j.userEmail?.toLowerCase()).filter(Boolean)
    );

    const base = BASE_VOLUNTEER_COUNTS[eventId] ?? 0;
    return base + uniqueUserEmails.size;
  } catch {
    return BASE_VOLUNTEER_COUNTS[eventId] ?? 0;
  }
}

export function notifyVolunteerCountChange() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("unityaid-volunteer-change"));
  }
}

