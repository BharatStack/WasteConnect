
import React from 'react';
import { Home, Building2, Factory, Landmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const UserTypes = () => {
  const userTypes = [
    {
      title: "Household Users",
      description: "Individuals and families looking to manage their household waste efficiently.",
      icon: Home,
      features: ["Log Waste Data", "Collection Scheduling", "Waste Insights"],
      color: "bg-eco-green-50 dark:bg-eco-green-900/20",
      iconColor: "text-eco-green-600 dark:text-eco-green-400"
    },
    {
      title: "Municipality Users",
      description: "City and town waste management agencies optimizing collection and processing.",
      icon: Building2,
      features: ["Route Optimization", "Analyze Data", "Resource Management"],
      color: "bg-blue-50 dark:bg-blue-900/20",
      iconColor: "text-blue-600 dark:text-blue-400"
    },
    {
      title: "Industry & MSME Users",
      description: "Businesses managing industrial waste and seeking circular economy solutions.",
      icon: Factory,
      features: ["Categorization & Storage", "Marketplace Listing", "Transaction Management"],
      color: "bg-amber-50 dark:bg-amber-900/20",
      iconColor: "text-amber-600 dark:text-amber-400"
    },
    {
      title: "Government & Regulatory",
      description: "Agencies overseeing compliance and strategic planning for waste management.",
      icon: Landmark,
      features: ["Oversight Dashboard", "Compliance Reporting", "Infrastructure Planning"],
      color: "bg-purple-50 dark:bg-purple-900/20",
      iconColor: "text-purple-600 dark:text-purple-400"
    }
  ];

  return (
    <section className="py-16 bg-white dark:bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-eco-green-700 dark:text-eco-green-400">
            Who Can Use WasteConnect?
          </h2>
          <p className="text-lg text-eco-green-600/90 dark:text-eco-green-300">
            Our platform serves different stakeholders in the waste management ecosystem, providing specialized features for each user type.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {userTypes.map((type, index) => (
            <Card key={index} className={`${type.color} border-none shadow-md hover:shadow-lg transition-shadow duration-300`}>
              <CardHeader>
                <div className="mb-4 flex justify-center">
                  <div className={`rounded-full p-3 ${type.color} border-2 border-eco-green-200 dark:border-eco-green-800`}>
                    <type.icon className={`h-8 w-8 ${type.iconColor}`} />
                  </div>
                </div>
                <CardTitle className="text-center text-xl font-bold text-eco-green-700 dark:text-white">{type.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center mb-4 text-eco-green-600 dark:text-eco-green-300">{type.description}</CardDescription>
                <div className="space-y-2">
                  {type.features.map((feature, i) => (
                    <div key={i} className="flex items-center">
                      <div className="h-2 w-2 rounded-full bg-eco-green-500 dark:bg-eco-green-400 mr-2"></div>
                      <span className="text-eco-green-700 dark:text-eco-green-200 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full border-eco-green-600 text-eco-green-600 hover:bg-eco-green-50 dark:border-eco-green-500 dark:text-eco-green-400">
                  Learn More
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UserTypes;
