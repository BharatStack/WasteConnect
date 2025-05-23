
import React from 'react';
import { Star } from 'lucide-react';

const TestimonialSection = () => {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Household User",
      testimonial: "WasteConnect has made managing household waste so much easier! I can schedule pickups and track my recycling progress over time.",
      stars: 5
    },
    {
      name: "Robert Chen",
      role: "Waste Management Director, Greenville",
      testimonial: "The route optimization feature has reduced our collection costs by 30% while improving service quality across the municipality.",
      stars: 5
    },
    {
      name: "Maria Rodriguez",
      role: "Sustainability Officer, EcoTech Industries",
      testimonial: "We've found reliable buyers for our industrial byproducts through the marketplace, turning waste expenses into revenue.",
      stars: 4
    }
  ];

  return (
    <section className="py-16 bg-white dark:bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-eco-green-700 dark:text-eco-green-400">
            What Our Users Say
          </h2>
          <p className="text-lg text-eco-green-600/90 dark:text-eco-green-300">
            Join thousands of satisfied users who have transformed their waste management practices.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-eco-green-50 dark:bg-eco-green-900/20 rounded-xl shadow-md p-8 border border-eco-green-100 dark:border-eco-green-800/30 relative">
              <div className="absolute top-0 right-0 h-16 w-16 bg-eco-green-100 dark:bg-eco-green-800/30 rounded-bl-xl flex items-center justify-center">
                <span className="text-eco-green-600 dark:text-eco-green-400 text-3xl font-serif">"</span>
              </div>
              <div className="flex mb-4">
                {[...Array(testimonial.stars)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-current text-yellow-400" />
                ))}
                {[...Array(5 - testimonial.stars)].map((_, i) => (
                  <Star key={i + testimonial.stars} className="h-5 w-5 text-gray-300 dark:text-gray-600" />
                ))}
              </div>
              <p className="text-eco-green-700 dark:text-eco-green-200 mb-6 italic">"{testimonial.testimonial}"</p>
              <div className="flex items-center mt-auto">
                <div className="w-10 h-10 rounded-full bg-eco-green-200 dark:bg-eco-green-700 flex items-center justify-center text-eco-green-600 dark:text-eco-green-300 font-semibold">
                  {testimonial.name.charAt(0)}
                </div>
                <div className="ml-3">
                  <h4 className="font-semibold text-eco-green-800 dark:text-white">{testimonial.name}</h4>
                  <p className="text-sm text-eco-green-600 dark:text-eco-green-400">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
