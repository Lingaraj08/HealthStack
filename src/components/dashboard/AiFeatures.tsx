
import React from 'react';
import { Brain, HeartPulse, Pill, Calendar, MessageSquare, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const AiFeatures: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <section className="py-16 bg-gray-50">
      <div className="health-container">
        <div className="text-center mb-12">
          <h2 className="health-heading text-3xl md:text-4xl mb-4">AI-Powered Healthcare Solutions</h2>
          <p className="health-subheading max-w-3xl mx-auto text-gray-600">
            Experience the future of healthcare with our advanced artificial intelligence tools designed to help you stay healthy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="health-card hover:border-healthBlue-300 transition-all">
            <CardContent className="p-6">
              <div className="h-12 w-12 rounded-full bg-healthBlue-100 flex items-center justify-center mb-4">
                <Brain className="h-6 w-6 text-healthBlue-600" />
              </div>
              <h3 className="font-semibold text-xl mb-2">AI Symptom Checker</h3>
              <p className="text-gray-600 mb-4">
                Describe your symptoms to our AI and get preliminary diagnosis and specialist recommendations.
              </p>
              <Button 
                className="w-full health-button-primary"
                onClick={() => navigate('/ai')}
              >
                Check Symptoms
              </Button>
            </CardContent>
          </Card>

          <Card className="health-card hover:border-healthGreen-300 transition-all">
            <CardContent className="p-6">
              <div className="h-12 w-12 rounded-full bg-healthGreen-100 flex items-center justify-center mb-4">
                <HeartPulse className="h-6 w-6 text-healthGreen-600" />
              </div>
              <h3 className="font-semibold text-xl mb-2">Smart Doctor Matching</h3>
              <p className="text-gray-600 mb-4">
                Our AI matches you with the best specialists based on your symptoms and medical history.
              </p>
              <Button 
                className="w-full health-button-secondary"
                onClick={() => navigate('/doctors')}
              >
                Find Specialist
              </Button>
            </CardContent>
          </Card>

          <Card className="health-card hover:border-healthOrange-300 transition-all">
            <CardContent className="p-6">
              <div className="h-12 w-12 rounded-full bg-healthOrange-100 flex items-center justify-center mb-4">
                <Pill className="h-6 w-6 text-healthOrange-600" />
              </div>
              <h3 className="font-semibold text-xl mb-2">Medication Assistant</h3>
              <p className="text-gray-600 mb-4">
                Get smart reminders for your medications and alerts about potential drug interactions.
              </p>
              <Button 
                className="w-full bg-healthOrange-500 hover:bg-healthOrange-600 text-white"
                onClick={() => navigate('/medications')}
              >
                Manage Medications
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 bg-white p-8 rounded-xl shadow-sm border">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0">
              <h3 className="font-bold text-2xl text-healthBlue-600 mb-2">Meet Your AI Health Companion</h3>
              <p className="text-gray-600 max-w-xl">
                Our AI-powered health assistant is available 24/7 to answer your questions, provide health tips, 
                and help you navigate through various healthcare services.
              </p>
            </div>
            <Button 
              className="health-button-accent"
              size="lg"
              onClick={() => navigate('/ai')}
            >
              <MessageSquare className="mr-2 h-5 w-5" />
              Chat with AI Assistant
            </Button>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-healthBlue-50 to-healthBlue-100 p-6 rounded-xl border border-healthBlue-200">
            <div className="flex items-center mb-4">
              <Activity className="h-6 w-6 text-healthBlue-600 mr-3" />
              <h3 className="font-semibold text-lg">Health Monitoring</h3>
            </div>
            <p className="text-gray-700 mb-4">
              Connect your wearable devices to track vital signs and receive AI-powered insights on improving your health.
            </p>
            <Button variant="outline" className="border-healthBlue-300 text-healthBlue-600">
              Connect Devices
            </Button>
          </div>
          
          <div className="bg-gradient-to-br from-healthGreen-50 to-healthGreen-100 p-6 rounded-xl border border-healthGreen-200">
            <div className="flex items-center mb-4">
              <Calendar className="h-6 w-6 text-healthGreen-600 mr-3" />
              <h3 className="font-semibold text-lg">Smart Appointment Scheduling</h3>
            </div>
            <p className="text-gray-700 mb-4">
              AI automatically suggests appointment times based on your calendar, doctor availability, and urgency of care.
            </p>
            <Button variant="outline" className="border-healthGreen-300 text-healthGreen-600">
              Schedule Appointment
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AiFeatures;
