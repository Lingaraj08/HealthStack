
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/components/auth/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Profile: React.FC = () => {
  const { user } = useAuth();
  
  // Extract user initials for avatar fallback
  const getInitials = () => {
    if (!user) return 'U';
    const email = user.email || '';
    return email.charAt(0).toUpperCase();
  };

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
                  {user?.user_metadata?.first_name || ''} {user?.user_metadata?.last_name || ''}
                </CardTitle>
                <CardDescription>{user?.email}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-700">Email</h3>
                <p>{user?.email}</p>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-700">Account Created</h3>
                <p>{user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}</p>
              </div>
            </div>
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
              <button className="bg-healthBlue-600 hover:bg-healthBlue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                Connect Health ID
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Profile;
