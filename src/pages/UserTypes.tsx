
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Home, Building2, Factory, Landmark, ArrowRight, ClipboardList, Map, ShoppingBag, BarChart2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const UserTypes = () => {
  const userTypes = [
    {
      id: "household",
      title: "Household Users",
      icon: Home,
      description: "Individual households looking to manage domestic waste efficiently and sustainably.",
      features: [
        {
          title: "Log Waste Data",
          description: "Record the types and amounts of waste generated in your household.",
          icon: ClipboardList
        },
        {
          title: "Collection Scheduling",
          description: "Schedule waste pickups and get reminders for collection days.",
          icon: Map
        },
        {
          title: "Waste Insights",
          description: "Get personalized insights on your waste generation patterns and ways to reduce waste.",
          icon: BarChart2
        }
      ],
      benefits: [
        "Reduce your environmental footprint",
        "Track recycling progress over time",
        "Save money through waste reduction",
        "Easy-to-use mobile interface"
      ]
    },
    {
      id: "municipality",
      title: "Municipality Users",
      icon: Building2,
      description: "City and town waste management agencies responsible for collection and processing.",
      features: [
        {
          title: "Route Optimization",
          description: "Optimize collection routes to minimize fuel usage and reduce costs.",
          icon: Map
        },
        {
          title: "Waste Analytics",
          description: "Analyze waste data across your jurisdiction to make informed decisions.",
          icon: BarChart2
        },
        {
          title: "Resource Management",
          description: "Manage collection vehicles, staff, and resources efficiently.",
          icon: ClipboardList
        }
      ],
      benefits: [
        "Reduce operational costs by up to 30%",
        "Improve service delivery to residents",
        "Data-driven infrastructure planning",
        "Meet regulatory compliance requirements"
      ]
    },
    {
      id: "industry",
      title: "Industry & MSME Users",
      icon: Factory,
      description: "Businesses managing industrial waste and seeking circular economy solutions.",
      features: [
        {
          title: "Waste Categorization",
          description: "Categorize industrial waste streams for proper management and compliance.",
          icon: ClipboardList
        },
        {
          title: "Marketplace Access",
          description: "Buy and sell recyclable materials through our circular economy marketplace.",
          icon: ShoppingBag
        },
        {
          title: "Compliance Management",
          description: "Manage waste disposal documentation and regulatory compliance requirements.",
          icon: BarChart2
        }
      ],
      benefits: [
        "Turn waste costs into revenue streams",
        "Reduce landfill disposal expenses",
        "Enhance corporate sustainability metrics",
        "Simplify regulatory compliance reporting"
      ]
    },
    {
      id: "government",
      title: "Government & Regulatory",
      icon: Landmark,
      description: "Agencies overseeing waste management regulations and infrastructure planning.",
      features: [
        {
          title: "Oversight Dashboard",
          description: "Monitor waste management activities across regions and jurisdictions.",
          icon: BarChart2
        },
        {
          title: "Compliance Tracking",
          description: "Track compliance status of waste generators and processors.",
          icon: ClipboardList
        },
        {
          title: "Policy Impact Analysis",
          description: "Measure the effectiveness of waste management policies and initiatives.",
          icon: Map
        }
      ],
      benefits: [
        "Evidence-based policy development",
        "Increased recycling rates jurisdiction-wide",
        "Improved environmental outcomes",
        "Enhanced public transparency"
      ]
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-white dark:bg-background">
        <div className="bg-eco-green-50 dark:bg-eco-green-900/20 py-12 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-eco-green-800 dark:text-white mb-6">
                WasteConnect User Types
              </h1>
              <p className="text-xl text-eco-green-600 dark:text-eco-green-300">
                Our platform serves different stakeholders in the waste management ecosystem, each with specialized features designed for their unique needs.
              </p>
            </div>
          </div>
        </div>

        <section className="py-16 container mx-auto px-4">
          <Tabs defaultValue="household" className="w-full">
            <div className="mb-8 flex justify-center">
              <TabsList className="bg-eco-green-100 dark:bg-eco-green-800/30 p-1 rounded-md">
                {userTypes.map((type) => (
                  <TabsTrigger key={type.id} value={type.id} className="data-[state=active]:bg-eco-green-600 data-[state=active]:text-white">
                    <div className="flex items-center">
                      <type.icon className="h-4 w-4 mr-2" />
                      <span>{type.title}</span>
                    </div>
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
            
            {userTypes.map((type) => (
              <TabsContent key={type.id} value={type.id}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-1">
                    <Card className="bg-eco-green-50 dark:bg-eco-green-900/20 border-0 shadow-md h-full">
                      <CardHeader>
                        <div className="flex items-center mb-4">
                          <div className="p-2 mr-3 bg-eco-green-200 dark:bg-eco-green-800/50 text-eco-green-700 dark:text-eco-green-300 rounded-md">
                            <type.icon className="h-6 w-6" />
                          </div>
                          <CardTitle className="text-2xl text-eco-green-800 dark:text-eco-green-200">{type.title}</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-eco-green-700 dark:text-eco-green-300 mb-6">{type.description}</p>
                        <h3 className="font-semibold text-eco-green-700 dark:text-eco-green-200 mb-2">Key Benefits:</h3>
                        <ul className="space-y-2 mb-6">
                          {type.benefits.map((benefit, index) => (
                            <li key={index} className="flex items-start">
                              <div className="h-5 w-5 rounded-full bg-eco-green-200 dark:bg-eco-green-800/50 flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                                <span className="text-eco-green-700 dark:text-eco-green-300 text-xs">✓</span>
                              </div>
                              <span className="text-eco-green-700 dark:text-eco-green-300">{benefit}</span>
                            </li>
                          ))}
                        </ul>
                        <Button className="w-full bg-eco-green-600 hover:bg-eco-green-700 text-white">
                          Register as {type.title}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="lg:col-span-2">
                    <Card className="bg-white dark:bg-eco-green-900/10 border-0 shadow-md mb-6">
                      <CardHeader>
                        <CardTitle className="text-eco-green-800 dark:text-eco-green-200">Key Features</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {type.features.map((feature, index) => (
                            <div key={index} className="bg-eco-green-50 dark:bg-eco-green-900/20 p-6 rounded-xl shadow-sm">
                              <div className="p-2 mb-4 bg-eco-green-100 dark:bg-eco-green-800/30 inline-block rounded-md text-eco-green-600 dark:text-eco-green-400">
                                <feature.icon className="h-6 w-6" />
                              </div>
                              <h3 className="font-semibold text-eco-green-700 dark:text-eco-green-200 mb-2">{feature.title}</h3>
                              <p className="text-eco-green-600 dark:text-eco-green-300 text-sm">{feature.description}</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-white dark:bg-eco-green-900/10 border-0 shadow-md">
                      <CardHeader>
                        <CardTitle className="text-eco-green-800 dark:text-eco-green-200">How It Works</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-col md:flex-row items-center justify-around px-4 py-8">
                          <div className="flex flex-col items-center text-center mb-8 md:mb-0">
                            <div className="w-14 h-14 rounded-full bg-eco-green-100 dark:bg-eco-green-800/30 flex items-center justify-center mb-3">
                              <span className="text-eco-green-600 dark:text-eco-green-300 font-bold text-xl">1</span>
                            </div>
                            <h3 className="font-medium text-eco-green-700 dark:text-eco-green-200 mb-1">Register</h3>
                            <p className="text-eco-green-600 dark:text-eco-green-300 text-sm">Create your account with your user type</p>
                          </div>

                          <div className="hidden md:block text-eco-green-300 dark:text-eco-green-600">
                            <ArrowRight className="h-6 w-6" />
                          </div>

                          <div className="flex flex-col items-center text-center mb-8 md:mb-0">
                            <div className="w-14 h-14 rounded-full bg-eco-green-100 dark:bg-eco-green-800/30 flex items-center justify-center mb-3">
                              <span className="text-eco-green-600 dark:text-eco-green-300 font-bold text-xl">2</span>
                            </div>
                            <h3 className="font-medium text-eco-green-700 dark:text-eco-green-200 mb-1">Configure</h3>
                            <p className="text-eco-green-600 dark:text-eco-green-300 text-sm">Set up your profile and preferences</p>
                          </div>

                          <div className="hidden md:block text-eco-green-300 dark:text-eco-green-600">
                            <ArrowRight className="h-6 w-6" />
                          </div>

                          <div className="flex flex-col items-center text-center">
                            <div className="w-14 h-14 rounded-full bg-eco-green-100 dark:bg-eco-green-800/30 flex items-center justify-center mb-3">
                              <span className="text-eco-green-600 dark:text-eco-green-300 font-bold text-xl">3</span>
                            </div>
                            <h3 className="font-medium text-eco-green-700 dark:text-eco-green-200 mb-1">Start Using</h3>
                            <p className="text-eco-green-600 dark:text-eco-green-300 text-sm">Access all features specific to your needs</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default UserTypes;
