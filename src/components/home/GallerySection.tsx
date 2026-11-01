"use client";

import React, { useState } from "react";
import Image from "next/image";

interface GalleryItem {
  id: string;
  title: string;
  category: string;
  location: string;
  date: string;
  impactStat: string;
  image: string;
}

const galleryItems: GalleryItem[] = [
  {
    id: "g1",
    title: "Community Micro-Donation & Emergency Relief Fund",
    category: "Donation",
    location: "Tejgaon, Dhaka",
    date: "Jan 2026",
    impactStat: "৳1,50,000 Community Aid Raised",
    image:
      "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "g2",
    title: "Bhairab Riverbank Plastic & Waste Cleanup Drive",
    category: "Cleanup",
    location: "Bhairab Ghat, Jashore",
    date: "Feb 2026",
    impactStat: "380kg Recyclable Waste Collected",
    image:
      "https://images.unsplash.com/photo-1595278069441-2cf29f8005a4?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "g3",
    title: "Village School Primary Education & Literacy Class",
    category: "Education",
    location: "Shyamnagar, Satkhira",
    date: "Mar 2026",
    impactStat: "180 Students Guided in Basic Literacy",
    image:
      "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "g4",
    title: "Free Community Medical & Health Consultation Camp",
    category: "Medical Aid",
    location: "Pirganj, Rangpur",
    date: "Apr 2026",
    impactStat: "450 Rural Patients Treated Free",
    image:
      "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "g5",
    title: "Rupsha Riverbank Green Tree Plantation Drive",
    category: "Plantation",
    location: "Rupsha Riverside, Khulna",
    date: "May 2026",
    impactStat: "650 Fruit & Forest Saplings Planted",
    image:
      "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "g6",
    title: "Community Food Relief & Grocery Ration Distribution",
    category: "Donation",
    location: "Dhanmondi, Dhaka",
    date: "Jun 2026",
    impactStat: "850 Grocery Ration Bags Handed Out",
    image:
      "https://images.unsplash.com/photo-1593113646773-028c64a8f1b8?auto=format&fit=crop&w=800&q=80",
  },
];

const categories = ["All", "Donation", "Cleanup", "Education", "Medical Aid", "Plantation"];

export default function GallerySection() {
  const [activeTab, setActiveTab] = useState("All");

  const filteredItems =
    activeTab === "All"
      ? galleryItems
      : galleryItems.filter((item) => item.category === activeTab);

  return (
    <section className="space-y-10">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--secondary)]">
            📸 Ground Realities & Impact
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-[var(--foreground)] tracking-tight">
            Moments of Community Service & Hope
          </h2>
          <p className="text-xs sm:text-sm text-[var(--muted)] max-w-2xl leading-relaxed">
            Real photos from grassroots campaigns organized through UnityAid. Every picture represents neighbors coming together to uplift those in need across Dhaka and beyond.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-full bg-[var(--card)] border border-[var(--border)] shadow-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              type="button"
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeTab === cat
                  ? "bg-[var(--primary)] text-white shadow-xs"
                  : "text-[var(--muted)] hover:text-[var(--foreground)]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="group card-breeds relative overflow-hidden h-80 bg-[var(--card)] border border-[var(--border)] shadow-sm hover:shadow-lg transition-all duration-300"
          >
            {/* Background Image */}
            <Image
              src={item.image}
              alt={item.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              unoptimized
            />

            {/* Gradient Dark Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 group-hover:via-black/50 transition-colors" />

            {/* Top Pill Badges */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
              <span className="badge-pill bg-white/90 dark:bg-black/80 backdrop-blur-md text-[var(--foreground)] text-[10px] font-black uppercase tracking-wider shadow-sm">
                {item.category}
              </span>
              <span className="badge-pill bg-black/60 backdrop-blur-md text-white text-[10px] font-semibold">
                📅 {item.date}
              </span>
            </div>

            {/* Bottom Content Overlay */}
            <div className="absolute bottom-4 left-4 right-4 text-white space-y-2">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-300 bg-black/50 backdrop-blur-xs px-2 py-0.5 rounded-md">
                ⭐ {item.impactStat}
              </span>

              <h3 className="text-base font-extrabold text-white leading-snug drop-shadow-sm group-hover:text-amber-200 transition-colors">
                {item.title}
              </h3>

              <div className="flex items-center justify-between pt-1 border-t border-white/20 text-xs text-white/80">
                <span className="flex items-center gap-1">
                  <span>📍</span> {item.location}
                </span>
                <span className="text-[11px] font-semibold text-teal-300 group-hover:translate-x-1 transition-transform">
                  Verified Drive ✓
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

