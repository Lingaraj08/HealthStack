
import React from 'react';
import { Search, Calendar, FileText, Shield, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const HeroSection: React.FC = () => {
  const navigate = useNavigate();

  const handleAIConsultClick = () => {
    navigate('/ai');
  };

  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-healthBlue-500/90 to-healthBlue-700/90"></div>
        <img 
          src="/healthcare-pattern.png" 
          alt="Healthcare Pattern" 
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-20"
        />
      </div>

      <div className="health-container relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 animate-slide-in-left">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 text-white text-sm font-medium">
              <Shield className="h-4 w-4 mr-1" />
              Now ABHA Integrated
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight font-poppins">
              Your Complete Digital Healthcare Ecosystem
            </h1>
            <p className="text-xl text-blue-100">
              Connecting patients, doctors, and healthcare services through AI-powered solutions and secure blockchain technology.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button 
                onClick={handleAIConsultClick}
                className="bg-white hover:bg-gray-100 text-healthBlue-700 font-medium px-6 py-3 text-base rounded-lg flex items-center gap-2 shadow-lg"
              >
                AI Health Consultation
                <ChevronRight className="h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                className="bg-transparent text-white border-white/70 hover:bg-white/10 hover:text-white px-6 py-3 text-base rounded-lg"
                onClick={() => navigate('/doctors')}
              >
                Find a Doctor
              </Button>
            </div>
          </div>

          <div className="hidden md:block animate-float">
            <div className="frosted-glass rounded-2xl p-6">
              <div className="flex items-center space-x-4 mb-6 animate-slide-in-bottom">
                <div className="h-12 w-12 rounded-full flex items-center justify-center bg-healthBlue-100/80">
                  <FileText className="h-6 w-6 text-healthBlue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-800 dark:text-white">Digital Health Records</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Secure, accessible, blockchain-verified</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 mb-6 animate-slide-in-bottom" style={{ animationDelay: "0.2s" }}>
                <div className="h-12 w-12 rounded-full flex items-center justify-center bg-healthGreen-100/80">
                  <Search className="h-6 w-6 text-healthGreen-600" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-800 dark:text-white">AI Symptom Checker</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Preliminary diagnosis and specialist matching</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 animate-slide-in-bottom" style={{ animationDelay: "0.4s" }}>
                <div className="h-12 w-12 rounded-full flex items-center justify-center bg-healthOrange-100/80">
                  <Calendar className="h-6 w-6 text-healthOrange-600" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-800 dark:text-white">Easy Appointments</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Book, reschedule and get reminders</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Curved bottom shape */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="fill-white dark:fill-background">
          <path d="M0,96L48,85.3C96,75,192,53,288,53.3C384,53,480,75,576,80C672,85,768,75,864,64C960,53,1056,43,1152,48C1248,53,1344,75,1392,85.3L1440,96L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
