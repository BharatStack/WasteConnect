
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { UserTypes } from "@/components/UserTypes";
import { TestimonialSection } from "@/components/TestimonialSection";
import { CallToAction } from "@/components/CallToAction";
import { Footer } from "@/components/Footer";
import MainNavigation from "@/components/navigation/MainNavigation";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-eco-green-50 to-white">
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
