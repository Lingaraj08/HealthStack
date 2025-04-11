import React from 'react';
import Layout from '@/components/layout/Layout';
import HeroSection from '@/components/dashboard/HeroSection';
import HealthIDSection from '@/components/dashboard/HealthIDSection';
import AiFeatures from '@/components/dashboard/AiFeatures';
import DoctorsSection from '@/components/dashboard/DoctorsSection';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { FileText, Calendar, User, FileSearch, IndianRupee, Layers, Shield } from 'lucide-react';
import AiChat from '@/components/ai/AiChat';
import { Button } from '@/components/ui/button';
import PaymentsSection from '@/components/payments/PaymentsSection';
import HealthSchemesSection from '@/components/dashboard/HealthSchemesSection';

const Index: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <HeroSection />
      
      <div className="bg-white py-12">
        <div className="health-container">
          <Tabs defaultValue="dashboard" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 mb-8">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="records">Medical Records</TabsTrigger>
              <TabsTrigger value="appointments">Appointments</TabsTrigger>
              <TabsTrigger value="payments">Payments</TabsTrigger>
              <TabsTrigger value="ai">AI Assistant</TabsTrigger>
            </TabsList>
            
            <TabsContent value="dashboard">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="col-span-1 md:col-span-2 p-6 space-y-4">
                  <h3 className="font-semibold text-xl text-gray-800">Welcome to HealthStack</h3>
                  <p className="text-gray-600">
                    Your complete healthcare ecosystem connecting doctors, patients, and healthcare services.
                    Experience AI-driven healthcare solutions and secure medical record management.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                    <div className="bg-healthBlue-50 p-4 rounded-lg border border-healthBlue-100">
                      <h4 className="font-medium text-healthBlue-700 mb-1">Connect Your Health ID</h4>
                      <p className="text-sm text-gray-600">Link your Ayushman Bharat Digital Health ID for seamless services.</p>
                    </div>
                    <div className="bg-healthGreen-50 p-4 rounded-lg border border-healthGreen-100">
                      <h4 className="font-medium text-healthGreen-700 mb-1">Complete Your Profile</h4>
                      <p className="text-sm text-gray-600">Add your medical history and preferences for personalized care.</p>
                    </div>
                  </div>
                  
                  <div className="bg-healthOrange-50 p-4 rounded-lg border border-healthOrange-100 mt-4">
                    <h4 className="font-medium text-healthOrange-700 mb-1 flex items-center">
                      <Layers className="h-4 w-4 mr-1" />
                      India Stack Integration Testing
                    </h4>
                    <p className="text-sm text-gray-600 mb-2">
                      Test ABHA Health ID, UPI, DigiLocker, eSign, and other India Stack features.
                    </p>
                    <Button 
                      variant="healthAccent" 
                      size="sm"
                      onClick={() => navigate('/india-stack-test')}
                    >
                      Open Test Dashboard
                    </Button>
                  </div>

                  <div className="bg-healthBlue-50 p-4 rounded-lg border border-healthBlue-100 mt-4">
                    <h4 className="font-medium text-healthBlue-700 mb-1 flex items-center">
                      <Shield className="h-4 w-4 mr-1" />
                      Government Health Schemes
                    </h4>
                    <p className="text-sm text-gray-600 mb-2">
                      Explore government healthcare schemes and programs you may be eligible for.
                    </p>
                    <Button 
                      variant="health" 
                      size="sm"
                      onClick={() => navigate('/health-schemes')}
                    >
                      View Health Schemes
                    </Button>
                  </div>
                </Card>
                
                <Card className="p-6 space-y-4 flex flex-col">
                  <h3 className="font-semibold text-xl text-gray-800">Quick Access</h3>
                  <div className="flex-1 space-y-3">
                    <div 
                      className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => navigate('/doctors')}
                    >
                      <p className="font-medium">Find Doctors</p>
                    </div>
                    <div 
                      className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => navigate('/appointments')}
                    >
                      <p className="font-medium">Book Appointment</p>
                    </div>
                    <div 
                      className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => navigate('/medications')}
                    >
                      <p className="font-medium">Order Medicines</p>
                    </div>
                    <div 
                      className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => navigate('/medical-records')}
                    >
                      <p className="font-medium">View Medical Records</p>
                    </div>
                    <div 
                      className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => navigate('/health-schemes')}
                    >
                      <p className="font-medium">Health Schemes</p>
                    </div>
                    <div 
                      className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors bg-healthOrange-50"
                      onClick={() => navigate('/india-stack-test')}
                    >
                      <p className="font-medium">India Stack Testing</p>
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="records">
              <div className="text-center p-12">
                <div className="flex flex-col items-center">
                  <FileText className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="font-semibold text-xl mb-2">Medical Records</h3>
                  <p className="text-gray-600 mb-4">Connect your Health ID to view and manage your medical records securely.</p>
                  <div className="flex gap-3">
                    <Button 
                      onClick={() => navigate('/medical-records')}
                      className="health-button-primary"
                    >
                      View Records
                    </Button>
                    <Button 
                      variant="outline"
                      className="border-healthBlue-300 text-healthBlue-600"
                      onClick={() => navigate('/india-stack-test')}
                    >
                      Connect Health ID
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="appointments">
              <div className="text-center p-12">
                <div className="flex flex-col items-center">
                  <Calendar className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="font-semibold text-xl mb-2">Appointments</h3>
                  <p className="text-gray-600 mb-4">Schedule, manage, and keep track of your healthcare appointments.</p>
                  <div className="flex gap-3">
                    <Button 
                      onClick={() => navigate('/appointments')}
                      className="health-button-primary"
                    >
                      View Appointments
                    </Button>
                    <Button 
                      variant="outline"
                      className="border-healthBlue-300 text-healthBlue-600"
                      onClick={() => navigate('/appointments')}
                    >
                      Book an Appointment
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="payments">
              <PaymentsSection />
            </TabsContent>
            
            <TabsContent value="ai" className="h-[600px]">
              <AiChat />
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <HealthIDSection />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <DoctorsSection />
        <HealthSchemesSection />
      </div>
      <AiFeatures />
    </Layout>
  );
};

export default Index;
