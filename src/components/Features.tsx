
import React from 'react';
import { ClipboardList, BarChart2, RotateCcw, Clock, Map, ShoppingBag, FileCheck, Search } from 'lucide-react';

const Features = () => {
  const features = [
    {
      title: "Log Waste Data",
      description: "Easily record and categorize your waste data with our intuitive data entry system.",
      icon: ClipboardList,
    },
    {
      title: "Route Optimization",
      description: "Optimize waste collection routes to save time, fuel, and reduce carbon footprint.",
      icon: Map,
    },
    {
      title: "Waste Analytics",
      description: "Gain insights through comprehensive waste generation and recycling analytics.",
      icon: BarChart2,
    },
    {
      title: "Collection Scheduling",
      description: "Schedule waste collection pickups and get notifications for upcoming collections.",
      icon: Clock,
    },
    {
      title: "Circular Economy Marketplace",
      description: "Buy and sell recyclable materials to promote reuse and circular economy.",
      icon: ShoppingBag,
    },
    {
      title: "Compliance Reporting",
      description: "Generate compliance reports for regulatory requirements with just a few clicks.",
      icon: FileCheck,
    },
    {
      title: "Real-time Tracking",
      description: "Track waste from generation to processing with real-time updates and notifications.",
      icon: Search,
    },
    {
      title: "Sustainable Practices",
      description: "Get recommendations for improving waste management practices based on your data.",
      icon: RotateCcw,
    },
  ];

  return (
    <section className="py-16 bg-eco-green-50 dark:bg-eco-green-900/10">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-eco-green-700 dark:text-eco-green-400">
            Key Features
          </h2>
          <p className="text-lg text-eco-green-600/90 dark:text-eco-green-300">
            Discover the powerful tools that WasteConnect offers to streamline waste management processes across the ecosystem.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white dark:bg-eco-green-900/20 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6 border border-eco-green-100 dark:border-eco-green-800/30 hover:-translate-y-1">
              <div className="mb-4 inline-flex p-3 rounded-lg bg-eco-green-100 dark:bg-eco-green-800/30 text-eco-green-600 dark:text-eco-green-400">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-eco-green-700 dark:text-eco-green-200">{feature.title}</h3>
              <p className="text-eco-green-600 dark:text-eco-green-300">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
