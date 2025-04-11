
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Loader2, CheckCircle, CreditCard, IndianRupee } from 'lucide-react';

interface AppointmentPaymentProps {
  appointmentId: string;
  doctorName: string;
  appointmentTime: string;
  amount: number;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const AppointmentPayment: React.FC<AppointmentPaymentProps> = ({
  appointmentId,
  doctorName,
  appointmentTime,
  amount,
  onSuccess,
  onCancel
}) => {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState<string>('upi');
  const [loading, setLoading] = useState(false);
  const [upiId, setUpiId] = useState('');

  const handlePayment = async () => {
    setLoading(true);
    try {
      // Create a payment record in the database
      // We need to handle the payment table manually since it might not be in the types yet
      const { data: paymentData, error: paymentError } = await supabase
        .from('payments')
        .insert({
          appointment_id: appointmentId,
          amount: amount,
          payment_method: paymentMethod,
          status: 'completed' // For demo, we'll mark it as completed immediately
        })
        .select();

      if (paymentError) throw paymentError;

      // Update the appointment payment status
      const { error: updateError } = await supabase
        .from('appointments')
        .update({ 
          payment_status: 'completed',
          payment_amount: amount
        })
        .eq('id', appointmentId);

      if (updateError) throw updateError;

      toast.success('Payment successful!');
      
      // Call the success callback if provided
      if (onSuccess) onSuccess();
    } catch (error: any) {
      console.error('Payment error:', error);
      toast.error(`Payment failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-xl">Complete Payment</CardTitle>
        <CardDescription>
          Pay for your appointment with Dr. {doctorName} on {new Date(appointmentTime).toLocaleString()}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="bg-gray-50 p-4 rounded-md border">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Consultation Fee</p>
              <p className="font-medium">₹{amount}</p>
            </div>
            <div className="bg-healthBlue-100 text-healthBlue-700 px-3 py-1 rounded-full text-xs font-medium">
              To be paid
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <Label className="text-base">Payment Method</Label>
          <RadioGroup defaultValue="upi" onValueChange={setPaymentMethod} className="space-y-3">
            <div className="flex items-center space-x-2 border p-3 rounded-md cursor-pointer hover:bg-gray-50">
              <RadioGroupItem value="upi" id="upi" />
              <Label htmlFor="upi" className="flex-1 cursor-pointer">
                <div className="flex items-center">
                  <IndianRupee className="h-5 w-5 mr-2 text-healthBlue-500" />
                  <span>UPI Payment</span>
                </div>
              </Label>
            </div>
            
            <div className="flex items-center space-x-2 border p-3 rounded-md cursor-pointer hover:bg-gray-50">
              <RadioGroupItem value="card" id="card" />
              <Label htmlFor="card" className="flex-1 cursor-pointer">
                <div className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2 text-healthBlue-500" />
                  <span>Credit/Debit Card</span>
                </div>
              </Label>
            </div>
          </RadioGroup>
          
          {paymentMethod === 'upi' && (
            <div className="space-y-2 pt-2">
              <Label htmlFor="upiId">UPI ID</Label>
              <Input 
                id="upiId" 
                value={upiId} 
                onChange={(e) => setUpiId(e.target.value)} 
                placeholder="yourname@upi"
                className="w-full"
              />
            </div>
          )}
          
          {paymentMethod === 'card' && (
            <div className="space-y-4 pt-2">
              <div>
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input 
                  id="cardNumber" 
                  placeholder="1234 5678 9012 3456"
                  className="w-full"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <Input 
                    id="expiryDate" 
                    placeholder="MM/YY"
                    className="w-full"
                  />
                </div>
                <div>
                  <Label htmlFor="cvv">CVV</Label>
                  <Input 
                    id="cvv" 
                    placeholder="123"
                    className="w-full"
                    type="password"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="nameOnCard">Name on Card</Label>
                <Input 
                  id="nameOnCard" 
                  placeholder="John Doe"
                  className="w-full"
                />
              </div>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button 
          className="bg-healthGreen-600 hover:bg-healthGreen-700"
          onClick={handlePayment}
          disabled={loading || (paymentMethod === 'upi' && !upiId)}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <CheckCircle className="mr-2 h-4 w-4" />
              Pay ₹{amount}
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AppointmentPayment;
