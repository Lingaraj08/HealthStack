import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  IndianRupee,
  Clock,
  CheckCircle2,
  XCircle,
  Download,
  CreditCard,
  Plus,
  Smartphone,
  AlertCircle,
  Calendar,
  Filter,
} from 'lucide-react';

interface Payment {
  id: string;
  date: string;
  description: string;
  category: 'consultation' | 'lab_test' | 'pharmacy' | 'procedure';
  amount: number;
  status: 'paid' | 'pending' | 'failed';
  method: string;
  doctor?: string;
}

interface PaymentMethod {
  id: string;
  type: 'upi' | 'card';
  label: string;
  detail: string;
  isDefault: boolean;
}

const mockPayments: Payment[] = [
  { id: 'PAY-001', date: '2025-01-15', description: 'General Consultation', category: 'consultation', amount: 800, status: 'paid', method: 'UPI - PhonePe', doctor: 'Dr. Priya Sharma' },
  { id: 'PAY-002', date: '2025-01-12', description: 'Complete Blood Count (CBC)', category: 'lab_test', amount: 450, status: 'paid', method: 'Credit Card ****4521', doctor: 'HealthStack Labs' },
  { id: 'PAY-003', date: '2025-01-10', description: 'Cardiology Consultation', category: 'consultation', amount: 1500, status: 'paid', method: 'UPI - GPay', doctor: 'Dr. Rajesh Kumar' },
  { id: 'PAY-004', date: '2025-01-08', description: 'Thyroid Profile', category: 'lab_test', amount: 1200, status: 'failed', method: 'Debit Card ****8832', doctor: 'HealthStack Labs' },
  { id: 'PAY-005', date: '2025-01-20', description: 'Dermatology Consultation', category: 'consultation', amount: 1000, status: 'pending', method: 'UPI - PhonePe', doctor: 'Dr. Anita Desai' },
  { id: 'PAY-006', date: '2025-01-22', description: 'Lipid Profile Test', category: 'lab_test', amount: 900, status: 'pending', method: 'Credit Card ****4521', doctor: 'HealthStack Labs' },
  { id: 'PAY-007', date: '2025-01-05', description: 'Orthopaedic Consultation', category: 'consultation', amount: 1200, status: 'paid', method: 'UPI - GPay', doctor: 'Dr. Vikram Patel' },
  { id: 'PAY-008', date: '2025-01-03', description: 'Vitamin D & B12 Panel', category: 'lab_test', amount: 2200, status: 'paid', method: 'Credit Card ****4521', doctor: 'HealthStack Labs' },
  { id: 'PAY-009', date: '2025-01-25', description: 'ENT Consultation', category: 'consultation', amount: 700, status: 'pending', method: 'UPI - PhonePe', doctor: 'Dr. Meena Iyer' },
  { id: 'PAY-010', date: '2024-12-28', description: 'HbA1c Test', category: 'lab_test', amount: 550, status: 'paid', method: 'Debit Card ****8832', doctor: 'HealthStack Labs' },
];

const mockPaymentMethods: PaymentMethod[] = [
  { id: 'PM-1', type: 'upi', label: 'PhonePe UPI', detail: 'user@ybl', isDefault: true },
  { id: 'PM-2', type: 'upi', label: 'Google Pay UPI', detail: 'user@okaxis', isDefault: false },
  { id: 'PM-3', type: 'card', label: 'HDFC Credit Card', detail: '****4521', isDefault: false },
  { id: 'PM-4', type: 'card', label: 'SBI Debit Card', detail: '****8832', isDefault: false },
];

