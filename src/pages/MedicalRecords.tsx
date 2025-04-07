
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { FilePlus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/components/auth/AuthContext';
import RecordDetails from '@/components/records/RecordDetails';
import RecordForm from '@/components/records/RecordForm';
import RecordsList from '@/components/records/RecordsList';

const MedicalRecords = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const { data: records, isLoading, error } = useQuery({
    queryKey: ['medicalRecords', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('Not authenticated');
      
      const { data, error } = await supabase
        .from('medical_records')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user
  });
  
  const addRecordMutation = useMutation({
    mutationFn: async (record: {
      title: string;
      record_type: string;
      description: string;
      file: File | null;
    }) => {
      if (!user) throw new Error('Not authenticated');
      
      let fileUrl = null;
      
      if (record.file) {
        const fileExt = record.file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;
      
        const { error: uploadError } = await supabase.storage
          .from('medical_records')
          .upload(filePath, record.file);
      
        if (uploadError) throw uploadError;
      
        fileUrl = supabase.storage
          .from('medical_records')
          .getPublicUrl(filePath).data.publicUrl;
      }
      
      const { data, error } = await supabase
        .from('medical_records')
        .insert({
          title: record.title,
          record_type: record.record_type,
          description: record.description,
          user_id: user.id,
          file_url: fileUrl
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medicalRecords', user?.id] });
      setIsAddModalOpen(false);
      toast({
        title: "Record Added",
        description: "Your medical record has been saved successfully"
      });
    },
    onError: (error) => {
      console.error('Error adding record:', error);
      toast({
        title: "Error",
        description: "Failed to add medical record: " + (error as Error).message,
        variant: "destructive"
      });
    }
  });
  
  const deleteRecordMutation = useMutation({
    mutationFn: async (recordId: string) => {
      const { error } = await supabase
        .from('medical_records')
        .delete()
        .eq('id', recordId);
      
      if (error) throw error;
      return recordId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medicalRecords', user?.id] });
      toast({
        title: "Record Deleted",
        description: "The medical record has been deleted"
      });
    },
    onError: (error) => {
      console.error('Error deleting record:', error);
      toast({
        title: "Error",
        description: "Failed to delete medical record: " + (error as Error).message,
        variant: "destructive"
      });
    }
  });

  const handleAddRecord = (record: {
    title: string;
    record_type: string;
    description: string;
    file: File | null;
  }) => {
    if (!record.title || !record.record_type) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    addRecordMutation.mutate(record);
  };

  const handleDeleteRecord = (id: string) => {
    deleteRecordMutation.mutate(id);
  };

  if (!user) {
    return (
      <Layout>
        <div className="container py-12">
          <div className="flex flex-col items-center justify-center gap-4">
            <p className="text-lg">Please sign in to view your medical records.</p>
            <Button onClick={() => window.location.href = '/auth'}>
              Sign In
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="container py-12">
          <div className="flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-healthBlue-600" />
            <p className="ml-2">Loading medical records...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="container py-12">
          <div className="flex justify-center">
            <Card className="w-full max-w-md p-6">
              <div className="text-red-600 font-semibold mb-2">Error Loading Records</div>
              <p>{(error as Error).message}</p>
              <Button 
                className="mt-4"
                onClick={() => queryClient.invalidateQueries({ queryKey: ['medicalRecords', user?.id] })}
              >
                Retry
              </Button>
            </Card>
          </div>
        </div>
      </Layout>
    );
  }

  if (selectedRecordId) {
    return (
      <Layout>
        <div className="container mx-auto py-12">
          <h1 className="text-3xl font-bold mb-8 text-healthBlue-800">Medical Record Details</h1>
          <RecordDetails 
            recordId={selectedRecordId} 
            onBack={() => setSelectedRecordId(null)} 
          />
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
          
          <Button 
            className="mt-4 md:mt-0 bg-healthBlue-600 hover:bg-healthBlue-700"
            onClick={() => setIsAddModalOpen(true)}
          >
            <FilePlus className="mr-2 h-4 w-4" />
            Add New Record
          </Button>

          <RecordForm
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            onSubmit={handleAddRecord}
            isSubmitting={addRecordMutation.isPending}
          />
        </div>
        
        <RecordsList
          records={records || []}
          onDelete={handleDeleteRecord}
          onViewDetails={(id) => setSelectedRecordId(id)}
          isDeleting={deleteRecordMutation.isPending}
          deletingId={deleteRecordMutation.variables}
          onOpenAddRecord={() => setIsAddModalOpen(true)}
        />
      </div>
    </Layout>
  );
};

export default MedicalRecords;
