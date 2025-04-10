
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Handle OAuth callback
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        if (data.session) {
          toast.success('Signed in successfully!');
          navigate('/');
        } else {
          toast.error('Authentication failed. Please try again.');
          navigate('/auth');
        }
      } catch (error: any) {
        console.error('Auth callback error:', error);
        toast.error(error.message || 'An error occurred during authentication');
        navigate('/auth');
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center">
        <div className="h-12 w-12 rounded-full border-4 border-healthBlue-500 border-t-transparent animate-spin mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-700">Completing sign in...</h2>
      </div>
    </div>
  );
};

export default AuthCallback;
