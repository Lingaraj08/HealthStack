
import React from 'react';
import Layout from '@/components/layout/Layout';
import { ScrollArea } from '@/components/ui/scroll-area';

const Terms: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Terms of Service</h1>
        
        <ScrollArea className="h-[70vh] rounded-md border p-6 bg-white">
          <div className="space-y-6 pr-4">
            <section>
              <h2 className="text-xl font-semibold mb-3 text-healthBlue-600">1. Acceptance of Terms</h2>
              <p className="text-gray-700">
                By accessing or using HealthStack services, you agree to be bound by these Terms of Service and all applicable laws and regulations. 
                If you do not agree with any of these terms, you are prohibited from using or accessing this site.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-healthBlue-600">2. Use License</h2>
              <p className="text-gray-700">
                Permission is granted to temporarily use HealthStack services for personal, non-commercial purposes only. 
                This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc pl-6 mt-2 text-gray-700 space-y-1">
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose</li>
                <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
                <li>Attempt to decompile or reverse engineer any software contained on HealthStack</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-healthBlue-600">3. Medical Disclaimer</h2>
              <p className="text-gray-700">
                HealthStack provides general information and services related to health and wellness. The information and services 
                provided are not intended to replace medical advice, diagnosis, or treatment from a qualified healthcare provider.
                Always consult with your healthcare provider before making decisions about your health or starting any treatments.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-healthBlue-600">4. User Accounts</h2>
              <p className="text-gray-700">
                When you create an account with us, you must provide information that is accurate, complete, and current at all times.
                Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our service.
              </p>
              <p className="text-gray-700 mt-2">
                You are responsible for safeguarding the password that you use to access the service and for any activities or actions under your password.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-healthBlue-600">5. Limitations</h2>
              <p className="text-gray-700">
                In no event shall HealthStack or its suppliers be liable for any damages arising out of the use or inability to use 
                HealthStack services, even if HealthStack has been notified of the possibility of such damage.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-healthBlue-600">6. Governing Law</h2>
              <p className="text-gray-700">
                These terms and conditions are governed by and construed in accordance with the laws of India and you irrevocably submit 
                to the exclusive jurisdiction of the courts in that location.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-healthBlue-600">7. Changes to Terms</h2>
              <p className="text-gray-700">
                HealthStack reserves the right to modify these terms at any time. We will notify users of any changes by updating 
                the date at the bottom of this page. It is your responsibility to check our Terms of Service periodically for changes.
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

export default Terms;