const statusConfig = {
  paid: { label: 'Paid', variant: 'default' as const, icon: CheckCircle2, className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' },
  pending: { label: 'Pending', variant: 'secondary' as const, icon: Clock, className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' },
  failed: { label: 'Failed', variant: 'destructive' as const, icon: XCircle, className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' },
};

const Payments = () => {
  const [payments, setPayments] = useState<Payment[]>(mockPayments);
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'pending' | 'failed'>('all');

  const totalSpent = payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);
  const pendingAmount = payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);
  const pendingPayments = payments.filter(p => p.status === 'pending');
  const lastPaidPayment = payments.filter(p => p.status === 'paid').sort((a, b) => b.date.localeCompare(a.date))[0];

  const filteredPayments = statusFilter === 'all' ? payments : payments.filter(p => p.status === statusFilter);

  const formatCurrency = (amount: number) => `₹${amount.toLocaleString('en-IN')}`;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const handleDownloadReceipt = (paymentId: string) => {
    toast.success('Receipt downloaded', { description: `Receipt for ${paymentId} has been downloaded.` });
  };

  const handlePayNow = (payment: Payment) => {
    setPayments(prev => prev.map(p => p.id === payment.id ? { ...p, status: 'paid' as const } : p));
    toast.success('Payment successful', { description: `${formatCurrency(payment.amount)} paid for ${payment.description}.` });
  };

  const handleAddMethod = () => {
    toast.info('Add Payment Method', { description: 'Payment method integration coming soon.' });
  };

  return (
    <Layout>
      <div className="container max-w-6xl py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Payments</h1>
          <p className="text-muted-foreground">Manage your billing, payments and payment methods</p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Spent</CardTitle>
              <IndianRupee className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalSpent)}</div>
              <p className="text-xs text-muted-foreground mt-1">Lifetime payments</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(pendingAmount)}</div>
              <p className="text-xs text-muted-foreground mt-1">{pendingPayments.length} pending payment{pendingPayments.length !== 1 ? 's' : ''}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Last Payment</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{lastPaidPayment ? formatCurrency(lastPaidPayment.amount) : '—'}</div>
              <p className="text-xs text-muted-foreground mt-1">{lastPaidPayment ? formatDate(lastPaidPayment.date) : 'No payments yet'}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Payment Methods</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockPaymentMethods.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Saved methods</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="history">
          <TabsList className="mb-4">
            <TabsTrigger value="history">Billing History</TabsTrigger>
            <TabsTrigger value="pending">
              Pending
              {pendingPayments.length > 0 && (
                <Badge variant="destructive" className="ml-2 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center">
                  {pendingPayments.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="methods">Payment Methods</TabsTrigger>
          </TabsList>

          {/* Billing History */}
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <CardTitle>Billing History</CardTitle>
                    <CardDescription>View and download receipts for past transactions</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
                      className="flex h-9 rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="all">All Status</option>
                      <option value="paid">Paid</option>
                      <option value="pending">Pending</option>
                      <option value="failed">Failed</option>
                    </select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {filteredPayments.length === 0 ? (
                    <div className="text-center py-8">
                      <AlertCircle className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                      <p className="text-muted-foreground">No payments found for the selected filter.</p>
                    </div>
                  ) : (
                    filteredPayments
                      .sort((a, b) => b.date.localeCompare(a.date))
                      .map((payment) => {
                        const status = statusConfig[payment.status];
                        const StatusIcon = status.icon;
                        return (
                          <div
                            key={payment.id}
                            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-lg border"
                          >
                            <div className="flex items-start gap-3">
                              <div className="h-10 w-10 rounded-full bg-healthBlue-100 dark:bg-healthBlue-900 flex items-center justify-center flex-shrink-0">
                                <IndianRupee className="h-5 w-5 text-healthBlue-600 dark:text-healthBlue-400" />
                              </div>
                              <div>
                                <p className="font-medium">{payment.description}</p>
                                <p className="text-sm text-muted-foreground">{payment.doctor}</p>
                                <div className="flex flex-wrap items-center gap-2 mt-1">
                                  <span className="text-xs text-muted-foreground">{formatDate(payment.date)}</span>
                                  <span className="text-xs text-muted-foreground">•</span>
                                  <span className="text-xs text-muted-foreground">{payment.method}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 sm:flex-shrink-0">
                              <Badge className={status.className}>
                                <StatusIcon className="h-3 w-3 mr-1" />
                                {status.label}
                              </Badge>
                              <span className="font-semibold whitespace-nowrap">{formatCurrency(payment.amount)}</span>
                              {payment.status === 'paid' && (
                                <Button variant="ghost" size="sm" onClick={() => handleDownloadReceipt(payment.id)}>
                                  <Download className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </div>
                        );
                      })
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pending Payments */}
          <TabsContent value="pending">
            <Card>
              <CardHeader>
                <CardTitle>Pending Payments</CardTitle>
                <CardDescription>Complete your outstanding payments</CardDescription>
              </CardHeader>
              <CardContent>
                {pendingPayments.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle2 className="h-10 w-10 text-green-500 mx-auto mb-3" />
                    <p className="font-medium">All caught up!</p>
                    <p className="text-sm text-muted-foreground">You have no pending payments.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingPayments.map((payment) => (
                      <div
                        key={payment.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg border border-yellow-200 bg-yellow-50 dark:border-yellow-900 dark:bg-yellow-950"
                      >
                        <div>
                          <p className="font-medium">{payment.description}</p>
                          <p className="text-sm text-muted-foreground">{payment.doctor}</p>
                          <p className="text-xs text-muted-foreground mt-1">Due: {formatDate(payment.date)} • {payment.method}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-lg font-bold">{formatCurrency(payment.amount)}</span>
                          <Button onClick={() => handlePayNow(payment)} className="bg-healthBlue-600 hover:bg-healthBlue-700">
                            Pay Now
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payment Methods */}
          <TabsContent value="methods">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <CardTitle>Payment Methods</CardTitle>
                    <CardDescription>Manage your saved payment methods</CardDescription>
                  </div>
                  <Button onClick={handleAddMethod}>
                    <Plus className="mr-2 h-4 w-4" /> Add Method
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mockPaymentMethods.map((method) => (
                    <div
                      key={method.id}
                      className="flex items-center gap-4 p-4 rounded-lg border"
                    >
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                        {method.type === 'upi' ? (
                          <Smartphone className="h-5 w-5 text-muted-foreground" />
                        ) : (
                          <CreditCard className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium truncate">{method.label}</p>
                          {method.isDefault && (
                            <Badge variant="secondary" className="text-xs">Default</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{method.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Payments;
