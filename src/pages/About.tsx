
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { CheckCircle2, ArrowRight, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const About = () => {
  const missionValues = [
    {
      title: "Sustainability",
      description: "We are committed to promoting sustainable waste management practices that minimize environmental impact and conserve natural resources."
    },
    {
      title: "Innovation",
      description: "We continuously innovate to provide cutting-edge solutions that make waste management more efficient, cost-effective, and environmentally friendly."
    },
    {
      title: "Collaboration",
      description: "We believe in the power of collaboration between stakeholders to create effective waste management solutions and circular economy opportunities."
    },
    {
      title: "Transparency",
      description: "We promote transparency in waste management practices, ensuring that all stakeholders have access to accurate and timely information."
    }
  ];

  const teamMembers = [
    {
      name: "Alex Johnson",
      role: "Founder & CEO",
      bio: "Environmental engineer with 15+ years of experience in waste management systems."
    },
    {
      name: "Sarah Chen",
      role: "CTO",
      bio: "Technology leader specializing in sustainable tech solutions and data analytics."
    },
    {
      name: "Michael Rodriguez",
      role: "Head of Operations",
      bio: "Operations expert with background in municipal waste management systems."
    },
    {
      name: "Priya Sharma",
      role: "Sustainability Director",
      bio: "Environmental scientist focused on circular economy and waste reduction strategies."
    }
  ];

  const partnerships = [
    {
      name: "Global Environmental Alliance",
      description: "Working together to promote sustainable waste management practices worldwide."
    },
    {
      name: "City Waste Management Agencies",
      description: "Partnering with municipalities to implement smart waste collection systems."
    },
    {
      name: "Recycling Industry Association",
      description: "Collaborating to create more efficient material recovery and recycling processes."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="bg-eco-green-50 dark:bg-eco-green-900/20 py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-eco-green-800 dark:text-white mb-6">
                About WasteConnect
              </h1>
              <p className="text-xl text-eco-green-600 dark:text-eco-green-300">
                We're on a mission to revolutionize waste management through technology, collaboration, and sustainable practices.
              </p>
            </div>
          </div>
        </div>

        <section className="py-16 bg-white dark:bg-background">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-eco-green-700 dark:text-eco-green-400 mb-6">
                  Our Story
                </h2>
                <p className="text-eco-green-600 dark:text-eco-green-300 mb-6">
                  WasteConnect was founded in 2022 with a vision to transform waste management into an efficient, transparent, and sustainable process. We recognized the challenges faced by various stakeholders in the waste management ecosystem - from households struggling with recycling to municipalities optimizing collection routes to regulators ensuring compliance.
                </p>
                <p className="text-eco-green-600 dark:text-eco-green-300 mb-6">
                  Our platform was built to bridge these gaps by connecting waste generators with processors, providing tools for efficient waste management, and promoting circular economy principles. Today, WasteConnect serves thousands of users across different sectors, helping them reduce environmental impact while creating economic opportunities from waste.
                </p>
                <div className="flex items-center space-x-3 text-eco-green-600 dark:text-eco-green-400">
                  <span className="font-bold">Learn more about our journey</span>
                  <ArrowRight className="h-5 w-5" />
                </div>
              </div>
              <div className="bg-eco-green-50 dark:bg-eco-green-900/20 p-8 rounded-xl shadow-md">
                <h3 className="text-xl font-bold text-eco-green-700 dark:text-eco-green-200 mb-4">Our Impact</h3>
                <div className="space-y-6">
                  <div className="flex items-center">
                    <div className="w-16 h-16 bg-white dark:bg-eco-green-800/20 rounded-full shadow flex items-center justify-center mr-4">
                      <span className="text-2xl font-bold text-eco-green-600 dark:text-eco-green-400">50+</span>
                    </div>
                    <div>
                      <p className="font-semibold text-eco-green-700 dark:text-eco-green-200">Cities Served</p>
                      <p className="text-eco-green-600 dark:text-eco-green-400">Across 12 countries</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-16 h-16 bg-white dark:bg-eco-green-800/20 rounded-full shadow flex items-center justify-center mr-4">
                      <span className="text-2xl font-bold text-eco-green-600 dark:text-eco-green-400">20K+</span>
                    </div>
                    <div>
                      <p className="font-semibold text-eco-green-700 dark:text-eco-green-200">Active Users</p>
                      <p className="text-eco-green-600 dark:text-eco-green-400">From households to large industries</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-16 h-16 bg-white dark:bg-eco-green-800/20 rounded-full shadow flex items-center justify-center mr-4">
                      <span className="text-2xl font-bold text-eco-green-600 dark:text-eco-green-400">500K</span>
                    </div>
                    <div>
                      <p className="font-semibold text-eco-green-700 dark:text-eco-green-200">Tons of Waste</p>
                      <p className="text-eco-green-600 dark:text-eco-green-400">Diverted from landfills</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-eco-green-50 dark:bg-eco-green-900/10">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-eco-green-700 dark:text-eco-green-400 mb-6 text-center">
              Our Mission & Values
            </h2>
            <p className="text-eco-green-600 dark:text-eco-green-300 text-center mb-12 max-w-3xl mx-auto">
              We're committed to creating a more sustainable future by revolutionizing the way waste is managed, processed, and valued.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {missionValues.map((value, index) => (
                <Card key={index} className="bg-white dark:bg-eco-green-900/20 border-0 shadow-md">
                  <CardContent className="pt-6">
                    <div className="flex items-start">
                      <div className="mr-4 flex-shrink-0">
                        <CheckCircle2 className="h-6 w-6 text-eco-green-600 dark:text-eco-green-400" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-eco-green-700 dark:text-eco-green-200 mb-2">{value.title}</h3>
                        <p className="text-eco-green-600 dark:text-eco-green-300">{value.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-white dark:bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-eco-green-700 dark:text-eco-green-400 mb-6 text-center">
              Our Team
            </h2>
            <p className="text-eco-green-600 dark:text-eco-green-300 text-center mb-12 max-w-3xl mx-auto">
              Meet the passionate team behind WasteConnect, dedicated to creating sustainable waste management solutions.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamMembers.map((member, index) => (
                <div key={index} className="bg-eco-green-50 dark:bg-eco-green-900/20 rounded-lg overflow-hidden shadow-md">
                  <div className="bg-eco-green-200 dark:bg-eco-green-800/30 h-40 flex items-center justify-center">
                    <span className="text-5xl font-bold text-eco-green-600/30 dark:text-eco-green-500/30">
                      {member.name.charAt(0)}
                    </span>
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-lg text-eco-green-700 dark:text-eco-green-200">{member.name}</h3>
                    <p className="text-eco-green-600 dark:text-eco-green-400 mb-3">{member.role}</p>
                    <p className="text-eco-green-600 dark:text-eco-green-300 text-sm">{member.bio}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-eco-green-50 dark:bg-eco-green-900/10">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-eco-green-700 dark:text-eco-green-400 mb-6 text-center">
              Partnerships
            </h2>
            <p className="text-eco-green-600 dark:text-eco-green-300 text-center mb-12 max-w-3xl mx-auto">
              We collaborate with leading organizations to maximize our positive impact on waste management systems.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {partnerships.map((partner, index) => (
                <div key={index} className="bg-white dark:bg-eco-green-900/20 p-6 rounded-lg shadow-md">
                  <div className="bg-eco-green-100 dark:bg-eco-green-800/30 h-24 mb-4 rounded flex items-center justify-center">
                    <span className="font-bold text-xl text-eco-green-600 dark:text-eco-green-400">{partner.name.charAt(0)}</span>
                  </div>
                  <h3 className="font-bold text-lg text-eco-green-700 dark:text-eco-green-200 mb-2">{partner.name}</h3>
                  <p className="text-eco-green-600 dark:text-eco-green-300">{partner.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-eco-green-600">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center text-white">
              <h2 className="text-2xl md:text-3xl font-bold mb-6">
                Interested in Joining Our Mission?
              </h2>
              <p className="text-xl mb-8">
                We're always looking for partners, team members, and collaborators who share our vision for a more sustainable future.
              </p>
              <Button className="bg-white hover:bg-gray-100 text-eco-green-600 px-8 py-6 rounded-md text-lg">
                <Mail className="mr-2 h-5 w-5" />
                Contact Us
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
