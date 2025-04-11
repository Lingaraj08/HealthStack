
import React from 'react';
import { Shield, Fingerprint, Share2, FileCheck, CreditCard, QrCode, Repeat, Smartphone, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const HealthIDSection: React.FC = () => {
  return (
    <section className="py-16 bg-white">
      <div className="health-container">
        <div className="text-center mb-12">
          <h2 className="health-heading text-3xl md:text-4xl mb-4">India Stack Integration</h2>
          <p className="health-subheading max-w-3xl mx-auto text-gray-600">
            Connect your Ayushman Bharat Digital Mission Health ID and leverage other India Stack components for seamless healthcare access across India.
          </p>
        </div>

        <Tabs defaultValue="abha" className="w-full mb-10">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 mb-8">
            <TabsTrigger value="abha">ABHA Health ID</TabsTrigger>
            <TabsTrigger value="digilocker">DigiLocker</TabsTrigger>
            <TabsTrigger value="other">Other India Stack</TabsTrigger>
          </TabsList>
          
          <TabsContent value="abha">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="bg-healthBlue-50 border-2 border-healthBlue-100 rounded-2xl p-8 relative">
                  <div className="absolute top-0 right-0 bg-healthBlue-500 text-white text-xs px-3 py-1 rounded-bl-lg rounded-tr-lg font-medium">
                    Secure & Verified
                  </div>
                  
                  <div className="mb-6 space-y-6">
                    <div className="flex items-start space-x-4">
                      <div className="mt-1">
                        <Fingerprint className="h-6 w-6 text-healthBlue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg text-gray-800">One Health ID for All Services</h3>
                        <p className="text-gray-600">
                          Use your ABDM Health ID to access all healthcare services without repetitive registrations.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <div className="mt-1">
                        <Share2 className="h-6 w-6 text-healthBlue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg text-gray-800">Share Medical History Securely</h3>
                        <p className="text-gray-600">
                          Grant temporary access to doctors and hospitals, with complete control over your data.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <div className="mt-1">
                        <Shield className="h-6 w-6 text-healthBlue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg text-gray-800">Blockchain-Secured Records</h3>
                        <p className="text-gray-600">
                          All your medical records are encrypted and stored securely using blockchain technology.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <div className="mt-1">
                        <FileCheck className="h-6 w-6 text-healthBlue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg text-gray-800">DigiLocker Integration</h3>
                        <p className="text-gray-600">
                          Access your health documents anytime through DigiLocker integration.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button className="health-button-primary">Connect Health ID</Button>
                    <Button variant="outline" className="border-healthBlue-300 text-healthBlue-600 hover:bg-healthBlue-50">
                      Create New Health ID
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <Card className="border-healthBlue-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-healthBlue-100 flex items-center justify-center">
                          <span className="font-bold text-healthBlue-600">ID</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">Health ID Benefits</h3>
                        </div>
                      </div>
                    </div>
                    <ul className="space-y-2 ml-5 list-disc text-gray-700">
                      <li>Single digital health ID for all healthcare services</li>
                      <li>Secure access to your medical history anywhere</li>
                      <li>Easy appointment booking across hospitals</li>
                      <li>Verified doctors and healthcare providers</li>
                      <li>Eligible for government healthcare schemes</li>
                      <li>Paperless hospital admission and checkups</li>
                    </ul>
                  </CardContent>
                </Card>
                
                <div className="bg-healthGreen-50 rounded-lg p-5 border border-healthGreen-100">
                  <h4 className="font-medium text-healthGreen-800 mb-2">Already have 14-digit Ayushman Bharat Health Account (ABHA) number?</h4>
                  <p className="text-gray-600 text-sm mb-4">Link it with HealthStack for enhanced services and easy access to government healthcare schemes.</p>
                  <Button variant="outline" className="border-healthGreen-300 text-healthGreen-700 hover:bg-healthGreen-100 w-full">
                    Link Existing ABHA Number
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="digilocker">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="bg-healthGreen-50 border-2 border-healthGreen-100 rounded-2xl p-8">
                  <h3 className="font-semibold text-xl mb-4 text-gray-800">DigiLocker for Healthcare Documents</h3>
                  <p className="text-gray-600 mb-6">
                    Store and access your medical documents securely through DigiLocker integration. Share documents instantly with healthcare providers.
                  </p>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex items-start space-x-3">
                      <div className="bg-healthGreen-100 p-2 rounded-full">
                        <FileCheck className="h-5 w-5 text-healthGreen-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800">Digital Medical Records</h4>
                        <p className="text-sm text-gray-600">Store prescriptions, lab reports, and discharge summaries</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="bg-healthGreen-100 p-2 rounded-full">
                        <Smartphone className="h-5 w-5 text-healthGreen-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800">eSign Documents</h4>
                        <p className="text-sm text-gray-600">Digitally sign consent forms and medical documents</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="bg-healthGreen-100 p-2 rounded-full">
                        <Repeat className="h-5 w-5 text-healthGreen-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800">Aadhaar eKYC</h4>
                        <p className="text-sm text-gray-600">Verify identity instantly for quick hospital registration</p>
                      </div>
                    </div>
                  </div>
                  
                  <Button className="w-full bg-healthGreen-500 hover:bg-healthGreen-600 text-white">
                    Connect DigiLocker
                  </Button>
                </div>
              </div>
              
              <div>
                <div className="bg-white rounded-2xl border-2 border-gray-200 p-8">
                  <h3 className="font-semibold text-xl mb-6 text-gray-800">Available Medical Documents</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center">
                        <FileCheck className="h-5 w-5 text-healthBlue-600 mr-3" />
                        <span>Vaccination Certificate</span>
                      </div>
                      <Button variant="ghost" size="sm">View</Button>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center">
                        <FileCheck className="h-5 w-5 text-healthBlue-600 mr-3" />
                        <span>Health Insurance</span>
                      </div>
                      <Button variant="ghost" size="sm">View</Button>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center">
                        <FileCheck className="h-5 w-5 text-healthBlue-600 mr-3" />
                        <span>Medical Prescriptions</span>
                      </div>
                      <Button variant="ghost" size="sm">View</Button>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center">
                        <FileCheck className="h-5 w-5 text-healthBlue-600 mr-3" />
                        <span>Test Reports</span>
                      </div>
                      <Button variant="ghost" size="sm">View</Button>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <Button variant="outline" className="w-full">Upload New Document</Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="other">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-healthBlue-200">
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-full bg-healthBlue-100 flex items-center justify-center mb-4">
                    <CreditCard className="h-6 w-6 text-healthBlue-600" />
                  </div>
                  <h3 className="font-semibold text-xl mb-2">UPI Payments</h3>
                  <p className="text-gray-600 mb-4">
                    Pay hospital bills, lab tests, and medicine purchases instantly using UPI.
                  </p>
                  <Button variant="outline" className="w-full border-healthBlue-300 text-healthBlue-600">
                    Setup UPI Payments
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="border-healthGreen-200">
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-full bg-healthGreen-100 flex items-center justify-center mb-4">
                    <QrCode className="h-6 w-6 text-healthGreen-600" />
                  </div>
                  <h3 className="font-semibold text-xl mb-2">BharatQR</h3>
                  <p className="text-gray-600 mb-4">
                    Scan QR codes for contactless payments at hospitals and pharmacies.
                  </p>
                  <Button variant="outline" className="w-full border-healthGreen-300 text-healthGreen-600">
                    Generate QR Code
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="border-healthOrange-200">
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-full bg-healthOrange-100 flex items-center justify-center mb-4">
                    <Lightbulb className="h-6 w-6 text-healthOrange-600" />
                  </div>
                  <h3 className="font-semibold text-xl mb-2">ONDC for Medicines</h3>
                  <p className="text-gray-600 mb-4">
                    Order medicines through the Open Network for Digital Commerce integration.
                  </p>
                  <Button variant="outline" className="w-full border-healthOrange-300 text-healthOrange-600">
                    Explore Pharmacies
                  </Button>
                </CardContent>
              </Card>
            </div>
            
            <div className="mt-8 bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h3 className="font-semibold text-xl mb-4">Other India Stack Components</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start space-x-3">
                  <div className="mt-1">
                    <Shield className="h-5 w-5 text-healthBlue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">eSign</h4>
                    <p className="text-sm text-gray-600">Digitally sign medical documents and consent forms</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="mt-1">
                    <Repeat className="h-5 w-5 text-healthBlue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">Bharat Bill Payment System</h4>
                    <p className="text-sm text-gray-600">Pay hospital and insurance bills through BBPS</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="mt-1">
                    <Smartphone className="h-5 w-5 text-healthBlue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">UMANG App Integration</h4>
                    <p className="text-sm text-gray-600">Access government healthcare services through UMANG</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="mt-1">
                    <Lightbulb className="h-5 w-5 text-healthBlue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">GeM for Medical Supplies</h4>
                    <p className="text-sm text-gray-600">Access healthcare products through Government e Marketplace</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default HealthIDSection;
