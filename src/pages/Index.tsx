
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import UserTypes from "@/components/UserTypes";
import TestimonialSection from "@/components/TestimonialSection";
import CallToAction from "@/components/CallToAction";
import Footer from "@/components/Footer";
import MainNavigation from "@/components/navigation/MainNavigation";
import LoadingAnimation from "@/components/LoadingAnimation";
import { useLoadingAnimation } from "@/hooks/useLoadingAnimation";

const Index = () => {
  const { showAnimation, handleAnimationComplete } = useLoadingAnimation();

  if (showAnimation) {
    return <LoadingAnimation onComplete={handleAnimationComplete} />;
  }

  return (
    <div className="min-h-screen bg-white">
      <MainNavigation />
      <Hero />
      <Features />
      <UserTypes />
      <TestimonialSection />
      <CallToAction />
      <Footer />
    </div>
  );
};

export default Index;
