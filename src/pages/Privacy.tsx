
import React from 'react';
import Layout from '@/components/layout/Layout';
import { ScrollArea } from '@/components/ui/scroll-area';

const Privacy: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
        
        <ScrollArea className="h-[70vh] rounded-md border p-6 bg-white">
          <div className="space-y-6 pr-4">
            <section>
              <h2 className="text-xl font-semibold mb-3 text-healthBlue-600">1. Information We Collect</h2>
              <p className="text-gray-700">
                HealthStack collects information you provide directly to us when you create an account, fill out a form, 
                participate in surveys, or communicate with us. The types of information we may collect include:
              </p>
              <ul className="list-disc pl-6 mt-2 text-gray-700 space-y-1">
                <li>Personal information such as name, email address, phone number, date of birth, and gender</li>
                <li>Health information such as medical history, medications, allergies, and symptoms</li>
                <li>Payment information when processing transactions</li>
                <li>Device and usage information collected automatically when you use our services</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-healthBlue-600">2. How We Use Your Information</h2>
              <p className="text-gray-700">
                We use the information we collect to:
              </p>
              <ul className="list-disc pl-6 mt-2 text-gray-700 space-y-1">
                <li>Provide, maintain, and improve our services</li>
                <li>Process transactions and send related information</li>
                <li>Send you technical notices, updates, security alerts, and support messages</li>
                <li>Respond to your comments, questions, and requests</li>
                <li>Personalize content and experiences</li>
                <li>Monitor and analyze trends, usage, and activities</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-healthBlue-600">3. Data Security</h2>
              <p className="text-gray-700">
                We take reasonable measures to help protect information about you from loss, theft, misuse, unauthorized access, 
                disclosure, alteration, and destruction. Your health data is encrypted and stored in compliance with healthcare 
                regulations applicable in India.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-healthBlue-600">4. Sharing of Information</h2>
              <p className="text-gray-700">
                We may share information about you as follows:
              </p>
              <ul className="list-disc pl-6 mt-2 text-gray-700 space-y-1">
                <li>With healthcare providers you choose to connect with through our platform</li>
                <li>With third-party vendors, consultants, and service providers who need access to such information to perform work on our behalf</li>
                <li>In response to a request for information if we believe disclosure is in accordance with any applicable law, regulation, or legal process</li>
                <li>With your consent or at your direction</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-healthBlue-600">5. Your Rights and Choices</h2>
              <p className="text-gray-700">
                You can access, update, or delete your account information at any time by logging into your account settings.
                You can also opt out of receiving promotional communications from us by following the instructions in those messages.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-healthBlue-600">6. Changes to this Privacy Policy</h2>
              <p className="text-gray-700">
                We may change this Privacy Policy from time to time. If we make changes, we will notify you by revising the date at the 
                top of the policy and, in some cases, provide you with additional notice or sending you a notification.
              </p>
            </section>

            <div className="pt-4 text-sm text-gray-500">
              Last updated: April 10, 2025
            </div>
          </div>
        </ScrollArea>
      </div>
    </Layout>
  );
};

export default Privacy;
