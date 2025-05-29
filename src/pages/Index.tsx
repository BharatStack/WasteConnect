
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import UserTypes from "@/components/UserTypes";
import TestimonialSection from "@/components/TestimonialSection";
import CallToAction from "@/components/CallToAction";
import Footer from "@/components/Footer";
import MainNavigation from "@/components/navigation/MainNavigation";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen">
      <MainNavigation />
      <Hero />
      
      {/* Auth CTA Section */}
      <section className="py-12 bg-eco-green-50">
        <div className="container mx-auto px-4 text-center">
          {!isAuthenticated ? (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-eco-green-700">
                Ready to Get Started?
              </h2>
              <p className="text-eco-green-600 max-w-2xl mx-auto">
                Join thousands of organizations already using WasteConnect to optimize their waste management and contribute to a sustainable future.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link to="/auth">
                  <Button size="lg" className="bg-eco-green-600 hover:bg-eco-green-700">
                    Sign Up Now
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button variant="outline" size="lg">
                    Login to Your Account
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-eco-green-700">
                Welcome Back!
              </h2>
              <p className="text-eco-green-600">
                Continue managing your waste data and environmental impact.
              </p>
              <Link to="/dashboard">
                <Button size="lg" className="bg-eco-green-600 hover:bg-eco-green-700">
                  Go to Dashboard
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      <Features />
      <UserTypes />
      <TestimonialSection />
      <CallToAction />
      <Footer />
    </div>
  );
};

export default Index;
