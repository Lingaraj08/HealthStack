
import React from 'react';
import { format } from 'date-fns';
import { FileText, Trash2, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface RecordItemProps {
  record: {
    id: string;
    title: string;
    record_type: string;
    description: string;
    file_url: string | null;
    created_at: string;
  };
  onDelete: (id: string) => void;
  onViewDetails: (id: string) => void;
  isDeleting: boolean;
  deletingId: string | null;
}

const RecordItem: React.FC<RecordItemProps> = ({ 
  record,
  onDelete,
  onViewDetails,
  isDeleting,
  deletingId
}) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete(record.id);
  };

  const handleViewDetails = () => {
    onViewDetails(record.id);
  };

  return (
    <Card>
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
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleDelete}
          disabled={isDeleting && deletingId === record.id}
        >
          {isDeleting && deletingId === record.id ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4 text-gray-500" />
          )}
        </Button>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">{record.description}</p>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        {record.file_url && (
          <Button variant="outline" asChild>
            <a href={record.file_url} target="_blank" rel="noopener noreferrer">
              View File
            </a>
          </Button>
        )}
        <Button variant="outline" onClick={handleViewDetails}>
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RecordItem;
