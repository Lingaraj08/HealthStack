
import React from 'react';
import Layout from '@/components/layout/Layout';
import HeroSection from '@/components/dashboard/HeroSection';
import HealthIDSection from '@/components/dashboard/HealthIDSection';
import AiFeatures from '@/components/dashboard/AiFeatures';
import DoctorsSection from '@/components/dashboard/DoctorsSection';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import AiChat from '@/components/ai/AiChat';

const Index: React.FC = () => {
  return (
    <Layout>
      <HeroSection />
      
      <div className="bg-white py-12">
        <div className="health-container">
          <Tabs defaultValue="dashboard" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-8">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="records">Medical Records</TabsTrigger>
              <TabsTrigger value="appointments">Appointments</TabsTrigger>
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
                </Card>
                <Card className="p-6 space-y-4 flex flex-col">
                  <h3 className="font-semibold text-xl text-gray-800">Quick Access</h3>
                  <div className="flex-1 space-y-3">
                    <div className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                      <p className="font-medium">Find Doctors</p>
                    </div>
                    <div className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                      <p className="font-medium">Book Appointment</p>
                    </div>
                    <div className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                      <p className="font-medium">Order Medicines</p>
                    </div>
                    <div className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                      <p className="font-medium">View Lab Reports</p>
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="records">
              <div className="text-center p-12">
                <h3 className="font-semibold text-xl mb-2">Medical Records</h3>
                <p className="text-gray-600 mb-4">Connect your Health ID to view and manage your medical records securely.</p>
                <button className="health-button-primary">Connect Health ID</button>
              </div>
            </TabsContent>
            
            <TabsContent value="appointments">
              <div className="text-center p-12">
                <h3 className="font-semibold text-xl mb-2">Appointments</h3>
                <p className="text-gray-600 mb-4">You don't have any upcoming appointments.</p>
                <button className="health-button-primary">Book an Appointment</button>
              </div>
            </TabsContent>
            
            <TabsContent value="ai" className="h-[600px]">
              <AiChat />
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <HealthIDSection />
      <AiFeatures />
      <DoctorsSection />
    </Layout>
  );
};

export default Index;
