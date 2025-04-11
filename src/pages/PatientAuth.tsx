
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ENV } from '@/lib/env';
import { LogIn, Mail, User, Lock, Phone, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthContext';

const PatientAuth = () => {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [guardianPhone, setGuardianPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('login');

  // Redirect if already authenticated
  useEffect(() => {
    if (session) {
      navigate('/');
    }
  }, [session, navigate]);

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      // Check if user is a patient
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('user_role')
        .eq('id', data.user.id)
        .single();
      
      if (profileError) throw profileError;
      
      if (profileData.user_role !== 'patient') {
        await supabase.auth.signOut();
        toast.error('This login is for patients only. Please use the doctor login page.');
      } else {
        toast.success('Signed in successfully!');
        navigate('/');
      }
    } catch (error: any) {
      toast.error(error.message || 'Error signing in');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            user_type: 'patient'
          }
        }
      });
      
      if (error) throw error;
    } catch (error: any) {
      toast.error(error.message || 'Error signing in with Google');
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    if (!firstName || !lastName || !email || !password || !phoneNumber) {
      toast.error('Please fill all required fields');
      setLoading(false);
      return;
    }
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            first_name: firstName,
            last_name: lastName,
            phone_number: phoneNumber,
            guardian_phone: guardianPhone,
            user_role: 'patient'
          }
        }
      });
      
      if (error) throw error;
      
      toast.success('Registration successful! Please check your email for verification.');
      setActiveTab('login');
    } catch (error: any) {
      toast.error(error.message || 'Error during registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-12">
        <div className="flex flex-col items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-healthBlue-700">Patient Portal</CardTitle>
              <CardDescription>
                Access your personal health dashboard and appointments
              </CardDescription>
            </CardHeader>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-2 mb-8 w-full">
                <TabsTrigger value="login">Log In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <form onSubmit={handleEmailSignIn}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="your.email@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="password">Password</Label>
                        <a href="#" className="text-sm text-healthBlue-600 hover:text-healthBlue-800">
                          Forgot password?
                        </a>
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="flex flex-col space-y-4">
                    <Button type="submit" className="w-full bg-healthBlue-600 hover:bg-healthBlue-700" disabled={loading}>
                      {loading ? <span className="flex items-center"><LogIn className="mr-2 h-4 w-4 animate-spin" /> Signing in...</span> : <span className="flex items-center"><LogIn className="mr-2 h-4 w-4" /> Sign In</span>}
                    </Button>
                    
                    {ENV.GOOGLE_CLIENT_ID && (
                      <>
                        <div className="relative flex py-3 items-center w-full">
                          <div className="flex-grow border-t border-gray-300"></div>
                          <span className="flex-shrink mx-4 text-gray-500">or</span>
                          <div className="flex-grow border-t border-gray-300"></div>
                        </div>
                        
                        <Button 
                          type="button" 
                          variant="outline" 
                          className="w-full"
                          onClick={handleGoogleSignIn}
                          disabled={loading}
                        >
                          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5 mr-2" />
                          Continue with Google
                        </Button>
                      </>
                    )}
                    
                    <div className="text-center text-sm mt-4">
                      Are you a doctor? <a href="/doctor-auth" className="text-healthBlue-600 hover:text-healthBlue-800">Sign in here</a>
                    </div>
                  </CardFooter>
                </form>
              </TabsContent>
              
              <TabsContent value="signup">
                <form onSubmit={handleSignUp}>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name*</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="firstName"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name*</Label>
                        <Input
                          id="lastName"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="signupEmail">Email*</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="signupEmail"
                          type="email"
                          placeholder="your.email@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber">Phone Number*</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="phoneNumber"
                          type="tel"
                          placeholder="+91 9876543210"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Label htmlFor="guardianPhone">Emergency Contact (Guardian's Phone)</Label>
                        <AlertTriangle className="h-4 w-4 text-healthOrange-500 ml-1" />
                      </div>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="guardianPhone"
                          type="tel"
                          placeholder="+91 9876543210"
                          value={guardianPhone}
                          onChange={(e) => setGuardianPhone(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                      <p className="text-xs text-gray-500">This number will be contacted in case of emergency when you use the SOS feature</p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="signupPassword">Password*</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="signupPassword"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                      <p className="text-xs text-gray-500">Must be at least 8 characters</p>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="flex flex-col space-y-4">
                    <Button type="submit" className="w-full bg-healthGreen-600 hover:bg-healthGreen-700" disabled={loading}>
                      {loading ? <span className="flex items-center">Signing up...</span> : <span className="flex items-center">Create Account</span>}
                    </Button>
                    
                    {ENV.GOOGLE_CLIENT_ID && (
                      <>
                        <div className="relative flex py-3 items-center w-full">
                          <div className="flex-grow border-t border-gray-300"></div>
                          <span className="flex-shrink mx-4 text-gray-500">or</span>
                          <div className="flex-grow border-t border-gray-300"></div>
                        </div>
                        
                        <Button 
                          type="button" 
                          variant="outline" 
                          className="w-full"
                          onClick={handleGoogleSignIn}
                          disabled={loading}
                        >
                          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5 mr-2" />
                          Sign up with Google
                        </Button>
                      </>
                    )}
                  </CardFooter>
                </form>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default PatientAuth;
