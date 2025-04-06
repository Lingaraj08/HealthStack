
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { 
  Card, CardContent, CardDescription, 
  CardHeader, CardTitle, CardFooter 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, FilePlus, Calendar, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';

// Mock data - in a real app this would come from Supabase
const mockRecords = [
  {
    id: '1',
    title: 'Complete Blood Count',
    record_type: 'Lab Test',
    description: 'Routine blood test to evaluate overall health and detect a wide range of disorders.',
    created_at: '2024-03-10T10:30:00Z',
    file_url: null
  },
  {
    id: '2',
    title: 'Chest X-Ray',
    record_type: 'Imaging',
    description: 'X-ray of chest to examine lungs, heart and other structures.',
    created_at: '2024-02-15T14:45:00Z',
    file_url: null
  },
  {
    id: '3',
    title: 'Cardiology Consultation',
    record_type: 'Consultation',
    description: 'Consultation with Dr. Priya Sharma regarding heart palpitations.',
    created_at: '2024-01-20T11:00:00Z',
    file_url: null
  }
];

const recordTypeOptions = [
  { label: 'Lab Test', value: 'Lab Test' },
  { label: 'Imaging', value: 'Imaging' },
  { label: 'Consultation', value: 'Consultation' },
  { label: 'Prescription', value: 'Prescription' },
  { label: 'Surgery', value: 'Surgery' },
  { label: 'Discharge Summary', value: 'Discharge Summary' },
  { label: 'Vaccination', value: 'Vaccination' },
  { label: 'Other', value: 'Other' },
];

const MedicalRecords = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newRecord, setNewRecord] = useState({
    title: '',
    record_type: '',
    description: '',
    file: null as File | null
  });
  const { toast } = useToast();
  
  // In a real app, this would be a query to Supabase
  const { data: records, isLoading, refetch } = useQuery({
    queryKey: ['medicalRecords'],
    queryFn: async () => {
      // In development, use mock data
      return mockRecords;
      
      // In production with Supabase:
      // const user = await supabase.auth.getUser();
      // if (!user.data.user) throw new Error('Not authenticated');
      
      // const { data, error } = await supabase
      //   .from('medical_records')
      //   .select('*')
      //   .eq('user_id', user.data.user.id)
      //   .order('created_at', { ascending: false });
      
      // if (error) throw error;
      // return data;
    }
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewRecord({ ...newRecord, file: e.target.files[0] });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewRecord({ ...newRecord, [name]: value });
  };

  const handleRecordTypeChange = (value: string) => {
    setNewRecord({ ...newRecord, record_type: value });
  };

  const handleAddRecord = async () => {
    if (!newRecord.title || !newRecord.record_type) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      // In a real app with Supabase:
      // const user = await supabase.auth.getUser();
      // if (!user.data.user) throw new Error('Not authenticated');
      
      // let fileUrl = null;
      // if (newRecord.file) {
      //   const fileExt = newRecord.file.name.split('.').pop();
      //   const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      //   const filePath = `${user.data.user.id}/${fileName}`;
      
      //   const { error: uploadError } = await supabase.storage
      //     .from('medical_records')
      //     .upload(filePath, newRecord.file);
      
      //   if (uploadError) throw uploadError;
      
      //   fileUrl = supabase.storage
      //     .from('medical_records')
      //     .getPublicUrl(filePath).data.publicUrl;
      // }
      
      // const { error } = await supabase
      //   .from('medical_records')
      //   .insert({
      //     title: newRecord.title,
      //     record_type: newRecord.record_type,
      //     description: newRecord.description,
      //     user_id: user.data.user.id,
      //     file_url: fileUrl
      //   });
      
      // if (error) throw error;
      
      toast({
        title: "Record Added",
        description: "Your medical record has been saved successfully"
      });
      
      setIsAddModalOpen(false);
      setNewRecord({
        title: '',
        record_type: '',
        description: '',
        file: null
      });
      
      refetch();
      
    } catch (error) {
      console.error('Error adding record:', error);
      toast({
        title: "Error",
        description: "Failed to add medical record",
        variant: "destructive"
      });
    }
  };

  const handleDeleteRecord = async (id: string) => {
    try {
      // In a real app with Supabase:
      // const { error } = await supabase
      //   .from('medical_records')
      //   .delete()
      //   .eq('id', id);
      
      // if (error) throw error;
      
      toast({
        title: "Record Deleted",
        description: "The medical record has been deleted"
      });
      
      refetch();
      
    } catch (error) {
      console.error('Error deleting record:', error);
      toast({
        title: "Error",
        description: "Failed to delete medical record",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container py-12">
          <div className="flex justify-center">
            <p>Loading medical records...</p>
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
            <h1 className="text-3xl font-bold text-healthBlue-800">Medical Records</h1>
            <p className="text-gray-600 mt-2">Store and manage your health records securely</p>
          </div>
          
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button className="mt-4 md:mt-0 bg-healthBlue-600 hover:bg-healthBlue-700">
                <FilePlus className="mr-2 h-4 w-4" />
                Add New Record
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>Add New Medical Record</DialogTitle>
                <DialogDescription>
                  Enter the details of your medical record below
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="title" className="text-right text-sm font-medium">
                    Title*
                  </label>
                  <Input
                    id="title"
                    name="title"
                    value={newRecord.title}
                    onChange={handleInputChange}
                    className="col-span-3"
                    placeholder="e.g., Blood Test Results"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="record_type" className="text-right text-sm font-medium">
                    Record Type*
                  </label>
                  <div className="col-span-3">
                    <Select value={newRecord.record_type} onValueChange={handleRecordTypeChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select record type" />
                      </SelectTrigger>
                      <SelectContent>
                        {recordTypeOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="description" className="text-right text-sm font-medium">
                    Description
                  </label>
                  <Textarea
                    id="description"
                    name="description"
                    value={newRecord.description}
                    onChange={handleInputChange}
                    className="col-span-3"
                    placeholder="Add additional details about this record"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="file" className="text-right text-sm font-medium">
                    File
                  </label>
                  <Input
                    id="file"
                    type="file"
                    onChange={handleFileChange}
                    className="col-span-3"
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddRecord} className="bg-healthBlue-600 hover:bg-healthBlue-700">
                  Save Record
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        {records && records.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {records.map((record) => (
              <Card key={record.id}>
                <CardHeader className="flex flex-row items-start justify-between space-y-0">
                  <div>
                    <CardTitle className="flex items-center">
                      <FileText className="mr-2 h-5 w-5" />
                      {record.title}
                    </CardTitle>
                    <CardDescription>
                      {record.record_type} • {format(new Date(record.created_at), 'MMMM dd, yyyy')}
                    </CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => handleDeleteRecord(record.id)}>
                    <Trash2 className="h-4 w-4 text-gray-500" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{record.description}</p>
                </CardContent>
                <CardFooter className="flex justify-end space-x-2">
                  {record.file_url && (
                    <Button variant="outline">
                      View File
                    </Button>
                  )}
                  <Button variant="outline">
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="text-center p-8">
            <div className="flex flex-col items-center">
              <FileText className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-xl font-medium mb-2">No records found</h3>
              <p className="text-gray-600 mb-6">
                You haven't added any medical records yet.
              </p>
              <DialogTrigger asChild>
                <Button className="bg-healthBlue-600 hover:bg-healthBlue-700">
                  <FilePlus className="mr-2 h-4 w-4" />
                  Add Your First Record
                </Button>
              </DialogTrigger>
            </div>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default MedicalRecords;
