import { CategoriesSection } from "@/components/home/CategoriesSection";
import { FeaturedCourses } from "@/components/home/FeaturedCourses";
import { HeroSection } from "@/components/home/HeroSection";
import { HowItWorks } from "@/components/home/HowItWorks";

export default function Home() {
  return (
    <>
      {/* <Navbar> */}
      <HeroSection />
      <CategoriesSection />
      {/* <Suspense fallback={<FeaturedCoursesSkeleton />}> */}
      <FeaturedCourses />
      {/* </Suspense> */}
      <HowItWorks />
      {/* </Navbar> */}
    </>
  );
}
