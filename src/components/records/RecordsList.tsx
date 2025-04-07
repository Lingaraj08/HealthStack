
import React from 'react';
import { FileText, FilePlus } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import RecordItem from './RecordItem';
import { DialogTrigger } from '@/components/ui/dialog';

interface RecordsListProps {
  records: Array<{
    id: string;
    title: string;
    record_type: string;
    description: string;
    file_url: string | null;
    created_at: string;
  }>;
  onDelete: (id: string) => void;
  onViewDetails: (id: string) => void;
  isDeleting: boolean;
  deletingId: string | null;
  onOpenAddRecord: () => void;
}

const RecordsList: React.FC<RecordsListProps> = ({ 
  records, 
  onDelete, 
  onViewDetails,
  isDeleting,
  deletingId,
  onOpenAddRecord
}) => {
  if (!records || records.length === 0) {
    return (
      <Card className="text-center p-8">
        <div className="flex flex-col items-center">
          <FileText className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-xl font-medium mb-2">No records found</h3>
          <p className="text-gray-600 mb-6">
            You haven't added any medical records yet.
          </p>
          <Button 
            className="bg-healthBlue-600 hover:bg-healthBlue-700" 
            onClick={onOpenAddRecord}
          >
            <FilePlus className="mr-2 h-4 w-4" />
            Add Your First Record
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      {records.map((record) => (
        <RecordItem
          key={record.id}
          record={record}
          onDelete={onDelete}
          onViewDetails={onViewDetails}
          isDeleting={isDeleting}
          deletingId={deletingId}
        />
      ))}
    </div>
  );
};

export default RecordsList;
