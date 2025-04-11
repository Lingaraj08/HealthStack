
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Heart, BadgeIndianRupee, GraduationCap, Leaf, Tag, Landmark } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthContext';

interface SchemeProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  url: string;
  eligibility?: string;
  benefits?: string[];
  isNew?: boolean;
}

const SchemeCard: React.FC<SchemeProps> = ({ 
  title, 
  description, 
  icon, 
  url,
  eligibility, 
  benefits,
  isNew 
}) => {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <div className="mr-3 p-2 bg-healthBlue-50 rounded-lg">
              {icon}
            </div>
            <CardTitle className="text-xl">{title}</CardTitle>
          </div>
          {isNew && (
            <div className="bg-healthOrange-100 text-healthOrange-700 text-xs px-2 py-1 rounded-full">
              New
            </div>
          )}
        </div>
        <CardDescription className="text-base">{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        {eligibility && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-1">Eligibility:</h4>
            <p className="text-sm text-gray-600">{eligibility}</p>
          </div>
        )}
        {benefits && benefits.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-1">Benefits:</h4>
            <ul className="text-sm text-gray-600 list-disc pl-4 space-y-1">
              {benefits.map((benefit, idx) => (
                <li key={idx}>{benefit}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={() => window.open(url, '_blank')}
        >
          Apply Now
        </Button>
      </CardFooter>
    </Card>
  );
};

const HealthSchemes = () => {
  const { user } = useAuth();
  
  const healthSchemes: SchemeProps[] = [
    {
      title: 'Ayushman Bharat Digital Health Mission',
      description: 'Create your Ayushman Bharat Health Account (ABHA) and manage your health records digitally.',
      icon: <Shield className="h-6 w-6 text-healthBlue-600" />,
      url: 'https://abha.abdm.gov.in/abha/v3/register',
      eligibility: 'All Indian citizens',
      benefits: [
        'Create a health ID for accessing digital health services',
        'Store and access your health records securely',
        'Share health information with healthcare providers',
        'Seamless access to healthcare services across the country'
      ]
    },
    {
      title: 'PM Jan Arogya Yojana',
      description: 'Pradhan Mantri Jan Arogya Yojana (PM-JAY) provides health coverage up to ₹5 lakh per family per year.',
      icon: <Heart className="h-6 w-6 text-healthRed-600" />,
      url: 'https://web.umang.gov.in/landing/department/pradhan-mantri-jan-arogya-yojana.html',
      eligibility: 'Poor and vulnerable families as per SECC database',
      benefits: [
        'Cashless and paperless treatment at empanelled hospitals',
        'Coverage up to ₹5 lakh per family per year',
        'Transportation allowance for hospitalization',
        'Pre and post-hospitalization expenses covered'
      ]
    },
    {
      title: 'Pradhan Mantri Suraksha Bima Yojana',
      description: 'An accident insurance scheme with coverage of ₹2 lakh at just ₹12 per year.',
      icon: <BadgeIndianRupee className="h-6 w-6 text-healthGreen-600" />,
      url: 'https://www.myscheme.gov.in/schemes/pmsby',
      eligibility: 'All Indian citizens aged 18-70 years with a bank account',
      benefits: [
        'Affordable premium of ₹12 per annum',
        '₹2 lakh coverage for accidental death or disability',
        'Auto-debit feature for hassle-free renewal',
        'One-year cover from June 1 to May 31'
      ]
    },
    {
      title: 'Pradhan Mantri Jeevan Jyoti Bima Yojana',
      description: 'Life insurance cover of ₹2 lakh at a premium of just ₹330 per year.',
      icon: <Landmark className="h-6 w-6 text-healthBlue-600" />,
      url: 'https://www.myscheme.gov.in/schemes/pmjjby',
      eligibility: 'All Indian citizens aged 18-50 years with a bank account',
      benefits: [
        '₹2 lakh life insurance coverage',
        'Affordable premium of ₹330 per annum',
        'Coverage for death due to any reason',
        'Simple enrollment process through bank account'
      ]
    },
    {
      title: 'Aam Aadmi Bima Yojana',
      description: 'Social security scheme for rural landless households providing insurance coverage.',
      icon: <Shield className="h-6 w-6 text-healthGreen-600" />,
      url: 'https://www.myscheme.gov.in/schemes/aaby',
      eligibility: 'Rural landless households, one person per family aged 18-59 years',
      benefits: [
        '₹30,000 for natural death',
        '₹75,000 for accidental death/disability',
        'Scholarship benefits for children studying in 9th to 12th standard',
        'Premium subsidized by central and state governments'
      ],
      isNew: true
    },
    {
      title: 'Central Government Health Scheme',
      description: 'Comprehensive healthcare facilities to Central Government employees and pensioners.',
      icon: <GraduationCap className="h-6 w-6 text-healthBlue-600" />,
      url: 'https://www.myscheme.gov.in/schemes/cghs',
      eligibility: 'Central government employees, pensioners and their dependents',
      benefits: [
        'Comprehensive medical care facilities',
        'OPD and hospitalization coverage',
        'Medical reimbursement for treatments',
        'Cashless treatment at empanelled hospitals'
      ]
    },
    {
      title: 'National Pension Scheme',
      description: 'Voluntary contribution pension scheme aimed at providing retirement income.',
      icon: <BadgeIndianRupee className="h-6 w-6 text-healthBlue-600" />,
      url: 'https://www.myscheme.gov.in/schemes/nps',
      eligibility: 'Indian citizens aged 18-65 years',
      benefits: [
        'Flexible investment options',
        'Tax benefits under Section 80C and 80CCD',
        'Regular pension after retirement',
        'Partial withdrawal for specific purposes'
      ],
      isNew: true
    },
    {
      title: 'Ayushman Bharat Health Infrastructure Mission',
      description: 'Developing healthcare infrastructure across primary, secondary, and tertiary care systems.',
      icon: <Leaf className="h-6 w-6 text-healthGreen-600" />,
      url: 'https://abdm.gov.in/pm-abhim',
      eligibility: 'All Indian citizens through public healthcare infrastructure',
      benefits: [
        'Strengthened public health infrastructure',
        'Better disease surveillance systems',
        'Improved testing capacities',
        'Enhanced research capabilities'
      ],
      isNew: true
    }
  ];

  const newSchemes = healthSchemes.filter(scheme => scheme.isNew);
  const allSchemes = healthSchemes;

  return (
    <Layout>
      <div className="container py-8 max-w-7xl">
        <h1 className="text-3xl font-bold mb-2">Health Schemes & Programs</h1>
        <p className="text-gray-600 mb-6">
          Explore government schemes and programs to support your healthcare needs
        </p>
        
        <Tabs defaultValue="all">
          <TabsList className="mb-8">
            <TabsTrigger value="all">All Schemes</TabsTrigger>
            <TabsTrigger value="new">
              New Schemes
              <span className="ml-2 bg-healthOrange-100 text-healthOrange-700 text-xs px-2 py-0.5 rounded-full">
                {newSchemes.length}
              </span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allSchemes.map((scheme, index) => (
                <SchemeCard key={index} {...scheme} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="new">
            {newSchemes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {newSchemes.map((scheme, index) => (
                  <SchemeCard key={index} {...scheme} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Tag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium mb-2">No new schemes at the moment</h3>
                <p className="text-gray-600">
                  Check back later for new government health schemes and programs.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        <div className="mt-12 bg-gray-50 p-6 rounded-lg border">
          <h3 className="text-xl font-medium mb-2">Need Help?</h3>
          <p className="text-gray-600 mb-4">
            Our team can help you understand these schemes and assist with the application process.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button variant="outline" className="bg-white">
              Schedule Consultation
            </Button>
            <Button variant="outline" className="bg-white">
              Eligibility Check
            </Button>
            {!user && (
              <Button onClick={() => window.location.href = '/auth'}>
                Sign In for Personalized Recommendations
              </Button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HealthSchemes;
