
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ESGDashboard from '@/components/esg/ESGDashboard';

const ESGInvestmentTracking = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Navigation */}
      <div className="bg-white shadow-sm border-b border-gray-200 px-4 py-3">
        <div className="max-w-7xl mx-auto">
          <Link to="/dashboard" className="inline-flex items-center text-eco-green-600 hover:text-eco-green-700">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">ESG Investment Tracking</h1>
          <p className="text-gray-600 mt-2">
            Track and manage your Environmental, Social, and Governance investments
          </p>
        </div>
        
        <ESGDashboard />
      </div>
    </div>
  );
};

export default ESGInvestmentTracking;
