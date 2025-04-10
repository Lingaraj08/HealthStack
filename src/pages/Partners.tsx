
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { ClockIcon, AlertCircle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Partners: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8 flex justify-center">
            <div className="bg-healthOrange-100 p-4 rounded-full">
              <ClockIcon className="h-16 w-16 text-healthOrange-600" />
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Coming Soon</h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Our Partners section is currently under development. We're working on building partnerships 
            with hospitals, clinics, pharmacies, and other healthcare service providers.
          </p>
          
          <div className="bg-healthBlue-50 border border-healthBlue-100 rounded-lg p-6 mb-10 max-w-2xl mx-auto">
            <div className="flex items-start">
              <AlertCircle className="h-6 w-6 text-healthBlue-600 mr-3 mt-1 flex-shrink-0" />
              <p className="text-left text-healthBlue-700">
                Would you like to become a HealthStack partner? We're looking for healthcare providers, 
                clinics, hospitals, and pharmacies to join our ecosystem.
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="outline" 
              className="border-healthBlue-300 text-healthBlue-600"
              onClick={() => navigate('/contact')}
            >
              Register Interest
            </Button>
            <Button onClick={() => navigate('/')}>
              Return to Home <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
          
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="bg-gray-100 h-20 rounded-md flex items-center justify-center text-gray-400">
              <p className="font-medium">Partner 1</p>
            </div>
            <div className="bg-gray-100 h-20 rounded-md flex items-center justify-center text-gray-400">
              <p className="font-medium">Partner 2</p>
            </div>
            <div className="bg-gray-100 h-20 rounded-md flex items-center justify-center text-gray-400">
              <p className="font-medium">Partner 3</p>
            </div>
            <div className="bg-gray-100 h-20 rounded-md flex items-center justify-center text-gray-400">
              <p className="font-medium">Partner 4</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Partners;
