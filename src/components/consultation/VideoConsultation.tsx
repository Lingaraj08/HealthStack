
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/components/auth/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Mic, MicOff, Video, VideoOff, Phone, Monitor, User } from 'lucide-react';
import { toast } from 'sonner';

declare global {
  interface Window {
    Peer: any;
  }
}

interface AppointmentDetails {
  id: string;
  doctor_id: string;
  patient_id: string;
  doctor: {
    id: string;
    full_name: string;
    user_id: string;
  };
  patient: {
    id: string;
    first_name: string;
    last_name: string;
  };
}

const VideoConsultation = () => {
  const navigate = useNavigate();
  const { appointmentId } = useParams();
  const { user, userRole } = useAuth();
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [peer, setPeer] = useState<any>(null);
  const [connected, setConnected] = useState(false);
  const [peerId, setPeerId] = useState<string | null>(null);
  const [remotePeerId, setRemotePeerId] = useState<string | null>(null);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isCallEnded, setIsCallEnded] = useState(false);
  
  // Load PeerJS script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/peerjs@1.4.7/dist/peerjs.min.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);
  
  // Fetch appointment details
  const { data: appointment, isLoading } = useQuery({
    queryKey: ['appointment-details', appointmentId],
    queryFn: async () => {
      if (!user || !appointmentId) throw new Error('Not authenticated or missing appointment ID');
      
      let query = supabase
        .from('appointments')
        .select(`
          id,
          doctor_id,
          patient_id,
          doctor:doctor_id (id, full_name, user_id),
          patient:patient_id (id, first_name, last_name)
        `)
        .eq('id', appointmentId)
        .single();
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as unknown as AppointmentDetails;
    },
    enabled: !!user && !!appointmentId
  });
  
  // Initialize media and peer connection
  useEffect(() => {
    if (!appointment || !window.Peer) return;
    
    // Initialize media
    const initializeMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: true, 
          audio: true 
        });
        
        setLocalStream(stream);
        
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing media devices:', error);
        toast.error('Could not access camera or microphone');
      }
    };
    
    // Initialize peer
    const initializePeer = () => {
      // Create unique peer ID based on user ID and role
      const id = `${userRole}-${user?.id.substring(0, 8)}`;
      
      const newPeer = new window.Peer(id, {
        host: 'peerjs-server.herokuapp.com',
        secure: true
      });
      
      newPeer.on('open', (id: string) => {
        console.log('My peer ID is:', id);
        setPeerId(id);
        
        // Determine remote peer ID
        let remoteId;
        if (userRole === 'doctor') {
          remoteId = `patient-${appointment.patient_id.substring(0, 8)}`;
        } else {
          remoteId = `doctor-${appointment.doctor.user_id.substring(0, 8)}`;
        }
        setRemotePeerId(remoteId);
      });
      
      newPeer.on('call', (call: any) => {
        toast.info('Incoming call...');
        
        call.answer(localStream);
        
        call.on('stream', (incomingStream: MediaStream) => {
          setRemoteStream(incomingStream);
          setConnected(true);
          
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = incomingStream;
          }
        });
        
        call.on('error', (err: any) => {
          console.error('Call error:', err);
          toast.error('Call error occurred');
        });
        
        call.on('close', () => {
          setConnected(false);
          toast.info('Call ended');
        });
      });
      
      newPeer.on('error', (err: any) => {
        console.error('Peer connection error:', err);
        toast.error('Connection error occurred');
      });
      
      setPeer(newPeer);
    };
    
    initializeMedia().then(() => {
      if (window.Peer) {
        initializePeer();
      }
    });
    
    return () => {
      // Clean up
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
      if (peer) {
        peer.destroy();
      }
    };
  }, [appointment, userRole, user, window.Peer]);
  
  // Call the other party
  const startCall = () => {
    if (!peer || !remotePeerId || !localStream) {
      toast.error('Cannot start call yet');
      return;
    }
    
    toast.info('Calling...');
    
    const call = peer.call(remotePeerId, localStream);
    
    call.on('stream', (incomingStream: MediaStream) => {
      setRemoteStream(incomingStream);
      setConnected(true);
      
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = incomingStream;
      }
      
      toast.success('Connected!');
    });
    
    call.on('error', (err: any) => {
      console.error('Call error:', err);
      toast.error('Call error occurred');
    });
    
    call.on('close', () => {
      setConnected(false);
      toast.info('Call ended');
    });
  };
  
  // Toggle audio
  const toggleAudio = () => {
    if (localStream) {
      const audioTracks = localStream.getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsAudioEnabled(!isAudioEnabled);
    }
  };
  
  // Toggle video
  const toggleVideo = () => {
    if (localStream) {
      const videoTracks = localStream.getVideoTracks();
      videoTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsVideoEnabled(!isVideoEnabled);
    }
  };
  
  // End call
  const endCall = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    if (peer) {
      peer.destroy();
    }
    setIsCallEnded(true);
    setConnected(false);
    toast.info('You ended the call');
    
    // Redirect after a delay
    setTimeout(() => {
      navigate(userRole === 'doctor' ? '/doctor-dashboard' : '/appointments');
    }, 3000);
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
  
  if (isLoading) {
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
  
  return (
    <div className="flex flex-col h-screen bg-black">
      {/* Main video area */}
      <div className="flex-grow relative">
        {/* Remote video (full screen) */}
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
          {connected ? (
            <video 
              ref={remoteVideoRef} 
              autoPlay 
              playsInline 
              className="max-h-full max-w-full"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-white">
              <div className="h-24 w-24 rounded-full bg-gray-700 flex items-center justify-center mb-4">
                <User className="h-12 w-12 text-gray-300" />
              </div>
              <p className="text-xl mb-6">
                {userRole === 'doctor' ? 
                  `Waiting for ${appointment.patient.first_name} ${appointment.patient.last_name}...` : 
                  `Waiting for Dr. ${appointment.doctor.full_name}...`}
              </p>
              {peerId && !connected && (
                <Button onClick={startCall}>
                  Start Call
                </Button>
              )}
            </div>
          )}
        </div>
        
        {/* Local video (picture-in-picture) */}
        <div className="absolute bottom-4 right-4 w-64 h-48 bg-black rounded-lg overflow-hidden border-2 border-white shadow-lg">
          <video 
            ref={localVideoRef} 
            autoPlay 
            muted 
            playsInline 
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      
      {/* Controls bar */}
      <div className="h-20 bg-gray-900 flex items-center justify-center px-4">
        <div className="flex space-x-4">
          <Button 
            variant="outline" 
            className={`rounded-full w-12 h-12 flex items-center justify-center ${isAudioEnabled ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-red-600 text-white hover:bg-red-700'}`}
            onClick={toggleAudio}
          >
            {isAudioEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
          </Button>
          
          <Button 
            variant="outline" 
            className={`rounded-full w-12 h-12 flex items-center justify-center ${isVideoEnabled ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-red-600 text-white hover:bg-red-700'}`}
            onClick={toggleVideo}
          >
            {isVideoEnabled ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
          </Button>
          
          <Button 
            className="rounded-full w-16 h-16 flex items-center justify-center bg-red-600 hover:bg-red-700"
            onClick={endCall}
          >
            <Phone className="h-6 w-6 rotate-135" />
          </Button>
          
          <Button 
            variant="outline" 
            className="rounded-full w-12 h-12 flex items-center justify-center bg-gray-700 text-white hover:bg-gray-600"
          >
            <Monitor className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      {/* Call ended overlay */}
      {isCallEnded && (
        <div className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center">
          <div className="text-center text-white">
            <h2 className="text-2xl font-bold mb-4">Call Ended</h2>
            <p className="mb-6">You will be redirected shortly...</p>
            <Button onClick={() => navigate(userRole === 'doctor' ? '/doctor-dashboard' : '/appointments')}>
              Return to Dashboard
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoConsultation;
