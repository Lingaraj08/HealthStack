
import React from 'react';
import { Card } from '@/components/ui/card';
import UpiPayment from './UpiPayment';
import { QrCode, IndianRupee, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

const PaymentsSection: React.FC = () => {
  const handlePaymentSuccess = (transactionId: string) => {
    toast({
      title: "Payment Successful",
      description: `Transaction ID: ${transactionId}`,
    });
  };

  const handlePaymentFailure = (error: string) => {
    toast({
      variant: "destructive",
      title: "Payment Failed",
      description: error,
    });
  };

  return (
    <div className="health-container py-12">
      <h2 className="health-heading mb-6">Digital Payments</h2>
      <p className="text-gray-600 dark:text-gray-300 mb-8">
        Securely pay for consultations, services, and medications using India's digital payment ecosystem.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6 flex flex-col space-y-4">
          <div className="bg-healthBlue-50 dark:bg-healthBlue-900/20 p-4 rounded-full w-12 h-12 flex items-center justify-center">
            <IndianRupee className="h-6 w-6 text-healthBlue-500" />
          </div>
          <h3 className="text-xl font-semibold">UPI Payments</h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm flex-1">
            Pay instantly using any UPI app like Google Pay, PhonePe, or BHIM.
          </p>
          <div className="space-y-2">
            <UpiPayment 
              merchantUpiId="8431632044-2@ybl" 
              merchantName="HealthStack"
              onPaymentSuccess={handlePaymentSuccess}
              onPaymentFailure={handlePaymentFailure}
            />
          </div>
        </Card>
        
        <Card className="p-6 flex flex-col space-y-4">
          <div className="bg-healthGreen-50 dark:bg-healthGreen-900/20 p-4 rounded-full w-12 h-12 flex items-center justify-center">
            <QrCode className="h-6 w-6 text-healthGreen-500" />
          </div>
          <h3 className="text-xl font-semibold">BharatQR</h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm flex-1">
            Scan and pay using BharatQR with any compatible banking app.
          </p>
          <Button variant="healthSecondary" className="flex items-center gap-2" onClick={() => {
            toast({
              title: "Feature Coming Soon",
              description: "BharatQR integration will be available shortly.",
            });
          }}>
            <QrCode className="h-4 w-4" />
            <span>Scan BharatQR</span>
          </Button>
        </Card>
        
        <Card className="p-6 flex flex-col space-y-4">
          <div className="bg-healthOrange-50 dark:bg-healthOrange-900/20 p-4 rounded-full w-12 h-12 flex items-center justify-center">
            <CreditCard className="h-6 w-6 text-healthOrange-500" />
          </div>
          <h3 className="text-xl font-semibold">Bharat Bill Payment</h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm flex-1">
            Pay medical bills securely through the Bharat Bill Payment System.
          </p>
          <Button variant="healthAccent" className="flex items-center gap-2" onClick={() => {
            toast({
              title: "Feature Coming Soon",
              description: "BBPS integration will be available shortly.",
            });
          }}>
            <CreditCard className="h-4 w-4" />
            <span>Pay Bills</span>
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default PaymentsSection;
