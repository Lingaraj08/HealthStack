
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/auth/AuthContext';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Users, UserCog, FlaskConical, IndianRupee, Activity, Building2,
  ShieldCheck, Settings, TrendingUp, BedDouble, Plus, CheckCircle2,
  XCircle, AlertTriangle, Lock, Bell, Monitor,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

// ── Mock Data ──────────────────────────────────────────────────────────────────

const patientFlowData = [
  { day: 'Mon', patients: 64 },
  { day: 'Tue', patients: 78 },
  { day: 'Wed', patients: 92 },
  { day: 'Thu', patients: 85 },
  { day: 'Fri', patients: 110 },
  { day: 'Sat', patients: 72 },
  { day: 'Sun', patients: 48 },
];

const revenueBreakdownData = [
  { month: 'Jan', revenue: 420000 },
  { month: 'Feb', revenue: 380000 },
  { month: 'Mar', revenue: 510000 },
  { month: 'Apr', revenue: 475000 },
  { month: 'May', revenue: 530000 },
  { month: 'Jun', revenue: 610000 },
];

const departmentFlowData = [
  { name: 'Cardiology', value: 320 },
  { name: 'Neurology', value: 210 },
  { name: 'Orthopedics', value: 280 },
  { name: 'Pediatrics', value: 190 },
  { name: 'Emergency', value: 410 },
  { name: 'General', value: 350 },
];

const PIE_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const appointmentTrendsData = [
  { week: 'W1', booked: 120, completed: 105, cancelled: 15 },
  { week: 'W2', booked: 140, completed: 128, cancelled: 12 },
  { week: 'W3', booked: 135, completed: 118, cancelled: 17 },
  { week: 'W4', booked: 155, completed: 140, cancelled: 15 },
];

interface Doctor {
  id: string;
  name: string;
  specialization: string;
  status: 'Active' | 'Inactive';
}

interface Lab {
  id: string;
  name: string;
  type: string;
  approved: boolean;
}

interface PatientRecord {
  id: string;
  name: string;
  age: number;
  lastVisit: string;
}

interface Department {
  id: string;
  name: string;
  head: string;
  staffCount: number;
  totalBeds: number;
  availableBeds: number;
}

interface AccessLog {
  id: string;
  user: string;
  action: string;
  timestamp: string;
  ip: string;
}

const initialDoctors: Doctor[] = [
  { id: 'd1', name: 'Dr. Arjun Mehta', specialization: 'Cardiology', status: 'Active' },
  { id: 'd2', name: 'Dr. Priya Sharma', specialization: 'Neurology', status: 'Active' },
  { id: 'd3', name: 'Dr. Raj Patel', specialization: 'Orthopedics', status: 'Inactive' },
  { id: 'd4', name: 'Dr. Sneha Reddy', specialization: 'Pediatrics', status: 'Active' },
  { id: 'd5', name: 'Dr. Vikram Singh', specialization: 'General Medicine', status: 'Inactive' },
];

const initialLabs: Lab[] = [
  { id: 'l1', name: 'PathCare Diagnostics', type: 'Pathology', approved: true },
  { id: 'l2', name: 'RadVision Imaging', type: 'Radiology', approved: true },
  { id: 'l3', name: 'GenomeLab India', type: 'Genetics', approved: false },
  { id: 'l4', name: 'MicroBio Labs', type: 'Microbiology', approved: true },
  { id: 'l5', name: 'NeuroScan Centre', type: 'Neurology', approved: false },
];

const initialPatients: PatientRecord[] = [
  { id: 'p1', name: 'Ananya Gupta', age: 34, lastVisit: '2025-07-10' },
  { id: 'p2', name: 'Rahul Verma', age: 52, lastVisit: '2025-07-09' },
  { id: 'p3', name: 'Meera Joshi', age: 28, lastVisit: '2025-07-08' },
  { id: 'p4', name: 'Suresh Kumar', age: 65, lastVisit: '2025-07-07' },
  { id: 'p5', name: 'Kavita Nair', age: 41, lastVisit: '2025-07-06' },
];

const initialDepartments: Department[] = [
  { id: 'dep1', name: 'Cardiology', head: 'Dr. Arjun Mehta', staffCount: 24, totalBeds: 40, availableBeds: 12 },
  { id: 'dep2', name: 'Neurology', head: 'Dr. Priya Sharma', staffCount: 18, totalBeds: 30, availableBeds: 8 },
  { id: 'dep3', name: 'Orthopedics', head: 'Dr. Raj Patel', staffCount: 20, totalBeds: 35, availableBeds: 15 },
  { id: 'dep4', name: 'Pediatrics', head: 'Dr. Sneha Reddy', staffCount: 22, totalBeds: 28, availableBeds: 10 },
  { id: 'dep5', name: 'Emergency', head: 'Dr. Vikram Singh', staffCount: 32, totalBeds: 50, availableBeds: 5 },
  { id: 'dep6', name: 'General Medicine', head: 'Dr. Amit Das', staffCount: 26, totalBeds: 45, availableBeds: 18 },
];

