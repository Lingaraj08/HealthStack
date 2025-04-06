
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useAuth } from '@/components/auth/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2, Save } from 'lucide-react';

type ProfileData = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  phone_number: string | null;
  date_of_birth: string | null;
  gender: string | null;
  blood_type: string | null;
  emergency_contact: string | null;
  health_id: string | null;
  address: string | null;
};

const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const genderOptions = ['Male', 'Female', 'Other', 'Prefer not to say'];

const Profile: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [profileForm, setProfileForm] = useState<Partial<ProfileData>>({
    first_name: '',
    last_name: '',
    phone_number: '',
    date_of_birth: '',
    gender: '',
    blood_type: '',
    emergency_contact: '',
    health_id: '',
    address: '',
  });
  
  const [isEditing, setIsEditing] = useState(false);
  
  // Fetch profile data
  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('Not authenticated');
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      return data as ProfileData;
    },
    enabled: !!user
  });
  
  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (updatedProfile: Partial<ProfileData>) => {
      if (!user) throw new Error('Not authenticated');
      
      const { error } = await supabase
        .from('profiles')
        .update(updatedProfile)
        .eq('id', user.id);
      
      if (error) throw error;
      return updatedProfile;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', user?.id] });
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully"
      });
      setIsEditing(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update profile: " + (error as Error).message,
        variant: "destructive"
      });
    }
  });
  
  // Initialize form with profile data when it's loaded
  useEffect(() => {
    if (profile) {
      setProfileForm({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        phone_number: profile.phone_number || '',
        date_of_birth: profile.date_of_birth || '',
        gender: profile.gender || '',
        blood_type: profile.blood_type || '',
        emergency_contact: profile.emergency_contact || '',
        health_id: profile.health_id || '',
        address: profile.address || '',
      });
    }
  }, [profile]);
  
  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
  };
  
  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setProfileForm((prev) => ({ ...prev, [name]: value }));
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate(profileForm);
  };
  
  // Extract user initials for avatar fallback
  const getInitials = () => {
    if (!user) return 'U';
    
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name[0]}${profile.last_name[0]}`;
    }
    
    const email = user.email || '';
    return email.charAt(0).toUpperCase();
  };

  if (!user) {
    return (
      <Layout>
        <div className="container mx-auto py-12 max-w-4xl">
          <Card className="p-6">
            <CardHeader>
              <CardTitle>Authentication Required</CardTitle>
              <CardDescription>
                Please sign in to view and edit your profile.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button onClick={() => window.location.href = '/auth'}>
                Sign In
              </Button>
            </CardFooter>
          </Card>
        </div>
      </Layout>
    );
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto py-12 max-w-4xl">
          <div className="flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-healthBlue-600" />
            <p className="ml-2">Loading profile...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-12 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8 text-healthBlue-800">Your Profile</h1>
        
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16 border-2 border-healthBlue-200">
                <AvatarImage src={user?.user_metadata?.avatar_url} />
                <AvatarFallback className="bg-healthBlue-100 text-healthBlue-700 text-lg">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-xl">
                  {profile?.first_name || ''} {profile?.last_name || ''}
                </CardTitle>
                <CardDescription>{user?.email}</CardDescription>
              </div>
              <div className="ml-auto">
                {!isEditing ? (
                  <Button onClick={() => setIsEditing(true)}>
                    Edit Profile
                  </Button>
                ) : (
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {!isEditing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium text-gray-700">Email</h3>
                    <p>{user?.email}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-700">Phone</h3>
                    <p>{profile?.phone_number || 'Not provided'}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-700">Date of Birth</h3>
                    <p>{profile?.date_of_birth || 'Not provided'}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-700">Gender</h3>
                    <p>{profile?.gender || 'Not provided'}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-700">Blood Type</h3>
                    <p>{profile?.blood_type || 'Not provided'}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-700">Emergency Contact</h3>
                    <p>{profile?.emergency_contact || 'Not provided'}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-700">Address</h3>
                    <p>{profile?.address || 'Not provided'}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-700">Account Created</h3>
                    <p>{user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}</p>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="first_name" className="text-sm font-medium">First Name</label>
                      <Input
                        id="first_name"
                        name="first_name"
                        value={profileForm.first_name || ''}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="last_name" className="text-sm font-medium">Last Name</label>
                      <Input
                        id="last_name"
                        name="last_name"
                        value={profileForm.last_name || ''}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="phone_number" className="text-sm font-medium">Phone</label>
                      <Input
                        id="phone_number"
                        name="phone_number"
                        value={profileForm.phone_number || ''}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="date_of_birth" className="text-sm font-medium">Date of Birth</label>
                      <Input
                        id="date_of_birth"
                        name="date_of_birth"
                        type="date"
                        value={profileForm.date_of_birth || ''}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="gender" className="text-sm font-medium">Gender</label>
                      <Select
                        value={profileForm.gender || ''}
                        onValueChange={(value) => handleSelectChange('gender', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          {genderOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="blood_type" className="text-sm font-medium">Blood Type</label>
                      <Select
                        value={profileForm.blood_type || ''}
                        onValueChange={(value) => handleSelectChange('blood_type', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select blood type" />
                        </SelectTrigger>
                        <SelectContent>
                          {bloodTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="emergency_contact" className="text-sm font-medium">Emergency Contact</label>
                      <Input
                        id="emergency_contact"
                        name="emergency_contact"
                        value={profileForm.emergency_contact || ''}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="health_id" className="text-sm font-medium">Health ID</label>
                      <Input
                        id="health_id"
                        name="health_id"
                        value={profileForm.health_id || ''}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label htmlFor="address" className="text-sm font-medium">Address</label>
                      <Input
                        id="address"
                        name="address"
                        value={profileForm.address || ''}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end pt-4">
                    <Button 
                      type="submit" 
                      disabled={updateProfileMutation.isPending}
                      className="bg-healthBlue-600 hover:bg-healthBlue-700"
                    >
                      {updateProfileMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Health Information</CardTitle>
            <CardDescription>
              Connect your health ID and manage your medical information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-healthBlue-50 rounded-lg border border-healthBlue-100">
              <h3 className="font-medium text-healthBlue-700 mb-2">Connect Health ID</h3>
              <p className="text-gray-600 mb-4">
                Link your Ayushman Bharat Digital Health ID for seamless healthcare services.
              </p>
              <Button className="bg-healthBlue-600 hover:bg-healthBlue-700">
                Connect Health ID
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Profile;
