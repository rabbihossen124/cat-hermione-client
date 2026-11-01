import HeroBanner from "@/components/home/HeroBanner";
import FeaturesSection from "@/components/home/FeaturesSection";
import RecentEventsSection from "@/components/home/RecentEventsSection";
import GallerySection from "@/components/home/GallerySection";
import NewsletterSection from "@/components/home/NewsletterSection";

export default function Home() {
  return (
    <div className="space-y-24 py-4">
      <HeroBanner />
      <FeaturesSection />
      <RecentEventsSection />
      <GallerySection />
      <NewsletterSection />
    </div>
  );
}
