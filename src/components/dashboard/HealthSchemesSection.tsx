
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Shield, Heart, BadgeIndianRupee, ArrowRight, Users, Stethoscope } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface SchemeProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  url: string;
  isNew?: boolean;
  iconBgColor: string;
  iconColor: string;
}

const SchemeCard: React.FC<SchemeProps> = ({ 
  title, 
  description, 
  icon, 
  url,
  isNew,
  iconBgColor,
  iconColor
}) => {
  return (
    <Card className="h-full flex flex-col hover:shadow-md transition-all duration-300 hover:-translate-y-1 overflow-hidden border border-gray-100 dark:border-gray-700 animate-fade-in backdrop-blur-sm bg-white/80 dark:bg-gray-800/80">
      <CardHeader className="pb-3 relative">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className={`p-2 ${iconBgColor} rounded-lg`}>
              {icon}
            </div>
            <CardTitle className="text-base font-semibold">{title}</CardTitle>
          </div>
          {isNew && (
            <div className="bg-healthOrange-100 text-healthOrange-700 text-xs px-2 py-0.5 rounded-full border border-healthOrange-200 font-medium">
              New
            </div>
          )}
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-gray-100/50 to-transparent rounded-bl-full -z-10 dark:from-gray-700/30"></div>
      </CardHeader>
      <CardContent className="pb-3 pt-0 flex-grow">
        <CardDescription className="line-clamp-2 text-xs">{description}</CardDescription>
      </CardContent>
      <CardFooter className="pt-0">
        <Button 
          onClick={() => window.open(url, '_blank')}
          variant="outline"
          size="sm"
          className="w-full text-xs group border-gray-200 dark:border-gray-600 hover:border-healthBlue-300 dark:hover:border-healthBlue-500 hover:bg-healthBlue-50 dark:hover:bg-healthBlue-900/30"
        >
          Apply Now
          <ArrowRight className="h-3.5 w-3.5 ml-1.5 transition-transform group-hover:translate-x-1" />
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
      isNew: false,
      iconBgColor: 'bg-healthBlue-50',
      iconColor: 'text-healthBlue-600'
    },
    {
      title: 'PM Jan Arogya Yojana',
      description: 'Health insurance coverage for poor and vulnerable families.',
      icon: <Heart className="h-4 w-4 text-healthRed-600" />,
      url: 'https://web.umang.gov.in/landing/department/pradhan-mantri-jan-arogya-yojana.html',
      isNew: false,
      iconBgColor: 'bg-red-50',
      iconColor: 'text-red-600'
    },
    {
      title: 'Pradhan Mantri Suraksha Bima Yojana',
      description: 'Accident insurance scheme with coverage of ₹2 lakh at just ₹12 per year.',
      icon: <BadgeIndianRupee className="h-4 w-4 text-healthGreen-600" />,
      url: 'https://www.myscheme.gov.in/schemes/pmsby',
      isNew: true,
      iconBgColor: 'bg-healthGreen-50',
      iconColor: 'text-healthGreen-600'
    },
    {
      title: 'Ayushman CAPF',
      description: 'Healthcare benefits for Central Armed Police Forces personnel and their dependents.',
      icon: <Users className="h-4 w-4 text-indigo-600" />,
      url: 'https://www.nhp.gov.in/ayushman-capf_pg',
      isNew: false,
      iconBgColor: 'bg-indigo-50',
      iconColor: 'text-indigo-600'
    },
    {
      title: 'Rashtriya Arogya Nidhi',
      description: 'Financial assistance for patients living below poverty line and suffering from life threatening diseases.',
      icon: <Stethoscope className="h-4 w-4 text-amber-600" />,
      url: 'https://main.mohfw.gov.in/Organisation/Departments-of-Health-and-Family-Welfare/rashtriya-arogya-nidhi-ran',
      isNew: true,
      iconBgColor: 'bg-amber-50',
      iconColor: 'text-amber-600'
    },
    {
      title: 'Pradhan Mantri National Dialysis Program',
      description: 'Free dialysis services to people suffering from kidney diseases in all district hospitals.',
      icon: <BadgeIndianRupee className="h-4 w-4 text-purple-600" />,
      url: 'https://nhm.gov.in/index1.php?lang=1&level=3&sublinkid=1220&lid=187',
      isNew: false,
      iconBgColor: 'bg-purple-50',
      iconColor: 'text-purple-600'
    }
  ];

  return (
    <div className="px-4 py-16 md:py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-healthBlue-50/50 to-white/80 dark:from-gray-800/50 dark:to-background/80 -z-10"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-healthBlue-200/20 dark:bg-healthBlue-800/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-healthGreen-200/20 dark:bg-healthGreen-800/10 rounded-full blur-3xl -z-10"></div>
      
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <div className="max-w-xl">
            <h2 className="text-2xl font-bold mb-2 text-healthBlue-800 dark:text-healthBlue-200">Health Schemes & Programs</h2>
            <p className="text-gray-600 dark:text-gray-300">Explore government schemes you may be eligible for to reduce your healthcare costs</p>
          </div>
          <Button 
            onClick={() => navigate('/health-schemes')}
            variant="outline"
            className="border-healthBlue-200 text-healthBlue-600 dark:border-healthBlue-700 dark:text-healthBlue-400 hover:bg-healthBlue-50 dark:hover:bg-healthBlue-900/30 hidden sm:flex items-center gap-2"
          >
            View All
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 stagger-children">
          {featuredSchemes.slice(0, 3).map((scheme, idx) => (
            <SchemeCard key={idx} {...scheme} />
          ))}
        </div>
        
        <div className="mt-8 flex justify-center sm:hidden">
          <Button 
            onClick={() => navigate('/health-schemes')}
            variant="outline"
            className="border-healthBlue-200 text-healthBlue-600 hover:bg-healthBlue-50 flex items-center gap-2"
          >
            View All Schemes
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HealthSchemesSection;
