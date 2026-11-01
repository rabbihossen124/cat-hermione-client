import HeroBanner from "@/components/home/HeroBanner";
import FeaturesSection from "@/components/home/FeaturesSection";

export default function Home() {
  return (
    <div className="space-y-20 py-4">
      <HeroBanner />
      <FeaturesSection />
    </div>
  );
}
