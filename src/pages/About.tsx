
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card } from '@/components/ui/card';
import { Layers, ShieldCheck, HeartPulse, Stethoscope } from 'lucide-react';

const About: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">About HealthStack</h1>
          
          <div className="prose max-w-none mb-12">
            <p className="text-lg text-gray-700 mb-6">
              HealthStack is a revolutionary healthcare ecosystem that integrates AI, Blockchain, and secure APIs 
              to provide seamless healthcare delivery. Our mission is to make quality healthcare accessible to everyone 
              through innovative technology solutions.
            </p>
            
            <p className="text-lg text-gray-700 mb-6">
              Founded in 2024, we set out to transform the healthcare experience by connecting patients with doctors, 
              enabling secure sharing of medical records, and providing AI-powered symptom checking capabilities.
            </p>
            
            <p className="text-lg text-gray-700">
              Our platform leverages India Stack components like Ayushman Bharat Digital Health ID, UPI payments, 
              DigiLocker integration, and eSign capabilities to create a comprehensive healthcare solution tailored 
              for the Indian healthcare ecosystem.
            </p>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Core Values</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <Card className="p-6 flex items-start space-x-4">
              <div className="bg-healthBlue-100 p-3 rounded-lg">
                <ShieldCheck className="h-6 w-6 text-healthBlue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-xl mb-2">Trust & Security</h3>
                <p className="text-gray-600">
                  We prioritize the security and privacy of your health data with state-of-the-art encryption and compliance with healthcare regulations.
                </p>
              </div>
            </Card>
            
            <Card className="p-6 flex items-start space-x-4">
              <div className="bg-healthGreen-100 p-3 rounded-lg">
                <Layers className="h-6 w-6 text-healthGreen-600" />
              </div>
              <div>
                <h3 className="font-semibold text-xl mb-2">Innovation</h3>
                <p className="text-gray-600">
                  We constantly explore new technologies to improve healthcare delivery and patient outcomes.
                </p>
              </div>
            </Card>
            
            <Card className="p-6 flex items-start space-x-4">
              <div className="bg-healthOrange-100 p-3 rounded-lg">
                <HeartPulse className="h-6 w-6 text-healthOrange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-xl mb-2">Patient-Centered Care</h3>
                <p className="text-gray-600">
                  Every feature we build focuses on improving the healthcare experience for patients.
                </p>
              </div>
            </Card>
            
            <Card className="p-6 flex items-start space-x-4">
              <div className="bg-healthBlue-100 p-3 rounded-lg">
                <Stethoscope className="h-6 w-6 text-healthBlue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-xl mb-2">Healthcare Expertise</h3>
                <p className="text-gray-600">
                  Our team combines healthcare professionals and technology experts to deliver effective solutions.
                </p>
              </div>
            </Card>
          </div>
          
          <div className="bg-healthBlue-50 p-8 rounded-lg border border-healthBlue-100 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h2>
            <p className="text-lg text-gray-700">
              To create a healthcare ecosystem where technology enhances the doctor-patient relationship, 
              simplifies administrative processes, and ultimately improves health outcomes for millions of people.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;
