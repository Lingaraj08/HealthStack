
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink, CheckCircle2, Clock, PlusCircle, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface HealthScheme {
  id: string;
  name: string;
  description: string;
  eligibility: string;
  url: string;
  status: 'popular' | 'new' | 'recommended' | '';
  deadlineSoon?: boolean;
}

const healthSchemes: HealthScheme[] = [
  {
    id: '1',
    name: 'Ayushman Bharat Digital Mission (ABHA)',
    description: 'Create your ABHA ID to access and share your health records digitally.',
    eligibility: 'All Indian citizens',
    url: 'https://abha.abdm.gov.in/abha/v3/register',
    status: 'popular'
  },
  {
    id: '2',
    name: 'PM Jan Arogya Yojana (PM-JAY)',
    description: 'Get free access to healthcare services up to ₹5 lakh per family per year.',
    eligibility: 'Economically disadvantaged families as per SECC data',
    url: 'https://web.umang.gov.in/landing/department/pradhan-mantri-jan-arogya-yojana.html',
    status: 'recommended',
    deadlineSoon: true
  },
  {
    id: '3',
    name: 'Pradhan Mantri Suraksha Bima Yojana (PMSBY)',
    description: 'Accident insurance cover of ₹2 lakh at just ₹12 per year.',
    eligibility: 'All Indian citizens aged 18-70 with a bank account',
    url: 'https://www.myscheme.gov.in/schemes/pmsby',
    status: ''
  },
  {
    id: '4',
    name: 'Pradhan Mantri Jeevan Jyoti Bima Yojana (PMJJBY)',
    description: 'Life insurance cover of ₹2 lakh at just ₹330 per year.',
    eligibility: 'All Indian citizens aged 18-50 with a bank account',
    url: 'https://www.myscheme.gov.in/schemes/pmjjby',
    status: 'new'
  },
  {
    id: '5',
    name: 'Rashtriya Swasthya Bima Yojana (RSBY)',
    description: 'Health insurance for BPL families providing coverage up to ₹30,000.',
    eligibility: 'BPL families',
    url: 'https://www.nhp.gov.in/rashtriya-swasthya-bima-yojana-rsby_pg',
    status: ''
  },
  {
    id: '6',
    name: 'Pradhan Mantri National Dialysis Program',
    description: 'Free dialysis services to people suffering from kidney diseases.',
    eligibility: 'All kidney disease patients',
    url: 'https://nhm.gov.in/index1.php?lang=1&level=2&sublinkid=1104&lid=135',
    status: ''
  }
];

const HealthSchemes = () => {
  const handleSchemeClick = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <Layout>
      <div className="container mx-auto py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-healthBlue-800 mb-2">Government Health Schemes</h1>
          <p className="text-gray-600">
            Apply for government healthcare schemes and benefits you may be eligible for
          </p>
        </div>
        
        {/* Featured Scheme */}
        <div className="mb-12">
          <Card className="bg-gradient-to-r from-healthBlue-50 to-white border-healthBlue-100">
            <div className="md:grid md:grid-cols-3 gap-6">
              <CardHeader className="md:col-span-2">
                <Badge className="mb-2 bg-healthBlue-100 text-healthBlue-800 hover:bg-healthBlue-200">Featured</Badge>
                <CardTitle className="text-2xl text-healthBlue-800">Ayushman Bharat Digital Mission</CardTitle>
                <CardDescription className="text-base mt-2">
                  Create your digital health ID (ABHA) to access and share health records securely 
                  across healthcare providers. Manage your medical history, prescriptions, and test
                  results in one place.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 md:pt-0 flex items-center justify-center">
                <img 
                  src="https://abdm.gov.in/assets/images/logo.png" 
                  alt="ABHA Logo" 
                  className="max-h-40 max-w-full object-contain"
                />
              </CardContent>
            </div>
            <CardFooter className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-white rounded-b-lg border-t p-6">
              <div className="flex items-center text-healthBlue-600 font-medium">
                <CheckCircle2 className="h-5 w-5 mr-2" />
                Free for all Indian citizens
              </div>
              <Button 
                className="bg-healthBlue-600 hover:bg-healthBlue-700 w-full sm:w-auto"
                onClick={() => handleSchemeClick('https://abha.abdm.gov.in/abha/v3/register')}
              >
                <span className="flex items-center">
                  Create ABHA ID
                  <ExternalLink className="ml-2 h-4 w-4" />
                </span>
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        {/* All Schemes */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {healthSchemes.map((scheme) => (
            <Card key={scheme.id} className="flex flex-col h-full">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <div className="flex gap-2 flex-wrap">
                    {scheme.status === 'popular' && (
                      <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                        Popular
                      </Badge>
                    )}
                    {scheme.status === 'new' && (
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                        New
                      </Badge>
                    )}
                    {scheme.status === 'recommended' && (
                      <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">
                        Recommended for you
                      </Badge>
                    )}
                  </div>
                  
                  {scheme.deadlineSoon && (
                    <div className="flex items-center text-amber-600 text-xs font-medium">
                      <Clock className="h-3 w-3 mr-1" />
                      Deadline soon
                    </div>
                  )}
                </div>
                <CardTitle className="text-lg">{scheme.name}</CardTitle>
                <CardDescription className="mt-2">{scheme.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-sm font-medium text-gray-700">Eligibility:</p>
                  <p className="text-sm text-gray-600">{scheme.eligibility}</p>
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Button 
                  className="w-full"
                  variant="outline"
                  onClick={() => handleSchemeClick(scheme.url)}
                >
                  <span className="flex items-center">
                    Apply Now
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </span>
                </Button>
              </CardFooter>
            </Card>
          ))}
          
          {/* Coming Soon Card */}
          <Card className="flex flex-col h-full border-dashed border-gray-300 bg-gray-50">
            <CardHeader>
              <CardTitle className="text-lg text-gray-600">More Schemes Coming Soon</CardTitle>
              <CardDescription className="mt-2">
                We're adding more government health benefit programs regularly.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex items-center justify-center">
              <PlusCircle className="h-12 w-12 text-gray-400" />
            </CardContent>
            <CardFooter className="pt-0">
              <div className="flex items-center w-full justify-center text-sm text-gray-500">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Check back soon for updates
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default HealthSchemes;
