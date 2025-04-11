
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Shield, Heart, BadgeIndianRupee } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface SchemeProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  url: string;
  isNew?: boolean;
}

const SchemeCard: React.FC<SchemeProps> = ({ 
  title, 
  description, 
  icon, 
  url,
  isNew 
}) => {
  return (
    <Card className="h-full flex flex-col hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-healthBlue-50 rounded-lg">
              {icon}
            </div>
            <CardTitle className="text-base">{title}</CardTitle>
          </div>
          {isNew && (
            <div className="bg-healthOrange-100 text-healthOrange-700 text-xs px-2 py-0.5 rounded-full">
              New
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="pb-3 pt-0 flex-grow">
        <CardDescription className="line-clamp-2 text-xs">{description}</CardDescription>
      </CardContent>
      <CardFooter className="pt-0">
        <Button 
          onClick={() => window.open(url, '_blank')}
          variant="outline"
          size="sm"
          className="w-full text-xs"
        >
          Apply Now
        </Button>
      </CardFooter>
    </Card>
  );
};

const HealthSchemesSection: React.FC = () => {
  const navigate = useNavigate();

  const featuredSchemes = [
    {
      title: 'Ayushman Bharat',
      description: 'Health coverage up to ₹5 lakh per family per year for secondary and tertiary care.',
      icon: <Shield className="h-4 w-4 text-healthBlue-600" />,
      url: 'https://setu.co/payments/abha',
      isNew: false
    },
    {
      title: 'PM Jan Arogya Yojana',
      description: 'Health insurance coverage for poor and vulnerable families.',
      icon: <Heart className="h-4 w-4 text-healthRed-600" />,
      url: 'https://web.umang.gov.in/landing/department/pradhan-mantri-jan-arogya-yojana.html',
      isNew: false
    },
    {
      title: 'Pradhan Mantri Suraksha Bima Yojana',
      description: 'Accident insurance scheme with coverage of ₹2 lakh at just ₹12 per year.',
      icon: <BadgeIndianRupee className="h-4 w-4 text-healthGreen-600" />,
      url: 'https://www.myscheme.gov.in/schemes/pmsby',
      isNew: true
    }
  ];

  return (
    <div className="px-4 py-12 md:py-16 bg-white border-t border-gray-100">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold mb-2">Health Schemes & Programs</h2>
            <p className="text-gray-600">Explore government schemes you may be eligible for</p>
          </div>
          <Button 
            onClick={() => navigate('/health-schemes')}
            variant="outline"
          >
            View All
          </Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {featuredSchemes.map((scheme, idx) => (
            <SchemeCard key={idx} {...scheme} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HealthSchemesSection;
