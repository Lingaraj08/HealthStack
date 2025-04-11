
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { CheckCircle, Clock, Bell, Calendar } from 'lucide-react';
import { format, isToday, isTomorrow, isYesterday } from 'date-fns';

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  time: string;
  user_id: string;
  quantity_remaining?: number;
}

interface Reminder {
  id: string;
  medication_id: string;
  user_id: string;
  scheduled_time: string;
  taken: boolean;
  created_at: string;
  medication?: Medication;
}

const MedicationReminders: React.FC = () => {
  const { user } = useAuth();
  const [medications, setMedications] = useState<Medication[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (!user) return;
    
    const fetchMedications = async () => {
      try {
        const { data, error } = await supabase
          .from('medications')
          .select('*')
          .eq('user_id', user.id);
          
        if (error) throw error;
        
        setMedications(data as Medication[]);
      } catch (error) {
        console.error('Error fetching medications:', error);
        toast.error('Failed to load your medications');
      }
    };
    
    const fetchReminders = async () => {
      try {
        const { data, error } = await supabase
          .from('medication_reminders')
          .select(`
            id, 
            medication_id,
            user_id,
            scheduled_time,
            taken,
            created_at,
            medication:medication_id (
              id,
              name,
              dosage,
              frequency,
              time,
              quantity_remaining
            )
          `)
          .eq('user_id', user.id)
          .order('scheduled_time');
          
        if (error) throw error;
        
        setReminders(data as Reminder[]);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching reminders:', error);
        toast.error('Failed to load your medication reminders');
        setLoading(false);
      }
    };
    
    fetchMedications();
    fetchReminders();
  }, [user]);
  
  const markReminderAsTaken = async (reminderId: string) => {
    try {
      const { error } = await supabase
        .from('medication_reminders')
        .update({ taken: true })
        .eq('id', reminderId);
      
      if (error) throw error;
      
      setReminders(prevReminders => 
        prevReminders.map(reminder => 
          reminder.id === reminderId 
            ? { ...reminder, taken: true } 
            : reminder
        )
      );
      
      toast.success('Medication marked as taken!');
      
      // Update medication quantity if applicable
      const reminder = reminders.find(r => r.id === reminderId);
      if (reminder && reminder.medication && reminder.medication.quantity_remaining !== undefined) {
        const { error: updateError } = await supabase
          .from('medications')
          .update({ 
            quantity_remaining: Math.max(0, reminder.medication.quantity_remaining - 1) 
          })
          .eq('id', reminder.medication_id);
          
        if (updateError) console.error('Error updating medication quantity:', updateError);
      }
    } catch (error) {
      console.error('Error marking reminder as taken:', error);
      toast.error('Failed to update medication status');
    }
  };
  
  const formatScheduledTime = (dateString: string) => {
    const date = new Date(dateString);
    
    if (isToday(date)) {
      return `Today at ${format(date, 'h:mm a')}`;
    } else if (isTomorrow(date)) {
      return `Tomorrow at ${format(date, 'h:mm a')}`;
    } else if (isYesterday(date)) {
      return `Yesterday at ${format(date, 'h:mm a')}`;
    } else {
      return format(date, 'MMM d, yyyy - h:mm a');
    }
  };
  
  if (!user) return null;
  
  const upcomingReminders = reminders
    .filter(reminder => !reminder.taken && new Date(reminder.scheduled_time) >= new Date())
    .slice(0, 5);
    
  const recentlyTakenReminders = reminders
    .filter(reminder => reminder.taken)
    .sort((a, b) => new Date(b.scheduled_time).getTime() - new Date(a.scheduled_time).getTime())
    .slice(0, 3);
  
  return (
    <div className="space-y-4">
      <Card className="border-healthBlue-100">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <Bell className="h-5 w-5 mr-2 text-healthBlue-500" />
            Upcoming Medications
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin h-6 w-6 border-2 border-healthBlue-500 border-t-transparent rounded-full"></div>
            </div>
          ) : upcomingReminders.length > 0 ? (
            <div className="space-y-2">
              {upcomingReminders.map(reminder => (
                <div key={reminder.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-md border">
                  <div>
                    <p className="font-medium">{reminder.medication?.name}</p>
                    <p className="text-xs text-gray-600">{reminder.medication?.dosage}</p>
                    <p className="text-xs text-gray-500">{formatScheduledTime(reminder.scheduled_time)}</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => markReminderAsTaken(reminder.id)}
                    className="border-healthGreen-200 text-healthGreen-700 hover:bg-healthGreen-50"
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Take
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-2">No upcoming medication reminders</p>
          )}
        </CardContent>
      </Card>
      
      <Card className="border-healthGreen-100">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <CheckCircle className="h-5 w-5 mr-2 text-healthGreen-500" />
            Recently Taken
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin h-6 w-6 border-2 border-healthGreen-500 border-t-transparent rounded-full"></div>
            </div>
          ) : recentlyTakenReminders.length > 0 ? (
            <div className="space-y-2">
              {recentlyTakenReminders.map(reminder => (
                <div key={reminder.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-md border">
                  <div>
                    <p className="font-medium">{reminder.medication?.name}</p>
                    <p className="text-xs text-gray-600">{reminder.medication?.dosage}</p>
                    <p className="text-xs text-gray-500">Taken {formatScheduledTime(reminder.scheduled_time)}</p>
                  </div>
                  <div className="bg-healthGreen-100 text-healthGreen-700 p-1 rounded-full">
                    <CheckCircle className="h-4 w-4" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-2">No recently taken medications</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MedicationReminders;
