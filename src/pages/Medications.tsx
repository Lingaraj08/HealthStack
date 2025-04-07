
import React, { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/components/auth/AuthContext';
import { Heart, Plus, Clock, Bell, Trash2, Calendar, AlertCircle, CheckCircle2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  time: string;
  reminder: boolean;
}

const Medications = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [medications, setMedications] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(true);
  const [newMedication, setNewMedication] = useState<Omit<Medication, 'id'>>({
    name: '',
    dosage: '',
    frequency: 'daily',
    time: '08:00',
    reminder: true
  });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // In a real app, we would fetch from Supabase
    const mockMedications = [
      { 
        id: '1', 
        name: 'Paracetamol', 
        dosage: '500mg', 
        frequency: 'As needed', 
        time: '08:00',
        reminder: true 
      },
      { 
        id: '2', 
        name: 'Multivitamin', 
        dosage: '1 tablet', 
        frequency: 'Daily', 
        time: '09:00',
        reminder: true 
      },
      { 
        id: '3', 
        name: 'Insulin', 
        dosage: '10 units', 
        frequency: 'Twice daily', 
        time: '07:30,19:30',
        reminder: true 
      }
    ];
    
    setTimeout(() => {
      setMedications(mockMedications);
      setLoading(false);
    }, 1000);
  }, []);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewMedication(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSwitchChange = (checked: boolean) => {
    setNewMedication(prev => ({
      ...prev,
      reminder: checked
    }));
  };
  
  const handleAddMedication = () => {
    const id = Math.random().toString(36).substring(2, 9);
    const medication = {
      id,
      ...newMedication
    };
    
    setMedications(prev => [...prev, medication]);
    
    toast({
      title: "Medication added",
      description: `${newMedication.name} has been added to your medications.`
    });
    
    setNewMedication({
      name: '',
      dosage: '',
      frequency: 'daily',
      time: '08:00',
      reminder: true
    });
    
    setOpen(false);
  };
  
  const handleDeleteMedication = (id: string) => {
    setMedications(prev => prev.filter(med => med.id !== id));
    
    toast({
      title: "Medication removed",
      description: "The medication has been removed from your list."
    });
  };

  return (
    <Layout>
      <div className="container max-w-6xl py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">My Medications</h1>
            <p className="text-muted-foreground">
              Track your medications and set reminders
            </p>
          </div>
          
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="health-button-primary mt-4 md:mt-0">
                <Plus className="mr-2 h-4 w-4" /> Add Medication
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Medication</DialogTitle>
                <DialogDescription>
                  Enter the details of your medication. You can set reminders to help you take them on time.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={newMedication.name}
                    onChange={handleChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="dosage" className="text-right">
                    Dosage
                  </Label>
                  <Input
                    id="dosage"
                    name="dosage"
                    value={newMedication.dosage}
                    onChange={handleChange}
                    className="col-span-3"
                    placeholder="e.g. 500mg, 2 tablets"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="frequency" className="text-right">
                    Frequency
                  </Label>
                  <select
                    id="frequency"
                    name="frequency"
                    value={newMedication.frequency}
                    onChange={handleChange}
                    className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  >
                    <option value="daily">Daily</option>
                    <option value="twice_daily">Twice Daily</option>
                    <option value="three_times">Three Times a Day</option>
                    <option value="four_times">Four Times a Day</option>
                    <option value="weekly">Weekly</option>
                    <option value="as_needed">As Needed</option>
                  </select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="time" className="text-right">
                    Time
                  </Label>
                  <Input
                    id="time"
                    name="time"
                    type="time"
                    value={newMedication.time}
                    onChange={handleChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="reminder" className="text-right">
                    Reminder
                  </Label>
                  <div className="flex items-center space-x-2 col-span-3">
                    <Switch
                      id="reminder"
                      checked={newMedication.reminder}
                      onCheckedChange={handleSwitchChange}
                    />
                    <Label htmlFor="reminder">Enable reminders</Label>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={handleAddMedication}>Add Medication</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center py-10">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-healthBlue-600 border-t-transparent"></div>
          </div>
        ) : (
          <>
            {medications.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <div className="flex flex-col items-center">
                    <Heart className="h-12 w-12 text-gray-300 mb-4" />
                    <h3 className="text-xl font-medium mb-2">No medications added</h3>
                    <p className="text-muted-foreground mb-6">
                      Add your medications to keep track and set reminders
                    </p>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="health-button-primary">
                          <Plus className="mr-2 h-4 w-4" /> Add Your First Medication
                        </Button>
                      </DialogTrigger>
                      {/* Dialog content same as above */}
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {medications.map((medication) => (
                  <Card key={medication.id}>
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <CardTitle>{medication.name}</CardTitle>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 text-gray-500 hover:text-red-500"
                          onClick={() => handleDeleteMedication(medication.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <CardDescription>{medication.dosage}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center text-sm">
                          <Calendar className="h-4 w-4 mr-2 text-healthBlue-500" />
                          <span>Frequency: </span>
                          <span className="ml-1 font-medium">{medication.frequency}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Clock className="h-4 w-4 mr-2 text-healthBlue-500" />
                          <span>Time: </span>
                          <span className="ml-1 font-medium">{medication.time}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Bell className="h-4 w-4 mr-2 text-healthBlue-500" />
                          <span>Reminder: </span>
                          <span className={`ml-1 font-medium ${medication.reminder ? 'text-green-600' : 'text-gray-500'}`}>
                            {medication.reminder ? 'Enabled' : 'Disabled'}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <div className="w-full">
                        <Button 
                          variant="outline" 
                          className="w-full flex items-center justify-center gap-2"
                          onClick={() => {
                            toast({
                              title: "Medication taken",
                              description: `You've marked ${medication.name} as taken.`,
                            });
                          }}
                        >
                          <CheckCircle2 className="h-4 w-4" /> Mark as Taken
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
                
                {/* Today's Schedule Card */}
                <Card className="bg-healthBlue-50 border-healthBlue-100">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Clock className="mr-2 h-5 w-5 text-healthBlue-600" />
                      Today's Schedule
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {medications
                      .filter(med => med.reminder)
                      .sort((a, b) => a.time.localeCompare(b.time))
                      .map((med, index) => (
                        <div key={index} className="flex items-center justify-between bg-white p-3 rounded-md border border-healthBlue-100">
                          <div className="flex items-center">
                            <div className="mr-3 flex-shrink-0">
                              <div className="h-10 w-10 rounded-full bg-healthBlue-100 flex items-center justify-center">
                                <Heart className="h-5 w-5 text-healthBlue-600" />
                              </div>
                            </div>
                            <div>
                              <p className="font-medium">{med.name}</p>
                              <p className="text-xs text-gray-500">{med.dosage}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-healthBlue-700">{med.time}</p>
                            <p className="text-xs text-gray-500">{med.frequency}</p>
                          </div>
                        </div>
                      ))}
                      
                    {medications.filter(med => med.reminder).length === 0 && (
                      <div className="text-center p-4">
                        <AlertCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-600">No scheduled medications for today</p>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant="outline" 
                      className="w-full border-healthBlue-200 text-healthBlue-700 hover:bg-healthBlue-100"
                      onClick={() => {
                        toast({
                          title: "Coming soon!",
                          description: "Calendar view will be available in the next update.",
                        });
                      }}
                    >
                      View Full Calendar
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default Medications;
