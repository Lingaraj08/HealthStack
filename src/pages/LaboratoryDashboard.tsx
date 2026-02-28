
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/auth/AuthContext';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import {
  FlaskConical,
  TestTubes,
  ClipboardList,
  IndianRupee,
  FileText,
  Upload,
  Bell,
  Plus,
  CheckCircle2,
  Clock,
  Package,
  TrendingUp,
  Users,
  ArrowRight,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

// --- Mock Data ---

const weeklyTestVolume = [
  { day: 'Mon', tests: 42 },
  { day: 'Tue', tests: 58 },
  { day: 'Wed', tests: 51 },
  { day: 'Thu', tests: 64 },
  { day: 'Fri', tests: 73 },
  { day: 'Sat', tests: 38 },
  { day: 'Sun', tests: 25 },
];

const monthlyRevenue = [
  { month: 'Jan', revenue: 185000 },
  { month: 'Feb', revenue: 210000 },
  { month: 'Mar', revenue: 195000 },
  { month: 'Apr', revenue: 230000 },
  { month: 'May', revenue: 248000 },
  { month: 'Jun', revenue: 262000 },
];

interface TestPackage {
  id: string;
  name: string;
  price: number;
  category: string;
  testsIncluded: number;
}

const initialTestPackages: TestPackage[] = [
  { id: '1', name: 'Complete Blood Count (CBC)', price: 450, category: 'Hematology', testsIncluded: 12 },
  { id: '2', name: 'Lipid Profile', price: 800, category: 'Biochemistry', testsIncluded: 5 },
  { id: '3', name: 'Thyroid Panel (T3, T4, TSH)', price: 1200, category: 'Endocrinology', testsIncluded: 3 },
  { id: '4', name: 'Liver Function Test (LFT)', price: 900, category: 'Biochemistry', testsIncluded: 8 },
  { id: '5', name: 'Kidney Function Test (KFT)', price: 750, category: 'Biochemistry', testsIncluded: 6 },
  { id: '6', name: 'HbA1c (Glycated Hemoglobin)', price: 600, category: 'Diabetology', testsIncluded: 1 },
  { id: '7', name: 'Vitamin D & B12 Panel', price: 1500, category: 'Nutrition', testsIncluded: 2 },
  { id: '8', name: 'Full Body Health Checkup', price: 2999, category: 'Preventive', testsIncluded: 65 },
];

type BookingStatus = 'Pending' | 'Collected' | 'Processing' | 'Completed';

interface Booking {
  id: string;
  patientName: string;
  testName: string;
  date: string;
  status: BookingStatus;
  sampleId: string;
}

const initialBookings: Booking[] = [
  { id: 'B001', patientName: 'Rajesh Kumar', testName: 'Complete Blood Count', date: '2025-01-15', status: 'Pending', sampleId: 'S-10231' },
  { id: 'B002', patientName: 'Priya Sharma', testName: 'Thyroid Panel', date: '2025-01-15', status: 'Collected', sampleId: 'S-10232' },
  { id: 'B003', patientName: 'Amit Patel', testName: 'Lipid Profile', date: '2025-01-15', status: 'Processing', sampleId: 'S-10233' },
  { id: 'B004', patientName: 'Sunita Devi', testName: 'Liver Function Test', date: '2025-01-14', status: 'Completed', sampleId: 'S-10234' },
  { id: 'B005', patientName: 'Vikram Singh', testName: 'HbA1c', date: '2025-01-15', status: 'Pending', sampleId: 'S-10235' },
  { id: 'B006', patientName: 'Neha Gupta', testName: 'Vitamin D & B12 Panel', date: '2025-01-14', status: 'Collected', sampleId: 'S-10236' },
  { id: 'B007', patientName: 'Arun Mehta', testName: 'Full Body Checkup', date: '2025-01-14', status: 'Processing', sampleId: 'S-10237' },
  { id: 'B008', patientName: 'Kavita Joshi', testName: 'Kidney Function Test', date: '2025-01-13', status: 'Completed', sampleId: 'S-10238' },
];

