
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { toast as sonnerToast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Bell, Clock, Plus, Trash2, Calendar, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { format } from 'date-fns';

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  time: string;
  quantity_remaining: number;
  refill_threshold: number;
  user_id: string;
}

interface Reminder {
  id: string;
  medication_id: string;
  scheduled_time: string;
  taken: boolean;
  user_id: string;
  medication: Medication;
}

const MedicationReminders: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newMedication, setNewMedication] = useState({
    name: '',
    dosage: '',
    frequency: 'daily',
    time: '08:00',
    quantity_remaining: 30,
    refill_threshold: 5
  });

  // Fetch user's medications
  const { data: medications, isLoading: loadingMeds } = useQuery({
    queryKey: ['medications', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('Not authenticated');
      
      const { data, error } = await supabase
        .from('medications')
        .select('*')
        .eq('user_id', user.id)
        .order('name');
      
      if (error) throw error;
      return data as Medication[];
    },
    enabled: !!user
  });

  // Fetch user's reminders
  const { data: reminders, isLoading: loadingReminders } = useQuery({
    queryKey: ['reminders', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('Not authenticated');
      
      const { data, error } = await supabase
        .from('medication_reminders')
        .select(`
          *,
          medication:medication_id (*)
        `)
        .eq('user_id', user.id)
        .order('scheduled_time');
      
      if (error) throw error;
      return data as Reminder[];
    },
    enabled: !!user
  });

  // Add new medication mutation
  const addMedicationMutation = useMutation({
    mutationFn: async (newMed: typeof newMedication) => {
      if (!user) throw new Error('Not authenticated');
      
      const { data, error } = await supabase
        .from('medications')
        .insert({
          name: newMed.name,
          dosage: newMed.dosage,
          frequency: newMed.frequency,
          time: newMed.time,
          quantity_remaining: newMed.quantity_remaining,
          refill_threshold: newMed.refill_threshold,
          user_id: user.id
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medications', user?.id] });
      setIsAddDialogOpen(false);
      setNewMedication({
        name: '',
        dosage: '',
        frequency: 'daily',
        time: '08:00',
        quantity_remaining: 30,
        refill_threshold: 5
      });
      toast({
        title: "Medication Added",
        description: "Your medication has been added successfully"
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to add medication: ${(error as Error).message}`,
        variant: "destructive"
      });
    }
  });

  // Mark reminder as taken mutation
  const markReminderTakenMutation = useMutation({
    mutationFn: async (reminderId: string) => {
      const { error } = await supabase
        .from('medication_reminders')
        .update({ taken: true })
        .eq('id', reminderId);
      
      if (error) throw error;
      
      // Also decrease the quantity remaining
      const reminder = reminders?.find(r => r.id === reminderId);
      if (reminder) {
        const { error: medicationError } = await supabase
          .from('medications')
          .update({ 
            quantity_remaining: Math.max(0, reminder.medication.quantity_remaining - 1) 
          })
          .eq('id', reminder.medication_id);
        
        if (medicationError) throw medicationError;
      }
      
      return reminderId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reminders', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['medications', user?.id] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update reminder: ${(error as Error).message}`,
        variant: "destructive"
      });
    }
  });

  // Check for medications that need refill
  useEffect(() => {
    if (medications) {
      const medsNeedingRefill = medications.filter(
        med => med.quantity_remaining <= med.refill_threshold
      );
      
      medsNeedingRefill.forEach(med => {
        sonnerToast.warning(`${med.name} is running low`, {
          description: `Only ${med.quantity_remaining} doses remaining. Consider ordering a refill.`,
          duration: 5000,
          action: {
            label: "Order Refill",
            onClick: () => {
              // Navigate to medication ordering page
              window.location.href = '/medications';
            }
          }
        });
      });
    }
  }, [medications]);

  // Demo effect to show medication reminder
  useEffect(() => {
    // For demo purposes, show a reminder after 30 seconds
    const timer = setTimeout(() => {
      if (user) {
        sonnerToast.info("Time to take your medication", {
          description: "Don't forget to take your evening dose of medication",
          duration: 0, // Won't auto-dismiss
          action: {
            label: "Mark as Taken",
            onClick: () => {
              sonnerToast.success("Marked as taken!", {
                description: "Keep up the good work taking your medications on time."
              });
            }
          }
        });
      }
    }, 30000);
    
    return () => clearTimeout(timer);
  }, [user]);

  const handleAddMedication = (e: React.FormEvent) => {
    e.preventDefault();
    addMedicationMutation.mutate(newMedication);
  };
  
  // Get today's reminders
  const todayReminders = reminders?.filter(
    reminder => {
      const reminderDate = new Date(reminder.scheduled_time);
      const today = new Date();
      return (
        reminderDate.getDate() === today.getDate() &&
        reminderDate.getMonth() === today.getMonth() &&
        reminderDate.getFullYear() === today.getFullYear() &&
        !reminder.taken
      );
    }
  ) || [];

  const upcomingReminders = todayReminders.filter(
    reminder => new Date(reminder.scheduled_time) > new Date()
  );
  
  if (!user) {
    return null;
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Medication Reminders</h2>
          <p className="text-gray-600">Keep track of your medications and get reminded when to take them</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-healthBlue-600 hover:bg-healthBlue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Medication
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Medication</DialogTitle>
              <DialogDescription>
                Add a new medication to your reminders list.
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleAddMedication}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={newMedication.name}
                    onChange={(e) => setNewMedication({...newMedication, name: e.target.value})}
                    className="col-span-3"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="dosage" className="text-right">
                    Dosage
                  </Label>
                  <Input
                    id="dosage"
                    value={newMedication.dosage}
                    onChange={(e) => setNewMedication({...newMedication, dosage: e.target.value})}
                    className="col-span-3"
                    placeholder="e.g., 500mg"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="frequency" className="text-right">
                    Frequency
                  </Label>
                  <Select
                    value={newMedication.frequency}
                    onValueChange={(value) => setNewMedication({...newMedication, frequency: value})}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="twice_daily">Twice Daily</SelectItem>
                      <SelectItem value="three_times_daily">Three Times Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="as_needed">As Needed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="time" className="text-right">
                    Time
                  </Label>
                  <Input
                    id="time"
                    type="time"
                    value={newMedication.time}
                    onChange={(e) => setNewMedication({...newMedication, time: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="quantity" className="text-right">
                    Quantity
                  </Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="0"
                    value={newMedication.quantity_remaining}
                    onChange={(e) => setNewMedication({...newMedication, quantity_remaining: parseInt(e.target.value)})}
                    className="col-span-3"
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="threshold" className="text-right">
                    Refill Alert
                  </Label>
                  <Input
                    id="threshold"
                    type="number"
                    min="1"
                    max={newMedication.quantity_remaining}
                    value={newMedication.refill_threshold}
                    onChange={(e) => setNewMedication({...newMedication, refill_threshold: parseInt(e.target.value)})}
                    className="col-span-3"
                  />
                  <p className="col-span-4 text-xs text-gray-500 text-right">
                    You'll be alerted when your medication reaches this quantity.
                  </p>
                </div>
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  className="bg-healthBlue-600 hover:bg-healthBlue-700"
                  disabled={addMedicationMutation.isPending}
                >
                  {addMedicationMutation.isPending ? 'Adding...' : 'Add Medication'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Reminders */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-lg font-medium">
              <Bell className="h-5 w-5 mr-2 text-healthBlue-500" />
              Today's Reminders
            </CardTitle>
            <CardDescription>Medications scheduled for today</CardDescription>
          </CardHeader>
          <CardContent>
            {loadingReminders ? (
              <div className="flex items-center justify-center h-40">
                <div className="animate-spin h-8 w-8 border-4 border-healthBlue-500 border-t-transparent rounded-full"></div>
              </div>
            ) : todayReminders.length > 0 ? (
              <div className="space-y-4">
                {todayReminders.map((reminder) => (
                  <div 
                    key={reminder.id} 
                    className="flex items-center justify-between p-4 bg-white border rounded-lg"
                  >
                    <div className="flex items-center">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center ${reminder.taken ? 'bg-gray-100' : 'bg-healthBlue-100'}`}>
                        {reminder.taken ? (
                          <Check className="h-5 w-5 text-gray-500" />
                        ) : (
                          <Clock className="h-5 w-5 text-healthBlue-500" />
                        )}
                      </div>
                      <div className="ml-4">
                        <h4 className={`font-medium ${reminder.taken ? 'line-through text-gray-500' : ''}`}>
                          {reminder.medication.name}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {reminder.medication.dosage} • {format(new Date(reminder.scheduled_time), 'h:mm a')}
                        </p>
                      </div>
                    </div>
                    
                    {!reminder.taken && (
                      <Button
                        variant="outline"
                        className="text-healthBlue-600 border-healthBlue-200 hover:bg-healthBlue-50"
                        onClick={() => markReminderTakenMutation.mutate(reminder.id)}
                      >
                        Mark as Taken
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8">
                <Calendar className="h-12 w-12 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium">No reminders for today</h3>
                <p className="text-gray-500 text-center mt-1">
                  You don't have any medication reminders scheduled for today.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Medications */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium">My Medications</CardTitle>
            <CardDescription>Current medication inventory</CardDescription>
          </CardHeader>
          <CardContent>
            {loadingMeds ? (
              <div className="flex items-center justify-center h-40">
                <div className="animate-spin h-8 w-8 border-4 border-healthBlue-500 border-t-transparent rounded-full"></div>
              </div>
            ) : medications?.length > 0 ? (
              <div className="space-y-4">
                {medications.map((med) => (
                  <div key={med.id} className="p-4 bg-white border rounded-lg">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium">{med.name}</h4>
                      {med.quantity_remaining <= med.refill_threshold ? (
                        <span className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 border border-yellow-200">
                          Low Stock
                        </span>
                      ) : null}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{med.dosage}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-sm">
                        {med.quantity_remaining} remaining
                      </span>
                      <span className="text-xs text-gray-500">
                        {med.frequency === 'daily' ? 'Once daily' : 
                         med.frequency === 'twice_daily' ? 'Twice daily' : 
                         med.frequency === 'three_times_daily' ? 'Three times daily' : 
                         med.frequency === 'weekly' ? 'Weekly' : 'As needed'}
                      </span>
                    </div>
                    
                    <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          med.quantity_remaining <= med.refill_threshold 
                            ? 'bg-red-500' 
                            : med.quantity_remaining < med.refill_threshold * 2 
                              ? 'bg-yellow-500' 
                              : 'bg-green-500'
                        }`}
                        style={{ width: `${Math.min(100, (med.quantity_remaining / 30) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  <Plus className="h-6 w-6 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium">No medications</h3>
                <p className="text-gray-500 text-center mt-1">
                  Add medications to get reminders
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => setIsAddDialogOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Medication
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default MedicationReminders;
