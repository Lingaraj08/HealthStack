
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/components/auth/AuthContext';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Calendar, Clock, User, Video, MessageSquare, Stethoscope, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface Appointment {
  id: string;
  patient_id: string;
  appointment_time: string;
  status: string;
  notes: string;
  patient: {
    id: string;
    first_name: string;
    last_name: string;
  };
}

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, isDoctor } = useAuth();
  const [availability, setAvailability] = useState(true);
  
  // Redirect if not doctor
  React.useEffect(() => {
    if (user && !isDoctor) {
      navigate('/');
    }
  }, [user, isDoctor, navigate]);

  // Fetch doctor's appointments
  const { data: appointments, isLoading } = useQuery({
    queryKey: ['doctor-appointments', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('Not authenticated');
      
      const { data: doctorData, error: doctorError } = await supabase
        .from('doctors')
        .select('id')
        .eq('user_id', user.id)
        .single();
      
      if (doctorError) throw doctorError;
      
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          id,
          patient_id,
          appointment_time,
          status,
          notes,
          patient:patient_id (
            id,
            first_name,
            last_name
          )
        `)
        .eq('doctor_id', doctorData.id)
        .order('appointment_time', { ascending: true });
      
      if (error) throw error;
      return data as Appointment[];
    },
    enabled: !!user && isDoctor
  });

  // Update doctor availability
  const updateAvailabilityMutation = useMutation({
    mutationFn: async (available: boolean) => {
      if (!user) throw new Error('Not authenticated');
      
      const { data: doctorData, error: doctorError } = await supabase
        .from('doctors')
        .select('id')
        .eq('user_id', user.id)
        .single();
      
      if (doctorError) throw doctorError;
      
      const { error } = await supabase
        .from('doctors')
        .update({ available_for_consultation: available })
        .eq('id', doctorData.id);
      
      if (error) throw error;
      return available;
    },
    onSuccess: (available) => {
      setAvailability(available);
      toast.success(`You are now ${available ? 'available' : 'unavailable'} for consultations`);
    },
    onError: (error) => {
      toast.error(`Failed to update availability: ${(error as Error).message}`);
    }
  });
  
  // Update appointment status
  const updateAppointmentStatusMutation = useMutation({
    mutationFn: async ({ appointmentId, status }: { appointmentId: string, status: string }) => {
      const { error } = await supabase
        .from('appointments')
        .update({ status })
        .eq('id', appointmentId);
      
      if (error) throw error;
      return { appointmentId, status };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['doctor-appointments', user?.id] });
      toast.success(`Appointment ${data.status === 'confirmed' ? 'confirmed' : 'declined'} successfully`);
    },
    onError: (error) => {
      toast.error(`Failed to update appointment: ${(error as Error).message}`);
    }
  });

  // Start video consultation
  const startConsultation = (appointmentId: string, patientName: string) => {
    // In a real app, this would create a video chat room and redirect
    navigate(`/video-consultation/${appointmentId}`);
  };
  
  // Start chat consultation
  const startChatConsultation = (appointmentId: string, patientName: string) => {
    // In a real app, this would open a chat interface
    navigate(`/chat-consultation/${appointmentId}`);
  };
  
  // Handle availability toggle
  const handleAvailabilityToggle = (checked: boolean) => {
    updateAvailabilityMutation.mutate(checked);
  };

  // Filter appointments by status
  const pendingAppointments = appointments?.filter(
    appointment => appointment.status === 'pending'
  ) || [];
  
  const confirmedAppointments = appointments?.filter(
    appointment => appointment.status === 'confirmed'
  ) || [];
  
  const completedAppointments = appointments?.filter(
    appointment => ['completed', 'cancelled'].includes(appointment.status)
  ) || [];
  
  if (!user) {
    return (
      <Layout>
        <div className="container py-12">
          <Card>
            <CardHeader>
              <CardTitle>Authentication Required</CardTitle>
              <CardDescription>Please sign in to access your doctor dashboard.</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button onClick={() => navigate('/doctor-auth')}>Sign In</Button>
            </CardFooter>
          </Card>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="container mx-auto py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-healthBlue-800">Doctor Dashboard</h1>
            <p className="text-gray-600 mt-2">Manage your appointments and patient consultations</p>
          </div>
          
          <div className="flex items-center space-x-4 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center space-x-2">
              <Switch 
                id="availability" 
                checked={availability}
                onCheckedChange={handleAvailabilityToggle}
              />
              <Label htmlFor="availability">Available for Consultations</Label>
            </div>
            <Badge variant={availability ? "outline" : "secondary"} className={availability ? "bg-healthGreen-50 text-healthGreen-700 border-healthGreen-200" : "bg-gray-100 text-gray-700"}>
              {availability ? "Available" : "Unavailable"}
            </Badge>
          </div>
        </div>
        
        <Tabs defaultValue="pending">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="pending" className="relative">
              Pending Requests
              {pendingAppointments.length > 0 && (
                <Badge variant="destructive" className="ml-2 absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0">
                  {pendingAppointments.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming Consultations</TabsTrigger>
            <TabsTrigger value="past">Past Consultations</TabsTrigger>
          </TabsList>
          
          {/* Pending Appointments Tab */}
          <TabsContent value="pending">
            {isLoading ? (
              <div className="flex justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-healthBlue-600" />
              </div>
            ) : pendingAppointments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {pendingAppointments.map((appointment) => (
                  <Card key={appointment.id} className="border-l-4 border-l-healthOrange-500">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg font-semibold">
                            {appointment.patient.first_name} {appointment.patient.last_name}
                          </CardTitle>
                          <CardDescription>Appointment Request</CardDescription>
                        </div>
                        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                          Pending
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-3">
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                          <span>{format(new Date(appointment.appointment_time), 'MMMM d, yyyy')}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 text-gray-500 mr-2" />
                          <span>{format(new Date(appointment.appointment_time), 'h:mm a')}</span>
                        </div>
                        {appointment.notes && (
                          <div className="pt-3">
                            <p className="text-sm text-gray-600 italic">Patient's note: "{appointment.notes}"</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button 
                        variant="outline" 
                        className="border-red-200 text-red-600 hover:bg-red-50"
                        onClick={() => updateAppointmentStatusMutation.mutate({ 
                          appointmentId: appointment.id, 
                          status: 'cancelled' 
                        })}
                        disabled={updateAppointmentStatusMutation.isPending}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Decline
                      </Button>
                      <Button 
                        className="bg-healthGreen-600 hover:bg-healthGreen-700"
                        onClick={() => updateAppointmentStatusMutation.mutate({ 
                          appointmentId: appointment.id, 
                          status: 'confirmed' 
                        })}
                        disabled={updateAppointmentStatusMutation.isPending}
                      >
                        <CheckCircle2 className="h-4 w-4 mr-1" />
                        Accept
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="text-center p-8">
                <CardContent>
                  <div className="flex flex-col items-center py-12">
                    <Stethoscope className="h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-xl font-medium mb-2">No pending requests</h3>
                    <p className="text-gray-500 max-w-sm">
                      You don't have any pending appointment requests at the moment.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          {/* Upcoming Appointments Tab */}
          <TabsContent value="upcoming">
            {isLoading ? (
              <div className="flex justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-healthBlue-600" />
              </div>
            ) : confirmedAppointments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {confirmedAppointments.map((appointment) => (
                  <Card key={appointment.id} className="border-l-4 border-l-healthGreen-500">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg font-semibold">
                            {appointment.patient.first_name} {appointment.patient.last_name}
                          </CardTitle>
                          <CardDescription>Confirmed Appointment</CardDescription>
                        </div>
                        <Badge variant="outline" className="bg-healthGreen-50 text-healthGreen-700 border-healthGreen-200">
                          Confirmed
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-3">
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                          <span>{format(new Date(appointment.appointment_time), 'MMMM d, yyyy')}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 text-gray-500 mr-2" />
                          <span>{format(new Date(appointment.appointment_time), 'h:mm a')}</span>
                        </div>
                        <div className="flex items-center">
                          <User className="h-4 w-4 text-gray-500 mr-2" />
                          <span>Patient ID: {appointment.patient_id.substring(0, 8)}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button 
                        variant="outline" 
                        className="border-healthBlue-200 text-healthBlue-600"
                        onClick={() => startChatConsultation(appointment.id, `${appointment.patient.first_name} ${appointment.patient.last_name}`)}
                      >
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Text Chat
                      </Button>
                      <Button 
                        className="bg-healthBlue-600 hover:bg-healthBlue-700"
                        onClick={() => startConsultation(appointment.id, `${appointment.patient.first_name} ${appointment.patient.last_name}`)}
                      >
                        <Video className="h-4 w-4 mr-1" />
                        Video Call
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="text-center p-8">
                <CardContent>
                  <div className="flex flex-col items-center py-12">
                    <Calendar className="h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-xl font-medium mb-2">No upcoming consultations</h3>
                    <p className="text-gray-500 max-w-sm">
                      You don't have any confirmed appointments scheduled.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          {/* Past Appointments Tab */}
          <TabsContent value="past">
            {isLoading ? (
              <div className="flex justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-healthBlue-600" />
              </div>
            ) : completedAppointments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {completedAppointments.map((appointment) => (
                  <Card key={appointment.id} className="opacity-80">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg font-semibold">
                            {appointment.patient.first_name} {appointment.patient.last_name}
                          </CardTitle>
                          <CardDescription>Past Consultation</CardDescription>
                        </div>
                        <Badge variant="outline" className={
                          appointment.status === 'completed' 
                            ? "bg-gray-50 text-gray-700 border-gray-200"
                            : "bg-red-50 text-red-700 border-red-200"
                        }>
                          {appointment.status === 'completed' ? 'Completed' : 'Cancelled'}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                          <span>{format(new Date(appointment.appointment_time), 'MMMM d, yyyy')}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 text-gray-500 mr-2" />
                          <span>{format(new Date(appointment.appointment_time), 'h:mm a')}</span>
                        </div>
                        <div className="flex items-center">
                          <User className="h-4 w-4 text-gray-500 mr-2" />
                          <span>Patient ID: {appointment.patient_id.substring(0, 8)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="text-center p-8">
                <CardContent>
                  <div className="flex flex-col items-center py-12">
                    <Stethoscope className="h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-xl font-medium mb-2">No past consultations</h3>
                    <p className="text-gray-500 max-w-sm">
                      You don't have any completed or cancelled appointments.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default DoctorDashboard;
