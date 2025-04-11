
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { 
  Card, CardContent, CardDescription, 
  CardHeader, CardTitle, CardFooter 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/components/ui/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { Star, MapPin, Award, Calendar as CalendarIcon, Clock, Users, FileText } from 'lucide-react';
import { format } from 'date-fns';

// Mock doctor data for development - in real app would come from Supabase
const mockDoctors = [
  {
    id: '1',
    full_name: 'Dr. Priya Sharma',
    specialization: 'Cardiologist',
    years_of_experience: 12,
    hospital: 'Apollo Hospital, Delhi',
    rating: 4.9,
    available_for_consultation: true,
    avatar_url: 'https://randomuser.me/api/portraits/women/65.jpg',
    qualification: ['MBBS', 'MD', 'DNB Cardiology'],
    bio: 'Dr. Sharma is a highly experienced cardiologist with over 12 years of clinical practice. She specializes in interventional cardiology and has performed over 1000 heart procedures.'
  },
  {
    id: '2',
    full_name: 'Dr. Rahul Mehta',
    specialization: 'Neurologist',
    years_of_experience: 8,
    hospital: 'Fortis Healthcare, Mumbai',
    rating: 4.7,
    available_for_consultation: true,
    avatar_url: 'https://randomuser.me/api/portraits/men/32.jpg',
    qualification: ['MBBS', 'MD', 'DM Neurology'],
    bio: 'Dr. Mehta is an expert in treating neurological disorders. He has special interest in movement disorders and headaches.'
  },
  {
    id: '3',
    full_name: 'Dr. Ananya Patel',
    specialization: 'Pediatrician',
    years_of_experience: 15,
    hospital: 'Max Healthcare, Bangalore',
    rating: 4.8,
    available_for_consultation: false,
    avatar_url: 'https://randomuser.me/api/portraits/women/45.jpg',
    qualification: ['MBBS', 'MD Pediatrics'],
    bio: 'Dr. Patel is a compassionate pediatrician with 15 years of experience in child healthcare. She specializes in developmental pediatrics.'
  },
  {
    id: '4',
    full_name: 'Dr. Vikram Singh',
    specialization: 'Dermatologist',
    years_of_experience: 10,
    hospital: 'AIIMS, New Delhi',
    rating: 4.6,
    available_for_consultation: true,
    avatar_url: 'https://randomuser.me/api/portraits/men/67.jpg',
    qualification: ['MBBS', 'MD Dermatology'],
    bio: 'Dr. Singh is an established dermatologist with expertise in cosmetic dermatology and skin disorders.'
  }
];

const timeSlots = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM', '01:00 PM', '01:30 PM',
  '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
  '04:00 PM', '04:30 PM'
];

