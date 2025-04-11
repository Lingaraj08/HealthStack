
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import {
  FileCheck,
  Shield,
  Fingerprint,
  Smartphone,
  IndianRupee,
  QrCode,
  Check,
  X,
  Loader2,
} from 'lucide-react';
import UpiPayment from '../payments/UpiPayment';
import { Input } from '@/components/ui/input';
import { ENV } from '@/lib/env';

// Mock test data
const mockHealthID = '12-3456-7890-1234';
const mockAadhaarNumber = '123456789012';
const mockUpiId = '8431632044-2@ybl';
const mockDocuments = [
  { id: 'doc1', name: 'COVID-19 Vaccination Certificate', status: 'verified' },
  { id: 'doc2', name: 'Aadhaar Card', status: 'verified' },
  { id: 'doc3', name: 'PAN Card', status: 'pending' },
];

const IndiaStackTesting: React.FC = () => {
  const [loading, setLoading] = useState({
    abha: false,
    digilocker: false,
    esign: false,
  });
  const [testResults, setTestResults] = useState({
    abhaConnected: false,
    digilockerConnected: false,
    documentsRetrieved: false,
    documentsSigned: false,
  });
  const [aadhaarInput, setAadhaarInput] = useState('');
  const [mobileInput, setMobileInput] = useState('');

  // Mock ABHA Health ID connection
  const testAbhaConnection = () => {
    setLoading(prev => ({ ...prev, abha: true }));
    
    // Simulate API call delay
    setTimeout(() => {
      setLoading(prev => ({ ...prev, abha: false }));
      setTestResults(prev => ({ ...prev, abhaConnected: true }));
      
      toast({
        title: "ABHA Health ID Connected",
        description: `Successfully connected Health ID: ${mockHealthID}`,
      });
    }, 2000);
  };

  // Mock DigiLocker connection
  const testDigilockerConnection = () => {
    if (!testResults.abhaConnected) {
      toast({
        variant: "destructive",
        title: "Connection Failed",
        description: "Please connect your ABHA Health ID first",
      });
      return;
    }
    
    setLoading(prev => ({ ...prev, digilocker: true }));
    
    // Simulate API call delay
    setTimeout(() => {
      setLoading(prev => ({ ...prev, digilocker: false }));
      setTestResults(prev => ({ 
        ...prev, 
        digilockerConnected: true,
        documentsRetrieved: true 
      }));
      
      toast({
        title: "DigiLocker Connected",
        description: "Successfully retrieved documents from DigiLocker",
      });
    }, 2000);
  };

  // Mock eSign document
  const testEsignDocument = () => {
    if (!testResults.documentsRetrieved) {
      toast({
        variant: "destructive",
        title: "eSign Failed",
        description: "Please retrieve your documents first",
      });
      return;
    }
    
    setLoading(prev => ({ ...prev, esign: true }));
    
    // Simulate API call delay
    setTimeout(() => {
      setLoading(prev => ({ ...prev, esign: false }));
      setTestResults(prev => ({ ...prev, documentsSigned: true }));
      
      toast({
        title: "Document Signed",
        description: "Successfully signed the medical consent form",
      });
    }, 2000);
  };

  // Mock ABHA creation with Aadhaar
  const testAbhaCreation = () => {
    if (!aadhaarInput || aadhaarInput.length !== 12 || !mobileInput || mobileInput.length !== 10) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please enter valid 12-digit Aadhaar number and 10-digit mobile",
      });
      return;
    }
    
    setLoading(prev => ({ ...prev, abha: true }));
    
    // Simulate API call delay
    setTimeout(() => {
      setLoading(prev => ({ ...prev, abha: false }));
      setTestResults(prev => ({ ...prev, abhaConnected: true }));
      
      toast({
        title: "ABHA Health ID Created",
        description: `Successfully created Health ID: ${mockHealthID}`,
      });
    }, 2000);
  };

  // Handle UPI payment success
  const handlePaymentSuccess = (transactionId: string) => {
    toast({
      title: "Test Payment Successful",
      description: `Transaction ID: ${transactionId}`,
    });
  };

  // Handle UPI payment failure
  const handlePaymentFailure = (error: string) => {
    toast({
      variant: "destructive",
      title: "Test Payment Failed",
      description: error,
    });
  };

  return (
    <div className="py-10">
      <div className="health-container">
        <div className="text-center mb-12">
          <h2 className="health-heading mb-3">India Stack Integration Testing</h2>
          <p className="health-subheading text-gray-600 dark:text-gray-300">
            Test the functionality of various India Stack components
          </p>
        </div>

        <Tabs defaultValue="abha" className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-8">
            <TabsTrigger value="abha">ABHA Health ID</TabsTrigger>
            <TabsTrigger value="payments">UPI Payments</TabsTrigger>
            <TabsTrigger value="digilocker">DigiLocker</TabsTrigger>
            <TabsTrigger value="esign">eSign</TabsTrigger>
            <TabsTrigger value="status">Test Status</TabsTrigger>
          </TabsList>
          
          {/* ABHA Health ID Tab */}
          <TabsContent value="abha">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="bg-healthBlue-100 p-2 rounded-full">
                      <Fingerprint className="h-5 w-5 text-healthBlue-600" />
                    </div>
                    <h3 className="text-xl font-medium">Connect Existing Health ID</h3>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Connect your existing Ayushman Bharat Health Account (ABHA) ID for testing
                  </p>
                  
                  {testResults.abhaConnected ? (
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg mb-4">
                      <div className="flex items-center space-x-2">
                        <Check className="h-5 w-5 text-green-600" />
                        <p className="font-medium text-green-700">Health ID Connected: {mockHealthID}</p>
                      </div>
                    </div>
                  ) : (
                    <Button 
                      onClick={testAbhaConnection} 
                      disabled={loading.abha} 
                      className="w-full"
                    >
                      {loading.abha && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Test Connect Health ID
                    </Button>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="bg-healthGreen-100 p-2 rounded-full">
                      <Smartphone className="h-5 w-5 text-healthGreen-600" />
                    </div>
                    <h3 className="text-xl font-medium">Create New Health ID</h3>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Create a new ABHA Health ID using Aadhaar number for testing
                  </p>
                  
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="aadhaar" className="text-sm font-medium mb-1 block">Aadhaar Number (Test)</label>
                      <Input 
                        id="aadhaar"
                        type="text" 
                        placeholder="12 digit Aadhaar" 
                        value={aadhaarInput}
                        onChange={(e) => setAadhaarInput(e.target.value.replace(/\D/g, '').slice(0, 12))}
                        maxLength={12}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="mobile" className="text-sm font-medium mb-1 block">Mobile Number</label>
                      <Input 
                        id="mobile"
                        type="text" 
                        placeholder="10 digit mobile" 
                        value={mobileInput}
                        onChange={(e) => setMobileInput(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        maxLength={10}
                      />
                    </div>
                    
                    <Button 
                      onClick={testAbhaCreation} 
                      disabled={loading.abha || testResults.abhaConnected}
                      className="w-full"
                    >
                      {loading.abha && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Test Create Health ID
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* UPI Payments Tab */}
          <TabsContent value="payments">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="bg-healthBlue-100 p-2 rounded-full">
                      <IndianRupee className="h-5 w-5 text-healthBlue-600" />
                    </div>
                    <h3 className="text-xl font-medium">UPI Payment Test</h3>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Test UPI payment flow to merchant ID: {mockUpiId}
                  </p>
                  
                  <div className="space-y-4">
                    <UpiPayment 
                      merchantUpiId={mockUpiId}
                      merchantName="HealthStack Testing"
                      defaultAmount={1}
                      onPaymentSuccess={handlePaymentSuccess}
                      onPaymentFailure={handlePaymentFailure}
                    />
                    <p className="text-sm text-gray-500">
                      This will simulate a payment flow with QR code and app intent.
                      No actual money will be transferred in test mode.
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="bg-healthGreen-100 p-2 rounded-full">
                      <QrCode className="h-5 w-5 text-healthGreen-600" />
                    </div>
                    <h3 className="text-xl font-medium">BharatQR Test</h3>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Test BharatQR payment flow for healthcare services
                  </p>
                  
                  <div className="space-y-4">
                    <Button 
                      variant="healthSecondary"
                      className="w-full"
                      onClick={() => {
                        toast({
                          title: "Test BharatQR Generated",
                          description: "QR code was generated successfully. Scan with any UPI app to test.",
                        });
                      }}
                    >
                      <QrCode className="mr-2 h-4 w-4" />
                      Generate Test BharatQR
                    </Button>
                    <p className="text-sm text-gray-500">
                      This will simulate generating a BharatQR code for payment.
                      No actual transactions will occur in test mode.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* DigiLocker Tab */}
          <TabsContent value="digilocker">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="bg-healthBlue-100 p-2 rounded-full">
                      <FileCheck className="h-5 w-5 text-healthBlue-600" />
                    </div>
                    <h3 className="text-xl font-medium">DigiLocker Connection</h3>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Test connecting to DigiLocker to retrieve documents
                  </p>
                  
                  <div className="space-y-4">
                    {testResults.digilockerConnected ? (
                      <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <Check className="h-5 w-5 text-green-600" />
                          <p className="font-medium text-green-700">DigiLocker Connected</p>
                        </div>
                        <p className="text-sm text-gray-600">Retrieved 3 documents successfully</p>
                      </div>
                    ) : (
                      <Button 
                        onClick={testDigilockerConnection}
                        disabled={loading.digilocker || !testResults.abhaConnected}
                        className="w-full"
                      >
                        {loading.digilocker && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Test DigiLocker Connection
                      </Button>
                    )}
                    
                    {!testResults.abhaConnected && (
                      <p className="text-sm text-amber-600">
                        Please connect your Health ID first before testing DigiLocker
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="bg-healthGreen-100 p-2 rounded-full">
                      <FileCheck className="h-5 w-5 text-healthGreen-600" />
                    </div>
                    <h3 className="text-xl font-medium">Retrieved Documents</h3>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Documents retrieved from DigiLocker
                  </p>
                  
                  {testResults.documentsRetrieved ? (
                    <div className="space-y-2">
                      {mockDocuments.map(doc => (
                        <div 
                          key={doc.id}
                          className="p-3 border rounded-md flex items-center justify-between"
                        >
                          <div className="flex items-center space-x-3">
                            <FileCheck className="h-5 w-5 text-healthBlue-600" />
                            <span>{doc.name}</span>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded ${
                            doc.status === 'verified' 
                              ? 'bg-green-50 text-green-700' 
                              : 'bg-amber-50 text-amber-700'
                          }`}>
                            {doc.status === 'verified' ? 'Verified' : 'Pending'}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-center">
                      <p className="text-gray-500">
                        No documents retrieved yet
                      </p>
                      <p className="text-sm text-gray-400 mt-1">
                        Connect DigiLocker to view documents
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* eSign Tab */}
          <TabsContent value="esign">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="bg-healthBlue-100 p-2 rounded-full">
                      <Shield className="h-5 w-5 text-healthBlue-600" />
                    </div>
                    <h3 className="text-xl font-medium">eSign Document</h3>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Test eSign functionality for medical consent form
                  </p>
                  
                  <div className="space-y-4">
                    {testResults.documentsSigned ? (
                      <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Check className="h-5 w-5 text-green-600" />
                          <p className="font-medium text-green-700">Document Successfully Signed</p>
                        </div>
                      </div>
                    ) : (
                      <Button 
                        onClick={testEsignDocument}
                        disabled={loading.esign || !testResults.documentsRetrieved}
                        className="w-full"
                      >
                        {loading.esign && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Test eSign Document
                      </Button>
                    )}
                    
                    {!testResults.documentsRetrieved && (
                      <p className="text-sm text-amber-600">
                        Please retrieve documents first before testing eSign
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="bg-healthGreen-100 p-2 rounded-full">
                      <Shield className="h-5 w-5 text-healthGreen-600" />
                    </div>
                    <h3 className="text-xl font-medium">eSign Status</h3>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    View the status of your eSign test
                  </p>
                  
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full">
                      <tbody>
                        <tr className="border-b">
                          <td className="p-3 text-gray-700">Document</td>
                          <td className="p-3 font-medium">Medical Consent Form</td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-3 text-gray-700">Status</td>
                          <td className="p-3">
                            {testResults.documentsSigned ? (
                              <span className="text-green-600 font-medium flex items-center">
                                <Check className="h-4 w-4 mr-1" /> Signed
                              </span>
                            ) : (
                              <span className="text-gray-500 font-medium flex items-center">
                                <X className="h-4 w-4 mr-1" /> Not Signed
                              </span>
                            )}
                          </td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-3 text-gray-700">Signature Type</td>
                          <td className="p-3">Aadhaar eSign</td>
                        </tr>
                        <tr>
                          <td className="p-3 text-gray-700">Timestamp</td>
                          <td className="p-3">
                            {testResults.documentsSigned ? new Date().toLocaleString() : '-'}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Test Status Tab */}
          <TabsContent value="status">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-xl font-medium mb-4">India Stack Test Status</h3>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">ABHA Health ID</h4>
                      <div className="flex items-center space-x-2">
                        {testResults.abhaConnected ? (
                          <>
                            <div className="h-4 w-4 bg-green-500 rounded-full"></div>
                            <span className="text-green-700">Connected</span>
                          </>
                        ) : (
                          <>
                            <div className="h-4 w-4 bg-gray-300 rounded-full"></div>
                            <span className="text-gray-500">Not Connected</span>
                          </>
                        )}
                      </div>
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">DigiLocker</h4>
                      <div className="flex items-center space-x-2">
                        {testResults.digilockerConnected ? (
                          <>
                            <div className="h-4 w-4 bg-green-500 rounded-full"></div>
                            <span className="text-green-700">Connected</span>
                          </>
                        ) : (
                          <>
                            <div className="h-4 w-4 bg-gray-300 rounded-full"></div>
                            <span className="text-gray-500">Not Connected</span>
                          </>
                        )}
                      </div>
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Documents Retrieved</h4>
                      <div className="flex items-center space-x-2">
                        {testResults.documentsRetrieved ? (
                          <>
                            <div className="h-4 w-4 bg-green-500 rounded-full"></div>
                            <span className="text-green-700">Retrieved (3 documents)</span>
                          </>
                        ) : (
                          <>
                            <div className="h-4 w-4 bg-gray-300 rounded-full"></div>
                            <span className="text-gray-500">Not Retrieved</span>
                          </>
                        )}
                      </div>
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">eSign Status</h4>
                      <div className="flex items-center space-x-2">
                        {testResults.documentsSigned ? (
                          <>
                            <div className="h-4 w-4 bg-green-500 rounded-full"></div>
                            <span className="text-green-700">Document Signed</span>
                          </>
                        ) : (
                          <>
                            <div className="h-4 w-4 bg-gray-300 rounded-full"></div>
                            <span className="text-gray-500">Not Signed</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4 mt-4">
                    <p className="text-gray-600 text-sm mb-4">
                      This is a test environment. In a production application, these components would 
                      connect to the actual India Stack APIs with appropriate credentials.
                    </p>
                    
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        // Reset all test states
                        setTestResults({
                          abhaConnected: false,
                          digilockerConnected: false,
                          documentsRetrieved: false,
                          documentsSigned: false,
                        });
                        setLoading({
                          abha: false,
                          digilocker: false,
                          esign: false,
                        });
                        setAadhaarInput('');
                        setMobileInput('');
                        
                        toast({
                          title: "Tests Reset",
                          description: "All test statuses have been reset",
                        });
                      }}
                    >
                      Reset All Tests
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default IndiaStackTesting;
