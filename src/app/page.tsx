import { CategoriesSection } from "@/components/home/CategoriesSection";
import { FeaturedMeals } from "@/components/home/FeaturedMeals";
import { FeaturedMealsSkeleton } from "@/components/home/FeaturedMealsSkeleton";
import { HeroSection } from "@/components/home/HeroSection";
import { HowItWorks } from "@/components/home/HowItWorks";
import { Suspense } from "react";

export default function Home() {
  return (
    <>
      {/* <Navbar> */}
      <HeroSection />
      <CategoriesSection />
      <Suspense fallback={<FeaturedMealsSkeleton />}>
        <FeaturedMeals />
      </Suspense>
      <HowItWorks />
      {/* </Navbar> */}
    </>
  );
}
