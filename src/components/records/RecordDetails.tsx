
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, FileText, Calendar, Clock, Download, ArrowLeft } from 'lucide-react';

interface RecordDetailsProps {
  recordId: string;
  onBack: () => void;
}

const RecordDetails: React.FC<RecordDetailsProps> = ({ recordId, onBack }) => {
  const { toast } = useToast();

  const { data: record, isLoading, error } = useQuery({
    queryKey: ['medicalRecord', recordId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('medical_records')
        .select('*')
        .eq('id', recordId)
        .single();
      
      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6 flex justify-center items-center min-h-[300px]">
          <Loader2 className="h-8 w-8 animate-spin text-healthBlue-600 mr-2" />
          <p>Loading record details...</p>
        </CardContent>
      </Card>
    );
  }

  if (error || !record) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-red-600">Error</CardTitle>
          <CardDescription>
            Failed to load record details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>{error ? (error as Error).message : 'Record not found'}</p>
        </CardContent>
        <CardFooter>
          <Button onClick={onBack} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl flex items-center">
              <FileText className="mr-3 h-6 w-6 text-healthBlue-600" />
              {record.title}
            </CardTitle>
            <CardDescription className="mt-1 text-base">
              {record.record_type}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center text-sm">
            <Calendar className="h-4 w-4 mr-1 text-gray-500" />
            <span className="text-gray-700">
              Created: {format(new Date(record.created_at), 'MMMM dd, yyyy')}
            </span>
          </div>
          
          {record.updated_at && record.updated_at !== record.created_at && (
            <div className="flex items-center text-sm">
              <Clock className="h-4 w-4 mr-1 text-gray-500" />
              <span className="text-gray-700">
                Updated: {format(new Date(record.updated_at), 'MMMM dd, yyyy')}
              </span>
            </div>
          )}
        </div>
        
        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="font-medium mb-2">Description</h3>
          <p className="text-gray-700 whitespace-pre-wrap">
            {record.description || 'No description provided.'}
          </p>
        </div>
        
        {record.file_url && (
          <div className="border rounded-md p-4">
            <h3 className="font-medium mb-2">Attached Document</h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FileText className="h-5 w-5 text-healthBlue-500 mr-2" />
                <span>Document</span>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" asChild>
                  <a href={record.file_url} target="_blank" rel="noopener noreferrer">
                    View
                  </a>
                </Button>
                <Button variant="outline" asChild>
                  <a href={record.file_url} download>
                    <Download className="mr-1 h-4 w-4" /> Download
                  </a>
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button onClick={onBack} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Records
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RecordDetails;
