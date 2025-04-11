
import React, { createContext, useState, useEffect, useContext } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type UserRole = 'patient' | 'doctor' | null;

type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  userRole: UserRole;
  isDoctor: boolean;
  isPatient: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<UserRole>(null);
  
  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Fetch user role from profiles
          const { data, error } = await supabase
            .from('profiles')
            .select('user_role')
            .eq('id', session.user.id)
            .single();
          
          if (error) {
            console.error('Error fetching user role:', error);
          } else {
            setUserRole(data?.user_role as UserRole || 'patient');
          }
        } else {
          setUserRole(null);
        }
        
        setLoading(false);
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        // Fetch user role from profiles
        const { data, error } = await supabase
          .from('profiles')
          .select('user_role')
          .eq('id', session.user.id)
          .single();
        
        if (error) {
          console.error('Error fetching user role:', error);
        } else {
          setUserRole(data?.user_role as UserRole || 'patient');
        }
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out successfully");
  };

  const value = {
    session,
    user,
    loading,
    signOut,
    userRole,
    isDoctor: userRole === 'doctor',
    isPatient: userRole === 'patient',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
