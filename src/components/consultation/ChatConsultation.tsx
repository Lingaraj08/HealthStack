
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/components/auth/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Send, ArrowLeft, Video } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

interface Message {
  id: string;
  appointment_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  sender_role: 'doctor' | 'patient';
}

interface AppointmentDetails {
  id: string;
  doctor_id: string;
  patient_id: string;
  appointment_time: string;
  doctor: {
    id: string;
    full_name: string;
    user_id: string;
    specialization: string;
    avatar_url?: string;
  };
  patient: {
    id: string;
    first_name: string;
    last_name: string;
    avatar_url?: string;
  };
}

const ChatConsultation = () => {
  const navigate = useNavigate();
  const { appointmentId } = useParams();
  const { user, userRole } = useAuth();
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Fetch appointment details
  const { data: appointment, isLoading } = useQuery({
    queryKey: ['appointment-chat-details', appointmentId],
    queryFn: async () => {
      if (!user || !appointmentId) throw new Error('Not authenticated or missing appointment ID');
      
      let query = supabase
        .from('appointments')
        .select(`
          id,
          doctor_id,
          patient_id,
          appointment_time,
          doctor:doctor_id (id, full_name, user_id, specialization, avatar_url),
          patient:patient_id (id, first_name, last_name, avatar_url)
        `)
        .eq('id', appointmentId)
        .single();
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as unknown as AppointmentDetails;
    },
    enabled: !!user && !!appointmentId
  });
  
  // Fetch messages
  const fetchMessages = async () => {
    if (!user || !appointmentId) return;
    
    try {
      const { data: messagesData, error } = await supabase
        .from('consultation_messages')
        .select('*')
        .eq('appointment_id', appointmentId)
        .order('created_at');
      
      if (error) throw error;
      
      setMessages(messagesData as Message[]); 
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Subscribe to real-time messages
  useEffect(() => {
    if (!appointmentId) return;
    
    fetchMessages();
    
    // Subscribe to changes
    const channel = supabase
      .channel(`appointment-${appointmentId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'consultation_messages',
          filter: `appointment_id=eq.${appointmentId}`,
        },
        (payload) => {
          const newMessage = payload.new as Message;
          setMessages((prev) => [...prev, newMessage]);
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [appointmentId]);
  
  // Scroll to bottom on new messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  // Send a message
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !user || !appointmentId || !userRole) return;
    
    try {
      const messageData = {
        appointment_id: appointmentId,
        sender_id: user.id,
        content: newMessage.trim(),
        sender_role: userRole
      };
      
      const { error } = await supabase
        .from('consultation_messages')
        .insert(messageData);
      
      if (error) throw error;
      
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };
  
  // Start video call
  const startVideoCall = () => {
    navigate(`/video-consultation/${appointmentId}`);
  };
  
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Card className="p-8 max-w-md w-full text-center">
          <h2 className="text-xl font-semibold">Authentication Required</h2>
          <p className="mt-2 text-gray-600">You need to be signed in to access this page.</p>
          <Button className="mt-4" onClick={() => navigate('/auth')}>Sign In</Button>
        </Card>
      </div>
    );
  }
  
  if (isLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="animate-spin h-12 w-12 border-4 border-healthBlue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  if (!appointment) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Card className="p-8 max-w-md w-full text-center">
          <h2 className="text-xl font-semibold">Appointment Not Found</h2>
          <p className="mt-2 text-gray-600">The consultation you're looking for doesn't exist or you don't have permission to access it.</p>
          <Button className="mt-4" onClick={() => navigate(userRole === 'doctor' ? '/doctor-dashboard' : '/appointments')}>Go Back</Button>
        </Card>
      </div>
    );
  }
  
  const otherParty = userRole === 'doctor' ? 
    `${appointment.patient.first_name} ${appointment.patient.last_name}` : 
    `Dr. ${appointment.doctor.full_name}`;
  
  const otherPartyAvatar = userRole === 'doctor' ? 
    appointment.patient.avatar_url : 
    appointment.doctor.avatar_url;
  
  const otherPartyInitials = userRole === 'doctor' ? 
    `${appointment.patient.first_name[0]}${appointment.patient.last_name[0]}` : 
    appointment.doctor.full_name.split(' ').map(n => n[0]).join('');
  
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b py-4 px-6 flex items-center shadow-sm">
        <Button 
          variant="ghost" 
          size="icon"
          className="mr-2"
          onClick={() => navigate(userRole === 'doctor' ? '/doctor-dashboard' : '/appointments')}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        
        <Avatar className="h-10 w-10 mr-3">
          <AvatarImage src={otherPartyAvatar} />
          <AvatarFallback>{otherPartyInitials}</AvatarFallback>
        </Avatar>
        
        <div className="flex-grow">
          <h2 className="font-semibold">{otherParty}</h2>
          <p className="text-sm text-gray-600">
            {userRole === 'patient' && appointment.doctor.specialization}
            {userRole === 'doctor' && 'Patient'}
          </p>
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="ml-2 bg-healthBlue-50 text-healthBlue-600 border-healthBlue-200"
          onClick={startVideoCall}
        >
          <Video className="h-4 w-4 mr-1" /> Video Call
        </Button>
      </div>
      
      {/* Chat messages */}
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {/* Appointment info card */}
        <Card className="mb-4">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Appointment Details</h3>
                <p className="text-sm text-gray-600">
                  {format(new Date(appointment.appointment_time), 'MMMM d, yyyy • h:mm a')}
                </p>
              </div>
              <Badge variant="outline" className="bg-healthGreen-50 text-healthGreen-700 border-healthGreen-200">
                Confirmed
              </Badge>
            </div>
          </CardContent>
        </Card>
        
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => (
            <div 
              key={message.id} 
              className={`flex ${message.sender_id === user.id ? 'justify-end' : 'justify-start'}`}
            >
              {message.sender_id !== user.id && userRole === 'patient' && (
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarImage src={appointment.doctor.avatar_url} />
                  <AvatarFallback>{appointment.doctor.full_name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
              )}
              
              {message.sender_id !== user.id && userRole === 'doctor' && (
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarImage src={appointment.patient.avatar_url} />
                  <AvatarFallback>
                    {appointment.patient.first_name[0]}{appointment.patient.last_name[0]}
                  </AvatarFallback>
                </Avatar>
              )}
              
              <div 
                className={`max-w-[70%] rounded-lg px-4 py-2 ${
                  message.sender_id === user.id 
                    ? 'bg-healthBlue-600 text-white' 
                    : 'bg-white border border-gray-200'
                }`}
              >
                <p className="mb-1">{message.content}</p>
                <p className={`text-xs ${
                  message.sender_id === user.id ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {format(new Date(message.created_at), 'h:mm a')}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Message input */}
      <div className="bg-white border-t p-4">
        <form onSubmit={sendMessage} className="flex items-center">
          <Input 
            placeholder="Type your message here..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-grow"
          />
          <Button 
            type="submit" 
            className="ml-2 bg-healthBlue-600 hover:bg-healthBlue-700"
            disabled={!newMessage.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChatConsultation;
