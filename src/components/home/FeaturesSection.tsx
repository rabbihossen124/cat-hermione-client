import React from "react";

const features = [
  {
    icon: "🤝",
    title: "Community-Led Organizing",
    description:
      "Empowering local volunteers to launch verified charity campaigns, winter clothes drives, and neighborhood cleanups with complete ease.",
    tag: "Organize",
    tagColor: "bg-[#FF6B00]/10 text-[#FF6B00]",
  },
  {
    icon: "🎯",
    title: "Seamless Volunteer Joining",
    description:
      "Join any social service with a single click. Keep track of your joined events, upcoming dates, and location instructions in your dashboard.",
    tag: "Participate",
    tagColor: "bg-[#0D9488]/10 text-[#0D9488]",
  },
  {
    icon: "📍",
    title: "Hyper-Local Dhaka Impact",
    description:
      "Find events happening right in your area — Mirpur 10, Mohammadpur, Dhanmondi, or Gulshan. Connecting immediate help where needed most.",
    tag: "Local Action",
    tagColor: "bg-blue-500/10 text-blue-500",
  },
  {
    icon: "🛡️",
    title: "Transparent & Verified Drives",
    description:
      "Protected user validation and creator ownership ensure genuine social causes without spam or misleading event details.",
    tag: "Trust & Safety",
    tagColor: "bg-purple-500/10 text-purple-500",
  },
];

const stats = [
  { value: "150+", label: "Social Drives Organized", icon: "🌱" },
  { value: "4,200+", label: "Active Volunteers", icon: "👥" },
  { value: "35+", label: "Dhaka Neighborhoods", icon: "📍" },
  { value: "100%", label: "Grassroots Non-Profit", icon: "❤️" },
];

export default function FeaturesSection() {
  return (
    <section className="space-y-12">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-[var(--primary)]">
          Why UnityAid
        </span>
        <h2 className="text-2xl sm:text-4xl font-black text-[var(--foreground)] tracking-tight">
          How Our Platform Drives Real Community Change
        </h2>
        <p className="text-xs sm:text-sm text-[var(--muted)] leading-relaxed">
          Built specifically for local change-makers to mobilize people, coordinate
          logistics, and transform compassion into tangible community action.
        </p>
      </div>

      {/* Feature Cards Grid (Equal height & width) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, idx) => (
          <div
            key={idx}
            className="card-breeds p-6 flex flex-col justify-between h-full bg-[var(--card)] border border-[var(--border)] group"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-[var(--accent)] flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <span
                  className={`text-[10px] uppercase font-extrabold px-2.5 py-1 rounded-full ${feature.tagColor}`}
                >
                  {feature.tag}
                </span>
              </div>
              <h3 className="text-base font-extrabold text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors">
                {feature.title}
              </h3>
              <p className="text-xs text-[var(--muted)] leading-relaxed">
                {feature.description}
              </p>
            </div>
            <div className="pt-4 border-t border-[var(--border)] mt-4">
              <span className="text-xs font-bold text-[var(--primary)] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Learn more →
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Impact Stats Strip */}
      <div className="card-breeds p-8 bg-gradient-to-r from-[var(--card)] via-[var(--accent)] to-[var(--card)] border border-[var(--border)] shadow-sm">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          {stats.map((stat, idx) => (
            <div key={idx} className="space-y-1">
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className="text-2xl sm:text-3xl font-black text-[var(--foreground)]">
                {stat.value}
              </div>
              <div className="text-xs font-semibold text-[var(--muted)]">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

