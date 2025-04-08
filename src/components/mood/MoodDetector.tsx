
import React, { useEffect, useRef, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Smile, Frown, Meh } from 'lucide-react';

export type Mood = 'happy' | 'sad' | 'neutral' | null;

interface MoodDetectorProps {
  onMoodDetected: (mood: Mood) => void;
  active: boolean;
}

const MoodDetector: React.FC<MoodDetectorProps> = ({ onMoodDetected, active }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [permission, setPermission] = useState<boolean>(false);
  const { toast } = useToast();
  
  // Request camera permissions and setup video stream
  useEffect(() => {
    if (!active) return;

    const setupCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            facingMode: 'user',
            width: { ideal: 320 },
            height: { ideal: 240 }
          } 
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          streamRef.current = stream;
          setPermission(true);
          
          // Start mood detection after camera is ready
          setTimeout(detectMood, 2000);
        }
      } catch (err) {
        console.error('Error accessing camera:', err);
        toast({
          title: "Camera Access Denied",
          description: "Please allow camera access to enable mood detection.",
          variant: "destructive",
        });
        setPermission(false);
      }
    };

    setupCamera();
    
    // Cleanup function
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [active, toast]);
  
  // Simple mood detection logic - in a real app, this would use a proper ML model
  const detectMood = () => {
    if (!permission || !active) return;
    
    // For demo purposes, we'll use a simple random mood generator
    // In a real application, you would integrate with a facial expression API or ML model
    const moods: Mood[] = ['happy', 'sad', 'neutral'];
    const detectedMood = moods[Math.floor(Math.random() * moods.length)];
    
    // Send the detected mood to the parent component
    onMoodDetected(detectedMood);
    
    // In a real app, you would analyze frames continuously
    // For demo purposes, we'll detect mood every 30 seconds
    setTimeout(detectMood, 30000);
  };
  
  return (
    <div className={`${active ? 'flex' : 'hidden'} flex-col items-center`}>
      <video 
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full rounded-full object-cover opacity-0 absolute"
        style={{ maxWidth: '100px', maxHeight: '100px' }}
      />
      <div className="flex gap-2 items-center text-xs text-gray-500">
        <span>Mood Detection:</span>
        {permission ? (
          <span className="text-green-500 flex items-center gap-1">
            Active <span className="inline-block h-2 w-2 bg-green-500 rounded-full animate-pulse"></span>
          </span>
        ) : (
          <span className="text-red-500">Inactive</span>
        )}
      </div>
    </div>
  );
};

export default MoodDetector;
