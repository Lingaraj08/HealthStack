
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, User, MapPin, FileText, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

// Mock data - in a real app this would come from Supabase
const mockAppointments = [
  {
    id: '1',
    doctor: {
      id: '1',
      name: 'Dr. Priya Sharma',
      specialty: 'Cardiologist',
      image: 'https://randomuser.me/api/portraits/women/65.jpg',
      hospital: 'Apollo Hospital, Delhi'
    },
    appointment_time: '2024-04-15T10:30:00Z',
    status: 'upcoming',
    notes: 'Regular check-up for heart condition'
  },
  {
    id: '2',
    doctor: {
      id: '2',
      name: 'Dr. Rahul Mehta',
      specialty: 'Neurologist',
      image: 'https://randomuser.me/api/portraits/men/32.jpg',
      hospital: 'Fortis Healthcare, Mumbai'
    },
    appointment_time: '2024-04-20T14:00:00Z',
    status: 'upcoming',
    notes: 'Follow-up on recent headaches'
  },
  {
    id: '3',
    doctor: {
      id: '4',
      name: 'Dr. Vikram Singh',
      specialty: 'Dermatologist',
      image: 'https://randomuser.me/api/portraits/men/67.jpg',
      hospital: 'AIIMS, New Delhi'
    },
    appointment_time: '2024-03-25T11:00:00Z',
    status: 'completed',
    notes: 'Skin allergy check'
  },
  {
    id: '4',
    doctor: {
      id: '6',
      name: 'Dr. Arun Kumar',
      specialty: 'ENT Specialist',
      image: 'https://randomuser.me/api/portraits/men/55.jpg',
      hospital: 'Fortis Healthcare, Chennai'
    },
    appointment_time: '2024-03-10T09:30:00Z',
    status: 'cancelled',
    notes: 'Ear infection follow-up'
  }
];

