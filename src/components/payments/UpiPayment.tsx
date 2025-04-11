
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { IndianRupee, QrCode, Smartphone } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

// UPI payment form validation schema
const formSchema = z.object({
  amount: z.string().min(1, "Amount is required").refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Amount must be a positive number",
  }),
  upiId: z.string().min(1, "UPI ID is required").regex(/^[\w.-]+@[\w.-]+$/, {
    message: "Please enter a valid UPI ID (e.g. name@bank)",
  }),
  note: z.string().optional(),
});

type UpiPaymentProps = {
  merchantUpiId?: string;
  merchantName?: string;
  defaultAmount?: number;
  onPaymentSuccess?: (transactionId: string) => void;
  onPaymentFailure?: (error: string) => void;
};

const UpiPayment: React.FC<UpiPaymentProps> = ({
  merchantUpiId = "healthstack@upi",
  merchantName = "HealthStack",
  defaultAmount = 0,
  onPaymentSuccess,
  onPaymentFailure,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'form' | 'qrcode' | 'intent'>('form');
  const [generatedQR, setGeneratedQR] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: defaultAmount ? String(defaultAmount) : "",
      upiId: "",
      note: "",
    },
  });

  const generateUpiUrl = (data: z.infer<typeof formSchema>) => {
    // Format according to UPI deep link specification
    const amount = Number(data.amount).toFixed(2);
    const upiParams = new URLSearchParams({
      pa: merchantUpiId, // payee address
      pn: merchantName, // payee name
      am: amount, // amount
      cu: "INR", // currency
      tn: data.note || `Payment to ${merchantName}`, // transaction note
    }).toString();
    
    return `upi://pay?${upiParams}`;
  };

  const generateQRCode = (upiUrl: string) => {
    // In a real application, you would generate an actual QR code image
    // For now, we'll simulate it with a placeholder
    setGeneratedQR(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiUrl)}`);
    return upiUrl;
  };

  const openUpiApp = (upiUrl: string) => {
    // Create an invisible anchor element to open the UPI URL
    const link = document.createElement('a');
    link.href = upiUrl;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // In a real implementation, you would set up a callback mechanism
    // Since we can't get direct callback from UPI apps, we'll simulate a response
    setIsProcessing(true);
    setTimeout(() => {
      // This is just a simulation - in reality, you would need a server-side webhook
      setIsProcessing(false);
      const success = Math.random() > 0.3; // 70% chance of success for demonstration
      
      if (success) {
        const mockTransactionId = `UPI${Date.now()}${Math.floor(Math.random() * 1000)}`;
        onPaymentSuccess?.(mockTransactionId);
        toast({
          title: "Payment Successful",
          description: `Transaction ID: ${mockTransactionId}`,
        });
      } else {
        onPaymentFailure?.("Payment was cancelled or failed");
        toast({
          variant: "destructive",
          title: "Payment Failed",
          description: "The payment was cancelled or failed to process",
        });
      }
      handleCloseDialog();
    }, 3000);
  };

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    const upiUrl = generateUpiUrl(data);
    
    if (paymentStep === 'form') {
      setPaymentStep('qrcode');
      generateQRCode(upiUrl);
    } else if (paymentStep === 'qrcode') {
      setPaymentStep('intent');
      openUpiApp(upiUrl);
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setPaymentStep('form');
    form.reset();
  };

  return (
    <>
      <Button 
        variant="health" 
        onClick={() => setIsDialogOpen(true)}
        className="flex items-center space-x-2"
      >
        <IndianRupee className="h-4 w-4" />
        <span>UPI Payment</span>
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{paymentStep === 'form' 
              ? 'Make UPI Payment' 
              : paymentStep === 'qrcode' 
                ? 'Scan QR Code' 
                : 'Processing Payment'
            }</DialogTitle>
            <DialogDescription>
              {paymentStep === 'form' 
                ? 'Enter payment details to proceed' 
                : paymentStep === 'qrcode' 
                  ? 'Scan with any UPI app or continue to payment' 
                  : 'Please complete the payment in your UPI app'
              }
            </DialogDescription>
          </DialogHeader>

          {paymentStep === 'form' && (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount (₹)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Enter amount" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="upiId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your UPI ID (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="yourname@bank" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="note"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Note (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Payment purpose" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={handleCloseDialog}>
                    Cancel
                  </Button>
                  <Button type="submit">Continue</Button>
                </DialogFooter>
              </form>
            </Form>
          )}

          {paymentStep === 'qrcode' && (
            <div className="flex flex-col items-center space-y-4">
              <div className="border border-gray-200 rounded-md p-2">
                <img 
                  src={generatedQR} 
                  alt="UPI QR Code" 
                  className="h-48 w-48 object-contain"
                />
              </div>
              
              <div className="flex space-x-2 w-full">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={handleCloseDialog}
                >
                  Cancel
                </Button>
                <Button 
                  className="flex-1 flex items-center justify-center gap-2"
                  onClick={form.handleSubmit(onSubmit)}
                >
                  <Smartphone className="h-4 w-4" />
                  Pay with UPI App
                </Button>
              </div>
            </div>
          )}

          {paymentStep === 'intent' && (
            <div className="flex flex-col items-center py-4 space-y-4">
              <div className="animate-pulse">
                <Smartphone className="h-16 w-16 text-healthBlue-500" />
              </div>
              <p className="text-center text-muted-foreground">
                {isProcessing 
                  ? "Processing your payment..." 
                  : "Complete the payment in your UPI app"
                }
              </p>
              
              <DialogFooter className="flex space-x-2 w-full">
                <Button 
                  variant="outline" 
                  onClick={handleCloseDialog}
                  disabled={isProcessing}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UpiPayment;
