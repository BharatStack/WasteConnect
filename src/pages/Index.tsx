
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import UserTypes from "@/components/UserTypes";
import TestimonialSection from "@/components/TestimonialSection";
import CallToAction from "@/components/CallToAction";
import Footer from "@/components/Footer";
import { Shield, Users, BarChart3 } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-eco-green-50 to-white">
      <Header />
      
      <main>
        <Hero />
        
        {/* Enhanced Authentication Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Secure Access for All Stakeholders
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Our enhanced authentication system provides secure, role-based access with multi-factor authentication 
                and government compliance features.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              <Card className="text-center">
                <CardHeader>
                  <Shield className="h-12 w-12 text-eco-green-600 mx-auto mb-4" />
                  <CardTitle>Enhanced Security</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Multi-factor authentication, phone verification, and secure audit logging 
                    protect your data and ensure compliance.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <Users className="h-12 w-12 text-eco-green-600 mx-auto mb-4" />
                  <CardTitle>Role-Based Access</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Different access levels for individuals, businesses, processors, collectors, 
                    and government officials with appropriate permissions.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <BarChart3 className="h-12 w-12 text-eco-green-600 mx-auto mb-4" />
                  <CardTitle>Government Oversight</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Comprehensive compliance monitoring, user verification, and audit trails 
                    for regulatory oversight and transparency.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>

            <div className="text-center mt-12">
              <Link to="/enhanced-auth">
                <Button size="lg" className="bg-eco-green-600 hover:bg-eco-green-700 mr-4">
                  Access Enhanced Platform
                </Button>
              </Link>
              <Link to="/auth">
                <Button size="lg" variant="outline">
                  Standard Login
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <Features />
        <UserTypes />
        <TestimonialSection />
        <CallToAction />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
