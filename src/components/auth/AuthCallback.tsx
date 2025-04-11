
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Layout from '@/components/layout/Layout';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the user role from query params for OAuth sign-ins
        const userType = searchParams.get('user_type');
        
        // Process the authentication response from Supabase
        const { data, error } = await supabase.auth.getSession();
        
        if (error) throw error;
        
        if (data.session) {
          // For OAuth sign-ins, we need to update the user profile
          if (userType) {
            // Check if profile already exists
            const { data: profileData, error: profileError } = await supabase
              .from('profiles')
              .select('user_role')
              .eq('id', data.session.user.id)
              .single();
            
            // If profile doesn't exist, create it
            if (profileError) {
              const { user } = data.session;
              const userData = {
                id: user.id,
                first_name: user.user_metadata.full_name?.split(' ')[0] || '',
                last_name: user.user_metadata.full_name?.split(' ').slice(1).join(' ') || '',
                avatar_url: user.user_metadata.avatar_url,
                user_role: userType
              };
              
              const { error: insertError } = await supabase
                .from('profiles')
                .upsert(userData);
              
              if (insertError) throw insertError;
              
              // If user is a doctor, create a doctor record
              if (userType === 'doctor') {
                const doctorData = {
                  user_id: user.id,
                  full_name: user.user_metadata.full_name ? `Dr. ${user.user_metadata.full_name}` : 'Dr.',
                  specialization: 'General Physician', // Default value
                  available_for_consultation: true
                };
                
                const { error: doctorError } = await supabase
                  .from('doctors')
                  .upsert(doctorData);
                
                if (doctorError) throw doctorError;
              }
            }
          }
          
          // Check the user role to determine where to redirect
          const { data: profile } = await supabase
            .from('profiles')
            .select('user_role')
            .eq('id', data.session.user.id)
            .single();
          
          toast.success('Signed in successfully!');
          
          if (profile?.user_role === 'doctor') {
            navigate('/doctor-dashboard');
          } else {
            navigate('/');
          }
        } else {
          navigate('/auth');
        }
      } catch (error: any) {
        console.error('Auth callback error:', error);
        setError(error.message || 'An error occurred during authentication');
      } finally {
        setLoading(false);
      }
    };
    
    handleAuthCallback();
  }, [navigate, searchParams]);

  return (
    <Layout>
      <div className="container flex items-center justify-center min-h-[70vh]">
        <Card className="w-full max-w-md p-6 text-center">
          <CardContent className="pt-6">
            {loading && (
              <div className="flex flex-col items-center">
                <div className="animate-spin h-10 w-10 border-4 border-healthBlue-500 border-t-transparent rounded-full mb-4"></div>
                <p>Completing authentication...</p>
              </div>
            )}
            
            {!loading && error && (
              <div className="space-y-4">
                <div className="text-red-500 mb-4">
                  <h2 className="text-xl font-semibold">Authentication Error</h2>
                  <p>{error}</p>
                </div>
                <Button onClick={() => navigate('/auth')}>Return to Login</Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default AuthCallback;
