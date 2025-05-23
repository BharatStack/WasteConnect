
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ClipboardList, BarChart2, RotateCcw, Clock, Map, ShoppingBag, FileCheck, Search, Award, Leaf, TrendingUp, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  color: string;
  iconColor: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, description, color, iconColor }) => {
  return (
    <Card className={`${color} border-none shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}>
      <CardHeader>
        <div className="mb-4 flex justify-center">
          <div className={`rounded-full p-3 ${color}`}>
            <Icon className={`h-8 w-8 ${iconColor}`} />
          </div>
        </div>
        <CardTitle className="text-center text-xl font-bold text-eco-green-700 dark:text-white">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-center text-eco-green-600 dark:text-eco-green-300">{description}</CardDescription>
      </CardContent>
    </Card>
  );
};

const Features = () => {
  const mainFeatures = [
    {
      title: "Log Waste Data",
      description: "Easily record and categorize your waste data with our intuitive data entry system.",
      icon: ClipboardList,
      color: "bg-eco-green-50 dark:bg-eco-green-900/20",
      iconColor: "text-eco-green-600 dark:text-eco-green-400"
    },
    {
      title: "Route Optimization",
      description: "Optimize waste collection routes to save time, fuel, and reduce carbon footprint.",
      icon: Map,
      color: "bg-blue-50 dark:bg-blue-900/20",
      iconColor: "text-blue-600 dark:text-blue-400"
    },
    {
      title: "Waste Analytics",
      description: "Gain insights through comprehensive waste generation and recycling analytics.",
      icon: BarChart2,
      color: "bg-purple-50 dark:bg-purple-900/20",
      iconColor: "text-purple-600 dark:text-purple-400"
    },
    {
      title: "Collection Scheduling",
      description: "Schedule waste collection pickups and get notifications for upcoming collections.",
      icon: Clock,
      color: "bg-amber-50 dark:bg-amber-900/20",
      iconColor: "text-amber-600 dark:text-amber-400"
    },
    {
      title: "Circular Economy Marketplace",
      description: "Buy and sell recyclable materials to promote reuse and circular economy.",
      icon: ShoppingBag,
      color: "bg-pink-50 dark:bg-pink-900/20",
      iconColor: "text-pink-600 dark:text-pink-400"
    },
    {
      title: "Compliance Reporting",
      description: "Generate compliance reports for regulatory requirements with just a few clicks.",
      icon: FileCheck,
      color: "bg-indigo-50 dark:bg-indigo-900/20",
      iconColor: "text-indigo-600 dark:text-indigo-400"
    },
    {
      title: "Real-time Tracking",
      description: "Track waste from generation to processing with real-time updates and notifications.",
      icon: Search,
      color: "bg-cyan-50 dark:bg-cyan-900/20",
      iconColor: "text-cyan-600 dark:text-cyan-400"
    },
    {
      title: "Sustainable Practices",
      description: "Get recommendations for improving waste management practices based on your data.",
      icon: Leaf,
      color: "bg-lime-50 dark:bg-lime-900/20",
      iconColor: "text-lime-600 dark:text-lime-400"
    }
  ];

  const additionalFeatures = [
    {
      title: "Gamification & Rewards",
      description: "Earn points and rewards for your sustainable waste management practices.",
      icon: Award,
    },
    {
      title: "Carbon Footprint Tracking",
      description: "Monitor the environmental impact of your waste management activities.",
      icon: Leaf,
    },
    {
      title: "Performance Benchmarking",
      description: "Compare your waste management performance with similar entities.",
      icon: TrendingUp,
    },
    {
      title: "Community Engagement",
      description: "Collaborate and share best practices with other users in your region.",
      icon: Users,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="bg-eco-green-50 dark:bg-eco-green-900/20 py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-eco-green-800 dark:text-white mb-6">
                Powerful Features for Sustainable Waste Management
              </h1>
              <p className="text-xl text-eco-green-600 dark:text-eco-green-300">
                Discover the comprehensive tools that make WasteConnect the leading platform for waste management and circular economy solutions.
              </p>
            </div>
          </div>
        </div>

        <section className="py-16 bg-white dark:bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-eco-green-700 dark:text-eco-green-400 mb-12 text-center">
              Core Features
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {mainFeatures.map((feature, index) => (
                <FeatureCard
                  key={index}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  color={feature.color}
                  iconColor={feature.iconColor}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-eco-green-50 dark:bg-eco-green-900/10">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-eco-green-700 dark:text-eco-green-400 mb-6">
                  Log & Track Your Waste Data
                </h2>
                <p className="text-eco-green-600 dark:text-eco-green-300 mb-6">
                  The WasteConnect platform makes it easy to record and monitor waste generation and management activities. Our intuitive interface allows users to log data quickly and access powerful analytics to identify trends and opportunities.
                </p>
                <div className="space-y-4 mb-8">
                  <div className="flex items-start">
                    <div className="bg-eco-green-200 dark:bg-eco-green-800/30 p-2 rounded-md mr-4 mt-1">
                      <ClipboardList className="h-5 w-5 text-eco-green-600 dark:text-eco-green-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-eco-green-700 dark:text-eco-green-200 mb-1">Simple Data Entry</h3>
                      <p className="text-eco-green-600 dark:text-eco-green-300 text-sm">
                        Log waste data in just a few clicks with our user-friendly forms.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-eco-green-200 dark:bg-eco-green-800/30 p-2 rounded-md mr-4 mt-1">
                      <BarChart2 className="h-5 w-5 text-eco-green-600 dark:text-eco-green-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-eco-green-700 dark:text-eco-green-200 mb-1">Visual Analytics</h3>
                      <p className="text-eco-green-600 dark:text-eco-green-300 text-sm">
                        Transform your data into actionable insights with our powerful visualization tools.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-eco-green-200 dark:bg-eco-green-800/30 p-2 rounded-md mr-4 mt-1">
                      <Clock className="h-5 w-5 text-eco-green-600 dark:text-eco-green-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-eco-green-700 dark:text-eco-green-200 mb-1">Historical Tracking</h3>
                      <p className="text-eco-green-600 dark:text-eco-green-300 text-sm">
                        Access and analyze your waste data history to identify long-term trends.
                      </p>
                    </div>
                  </div>
                </div>
                <Button className="bg-eco-green-600 hover:bg-eco-green-700 text-white px-6">
                  Learn More
                </Button>
              </div>
              <div className="bg-white dark:bg-eco-green-900/20 rounded-xl shadow-lg p-6 border border-eco-green-100 dark:border-eco-green-800/30">
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-eco-green-700 dark:text-eco-green-200">Waste Data Entry</h3>
                    <span className="px-3 py-1 bg-eco-green-100 dark:bg-eco-green-800/50 text-eco-green-600 dark:text-eco-green-300 text-sm rounded-full">Sample UI</span>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-eco-green-50 dark:bg-eco-green-800/10 p-4 rounded-md">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-eco-green-600 dark:text-eco-green-400">Waste Type</span>
                        <span className="text-sm text-eco-green-500 dark:text-eco-green-400">Select type</span>
                      </div>
                      <div className="grid grid-cols-4 gap-2">
                        <div className="bg-white dark:bg-eco-green-800/20 p-3 rounded border border-eco-green-200 dark:border-eco-green-700/30 text-center">
                          <div className="h-10 flex items-center justify-center text-eco-green-600 dark:text-eco-green-400">
                            <Leaf className="h-6 w-6" />
                          </div>
                          <span className="text-xs mt-1 block text-eco-green-700 dark:text-eco-green-300">Organic</span>
                        </div>
                        <div className="bg-eco-green-100 dark:bg-eco-green-700/30 p-3 rounded border border-eco-green-300 dark:border-eco-green-600 text-center">
                          <div className="h-10 flex items-center justify-center text-eco-green-600 dark:text-eco-green-400">
                            <RotateCcw className="h-6 w-6" />
                          </div>
                          <span className="text-xs mt-1 block text-eco-green-700 dark:text-eco-green-300">Plastic</span>
                        </div>
                        <div className="bg-white dark:bg-eco-green-800/20 p-3 rounded border border-eco-green-200 dark:border-eco-green-700/30 text-center">
                          <div className="h-10 flex items-center justify-center text-eco-green-600 dark:text-eco-green-400">
                            <ClipboardList className="h-6 w-6" />
                          </div>
                          <span className="text-xs mt-1 block text-eco-green-700 dark:text-eco-green-300">Paper</span>
                        </div>
                        <div className="bg-white dark:bg-eco-green-800/20 p-3 rounded border border-eco-green-200 dark:border-eco-green-700/30 text-center">
                          <div className="h-10 flex items-center justify-center text-eco-green-600 dark:text-eco-green-400">
                            <ShoppingBag className="h-6 w-6" />
                          </div>
                          <span className="text-xs mt-1 block text-eco-green-700 dark:text-eco-green-300">Glass</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-eco-green-50 dark:bg-eco-green-800/10 p-4 rounded-md">
                      <div className="mb-3">
                        <span className="text-sm text-eco-green-600 dark:text-eco-green-400">Quantity</span>
                        <div className="flex items-center mt-2">
                          <input 
                            type="text" 
                            value="3.5" 
                            className="w-20 p-2 bg-white dark:bg-eco-green-800/20 border border-eco-green-200 dark:border-eco-green-700/30 rounded" 
                            readOnly
                          />
                          <span className="mx-3 text-eco-green-600 dark:text-eco-green-400">kg</span>
                          <div className="flex-1">
                            <div className="h-2 bg-eco-green-200 dark:bg-eco-green-800/30 rounded-full">
                              <div className="h-2 bg-eco-green-500 dark:bg-eco-green-500/80 rounded-full w-2/3"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-eco-green-50 dark:bg-eco-green-800/10 p-4 rounded-md">
                      <div className="mb-3">
                        <span className="text-sm text-eco-green-600 dark:text-eco-green-400">Collection Date</span>
                        <div className="flex items-center justify-between mt-2 p-2 bg-white dark:bg-eco-green-800/20 border border-eco-green-200 dark:border-eco-green-700/30 rounded">
                          <span className="text-eco-green-700 dark:text-eco-green-300">May 25, 2025</span>
                          <Clock className="h-5 w-5 text-eco-green-500 dark:text-eco-green-400" />
                        </div>
                      </div>
                    </div>
                    
                    <Button className="w-full bg-eco-green-600 hover:bg-eco-green-700 text-white">
                      Log Waste
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-white dark:bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-eco-green-700 dark:text-eco-green-400 mb-6 text-center">
              Additional Features
            </h2>
            <p className="text-eco-green-600 dark:text-eco-green-300 text-center mb-12 max-w-3xl mx-auto">
              Beyond our core features, WasteConnect offers these additional tools to enhance your waste management experience.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {additionalFeatures.map((feature, index) => (
                <div key={index} className="bg-white dark:bg-eco-green-900/10 shadow-md rounded-lg p-6 border border-eco-green-100 dark:border-eco-green-800/30">
                  <div className="mb-4 inline-flex p-3 rounded-lg bg-eco-green-100 dark:bg-eco-green-800/30 text-eco-green-600 dark:text-eco-green-400">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-eco-green-700 dark:text-eco-green-200">{feature.title}</h3>
                  <p className="text-eco-green-600 dark:text-eco-green-300 text-sm">{feature.description}</p>
                </div>
              ))}
            </div>

            <div className="mt-12 bg-eco-green-50 dark:bg-eco-green-900/20 p-8 rounded-xl shadow-md border border-eco-green-100 dark:border-eco-green-800/30">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="mb-6 md:mb-0 md:mr-6">
                  <h3 className="text-xl font-bold text-eco-green-700 dark:text-eco-green-200 mb-2">
                    Need a Custom Feature?
                  </h3>
                  <p className="text-eco-green-600 dark:text-eco-green-300">
                    We can develop custom features tailored to your specific waste management requirements.
                  </p>
                </div>
                <Button className="bg-eco-green-600 hover:bg-eco-green-700 text-white px-8">
                  Contact Us
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Features;
