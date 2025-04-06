
import React from 'react';
import Layout from '@/components/layout/Layout';
import DoctorsList from '@/components/doctors/DoctorsList';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter } from 'lucide-react';

const Doctors: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-healthBlue-800">Find Doctors</h1>
            <p className="text-gray-600 mt-2">Connect with verified healthcare professionals</p>
          </div>
        </div>

        <Card className="mb-8">
          <CardHeader className="pb-0">
            <CardTitle>Search Doctors</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input placeholder="Doctor name or specialty" className="pl-10" />
              </div>
              
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Specialization" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cardiologist">Cardiologist</SelectItem>
                  <SelectItem value="neurologist">Neurologist</SelectItem>
                  <SelectItem value="pediatrician">Pediatrician</SelectItem>
                  <SelectItem value="dermatologist">Dermatologist</SelectItem>
                  <SelectItem value="orthopedic">Orthopedic</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Hospital" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="apollo">Apollo Hospital</SelectItem>
                  <SelectItem value="fortis">Fortis Healthcare</SelectItem>
                  <SelectItem value="max">Max Healthcare</SelectItem>
                  <SelectItem value="aiims">AIIMS</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-between items-center">
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" /> More Filters
              </Button>
              <Button className="bg-healthBlue-600 hover:bg-healthBlue-700">Search</Button>
            </div>
          </CardContent>
        </Card>

        <DoctorsList />
      </div>
    </Layout>
  );
};

export default Doctors;
