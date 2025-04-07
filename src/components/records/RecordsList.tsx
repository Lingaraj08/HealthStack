
import React from 'react';
import { FileText, FilePlus } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import RecordItem from './RecordItem';

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
      <Card className="text-center p-8 shadow-soft dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col items-center">
          <div className="rounded-full bg-healthBlue-100 dark:bg-healthBlue-900/50 p-4 mb-4">
            <FileText className="h-12 w-12 text-healthBlue-500 dark:text-healthBlue-400" />
          </div>
          <h3 className="text-xl font-semibold mb-2 font-nunito">No records found</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md">
            You haven't added any medical records yet. Add your first record to keep track of your health documents.
          </p>
          <Button 
            className="bg-healthBlue-500 hover:bg-healthBlue-600 dark:bg-healthBlue-600 dark:hover:bg-healthBlue-700 text-white shadow-soft" 
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
