
import React from 'react';
import { Shield, Fingerprint, Share2, FileCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const HealthIDSection: React.FC = () => {
  return (
    <section className="py-16 bg-white">
      <div className="health-container">
        <div className="text-center mb-12">
          <h2 className="health-heading text-3xl md:text-4xl mb-4">ABDM Health ID Integration</h2>
          <p className="health-subheading max-w-3xl mx-auto text-gray-600">
            Connect your Ayushman Bharat Digital Mission Health ID with HealthStack for seamless healthcare access across India.
          </p>
        </div>

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
      </div>
    </section>
  );
};

export default HealthIDSection;
