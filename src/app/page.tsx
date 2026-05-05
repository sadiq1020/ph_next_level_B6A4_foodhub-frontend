import { CategoriesSection } from "@/components/home/CategoriesSection";
import { CTASection } from "@/components/home/CTASection";
import { FAQSection } from "@/components/home/FAQSection";
import { FeaturedCourses } from "@/components/home/FeaturedCourses";
import { HeroSection } from "@/components/home/HeroSection";
import { HowItWorks } from "@/components/home/HowItWorks";
import { StatsSection } from "@/components/home/StatsSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { WhyKitchenClass } from "@/components/home/WhyKitchenClass";

export default function Home() {
  return (
    <>
    <HeroSection />
      <StatsSection />
      <CategoriesSection />
      <WhyKitchenClass />
      <FeaturedCourses />
      <TestimonialsSection />
      <HowItWorks />
      <FAQSection />
      <CTASection />
    </>
  );
}
