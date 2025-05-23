
import React from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import UserTypes from '@/components/UserTypes';
import Features from '@/components/Features';
import TestimonialSection from '@/components/TestimonialSection';
import CallToAction from '@/components/CallToAction';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <UserTypes />
        <Features />
        <TestimonialSection />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
