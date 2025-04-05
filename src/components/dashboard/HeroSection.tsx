
import React from 'react';
import { Search, Calendar, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const HeroSection: React.FC = () => {
  const navigate = useNavigate();

  const handleAIConsultClick = () => {
    navigate('/ai');
  };

  return (
    <section className="relative bg-gradient-to-r from-healthBlue-500 to-healthBlue-700 py-16 md:py-20 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-white animate-pulse-slow"></div>
        <div className="absolute bottom-10 right-20 w-40 h-40 rounded-full bg-white animate-pulse-slow delay-500"></div>
        <div className="absolute top-40 right-40 w-24 h-24 rounded-full bg-white animate-pulse-slow delay-1000"></div>
      </div>

      <div className="health-container relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
              Your Complete Digital Healthcare Ecosystem
            </h1>
            <p className="text-xl text-blue-100">
              Connecting patients, doctors, and healthcare services through AI-powered solutions and secure blockchain technology.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button 
                onClick={handleAIConsultClick}
                className="health-button-accent px-6 py-3 text-base"
              >
                AI Health Consultation
              </Button>
              <Button 
                variant="outline" 
                className="bg-white text-healthBlue-600 border-white hover:bg-blue-100 hover:text-healthBlue-700 px-6 py-3 text-base"
                onClick={() => navigate('/doctors')}
              >
                Find a Doctor
              </Button>
            </div>
          </div>

          <div className="hidden md:block">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl animate-float">
              <div className="flex items-center space-x-4 mb-6">
                <div className="h-12 w-12 rounded-full flex items-center justify-center bg-healthBlue-100">
                  <FileText className="h-6 w-6 text-healthBlue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-800">Digital Health Records</h3>
                  <p className="text-sm text-gray-500">Secure, accessible, blockchain-verified</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 mb-6">
                <div className="h-12 w-12 rounded-full flex items-center justify-center bg-healthGreen-100">
                  <Search className="h-6 w-6 text-healthGreen-600" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-800">AI Symptom Checker</h3>
                  <p className="text-sm text-gray-500">Preliminary diagnosis and specialist matching</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 rounded-full flex items-center justify-center bg-healthOrange-100">
                  <Calendar className="h-6 w-6 text-healthOrange-600" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-800">Easy Appointments</h3>
                  <p className="text-sm text-gray-500">Book, reschedule and get reminders</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
