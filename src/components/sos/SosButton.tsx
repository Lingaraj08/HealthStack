
import React, { useState } from 'react';
import { AlertOctagon, PhoneCall, AlertCircle } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface UserProfile {
  id: string;
  guardian_phone?: string;
  // Add other profile fields as needed
}

const SosButton: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isActivated, setIsActivated] = useState(false);
  
  // Fetch guardian contact information with proper type handling
  const { data: profile, isLoading } = useQuery({
    queryKey: ['guardian-contact', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('Not authenticated');
      
      const { data, error } = await supabase
        .from('profiles')
        .select('guardian_phone')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      return data as UserProfile;
    },
    enabled: !!user
  });

  const handleSosActivation = () => {
    if (!profile?.guardian_phone) {
      toast({
        title: "No emergency contact found",
        description: "Please add an emergency contact in your profile settings.",
        variant: "destructive"
      });
      return;
    }

    setIsActivated(true);
    
    // In a real app, this would trigger emergency notifications via an API
    toast({
      title: "SOS Emergency Alert Sent",
      description: `Alerting your emergency contact: ${profile.guardian_phone}`,
      variant: "destructive"
    });
    
    // Simulating making a call
    setTimeout(() => {
      // In a real app, this would use a telephony API
      toast({
        title: "Emergency call initiated",
        description: "Calling your emergency contact now",
        variant: "default"
      });
      
      // Reset after simulated response
      setTimeout(() => {
        setIsActivated(false);
        setIsDialogOpen(false);
      }, 3000);
    }, 2000);
  };

  if (!user || isLoading) {
    return null;
  }

  return (
    <>
      <Button
        className="fixed bottom-24 right-6 z-40 h-14 w-14 rounded-full bg-healthRed-500 hover:bg-red-600 shadow-lg flex items-center justify-center border-4 border-white"
        size="icon"
        onClick={() => setIsDialogOpen(true)}
      >
        <AlertOctagon className="h-6 w-6" />
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-red-600 flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              Emergency SOS Alert
            </DialogTitle>
            <DialogDescription>
              This will send an emergency alert to your registered emergency contact.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <p className="text-sm text-gray-700 mb-4">
              Emergency contact: {profile?.guardian_phone || 'Not configured'}
            </p>
            
            {!profile?.guardian_phone && (
              <p className="text-sm text-red-500">
                Please add an emergency contact in your profile settings before using this feature.
              </p>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isActivated}>
              Cancel
            </Button>
            <Button 
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={handleSosActivation}
              disabled={!profile?.guardian_phone || isActivated}
            >
              {isActivated ? (
                <span className="flex items-center">
                  <PhoneCall className="h-4 w-4 mr-2 animate-pulse" />
                  Alerting...
                </span>
              ) : (
                <span className="flex items-center">
                  <PhoneCall className="h-4 w-4 mr-2" />
                  Activate SOS
                </span>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SosButton;
