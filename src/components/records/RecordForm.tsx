import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { 
  Dialog,
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface RecordFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (record: {
    title: string;
    record_type: string;
    description: string;
    file: File | null;
  }) => void;
  isSubmitting: boolean;
}

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

const RecordForm: React.FC<RecordFormProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  isSubmitting 
}) => {
  const [newRecord, setNewRecord] = useState({
    title: '',
    record_type: '',
    description: '',
    file: null as File | null
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

  const handleSubmit = () => {
    onSubmit(newRecord);
    if (!isSubmitting) {
      // Reset form only if not submitting (so we keep the form state if there's an error)
      setNewRecord({
        title: '',
        record_type: '',
        description: '',
        file: null
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
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
          <Button variant="outline" onClick={onClose}
            disabled={isSubmitting}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            className="bg-healthBlue-600 hover:bg-healthBlue-700"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : 'Save Record'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RecordForm;
