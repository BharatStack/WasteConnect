
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import UserTypes from "@/components/UserTypes";
import TestimonialSection from "@/components/TestimonialSection";
import CallToAction from "@/components/CallToAction";
import Footer from "@/components/Footer";
import MainNavigation from "@/components/navigation/MainNavigation";
import AppOpeningAnimation from "@/components/AppOpeningAnimation";
import { useAppOpeningAnimation } from "@/hooks/useAppOpeningAnimation";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { showOpeningAnimation, handleOpeningComplete } = useAppOpeningAnimation();
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If user is authenticated and animation is complete, redirect to dashboard
    if (isAuthenticated && !loading && !showOpeningAnimation) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, loading, showOpeningAnimation, navigate]);

  const handleAnimationComplete = () => {
    handleOpeningComplete();
    // After animation, redirect unauthenticated users to auth page
    if (!isAuthenticated && !loading) {
      navigate('/enhanced-auth');
    }
  };

  if (showOpeningAnimation) {
    return <AppOpeningAnimation onComplete={handleAnimationComplete} />;
  }

  // If authenticated user somehow reaches here, redirect to dashboard
  if (isAuthenticated && !loading) {
    navigate('/dashboard');
    return null;
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

export default Home;