interface Report {
  id: string;
  patientName: string;
  testName: string;
  completedDate: string;
  doctorName: string;
  notified: boolean;
}

const initialReports: Report[] = [
  { id: 'R001', patientName: 'Sunita Devi', testName: 'Liver Function Test', completedDate: '2025-01-14', doctorName: 'Dr. Anand Rao', notified: false },
  { id: 'R002', patientName: 'Kavita Joshi', testName: 'Kidney Function Test', completedDate: '2025-01-13', doctorName: 'Dr. Meena Iyer', notified: true },
  { id: 'R003', patientName: 'Ravi Shankar', testName: 'Complete Blood Count', completedDate: '2025-01-12', doctorName: 'Dr. Anand Rao', notified: true },
];

const statusFlow: Record<BookingStatus, BookingStatus | null> = {
  Pending: 'Collected',
  Collected: 'Processing',
  Processing: 'Completed',
  Completed: null,
};

const statusColors: Record<BookingStatus, string> = {
  Pending: 'bg-amber-100 text-amber-800 border-amber-300',
  Collected: 'bg-blue-100 text-blue-800 border-blue-300',
  Processing: 'bg-purple-100 text-purple-800 border-purple-300',
  Completed: 'bg-green-100 text-green-800 border-green-300',
};

const statusBorderColors: Record<BookingStatus, string> = {
  Pending: '#f59e0b',
  Collected: '#3b82f6',
  Processing: '#a855f7',
  Completed: '#22c55e',
};

const chartConfig = {
  tests: { label: 'Tests', color: '#3b82f6' },
  revenue: { label: 'Revenue', color: '#10b981' },
};

// --- Component ---

const LaboratoryDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [reports, setReports] = useState<Report[]>(initialReports);
  const [testPackages] = useState<TestPackage[]>(initialTestPackages);

  // Report upload form state
  const [uploadPatient, setUploadPatient] = useState('');
  const [uploadTest, setUploadTest] = useState('');

  const MOCK_TODAY = '2025-01-15';
  const todayBookings = bookings.filter((b) => b.date === MOCK_TODAY);
  const pendingReports = bookings.filter((b) => b.status !== 'Completed').length;
  const completedToday = todayBookings.filter((b) => b.status === 'Completed').length;

  const advanceStatus = (bookingId: string) => {
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id !== bookingId) return b;
        const next = statusFlow[b.status];
        if (!next) return b;
        toast.success(`Sample ${b.sampleId} moved to "${next}"`);
        return { ...b, status: next };
      })
    );
  };

  const notifyPatientDoctor = (reportId: string) => {
    setReports((prev) =>
      prev.map((r) => {
        if (r.id !== reportId) return r;
        return { ...r, notified: true };
      })
    );
    toast.success('Notification sent to patient and doctor');
  };

  const handleUploadReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadPatient || !uploadTest) {
      toast.error('Please fill in all fields');
      return;
    }
    const newReport: Report = {
      id: `R${Date.now()}`,
      patientName: uploadPatient,
      testName: uploadTest,
      completedDate: MOCK_TODAY,
      doctorName: 'Dr. Anand Rao',
      notified: false,
    };
    setReports((prev) => [newReport, ...prev]);
    setUploadPatient('');
    setUploadTest('');
    toast.success('Report uploaded successfully');
  };

  if (!user) {
    return (
      <Layout>
        <div className="container py-12">
          <Card>
            <CardHeader>
              <CardTitle>Authentication Required</CardTitle>
              <CardDescription>Please sign in to access the laboratory dashboard.</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button onClick={() => navigate('/auth')}>Sign In</Button>
            </CardFooter>
          </Card>
        </div>
      </Layout>
    );
  }

  // --- Kanban helpers for Sample Tracking ---
  const samplesByStatus = (status: BookingStatus) => bookings.filter((b) => b.status === status);

  return (
    <Layout>
      <div className="container mx-auto py-8 md:py-12 px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <FlaskConical className="h-8 w-8 text-primary" />
              Laboratory Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">Manage tests, samples, and reports</p>
          </div>
          <Badge variant="outline" className="text-sm px-3 py-1">
            <Clock className="h-3.5 w-3.5 mr-1" />
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </Badge>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview">
          <TabsList className="grid grid-cols-3 md:grid-cols-6 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tests">Tests</TabsTrigger>
            <TabsTrigger value="bookings" className="relative">
              Bookings
              {pendingReports > 0 && (
                <Badge variant="destructive" className="ml-1 h-5 w-5 p-0 flex items-center justify-center text-[10px] absolute -top-2 -right-2">
                  {pendingReports}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="samples">Samples</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
          </TabsList>

          {/* ==================== OVERVIEW TAB ==================== */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Tests Today</CardTitle>
                  <TestTubes className="h-5 w-5 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{todayBookings.length}</div>
                  <p className="text-xs text-muted-foreground mt-1">+12% from yesterday</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Pending Reports</CardTitle>
                  <Clock className="h-5 w-5 text-amber-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{pendingReports}</div>
                  <p className="text-xs text-muted-foreground mt-1">Awaiting completion</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Completed Reports</CardTitle>
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{completedToday}</div>
                  <p className="text-xs text-muted-foreground mt-1">Delivered today</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Revenue Today</CardTitle>
                  <IndianRupee className="h-5 w-5 text-emerald-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">₹12,450</div>
                  <p className="text-xs text-muted-foreground mt-1">+8% from yesterday</p>
                </CardContent>
              </Card>
            </div>

            {/* Weekly Test Volume Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Weekly Test Volume</CardTitle>
                <CardDescription>Number of tests processed each day this week</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px] w-full">
                  <LineChart data={weeklyTestVolume}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="day" className="text-muted-foreground" />
                    <YAxis className="text-muted-foreground" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line type="monotone" dataKey="tests" stroke="var(--color-tests)" strokeWidth={2} dot={{ r: 4 }} />
                  </LineChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ==================== TEST MANAGEMENT TAB ==================== */}
          <TabsContent value="tests">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-foreground">Test Packages</h2>
              <Button onClick={() => toast.info('Add Test Package feature coming soon')}>
                <Plus className="h-4 w-4 mr-1" />
                Add Test Package
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {testPackages.map((pkg) => (
                <Card key={pkg.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-base font-semibold">{pkg.name}</CardTitle>
                      <Badge variant="secondary">{pkg.category}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-muted-foreground text-sm">
                        <Package className="h-4 w-4 mr-1" />
                        {pkg.testsIncluded} test{pkg.testsIncluded > 1 ? 's' : ''} included
                      </div>
                      <span className="text-lg font-bold text-foreground">₹{pkg.price.toLocaleString('en-IN')}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* ==================== BOOKINGS TAB ==================== */}
          <TabsContent value="bookings">
            <h2 className="text-xl font-semibold text-foreground mb-6">Test Bookings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bookings.map((booking) => (
                <Card key={booking.id} className="border-l-4" style={{ borderLeftColor: statusBorderColors[booking.status] }}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-base">{booking.patientName}</CardTitle>
                        <CardDescription>{booking.testName}</CardDescription>
                      </div>
                      <Badge variant="outline" className={statusColors[booking.status]}>
                        {booking.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {booking.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <ClipboardList className="h-3.5 w-3.5" />
                        {booking.sampleId}
                      </span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    {statusFlow[booking.status] ? (
                      <Button size="sm" variant="outline" onClick={() => advanceStatus(booking.id)}>
                        Move to {statusFlow[booking.status]}
                        <ArrowRight className="h-3.5 w-3.5 ml-1" />
                      </Button>
                    ) : (
                      <span className="flex items-center text-sm text-green-600">
                        <CheckCircle2 className="h-4 w-4 mr-1" />
                        Completed
                      </span>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* ==================== SAMPLE TRACKING TAB ==================== */}
          <TabsContent value="samples">
            <h2 className="text-xl font-semibold text-foreground mb-6">Sample Tracking</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(['Collected', 'Processing', 'Completed'] as BookingStatus[]).map((status) => (
                <div key={status}>
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="outline" className={statusColors[status]}>
                      {status}
                    </Badge>
                    <span className="text-sm text-muted-foreground">({samplesByStatus(status).length})</span>
                  </div>
                  <div className="space-y-3">
                    {samplesByStatus(status).length === 0 ? (
                      <Card className="border-dashed">
                        <CardContent className="py-6 text-center text-sm text-muted-foreground">
                          No samples in this stage
                        </CardContent>
                      </Card>
                    ) : (
                      samplesByStatus(status).map((sample) => (
                        <Card key={sample.id} className="hover:shadow-sm transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-2">
                              <p className="font-medium text-sm text-foreground">{sample.patientName}</p>
                              <span className="text-xs font-mono text-muted-foreground">{sample.sampleId}</span>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">{sample.testName}</p>
                            {statusFlow[sample.status] && (
                              <Button size="sm" variant="ghost" className="w-full text-xs" onClick={() => advanceStatus(sample.id)}>
                                Move to {statusFlow[sample.status]}
                                <ArrowRight className="h-3 w-3 ml-1" />
                              </Button>
                            )}
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* ==================== REPORTS TAB ==================== */}
          <TabsContent value="reports">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Upload Form */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Upload className="h-5 w-5" />
                    Upload Report
                  </CardTitle>
                  <CardDescription>Submit a completed test report</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleUploadReport} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="patient-name">Patient Name</Label>
                      <Input
                        id="patient-name"
                        placeholder="Enter patient name"
                        value={uploadPatient}
                        onChange={(e) => setUploadPatient(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="test-name">Test Name</Label>
                      <Select value={uploadTest} onValueChange={setUploadTest}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select test" />
                        </SelectTrigger>
                        <SelectContent>
                          {testPackages.map((pkg) => (
                            <SelectItem key={pkg.id} value={pkg.name}>
                              {pkg.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button type="submit" className="w-full">
                      <FileText className="h-4 w-4 mr-1" />
                      Upload Report
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Completed Reports List */}
              <div className="lg:col-span-2">
                <h3 className="text-lg font-semibold text-foreground mb-4">Completed Reports</h3>
                <div className="space-y-3">
                  {reports.map((report) => (
                    <Card key={report.id}>
                      <CardContent className="p-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="space-y-1">
                            <p className="font-medium text-foreground">{report.patientName}</p>
                            <p className="text-sm text-muted-foreground">{report.testName}</p>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                              <span>{report.completedDate}</span>
                              <span>Ref: {report.doctorName}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {report.notified ? (
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                Notified
                              </Badge>
                            ) : (
                              <Button size="sm" variant="outline" onClick={() => notifyPatientDoctor(report.id)}>
                                <Bell className="h-3.5 w-3.5 mr-1" />
                                Notify Patient & Doctor
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* ==================== REVENUE TAB ==================== */}
          <TabsContent value="revenue">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Revenue</CardTitle>
                  <TrendingUp className="h-5 w-5 text-emerald-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">₹2,62,000</div>
                  <p className="text-xs text-muted-foreground mt-1">+5.6% from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Tests Completed</CardTitle>
                  <ClipboardList className="h-5 w-5 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">351</div>
                  <p className="text-xs text-muted-foreground mt-1">This month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Average Test Price</CardTitle>
                  <Users className="h-5 w-5 text-purple-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">₹746</div>
                  <p className="text-xs text-muted-foreground mt-1">Per test average</p>
                </CardContent>
              </Card>
            </div>

            {/* Revenue Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Monthly Revenue Trend</CardTitle>
                <CardDescription>Revenue performance over the last 6 months</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px] w-full">
                  <BarChart data={monthlyRevenue}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" className="text-muted-foreground" />
                    <YAxis className="text-muted-foreground" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="revenue" fill="var(--color-revenue)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default LaboratoryDashboard;
