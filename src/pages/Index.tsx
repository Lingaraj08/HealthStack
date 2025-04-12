
import React from 'react';
import Layout from '@/components/layout/Layout';
import HeroSection from '@/components/dashboard/HeroSection';
import HealthIDSection from '@/components/dashboard/HealthIDSection';
import AiFeatures from '@/components/dashboard/AiFeatures';
import DoctorsSection from '@/components/dashboard/DoctorsSection';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { FileText, Calendar, FileSearch, Shield, Layers, Stethoscope, ChevronRight } from 'lucide-react';
import AiChat from '@/components/ai/AiChat';
import { Button } from '@/components/ui/button';
import PaymentsSection from '@/components/payments/PaymentsSection';
import HealthSchemesSection from '@/components/dashboard/HealthSchemesSection';

const Index: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <HeroSection />
      
      <div className="py-12">
        <div className="health-container">
          <Tabs defaultValue="dashboard" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 mb-8 bg-gray-100/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-1">
              <TabsTrigger value="dashboard" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:text-healthBlue-600 dark:data-[state=active]:text-healthBlue-400 rounded-lg">
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="records" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:text-healthBlue-600 dark:data-[state=active]:text-healthBlue-400 rounded-lg">
                Medical Records
              </TabsTrigger>
              <TabsTrigger value="appointments" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:text-healthBlue-600 dark:data-[state=active]:text-healthBlue-400 rounded-lg">
                Appointments
              </TabsTrigger>
              <TabsTrigger value="payments" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:text-healthBlue-600 dark:data-[state=active]:text-healthBlue-400 rounded-lg">
                Payments
              </TabsTrigger>
              <TabsTrigger value="ai" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:text-healthBlue-600 dark:data-[state=active]:text-healthBlue-400 rounded-lg">
                AI Assistant
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="dashboard" className="animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="col-span-1 md:col-span-2 p-6 space-y-4 frosted-glass">
                  <h3 className="font-semibold text-xl text-gray-800 dark:text-white">Welcome to HealthStack</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Your complete healthcare ecosystem connecting doctors, patients, and healthcare services.
                    Experience AI-driven healthcare solutions and secure medical record management.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                    <div className="bg-healthBlue-50/70 dark:bg-healthBlue-900/30 p-4 rounded-lg border border-healthBlue-100 dark:border-healthBlue-800/50 card-hover">
                      <h4 className="font-medium text-healthBlue-700 dark:text-healthBlue-400 mb-1 flex items-center">
                        <Shield className="h-4 w-4 mr-1.5" />
                        Connect Your Health ID
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Link your Ayushman Bharat Digital Health ID for seamless services.</p>
                    </div>
                    <div className="bg-healthGreen-50/70 dark:bg-healthGreen-900/30 p-4 rounded-lg border border-healthGreen-100 dark:border-healthGreen-800/50 card-hover">
                      <h4 className="font-medium text-healthGreen-700 dark:text-healthGreen-400 mb-1 flex items-center">
                        <Stethoscope className="h-4 w-4 mr-1.5" />
                        Complete Your Profile
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Add your medical history and preferences for personalized care.</p>
                    </div>
                  </div>
                  
                  <div className="bg-healthOrange-50/70 dark:bg-healthOrange-900/30 p-4 rounded-lg border border-healthOrange-100 dark:border-healthOrange-800/50 mt-4 card-hover">
                    <h4 className="font-medium text-healthOrange-700 dark:text-healthOrange-400 mb-1 flex items-center">
                      <Layers className="h-4 w-4 mr-1.5" />
                      India Stack Integration Testing
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Test ABHA Health ID, UPI, DigiLocker, eSign, and other India Stack features.
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate('/india-stack-test')}
                      className="border-healthOrange-200 dark:border-healthOrange-700 text-healthOrange-600 dark:text-healthOrange-400 hover:bg-healthOrange-50 dark:hover:bg-healthOrange-900/30 group"
                    >
                      Open Test Dashboard
                      <ChevronRight className="h-3.5 w-3.5 ml-1 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </div>

                  <div className="bg-healthBlue-50/70 dark:bg-healthBlue-900/30 p-4 rounded-lg border border-healthBlue-100 dark:border-healthBlue-800/50 mt-4 card-hover">
                    <h4 className="font-medium text-healthBlue-700 dark:text-healthBlue-400 mb-1 flex items-center">
                      <Shield className="h-4 w-4 mr-1.5" />
                      Government Health Schemes
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Explore government healthcare schemes and programs you may be eligible for.
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate('/health-schemes')}
                      className="border-healthBlue-200 dark:border-healthBlue-700 text-healthBlue-600 dark:text-healthBlue-400 hover:bg-healthBlue-50 dark:hover:bg-healthBlue-900/30 group"
                    >
                      View Health Schemes
                      <ChevronRight className="h-3.5 w-3.5 ml-1 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </div>
                </Card>
                
                <Card className="p-6 space-y-4 flex flex-col frosted-glass">
                  <h3 className="font-semibold text-xl text-gray-800 dark:text-white">Quick Access</h3>
                  <div className="flex-1 space-y-3 stagger-children">
                    <div 
                      className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-all hover:border-healthBlue-300 dark:hover:border-healthBlue-700 animate-fade-in flex justify-between items-center group"
                      onClick={() => navigate('/doctors')}
                    >
                      <p className="font-medium">Find Doctors</p>
                      <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1 text-healthBlue-500" />
                    </div>
                    <div 
                      className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-all hover:border-healthBlue-300 dark:hover:border-healthBlue-700 animate-fade-in flex justify-between items-center group"
                      onClick={() => navigate('/appointments')}
                    >
                      <p className="font-medium">Book Appointment</p>
                      <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1 text-healthBlue-500" />
                    </div>
                    <div 
                      className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-all hover:border-healthBlue-300 dark:hover:border-healthBlue-700 animate-fade-in flex justify-between items-center group"
                      onClick={() => navigate('/medications')}
                    >
                      <p className="font-medium">Order Medicines</p>
                      <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1 text-healthBlue-500" />
                    </div>
                    <div 
                      className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-all hover:border-healthBlue-300 dark:hover:border-healthBlue-700 animate-fade-in flex justify-between items-center group"
                      onClick={() => navigate('/medical-records')}
                    >
                      <p className="font-medium">View Medical Records</p>
                      <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1 text-healthBlue-500" />
                    </div>
                    <div 
                      className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-all hover:border-healthBlue-300 dark:hover:border-healthBlue-700 animate-fade-in flex justify-between items-center group"
                      onClick={() => navigate('/health-schemes')}
                    >
                      <p className="font-medium">Health Schemes</p>
                      <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1 text-healthBlue-500" />
                    </div>
                    <div 
                      className="p-3 border border-healthOrange-200 dark:border-healthOrange-700 bg-healthOrange-50 dark:bg-healthOrange-900/30 rounded-lg hover:bg-healthOrange-100/50 dark:hover:bg-healthOrange-800/50 cursor-pointer transition-all hover:border-healthOrange-300 dark:hover:border-healthOrange-600 animate-fade-in flex justify-between items-center group"
                      onClick={() => navigate('/india-stack-test')}
                    >
                      <p className="font-medium text-healthOrange-700 dark:text-healthOrange-400">India Stack Testing</p>
                      <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1 text-healthOrange-500" />
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="records" className="animate-fade-in">
              <div className="text-center p-12 frosted-glass rounded-xl">
                <div className="flex flex-col items-center">
                  <FileText className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="font-semibold text-xl mb-2 dark:text-white">Medical Records</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">Connect your Health ID to view and manage your medical records securely.</p>
                  <div className="flex gap-3">
                    <Button 
                      onClick={() => navigate('/medical-records')}
                      className="health-button-primary"
                    >
                      View Records
                    </Button>
                    <Button 
                      variant="outline"
                      className="border-healthBlue-300 text-healthBlue-600 dark:border-healthBlue-700 dark:text-healthBlue-400"
                      onClick={() => navigate('/india-stack-test')}
                    >
                      Connect Health ID
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="appointments" className="animate-fade-in">
              <div className="text-center p-12 frosted-glass rounded-xl">
                <div className="flex flex-col items-center">
                  <Calendar className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="font-semibold text-xl mb-2 dark:text-white">Appointments</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">Schedule, manage, and keep track of your healthcare appointments.</p>
                  <div className="flex gap-3">
                    <Button 
                      onClick={() => navigate('/appointments')}
                      className="health-button-primary"
                    >
                      View Appointments
                    </Button>
                    <Button 
                      variant="outline"
                      className="border-healthBlue-300 text-healthBlue-600 dark:border-healthBlue-700 dark:text-healthBlue-400"
                      onClick={() => navigate('/appointments')}
                    >
                      Book an Appointment
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="payments" className="animate-fade-in">
              <PaymentsSection />
            </TabsContent>
            
            <TabsContent value="ai" className="h-[600px] animate-fade-in">
              <AiChat />
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <div className="relative z-10">
        <HealthIDSection />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
        <DoctorsSection />
        <HealthSchemesSection />
      </div>
      
      <div className="relative z-10">
        <AiFeatures />
      </div>
    </Layout>
  );
};

export default Index;
