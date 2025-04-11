
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Check, AlertCircle, Clock } from 'lucide-react';

interface PaymentStatusProps {
  status: string;
  amount?: number;
}

const PaymentStatus: React.FC<PaymentStatusProps> = ({ status, amount }) => {
  const getStatusDetails = () => {
    switch (status) {
      case 'completed':
        return {
          color: 'bg-healthGreen-50 text-healthGreen-700 border-healthGreen-200',
          icon: <Check className="h-3 w-3 mr-1" />,
          text: 'Paid'
        };
      case 'pending':
        return {
          color: 'bg-amber-50 text-amber-700 border-amber-200',
          icon: <Clock className="h-3 w-3 mr-1" />,
          text: 'Payment Pending'
        };
      case 'failed':
        return {
          color: 'bg-red-50 text-red-700 border-red-200',
          icon: <AlertCircle className="h-3 w-3 mr-1" />,
          text: 'Payment Failed'
        };
      default:
        return {
          color: 'bg-gray-50 text-gray-700 border-gray-200',
          icon: <CreditCard className="h-3 w-3 mr-1" />,
          text: 'Not Paid'
        };
    }
  };

  const { color, icon, text } = getStatusDetails();

  return (
    <Badge variant="outline" className={`${color} flex items-center`}>
      {icon}
      <span>{text}{amount ? ` - ₹${amount}` : ''}</span>
    </Badge>
  );
};

export default PaymentStatus;
