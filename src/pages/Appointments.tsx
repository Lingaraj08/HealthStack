
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { format, addDays, startOfToday, isBefore } from 'date-fns';
import { CalendarIcon, Clock, MapPin, User, Calendar as CalendarIcon2, Loader2, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthContext';

interface Doctor {
  id: string;
  full_name: string;
  specialization: string;
  avatar_url: string;
  hospital: string;
}

interface Appointment {
  id: string;
  doctor_id: string;
  patient_id: string;
  appointment_time: string;
  status: string;
  notes: string;
  doctor: Doctor;
}

// Time slot options
const timeSlots = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', 
  '12:00', '12:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30'
];

// Appointment status badges
const getStatusBadge = (status: string) => {
  switch (status) {
    case 'confirmed':
      return <Badge variant="outline" className="bg-healthGreen-50 text-healthGreen-700 border-healthGreen-200">Confirmed</Badge>;
    case 'pending':
      return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Pending</Badge>;
    case 'cancelled':
      return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Cancelled</Badge>;
    case 'completed':
      return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Completed</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const Appointments = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(addDays(new Date(), 1));
  const [selectedTime, setSelectedTime] = useState<string | undefined>();
  const [selectedDoctor, setSelectedDoctor] = useState<string | undefined>();
  const [appointmentNotes, setAppointmentNotes] = useState('');
  
  // Get doctors for appointment booking
  const { data: doctors } = useQuery({
    queryKey: ['doctors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('doctors')
        .select('id, full_name, specialization')
        .order('full_name');
      
      if (error) throw error;
      return data as Doctor[];
    },
    enabled: !!user
  });
  
  // Get user's appointments
  const { data: appointments, isLoading, error } = useQuery({
    queryKey: ['appointments', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('Not authenticated');
      
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          doctor:doctor_id (
            id, full_name, specialization, avatar_url, hospital
          )
        `)
        .eq('patient_id', user.id)
        .order('appointment_time', { ascending: true });
      
      if (error) throw error;
      return data as Appointment[];
    },
    enabled: !!user
  });
  
  // Create appointment mutation
  const bookAppointmentMutation = useMutation({
    mutationFn: async () => {
      if (!user || !selectedDoctor || !selectedDate || !selectedTime) {
        throw new Error('Missing required appointment details');
      }
      
      // Create the appointment datetime
      const appointmentDateTime = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate(),
        parseInt(selectedTime.split(':')[0]),
        parseInt(selectedTime.split(':')[1])
      ).toISOString();
      
      const { data, error } = await supabase
        .from('appointments')
        .insert({
          doctor_id: selectedDoctor,
          patient_id: user.id,
          appointment_time: appointmentDateTime,
          status: 'pending',
          notes: appointmentNotes
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments', user?.id] });
      toast({
        title: "Appointment Booked",
        description: "Your appointment has been scheduled successfully"
      });
      setIsBookingOpen(false);
      resetBookingForm();
    },
    onError: (error) => {
      toast({
        title: "Booking Failed",
        description: "Failed to book appointment: " + (error as Error).message,
        variant: "destructive"
      });
    }
  });
  
  // Cancel appointment mutation
  const cancelAppointmentMutation = useMutation({
    mutationFn: async (appointmentId: string) => {
      const { error } = await supabase
        .from('appointments')
        .update({ status: 'cancelled' })
        .eq('id', appointmentId)
        .eq('patient_id', user?.id);
      
      if (error) throw error;
      return appointmentId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments', user?.id] });
      toast({
        title: "Appointment Cancelled",
        description: "Your appointment has been cancelled successfully"
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to cancel appointment: " + (error as Error).message,
        variant: "destructive"
      });
    }
  });
  
  const resetBookingForm = () => {
    setSelectedDate(addDays(new Date(), 1));
    setSelectedTime(undefined);
    setSelectedDoctor(undefined);
    setAppointmentNotes('');
  };
  
  const handleBookAppointment = () => {
    if (!selectedDoctor) {
      toast({
        title: "Missing Information",
        description: "Please select a doctor",
        variant: "destructive"
      });
      return;
    }
    
    if (!selectedDate) {
      toast({
        title: "Missing Information",
        description: "Please select a date",
        variant: "destructive"
      });
      return;
    }
    
    if (!selectedTime) {
      toast({
        title: "Missing Information",
        description: "Please select a time slot",
        variant: "destructive"
      });
      return;
    }
    
    bookAppointmentMutation.mutate();
  };
  
  const handleCancelAppointment = (appointmentId: string) => {
    cancelAppointmentMutation.mutate(appointmentId);
  };
  
  // Filter appointments by status
  const upcomingAppointments = appointments?.filter(
    appointment => 
      !isBefore(new Date(appointment.appointment_time), startOfToday()) && 
      appointment.status !== 'cancelled' && 
      appointment.status !== 'completed'
  ) || [];
  
  const pastAppointments = appointments?.filter(
    appointment => 
      isBefore(new Date(appointment.appointment_time), startOfToday()) || 
      appointment.status === 'cancelled' || 
      appointment.status === 'completed'
  ) || [];
  
  if (!user) {
    return (
      <Layout>
        <div className="container py-12">
          <Card className="mx-auto max-w-md">
            <CardHeader>
              <CardTitle>Authentication Required</CardTitle>
              <CardDescription>
                Please sign in to view and manage your appointments.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button onClick={() => window.location.href = '/auth'}>
                Sign In
              </Button>
            </CardFooter>
          </Card>
        </div>
      </Layout>
    );
  }
  
  if (isLoading) {
    return (
      <Layout>
        <div className="container py-12">
          <div className="flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-healthBlue-600 mr-2" />
            <p className="ml-2">Loading appointments...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-healthBlue-800">Appointments</h1>
            <p className="text-gray-600 mt-2">Manage your healthcare appointments</p>
          </div>
          
          <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
            <DialogTrigger asChild>
              <Button className="mt-4 md:mt-0 bg-healthBlue-600 hover:bg-healthBlue-700">
                <Plus className="mr-2 h-4 w-4" />
                Book New Appointment
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Book an Appointment</DialogTitle>
                <DialogDescription>
                  Schedule an appointment with one of our healthcare professionals.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="doctor" className="text-right text-sm font-medium">
                    Doctor*
                  </label>
                  <div className="col-span-3">
                    <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a doctor" />
                      </SelectTrigger>
                      <SelectContent>
                        {doctors?.map((doctor) => (
                          <SelectItem key={doctor.id} value={doctor.id}>
                            {doctor.full_name} - {doctor.specialization}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <label className="text-right text-sm font-medium">
                    Date*
                  </label>
                  <div className="col-span-3">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={(date) => 
                        isBefore(date, startOfToday()) || 
                        date > addDays(new Date(), 30)
                      }
                      className="border rounded-md p-3"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="time" className="text-right text-sm font-medium">
                    Time*
                  </label>
                  <div className="col-span-3">
                    <Select value={selectedTime} onValueChange={setSelectedTime}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a time slot" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="notes" className="text-right text-sm font-medium">
                    Notes
                  </label>
                  <textarea
                    id="notes"
                    value={appointmentNotes}
                    onChange={(e) => setAppointmentNotes(e.target.value)}
                    className="col-span-3 flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Add any specific details about your appointment"
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsBookingOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleBookAppointment} 
                  className="bg-healthBlue-600 hover:bg-healthBlue-700"
                  disabled={bookAppointmentMutation.isPending}
                >
                  {bookAppointmentMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Booking...
                    </>
                  ) : 'Book Appointment'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        <Tabs defaultValue="upcoming">
          <TabsList className="mb-6">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upcoming">
            {upcomingAppointments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {upcomingAppointments.map((appointment) => (
                  <Card key={appointment.id}>
                    <CardHeader className="pb-3">
                      <div className="flex justify-between">
                        <CardTitle>{appointment.doctor.full_name}</CardTitle>
                        {getStatusBadge(appointment.status)}
                      </div>
                      <CardDescription>{appointment.doctor.specialization}</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-3">
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <CalendarIcon2 className="h-4 w-4 text-gray-500 mr-2" />
                          <span>{format(new Date(appointment.appointment_time), 'MMMM d, yyyy')}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 text-gray-500 mr-2" />
                          <span>{format(new Date(appointment.appointment_time), 'h:mm a')}</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 text-gray-500 mr-2" />
                          <span>{appointment.doctor.hospital || 'Hospital information not available'}</span>
                        </div>
                        {appointment.notes && (
                          <div className="pt-2">
                            <p className="text-sm text-gray-600 italic">"{appointment.notes}"</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        variant="outline" 
                        className="text-red-600 border-red-200 hover:bg-red-50" 
                        onClick={() => handleCancelAppointment(appointment.id)}
                        disabled={cancelAppointmentMutation.isPending}
                      >
                        {cancelAppointmentMutation.isPending && cancelAppointmentMutation.variables === appointment.id ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : 'Cancel Appointment'}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="text-center p-8">
                <CardContent>
                  <div className="flex flex-col items-center">
                    <CalendarIcon className="h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-xl font-medium mb-2">No upcoming appointments</h3>
                    <p className="text-gray-600 mb-6">
                      You don't have any upcoming appointments scheduled.
                    </p>
                    <DialogTrigger asChild>
                      <Button className="bg-healthBlue-600 hover:bg-healthBlue-700">
                        Book an Appointment
                      </Button>
                    </DialogTrigger>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="past">
            {pastAppointments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {pastAppointments.map((appointment) => (
                  <Card key={appointment.id} className="opacity-80">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between">
                        <CardTitle>{appointment.doctor.full_name}</CardTitle>
                        {getStatusBadge(appointment.status)}
                      </div>
                      <CardDescription>{appointment.doctor.specialization}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <CalendarIcon2 className="h-4 w-4 text-gray-500 mr-2" />
                          <span>{format(new Date(appointment.appointment_time), 'MMMM d, yyyy')}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 text-gray-500 mr-2" />
                          <span>{format(new Date(appointment.appointment_time), 'h:mm a')}</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 text-gray-500 mr-2" />
                          <span>{appointment.doctor.hospital || 'Hospital information not available'}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="text-center p-8">
                <CardContent>
                  <div className="flex flex-col items-center">
                    <CalendarIcon className="h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-xl font-medium mb-2">No past appointments</h3>
                    <p className="text-gray-600">
                      You don't have any past appointment records.
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

export default Appointments;
