
import React from 'react';
import { Star, Badge, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge as UIBadge } from '@/components/ui/badge';

const DoctorsSection: React.FC = () => {
  const navigate = useNavigate();
  
  const doctors = [
    {
      id: 1,
      name: 'Dr. Priya Sharma',
      specialty: 'Cardiologist',
      experience: '12 years',
      location: 'Apollo Hospital, Delhi',
      rating: 4.9,
      verified: true,
      image: 'https://randomuser.me/api/portraits/women/65.jpg',
      available: true
    },
    {
      id: 2,
      name: 'Dr. Rahul Mehta',
      specialty: 'Neurologist',
      experience: '8 years',
      location: 'Fortis Healthcare, Mumbai',
      rating: 4.7,
      verified: true,
      image: 'https://randomuser.me/api/portraits/men/32.jpg',
      available: true
    },
    {
      id: 3,
      name: 'Dr. Ananya Patel',
      specialty: 'Pediatrician',
      experience: '15 years',
      location: 'Max Healthcare, Bangalore',
      rating: 4.8,
      verified: true,
      image: 'https://randomuser.me/api/portraits/women/45.jpg',
      available: false
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="health-container">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
          <div>
            <h2 className="health-heading text-3xl md:text-4xl mb-2">Top Verified Doctors</h2>
            <p className="health-subheading text-gray-600">
              All doctors are verified through Aadhaar eKYC and medical council registrations
            </p>
          </div>
          <Button 
            className="health-button-primary mt-4 md:mt-0"
            onClick={() => navigate('/doctors')}
          >
            View All Doctors
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {doctors.map((doctor) => (
            <Card key={doctor.id} className="health-card hover:border-healthBlue-300 transition-all">
              <CardContent className="p-6">
                <div className="flex items-center mb-6">
                  <div className="relative mr-4">
                    <img 
                      src={doctor.image} 
                      alt={doctor.name} 
                      className="h-16 w-16 rounded-full object-cover border-2 border-healthBlue-100"
                    />
                    {doctor.verified && (
                      <div className="absolute -bottom-1 -right-1 bg-healthBlue-500 rounded-full p-1">
                        <Badge className="h-3 w-3 text-white" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{doctor.name}</h3>
                    <p className="text-sm text-gray-600">{doctor.specialty} • {doctor.experience}</p>
                    <div className="flex items-center mt-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium ml-1">{doctor.rating}</span>
                    </div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="flex items-center text-gray-600 mb-2">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span className="text-sm">{doctor.location}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <UIBadge variant="outline" className="bg-healthBlue-50 text-healthBlue-700 border-healthBlue-200">
                      ABDM Verified
                    </UIBadge>
                    {doctor.available ? (
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
                    className="health-button-primary flex-1"
                    onClick={() => navigate(`/doctors/${doctor.id}`)}
                  >
                    Book Appointment
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-healthBlue-300 text-healthBlue-600 flex-1"
                    onClick={() => navigate(`/doctors/${doctor.id}/profile`)}
                  >
                    View Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DoctorsSection;
