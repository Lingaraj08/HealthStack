
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Badge, MapPin, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge as UIBadge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

interface Doctor {
  id: string;
  full_name: string;
  specialization: string;
  years_of_experience: number;
  hospital: string;
  rating: number;
  available_for_consultation: boolean;
  avatar_url: string;
}

const DoctorsList: React.FC = () => {
  const navigate = useNavigate();

  const { data: doctors, isLoading, error } = useQuery({
    queryKey: ['doctors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('doctors')
        .select('*')
        .order('rating', { ascending: false });
      
      if (error) throw error;
      return data as Doctor[];
    }
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-healthBlue-600 mr-2" />
        <p>Loading doctors...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="text-red-600 font-medium mb-2">Error loading doctors</h3>
        <p className="text-gray-700">{(error as Error).message}</p>
      </div>
    );
  }

  if (!doctors || doctors.length === 0) {
    return (
      <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg text-center">
        <h3 className="font-medium mb-2">No doctors found</h3>
        <p className="text-gray-600">There are no doctors available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {doctors.map((doctor) => (
        <Card key={doctor.id} className="hover:border-healthBlue-300 transition-all">
          <CardContent className="p-6">
            <div className="flex items-center mb-6">
              <div className="relative mr-4">
                <img 
                  src={doctor.avatar_url || 'https://randomuser.me/api/portraits/men/32.jpg'} 
                  alt={doctor.full_name} 
                  className="h-16 w-16 rounded-full object-cover border-2 border-healthBlue-100"
                />
                <div className="absolute -bottom-1 -right-1 bg-healthBlue-500 rounded-full p-1">
                  <Badge className="h-3 w-3 text-white" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-lg">{doctor.full_name}</h3>
                <p className="text-sm text-gray-600">{doctor.specialization} • {doctor.years_of_experience} years</p>
                <div className="flex items-center mt-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium ml-1">{doctor.rating}</span>
                </div>
              </div>
            </div>
            
            <div className="mb-4">
              <div className="flex items-center text-gray-600 mb-2">
                <MapPin className="h-4 w-4 mr-2" />
                <span className="text-sm">{doctor.hospital || "Not specified"}</span>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                <UIBadge variant="outline" className="bg-healthBlue-50 text-healthBlue-700 border-healthBlue-200">
                  ABDM Verified
                </UIBadge>
                {doctor.available_for_consultation ? (
                  <UIBadge variant="outline" className="bg-healthGreen-50 text-healthGreen-700 border-healthGreen-200">
                    Available Today
                  </UIBadge>
                ) : (
                  <UIBadge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                    Next Available: Tomorrow
                  </UIBadge>
                )}
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <Button 
                className="bg-healthBlue-600 hover:bg-healthBlue-700 flex-1"
                onClick={() => navigate(`/doctors/${doctor.id}`)}
              >
                Book Appointment
              </Button>
              <Button 
                variant="outline" 
                className="border-healthBlue-300 text-healthBlue-600 flex-1"
                onClick={() => navigate(`/doctors/${doctor.id}`)}
              >
                View Profile
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DoctorsList;
