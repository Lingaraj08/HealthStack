
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/components/auth/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { ProfileData } from '@/types/profile';
import { Camera, Save, User, UserCircle, Phone, MapPin, Calendar, HeartPulse, Users, Activity, ShieldAlert } from 'lucide-react';
import { format } from 'date-fns';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const Profile = () => {
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);

  // Form fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [address, setAddress] = useState('');
  const [bloodType, setBloodType] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [healthId, setHealthId] = useState('');

  const queryClient = useQueryClient();

  // Use react-query to fetch profile (cached, faster on repeated visits)
  const { data: fetchedProfile, isLoading, isError, error } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      if (error) throw error;
      return data as ProfileData;
    },
    enabled: !!user && !authLoading,
    staleTime: 1000 * 60 * 5, // cache 5 minutes
    retry: 1,
  });

  // Keep local form state in sync when profile arrives
  useEffect(() => {
    if (fetchedProfile) {
      setProfileData(fetchedProfile);
      setFirstName(fetchedProfile.first_name || '');
      setLastName(fetchedProfile.last_name || '');
      setPhone(fetchedProfile.phone_number || '');
      setDob(fetchedProfile.date_of_birth || '');
      setGender(fetchedProfile.gender || '');
      setAddress(fetchedProfile.address || '');
      setBloodType(fetchedProfile.blood_type || '');
      setEmergencyContact(fetchedProfile.emergency_contact || '');
      setHealthId(fetchedProfile.health_id || '');
    }
  }, [fetchedProfile]);

  useEffect(() => {
    // If auth resolved and no user, redirect to auth (PrivateRoute should already do this)
    if (!authLoading && !user) {
      navigate('/auth');
    }
    // otherwise react-query will fetch the profile automatically
  }, [authLoading, user, navigate]);

  const uploadMutation = useMutation<string, Error, File>({
    mutationFn: async (file: File) => {
      const fileExt = file.name.split('.').pop();
      const filePath = `${user!.id}/avatar.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: data.publicUrl })
        .eq('id', user!.id);

      if (updateError) throw updateError;

      return data.publicUrl;
    },
    onMutate: () => setUploading(true),
    onSuccess: (publicUrl) => {
      toast({ title: 'Success', description: 'Avatar updated successfully!' });
      queryClient.invalidateQueries({ queryKey: ['profile', user?.id] });
      setUploading(false);
    },
    onError: (err: any) => {
      toast({ title: 'Error updating avatar', description: err.message || String(err), variant: 'destructive' });
      setUploading(false);
    }
  });

  const uploadAvatar = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;
    const file = event.target.files[0];
    uploadMutation.mutate(file);
  };

  const queryClientForMutations = queryClient;
  const updateMutation = useMutation<Partial<ProfileData>, Error, void>({
    mutationFn: async () => {
      if (!user) throw new Error('No user');

      const updates = {
        id: user.id,
        first_name: firstName,
        last_name: lastName,
        phone_number: phone,
        date_of_birth: dob,
        gender,
        address,
        blood_type: bloodType,
        emergency_contact: emergencyContact,
        health_id: healthId,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase.from('profiles').update(updates).eq('id', user.id);
      if (error) throw error;
      return updates;
    },
    onMutate: () => {},
    onSuccess: () => {
      toast({ title: 'Profile updated!', description: 'Your profile has been updated successfully.' });
      queryClientForMutations.invalidateQueries({ queryKey: ['profile', user?.id] });
    },
    onError: (err: any) => {
      toast({ title: 'Error updating profile', description: err.message || String(err), variant: 'destructive' });
    }
  });

  // helper to trigger the update and expose loading state used by the UI
      const updateProfile = () => updateMutation.mutate();
      const loading = updateMutation.isPending;

  const getInitials = () => {
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    }
    
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    
    return 'U';
  };

  return (
    <Layout>
      <div className="container max-w-5xl py-8 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
            <p className="text-muted-foreground">
              Manage your personal health information
            </p>
          </div>
          <Button variant="outline" onClick={() => navigate(-1)}>
            Back
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-10">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-healthBlue-600 border-t-transparent"></div>
          </div>
        ) : isError ? (
              <div className="py-10 text-center">
            <p className="text-red-400 mb-4">Error loading profile: {(error as any)?.message || String(error)}</p>
            <div>
              <Button onClick={() => queryClient.invalidateQueries({ queryKey: ['profile', user?.id] })}>Retry</Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Profile Card */}
            <Card>
              <CardContent className="pt-6 flex flex-col items-center text-center">
                <div className="relative mb-4">
                  <Avatar className="h-24 w-24 border-2 border-healthBlue-100">
                    <AvatarImage src={profileData?.avatar_url || undefined} />
                    <AvatarFallback className="bg-healthBlue-100 text-healthBlue-700 text-xl">
                      {getInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute bottom-0 right-0">
                    <label htmlFor="avatar-upload" className="cursor-pointer">
                      <div className="rounded-full bg-healthBlue-500 p-1.5 text-white hover:bg-healthBlue-600 transition">
                        <Camera size={16} />
                      </div>
                      <input
                        type="file"
                        id="avatar-upload"
                        className="hidden"
                        accept="image/*"
                        onChange={uploadAvatar}
                        disabled={uploading}
                      />
                    </label>
                  </div>
                </div>
                <h3 className="text-xl font-medium">
                  {firstName} {lastName}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">{user?.email}</p>
                <div className="w-full space-y-3 text-left">
                  <div className="flex items-center text-sm">
                    <Phone className="h-4 w-4 mr-2 text-healthBlue-500" />
                    <span className="font-medium mr-1">Phone:</span>
                    {phone || 'Not provided'}
                  </div>
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 mr-2 text-healthBlue-500" />
                    <span className="font-medium mr-1">Date of Birth:</span>
                    {dob ? format(new Date(dob), 'PP') : 'Not provided'}
                  </div>
                  <div className="flex items-center text-sm">
                    <User className="h-4 w-4 mr-2 text-healthBlue-500" />
                    <span className="font-medium mr-1">Gender:</span>
                    {gender || 'Not provided'}
                  </div>
                  <div className="flex items-center text-sm">
                    <MapPin className="h-4 w-4 mr-2 text-healthBlue-500" />
                    <span className="font-medium mr-1">Address:</span>
                    {address || 'Not provided'}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Edit Profile */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <UserCircle className="mr-2 h-5 w-5" /> Edit Profile
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="personal">
                  <TabsList className="grid grid-cols-2 w-full">
                    <TabsTrigger value="personal">Personal Details</TabsTrigger>
                    <TabsTrigger value="medical">Medical Information</TabsTrigger>
                  </TabsList>
                  <TabsContent value="personal" className="space-y-4 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dob">Date of Birth</Label>
                        <Input
                          id="dob"
                          type="date"
                          value={dob}
                          onChange={(e) => setDob(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="gender">Gender</Label>
                        <select
                          id="gender"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          value={gender}
                          onChange={(e) => setGender(e.target.value)}
                        >
                          <option value="">Select gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                          <option value="prefer_not_to_say">Prefer not to say</option>
                        </select>
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="address">Address</Label>
                        <Input
                          id="address"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                        />
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="medical" className="space-y-4 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="bloodType">Blood Type</Label>
                        <select
                          id="bloodType"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          value={bloodType}
                          onChange={(e) => setBloodType(e.target.value)}
                        >
                          <option value="">Select blood type</option>
                          <option value="A+">A+</option>
                          <option value="A-">A-</option>
                          <option value="B+">B+</option>
                          <option value="B-">B-</option>
                          <option value="AB+">AB+</option>
                          <option value="AB-">AB-</option>
                          <option value="O+">O+</option>
                          <option value="O-">O-</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="emergencyContact">Emergency Contact</Label>
                        <Input
                          id="emergencyContact"
                          value={emergencyContact}
                          onChange={(e) => setEmergencyContact(e.target.value)}
                          placeholder="Name: Phone"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="healthId">Health ID</Label>
                        <Input
                          id="healthId"
                          value={healthId}
                          onChange={(e) => setHealthId(e.target.value)}
                          placeholder="Your ABHA ID"
                        />
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="flex justify-end mt-6">
                  <Button
                    onClick={updateProfile}
                    disabled={loading}
                    className="health-button-primary"
                  >
                    {loading ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" /> Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Health Cards */}
            <Card className="md:col-span-3">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="mr-2 h-5 w-5" /> Health Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-healthBlue-50 p-4 rounded-lg border border-healthBlue-100">
                    <div className="flex items-center mb-2">
                      <HeartPulse className="text-healthBlue-600 mr-2" />
                      <h3 className="font-semibold">Blood Type</h3>
                    </div>
                    <p className="text-2xl font-bold text-healthBlue-700">
                      {bloodType || 'Not set'}
                    </p>
                  </div>

                  <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                    <div className="flex items-center mb-2">
                      <ShieldAlert className="text-indigo-600 mr-2" />
                      <h3 className="font-semibold">Emergency Contact</h3>
                    </div>
                    <p className={`${emergencyContact ? 'text-base' : 'text-2xl'} font-bold text-indigo-700`}>
                      {emergencyContact || 'Not set'}
                    </p>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                    <div className="flex items-center mb-2">
                      <Users className="text-green-600 mr-2" />
                      <h3 className="font-semibold">Health ID</h3>
                    </div>
                    <p className="text-base font-bold text-green-700 truncate">
                      {healthId || 'Not set'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Profile;