const DoctorDetail = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  
  const form = useForm({
    defaultValues: {
      notes: '',
    },
  });

  // In a real app, this would be a query to Supabase
  const { data: doctor, isLoading } = useQuery({
    queryKey: ['doctor', doctorId],
    queryFn: async () => {
      // In development, use mock data
      return mockDoctors.find(d => d.id === doctorId);
      
      // In production with Supabase:
      // const { data, error } = await supabase
      //   .from('doctors')
      //   .select('*')
      //   .eq('id', doctorId)
      //   .single();
      // if (error) throw error;
      // return data;
    }
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="container py-12">
          <div className="flex justify-center">
            <p>Loading doctor profile...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!doctor) {
    return (
      <Layout>
        <div className="container py-12">
          <div className="flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-4">Doctor Not Found</h2>
            <Button onClick={() => navigate('/doctors')}>Back to Doctors</Button>
          </div>
        </div>
      </Layout>
    );
  }

  const handleBookAppointment = async (formData: { notes: string }) => {
    if (!date || !selectedTimeSlot) {
      toast({
        title: "Missing Information",
        description: "Please select both date and time for your appointment",
        variant: "destructive"
      });
      return;
    }
    
    // In a real app, this would save to Supabase
    // const { data, error } = await supabase
    //   .from('appointments')
    //   .insert({
    //     doctor_id: doctorId,
    //     patient_id: auth.user.id,
    //     appointment_time: new Date(`${format(date, 'yyyy-MM-dd')} ${selectedTimeSlot}`).toISOString(),
    //     notes: formData.notes,
    //     status: 'pending'
    //   });
    
    toast({
      title: "Appointment Booked",
      description: `Appointment scheduled with ${doctor.full_name} on ${format(date, 'MMMM dd, yyyy')} at ${selectedTimeSlot}`,
    });
    
    navigate('/');
  };

  return (
    <Layout>
      <div className="container mx-auto py-12">
        <div className="mb-8">
          <Button variant="outline" onClick={() => navigate('/doctors')} className="mb-6">
            ← Back to Doctors
          </Button>
          
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/4">
                  <div className="rounded-lg overflow-hidden">
                    <img 
                      src={doctor.avatar_url} 
                      alt={doctor.full_name} 
                      className="w-full aspect-square object-cover"
                    />
                  </div>
                </div>
                
                <div className="md:w-3/4">
                  <div className="flex flex-col md:flex-row justify-between mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-healthBlue-800">{doctor.full_name}</h2>
                      <p className="text-gray-600">{doctor.specialization}</p>
                      
                      <div className="flex items-center mt-2">
                        <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                        <span className="ml-1 font-medium">{doctor.rating}</span>
                        <span className="ml-2 text-gray-500">(120+ reviews)</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 md:mt-0">
                      <Badge variant="outline" className="bg-healthBlue-50 text-healthBlue-700 border-healthBlue-200 mb-2">
                        ABDM Verified
                      </Badge>
                      {doctor.available_for_consultation ? (
                        <Badge variant="outline" className="bg-healthGreen-50 text-healthGreen-700 border-healthGreen-200 ml-2">
                          Available Today
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200 ml-2">
                          Next Available: Tomorrow
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>{doctor.hospital}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Award className="h-4 w-4 mr-2" />
                      <span>{doctor.years_of_experience} years of experience</span>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="font-semibold text-lg mb-2">About</h3>
                    <p className="text-gray-700">{doctor.bio}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Qualifications</h3>
                    <div className="flex flex-wrap gap-2">
                      {doctor.qualification.map((qual, index) => (
                        <Badge key={index} variant="outline" className="bg-gray-50 text-gray-700">
                          {qual}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Book an Appointment</CardTitle>
              <CardDescription>Select a date and time that works for you</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="calendar">
                <TabsList className="mb-4">
                  <TabsTrigger value="calendar">Calendar</TabsTrigger>
                  <TabsTrigger value="details">Appointment Details</TabsTrigger>
                </TabsList>
                
                <TabsContent value="calendar">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-medium mb-2">Select Date</h3>
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        className="rounded-md border"
                        disabled={(date) => 
                          date < new Date() || 
                          date > new Date(new Date().setDate(new Date().getDate() + 30))
                        }
                      />
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-2">Select Time</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {timeSlots.map((time) => (
                          <Button
                            key={time}
                            type="button"
                            variant={selectedTimeSlot === time ? "default" : "outline"}
                            className={`justify-start ${selectedTimeSlot === time ? "bg-healthBlue-600" : ""}`}
                            onClick={() => setSelectedTimeSlot(time)}
                          >
                            <Clock className="mr-2 h-4 w-4" />
                            {time}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="details">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleBookAppointment)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="notes"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Additional Notes</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Describe your symptoms or any information the doctor should know"
                                className="min-h-[120px]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="flex flex-col space-y-4">
                        <div className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center">
                            <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-600">Appointment Date</span>
                          </div>
                          <span className="font-medium">
                            {date ? format(date, 'MMMM dd, yyyy') : 'Not selected'}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center">
                            <Clock className="mr-2 h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-600">Appointment Time</span>
                          </div>
                          <span className="font-medium">{selectedTimeSlot || 'Not selected'}</span>
                        </div>
                      </div>
                    </form>
                  </Form>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => navigate('/doctors')}>
                Cancel
              </Button>
              <Button 
                onClick={form.handleSubmit(handleBookAppointment)}
                disabled={!date || !selectedTimeSlot}
                className="bg-healthBlue-600 hover:bg-healthBlue-700"
              >
                Confirm Appointment
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default DoctorDetail;