const Appointments = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('upcoming');
  
  // In a real app, this would be a query to Supabase
  const { data: appointments, isLoading, refetch } = useQuery({
    queryKey: ['appointments'],
    queryFn: async () => {
      // In development, use mock data
      return mockAppointments;
      
      // In production with Supabase:
      // const user = await supabase.auth.getUser();
      // if (!user.data.user) throw new Error('Not authenticated');
      
      // const { data, error } = await supabase
      //   .from('appointments')
      //   .select(`
      //     *,
      //     doctor:doctor_id(id, full_name, specialization, avatar_url, hospital)
      //   `)
      //   .eq('patient_id', user.data.user.id);
      
      // if (error) throw error;
      // return data;
    }
  });

  const handleCancelAppointment = async (appointmentId: string) => {
    try {
      // In a real app with Supabase:
      // const { error } = await supabase
      //   .from('appointments')
      //   .update({ status: 'cancelled' })
      //   .eq('id', appointmentId);
      
      // if (error) throw error;
      
      toast({
        title: "Appointment Cancelled",
        description: "The appointment has been cancelled successfully"
      });
      
      refetch();
      
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      toast({
        title: "Error",
        description: "Failed to cancel appointment",
        variant: "destructive"
      });
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'upcoming':
        return <Badge className="bg-healthBlue-500">Upcoming</Badge>;
      case 'completed':
        return <Badge className="bg-healthGreen-500">Completed</Badge>;
      case 'cancelled':
        return <Badge className="bg-gray-500">Cancelled</Badge>;
      default:
        return <Badge className="bg-yellow-500">Pending</Badge>;
    }
  };

  const filteredAppointments = appointments?.filter(appointment => {
    if (activeTab === 'all') return true;
    return appointment.status === activeTab;
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="container py-12">
          <div className="flex justify-center">
            <p>Loading appointments...</p>
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
            <h1 className="text-3xl font-bold text-healthBlue-800">My Appointments</h1>
            <p className="text-gray-600 mt-2">Manage your upcoming and past medical appointments</p>
          </div>
          
          <Button 
            className="mt-4 md:mt-0 bg-healthBlue-600 hover:bg-healthBlue-700"
            onClick={() => navigate('/doctors')}
          >
            Book New Appointment
          </Button>
        </div>
        
        <Tabs defaultValue="upcoming" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="upcoming">
              <Calendar className="h-4 w-4 mr-2" />
              Upcoming
            </TabsTrigger>
            <TabsTrigger value="completed">
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Completed
            </TabsTrigger>
            <TabsTrigger value="cancelled">
              <XCircle className="h-4 w-4 mr-2" />
              Cancelled
            </TabsTrigger>
            <TabsTrigger value="all">
              <AlertCircle className="h-4 w-4 mr-2" />
              All
            </TabsTrigger>
          </TabsList>
          
          {filteredAppointments && filteredAppointments.length > 0 ? (
            <TabsContent value={activeTab} className="mt-0">
              <div className="grid grid-cols-1 gap-6">
                {filteredAppointments.map((appointment) => (
                  <Card key={appointment.id} className="overflow-hidden">
                    <div className={`h-2 ${
                      appointment.status === 'upcoming' ? 'bg-healthBlue-500' :
                      appointment.status === 'completed' ? 'bg-healthGreen-500' :
                      'bg-gray-400'
                    }`}></div>
                    <CardContent className="p-0">
                      <div className="flex flex-col md:flex-row">
                        <div className="p-6 md:w-2/3">
                          <div className="flex items-center mb-4">
                            <img 
                              src={appointment.doctor.image} 
                              alt={appointment.doctor.name} 
                              className="h-12 w-12 rounded-full object-cover mr-4"
                            />
                            <div>
                              <h3 className="font-semibold text-lg">{appointment.doctor.name}</h3>
                              <p className="text-sm text-gray-600">{appointment.doctor.specialty}</p>
                            </div>
                          </div>
                          
                          <div className="space-y-3">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                              <span className="text-gray-700">
                                {format(parseISO(appointment.appointment_time), 'EEEE, MMMM d, yyyy')}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 text-gray-500 mr-2" />
                              <span className="text-gray-700">
                                {format(parseISO(appointment.appointment_time), 'h:mm a')}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 text-gray-500 mr-2" />
                              <span className="text-gray-700">{appointment.doctor.hospital}</span>
                            </div>
                            {appointment.notes && (
                              <div className="flex items-start">
                                <FileText className="h-4 w-4 text-gray-500 mr-2 mt-1" />
                                <span className="text-gray-700">{appointment.notes}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="bg-gray-50 p-6 md:w-1/3 flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-center mb-4">
                              <h4 className="font-medium">Appointment Status</h4>
                              {getStatusBadge(appointment.status)}
                            </div>
                            
                            <p className="text-sm text-gray-600 mb-6">
                              {appointment.status === 'upcoming' ? 
                                "Your appointment is confirmed. Please arrive 15 minutes early." : 
                                appointment.status === 'completed' ? 
                                "This appointment has been completed." :
                                "This appointment was cancelled."}
                            </p>
                          </div>
                          
                          <div className="space-y-2">
                            {appointment.status === 'upcoming' && (
                              <>
                                <Button 
                                  className="w-full bg-healthBlue-600 hover:bg-healthBlue-700"
                                  onClick={() => navigate(`/doctors/${appointment.doctor.id}`)}
                                >
                                  Reschedule
                                </Button>
                                <Button 
                                  variant="outline" 
                                  className="w-full border-red-300 text-red-600 hover:bg-red-50"
                                  onClick={() => handleCancelAppointment(appointment.id)}
                                >
                                  Cancel
                                </Button>
                              </>
                            )}
                            {appointment.status === 'completed' && (
                              <Button 
                                variant="outline" 
                                className="w-full"
                              >
                                View Summary
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ) : (
            <Card className="text-center p-8">
              <div className="flex flex-col items-center">
                <Calendar className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-xl font-medium mb-2">No {activeTab} appointments</h3>
                <p className="text-gray-600 mb-6">
                  {activeTab === 'upcoming' 
                    ? "You don't have any upcoming appointments scheduled."
                    : activeTab === 'completed'
                    ? "You don't have any completed appointments yet."
                    : activeTab === 'cancelled'
                    ? "You don't have any cancelled appointments."
                    : "You don't have any appointments yet."}
                </p>
                <Button 
                  className="bg-healthBlue-600 hover:bg-healthBlue-700"
                  onClick={() => navigate('/doctors')}
                >
                  Book an Appointment
                </Button>
              </div>
            </Card>
          )}
        </Tabs>
      </div>
    </Layout>
  );
};

export default Appointments;
