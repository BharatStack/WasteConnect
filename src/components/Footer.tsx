
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Github, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-eco-green-50 dark:bg-eco-green-900/30 text-eco-green-800 dark:text-eco-green-100 pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-eco-green-500 to-eco-green-400 flex items-center justify-center">
                <span className="text-white font-bold text-lg">W</span>
              </div>
              <span className="text-xl font-bold text-eco-green-700 dark:text-white">WasteConnect</span>
            </Link>
            <p className="text-eco-green-600 dark:text-eco-green-300 mb-4">
              Connecting waste generators with processors for a sustainable future.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-eco-green-600 hover:text-eco-green-800 dark:text-eco-green-400 dark:hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-eco-green-600 hover:text-eco-green-800 dark:text-eco-green-400 dark:hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-eco-green-600 hover:text-eco-green-800 dark:text-eco-green-400 dark:hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-eco-green-600 hover:text-eco-green-800 dark:text-eco-green-400 dark:hover:text-white transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4 text-eco-green-700 dark:text-eco-green-300">User Types</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/users/household" className="text-eco-green-600 hover:text-eco-green-800 dark:text-eco-green-400 dark:hover:text-white transition-colors">
                  Household Users
                </Link>
              </li>
              <li>
                <Link to="/users/municipality" className="text-eco-green-600 hover:text-eco-green-800 dark:text-eco-green-400 dark:hover:text-white transition-colors">
                  Municipality Users
                </Link>
              </li>
              <li>
                <Link to="/users/industry" className="text-eco-green-600 hover:text-eco-green-800 dark:text-eco-green-400 dark:hover:text-white transition-colors">
                  Industry & MSME Users
                </Link>
              </li>
              <li>
                <Link to="/users/government" className="text-eco-green-600 hover:text-eco-green-800 dark:text-eco-green-400 dark:hover:text-white transition-colors">
                  Government & Regulatory Users
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4 text-eco-green-700 dark:text-eco-green-300">Features</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/features/waste-log" className="text-eco-green-600 hover:text-eco-green-800 dark:text-eco-green-400 dark:hover:text-white transition-colors">
                  Log Waste Data
                </Link>
              </li>
              <li>
                <Link to="/features/route-optimization" className="text-eco-green-600 hover:text-eco-green-800 dark:text-eco-green-400 dark:hover:text-white transition-colors">
                  Route Optimization
                </Link>
              </li>
              <li>
                <Link to="/features/marketplace" className="text-eco-green-600 hover:text-eco-green-800 dark:text-eco-green-400 dark:hover:text-white transition-colors">
                  Marketplace
                </Link>
              </li>
              <li>
                <Link to="/features/dashboard" className="text-eco-green-600 hover:text-eco-green-800 dark:text-eco-green-400 dark:hover:text-white transition-colors">
                  Analytics Dashboard
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4 text-eco-green-700 dark:text-eco-green-300">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-start space-x-3">
                <Mail size={18} className="text-eco-green-600 dark:text-eco-green-400 mt-1 flex-shrink-0" />
                <span className="text-eco-green-600 dark:text-eco-green-400">info@wasteconnect.com</span>
              </li>
              <li className="flex items-start space-x-3">
                <Mail size={18} className="text-eco-green-600 dark:text-eco-green-400 mt-1 flex-shrink-0" />
                <span className="text-eco-green-600 dark:text-eco-green-400">skandam063@gmail.com</span>
              </li>
              <li className="text-eco-green-600 dark:text-eco-green-400">
                123 Green Street<br />
                Eco City, EC 12345<br />
                Earth
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-eco-green-200 dark:border-eco-green-800/30 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-eco-green-600 dark:text-eco-green-400 text-sm mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} WasteConnect. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link to="/privacy" className="text-sm text-eco-green-600 hover:text-eco-green-800 dark:text-eco-green-400 dark:hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-sm text-eco-green-600 hover:text-eco-green-800 dark:text-eco-green-400 dark:hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link to="/contact" className="text-sm text-eco-green-600 hover:text-eco-green-800 dark:text-eco-green-400 dark:hover:text-white transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