const accessLogs: AccessLog[] = [
  { id: 'log1', user: 'admin@healthstack.in', action: 'Login', timestamp: '2025-07-12 09:14:22', ip: '192.168.1.101' },
  { id: 'log2', user: 'dr.mehta@healthstack.in', action: 'Updated patient record', timestamp: '2025-07-12 09:32:05', ip: '192.168.1.115' },
  { id: 'log3', user: 'lab.pathcare@healthstack.in', action: 'Uploaded lab report', timestamp: '2025-07-12 10:05:41', ip: '192.168.1.130' },
  { id: 'log4', user: 'admin@healthstack.in', action: 'Approved new lab', timestamp: '2025-07-12 10:18:09', ip: '192.168.1.101' },
  { id: 'log5', user: 'dr.sharma@healthstack.in', action: 'Started video consultation', timestamp: '2025-07-12 11:00:33', ip: '192.168.1.122' },
  { id: 'log6', user: 'admin@healthstack.in', action: 'Changed system settings', timestamp: '2025-07-12 11:42:17', ip: '192.168.1.101' },
];

// ── Component ──────────────────────────────────────────────────────────────────

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, userRole } = useAuth();

  const [doctors, setDoctors] = useState<Doctor[]>(initialDoctors);
  const [labs, setLabs] = useState<Lab[]>(initialLabs);
  const [patients] = useState<PatientRecord[]>(initialPatients);
  const [departments, setDepartments] = useState<Department[]>(initialDepartments);

  // Settings state
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [twoFactorAuth, setTwoFactorAuth] = useState(true);
  const [autoBackup, setAutoBackup] = useState(true);

  // ── Handlers ───────────────────────────────────────────────────────────

  const toggleDoctorStatus = (id: string) => {
    setDoctors(prev =>
      prev.map(d =>
        d.id === id
          ? { ...d, status: d.status === 'Active' ? 'Inactive' : 'Active' }
          : d,
      ),
    );
    toast.success('Doctor status updated');
  };

  const toggleLabApproval = (id: string) => {
    setLabs(prev =>
      prev.map(l => (l.id === id ? { ...l, approved: !l.approved } : l)),
    );
    toast.success('Lab approval status updated');
  };

  const addDepartment = () => {
    const newDept: Department = {
      id: `dep${departments.length + 1}`,
      name: 'New Department',
      head: 'Unassigned',
      staffCount: 0,
      totalBeds: 20,
      availableBeds: 20,
    };
    setDepartments(prev => [...prev, newDept]);
    toast.success('New department added');
  };

  // ── Summary stats ──────────────────────────────────────────────────────

  const totalPatients = patients.length;
  const totalDoctors = doctors.length;
  const totalLabs = labs.length;
  const monthlyRevenue = 610000;

  // ── Auth guard ─────────────────────────────────────────────────────────

  if (!user) {
    return (
      <Layout>
        <div className="container py-12">
          <Card>
            <CardHeader>
              <CardTitle>Authentication Required</CardTitle>
              <CardDescription>Please sign in to access the admin dashboard.</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button onClick={() => navigate('/login')}>Sign In</Button>
            </CardFooter>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-healthBlue-800 dark:text-healthBlue-200">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Hospital management &amp; system administration
            </p>
          </div>
          <Badge
            variant="outline"
            className="bg-healthBlue-50 text-healthBlue-700 border-healthBlue-200 dark:bg-healthBlue-900 dark:text-healthBlue-300 dark:border-healthBlue-700"
          >
            {userRole ?? 'admin'}
          </Badge>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview">
          <TabsList className="grid grid-cols-3 md:grid-cols-6 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="operations">Operations</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* ── Overview Tab ──────────────────────────────────────────── */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Patients
                  </CardTitle>
                  <Users className="h-5 w-5 text-healthBlue-600" />
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{totalPatients.toLocaleString()}</p>
                  <p className="text-xs text-gray-500 mt-1">+12% from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Doctors
                  </CardTitle>
                  <UserCog className="h-5 w-5 text-healthGreen-600" />
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{totalDoctors}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {doctors.filter(d => d.status === 'Active').length} active
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Labs
                  </CardTitle>
                  <FlaskConical className="h-5 w-5 text-healthOrange-600" />
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{totalLabs}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {labs.filter(l => l.approved).length} approved
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Revenue This Month
                  </CardTitle>
                  <IndianRupee className="h-5 w-5 text-emerald-600" />
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">₹{(monthlyRevenue / 100000).toFixed(1)}L</p>
                  <p className="text-xs text-gray-500 mt-1">+8.2% from last month</p>
                </CardContent>
              </Card>
            </div>

            {/* Patient Flow Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Patient Flow – Last 7 Days
                </CardTitle>
                <CardDescription>Daily patient visits across all departments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={patientFlowData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="patients"
                        stroke="#2563eb"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        name="Patients"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── User Management Tab ───────────────────────────────────── */}
          <TabsContent value="users">
            <Tabs defaultValue="doctors">
              <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger value="doctors">Manage Doctors</TabsTrigger>
                <TabsTrigger value="labs">Manage Labs</TabsTrigger>
                <TabsTrigger value="patients">Manage Patients</TabsTrigger>
              </TabsList>

              {/* Doctors */}
              <TabsContent value="doctors">
                <Card>
                  <CardHeader>
                    <CardTitle>Registered Doctors</CardTitle>
                    <CardDescription>Approve or suspend doctor accounts</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Specialization</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {doctors.map(doc => (
                          <TableRow key={doc.id}>
                            <TableCell className="font-medium">{doc.name}</TableCell>
                            <TableCell>{doc.specialization}</TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={
                                  doc.status === 'Active'
                                    ? 'bg-healthGreen-50 text-healthGreen-700 border-healthGreen-200'
                                    : 'bg-red-50 text-red-700 border-red-200'
                                }
                              >
                                {doc.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                size="sm"
                                variant={doc.status === 'Active' ? 'destructive' : 'default'}
                                onClick={() => toggleDoctorStatus(doc.id)}
                              >
                                {doc.status === 'Active' ? (
                                  <>
                                    <XCircle className="h-4 w-4 mr-1" />
                                    Suspend
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle2 className="h-4 w-4 mr-1" />
                                    Approve
                                  </>
                                )}
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Labs */}
              <TabsContent value="labs">
                <Card>
                  <CardHeader>
                    <CardTitle>Registered Laboratories</CardTitle>
                    <CardDescription>Manage lab approval status</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Lab Name</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Approval</TableHead>
                          <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {labs.map(lab => (
                          <TableRow key={lab.id}>
                            <TableCell className="font-medium">{lab.name}</TableCell>
                            <TableCell>{lab.type}</TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={
                                  lab.approved
                                    ? 'bg-healthGreen-50 text-healthGreen-700 border-healthGreen-200'
                                    : 'bg-amber-50 text-amber-700 border-amber-200'
                                }
                              >
                                {lab.approved ? 'Approved' : 'Pending'}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                size="sm"
                                variant={lab.approved ? 'destructive' : 'default'}
                                onClick={() => toggleLabApproval(lab.id)}
                              >
                                {lab.approved ? 'Revoke' : 'Approve'}
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Patients */}
              <TabsContent value="patients">
                <Card>
                  <CardHeader>
                    <CardTitle>Patient Records</CardTitle>
                    <CardDescription>Overview of registered patients</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Age</TableHead>
                          <TableHead>Last Visit</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {patients.map(p => (
                          <TableRow key={p.id}>
                            <TableCell className="font-medium">{p.name}</TableCell>
                            <TableCell>{p.age}</TableCell>
                            <TableCell>{p.lastVisit}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </TabsContent>

          {/* ── Hospital Operations Tab ───────────────────────────────── */}
          <TabsContent value="operations">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Department Management</h2>
              <Button onClick={addDepartment}>
                <Plus className="h-4 w-4 mr-1" />
                Add Department
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {departments.map(dept => (
                <Card key={dept.id} className="border-l-4 border-l-healthBlue-500">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{dept.name}</CardTitle>
                      <Building2 className="h-5 w-5 text-healthBlue-600" />
                    </div>
                    <CardDescription>Head: {dept.head}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Staff</span>
                        <span className="font-medium">{dept.staffCount}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                          <BedDouble className="h-4 w-4" /> Beds
                        </span>
                        <span className="font-medium">
                          {dept.availableBeds}/{dept.totalBeds} available
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            dept.availableBeds / dept.totalBeds < 0.2
                              ? 'bg-red-500'
                              : dept.availableBeds / dept.totalBeds < 0.5
                                ? 'bg-amber-500'
                                : 'bg-healthGreen-500'
                          }`}
                          style={{
                            width: `${((dept.totalBeds - dept.availableBeds) / dept.totalBeds) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* ── Analytics Tab ─────────────────────────────────────────── */}
          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revenue Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Breakdown</CardTitle>
                  <CardDescription>Monthly revenue over the last 6 months</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={revenueBreakdownData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
                        <Tooltip formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Revenue']} />
                        <Legend />
                        <Bar dataKey="revenue" fill="#2563eb" name="Revenue (₹)" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Patient Flow by Department */}
              <Card>
                <CardHeader>
                  <CardTitle>Patient Flow by Department</CardTitle>
                  <CardDescription>Distribution of patients across departments</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={departmentFlowData}
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          dataKey="value"
                          nameKey="name"
                          label={({ name, percent }) =>
                            `${name} ${(percent * 100).toFixed(0)}%`
                          }
                        >
                          {departmentFlowData.map((_entry, index) => (
                            <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Appointment Trends */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Appointment Trends</CardTitle>
                  <CardDescription>Weekly appointment statistics for the current month</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={appointmentTrendsData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="week" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="booked" fill="#2563eb" name="Booked" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="completed" fill="#16a34a" name="Completed" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="cancelled" fill="#dc2626" name="Cancelled" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* ── Security Tab ──────────────────────────────────────────── */}
          <TabsContent value="security">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center gap-3 pb-2">
                  <ShieldCheck className="h-6 w-6 text-healthGreen-600" />
                  <div>
                    <CardTitle className="text-sm font-medium">HIPAA Compliance</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <Badge className="bg-healthGreen-50 text-healthGreen-700 border-healthGreen-200">
                    Compliant
                  </Badge>
                  <p className="text-xs text-gray-500 mt-2">Last audit: July 1, 2025</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center gap-3 pb-2">
                  <Lock className="h-6 w-6 text-healthBlue-600" />
                  <div>
                    <CardTitle className="text-sm font-medium">Data Encryption</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <Badge className="bg-healthGreen-50 text-healthGreen-700 border-healthGreen-200">
                    AES-256 Active
                  </Badge>
                  <p className="text-xs text-gray-500 mt-2">All data encrypted at rest &amp; in transit</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center gap-3 pb-2">
                  <AlertTriangle className="h-6 w-6 text-amber-600" />
                  <div>
                    <CardTitle className="text-sm font-medium">Security Alerts</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <Badge className="bg-amber-50 text-amber-700 border-amber-200">
                    2 Warnings
                  </Badge>
                  <p className="text-xs text-gray-500 mt-2">Review pending security patches</p>
                </CardContent>
              </Card>
            </div>

            {/* Access Logs */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Access Logs</CardTitle>
                <CardDescription>Latest system activity across all users</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>IP Address</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {accessLogs.map(log => (
                      <TableRow key={log.id}>
                        <TableCell className="font-medium">{log.user}</TableCell>
                        <TableCell>{log.action}</TableCell>
                        <TableCell className="text-gray-500">{log.timestamp}</TableCell>
                        <TableCell className="font-mono text-sm">{log.ip}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── Settings Tab ──────────────────────────────────────────── */}
          <TabsContent value="settings">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Notifications
                  </CardTitle>
                  <CardDescription>Configure notification preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-notif">Email Notifications</Label>
                    <Switch
                      id="email-notif"
                      checked={emailNotifications}
                      onCheckedChange={v => {
                        setEmailNotifications(v);
                        toast.success(`Email notifications ${v ? 'enabled' : 'disabled'}`);
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="sms-notif">SMS Notifications</Label>
                    <Switch
                      id="sms-notif"
                      checked={smsNotifications}
                      onCheckedChange={v => {
                        setSmsNotifications(v);
                        toast.success(`SMS notifications ${v ? 'enabled' : 'disabled'}`);
                      }}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    System
                  </CardTitle>
                  <CardDescription>System-wide settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="maintenance">Maintenance Mode</Label>
                      <p className="text-xs text-gray-500">Temporarily disable public access</p>
                    </div>
                    <Switch
                      id="maintenance"
                      checked={maintenanceMode}
                      onCheckedChange={v => {
                        setMaintenanceMode(v);
                        toast.success(
                          v ? 'Maintenance mode enabled' : 'Maintenance mode disabled',
                        );
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="two-factor">Two-Factor Authentication</Label>
                      <p className="text-xs text-gray-500">Require 2FA for all admin accounts</p>
                    </div>
                    <Switch
                      id="two-factor"
                      checked={twoFactorAuth}
                      onCheckedChange={v => {
                        setTwoFactorAuth(v);
                        toast.success(`Two-factor auth ${v ? 'enabled' : 'disabled'}`);
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="auto-backup">Automatic Backups</Label>
                      <p className="text-xs text-gray-500">Daily automated database backups</p>
                    </div>
                    <Switch
                      id="auto-backup"
                      checked={autoBackup}
                      onCheckedChange={v => {
                        setAutoBackup(v);
                        toast.success(`Auto backups ${v ? 'enabled' : 'disabled'}`);
                      }}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Monitor className="h-5 w-5" />
                    System Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Platform Version</p>
                      <p className="font-medium">HealthStack v2.4.0</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Server Uptime</p>
                      <p className="font-medium">99.97%</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Last Deployment</p>
                      <p className="font-medium">July 10, 2025</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
