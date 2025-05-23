
import React from 'react';
import { ArrowRight, Recycle, Award, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Hero = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-eco-green-50 to-white dark:from-eco-green-900/20 dark:to-background pt-16 pb-20 md:pt-24 md:pb-28 lg:pb-32">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-eco-green-300/20 rounded-full blur-3xl"></div>
        <div className="absolute top-60 -left-20 w-60 h-60 bg-eco-green-400/20 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <span className="inline-block px-4 py-2 rounded-full bg-eco-green-100 dark:bg-eco-green-800/30 text-eco-green-600 dark:text-eco-green-300 text-sm font-medium mb-6">
              Sustainable waste management platform
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-eco-green-800 dark:text-white mb-6 leading-tight">
              Connect, Manage & <span className="text-eco-green-600 dark:text-eco-green-400">Transform</span> Waste
            </h1>
            <p className="text-lg md:text-xl text-eco-green-700/80 dark:text-eco-green-100 mb-8 max-w-2xl mx-auto lg:mx-0">
              WasteConnect bridges the gap between waste generators, processors, and regulators to create a sustainable circular economy.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
              <Button className="bg-eco-green-600 hover:bg-eco-green-700 text-white px-8 py-6 rounded-md text-lg w-full sm:w-auto">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" className="border-eco-green-600 text-eco-green-600 hover:bg-eco-green-50 dark:text-eco-green-400 dark:border-eco-green-500 px-8 py-6 rounded-md text-lg w-full sm:w-auto">
                Learn More
              </Button>
            </div>
          </div>
          
          <div className="relative">
            <div className="bg-white dark:bg-eco-green-800/20 rounded-2xl shadow-xl overflow-hidden transform rotate-1 hover:rotate-0 transition-transform duration-500 border border-eco-green-200 dark:border-eco-green-700/30">
              <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-eco-green-700 dark:text-white">Waste Dashboard</h3>
                  <span className="px-3 py-1 bg-eco-green-100 dark:bg-eco-green-800/50 text-eco-green-600 dark:text-eco-green-300 text-sm rounded-full">Live Data</span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-eco-green-50 dark:bg-eco-green-800/30 p-4 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-eco-green-600 dark:text-eco-green-300 text-sm">Total Waste Collected</p>
                        <p className="text-2xl font-bold text-eco-green-800 dark:text-white">2,543 kg</p>
                      </div>
                      <div className="bg-eco-green-200 dark:bg-eco-green-700/40 p-2 rounded-md">
                        <Recycle className="h-6 w-6 text-eco-green-600 dark:text-eco-green-300" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-eco-green-50 dark:bg-eco-green-800/30 p-4 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-eco-green-600 dark:text-eco-green-300 text-sm">Recycling Rate</p>
                        <p className="text-2xl font-bold text-eco-green-800 dark:text-white">78%</p>
                      </div>
                      <div className="bg-eco-green-200 dark:bg-eco-green-700/40 p-2 rounded-md">
                        <Award className="h-6 w-6 text-eco-green-600 dark:text-eco-green-300" />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-eco-green-50 dark:bg-eco-green-800/30 p-4 rounded-lg mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-eco-green-700 dark:text-eco-green-200">Waste Distribution</h4>
                    <span className="text-sm text-eco-green-600 dark:text-eco-green-300">Last 7 days</span>
                  </div>
                  <div className="h-40 flex items-end space-x-2">
                    <div className="w-1/7 bg-eco-green-300 dark:bg-eco-green-500/70 h-[60%] rounded-t-sm"></div>
                    <div className="w-1/7 bg-eco-green-400 dark:bg-eco-green-500/80 h-[75%] rounded-t-sm"></div>
                    <div className="w-1/7 bg-eco-green-500 dark:bg-eco-green-500/90 h-[45%] rounded-t-sm"></div>
                    <div className="w-1/7 bg-eco-green-600 dark:bg-eco-green-500 h-[85%] rounded-t-sm"></div>
                    <div className="w-1/7 bg-eco-green-500 dark:bg-eco-green-500/90 h-[70%] rounded-t-sm"></div>
                    <div className="w-1/7 bg-eco-green-400 dark:bg-eco-green-500/80 h-[60%] rounded-t-sm"></div>
                    <div className="w-1/7 bg-eco-green-300 dark:bg-eco-green-500/70 h-[50%] rounded-t-sm"></div>
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-eco-green-600 dark:text-eco-green-400">
                    <span>Mon</span>
                    <span>Tue</span>
                    <span>Wed</span>
                    <span>Thu</span>
                    <span>Fri</span>
                    <span>Sat</span>
                    <span>Sun</span>
                  </div>
                </div>
                
                <Button className="w-full bg-eco-green-600 hover:bg-eco-green-700 text-white">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  View Full Analytics
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
