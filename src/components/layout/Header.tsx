
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import UserProfileDropdown from '@/components/profile/UserProfileDropdown';
import { useAuth } from '@/components/auth/AuthContext';
import { Home, FileText, UserCircle2, Calendar, User, Stethoscope, LogIn } from 'lucide-react';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading } = useAuth();
  
  // Function to check if a path is active
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <FileText className="h-6 w-6 text-healthBlue-600" />
              <span className="ml-2 text-xl font-semibold text-gray-900">HealthStack</span>
            </Link>
            
            {user && (
              <nav className="hidden md:ml-10 md:flex items-center space-x-6">
                <Link to="/" className={`flex items-center ${isActive('/') ? 'text-healthBlue-600 font-medium' : 'text-gray-600'} hover:text-healthBlue-600 transition-colors`}>
                  <Home className="h-4 w-4 mr-1" /> 
                  Dashboard
                </Link>
                <Link to="/doctors" className={`flex items-center ${isActive('/doctors') ? 'text-healthBlue-600 font-medium' : 'text-gray-600'} hover:text-healthBlue-600 transition-colors`}>
                  <Stethoscope className="h-4 w-4 mr-1" /> 
                  Doctors
                </Link>
                <Link to="/appointments" className={`flex items-center ${isActive('/appointments') ? 'text-healthBlue-600 font-medium' : 'text-gray-600'} hover:text-healthBlue-600 transition-colors`}>
                  <Calendar className="h-4 w-4 mr-1" /> 
                  Appointments
                </Link>
                <Link to="/medical-records" className={`flex items-center ${isActive('/medical-records') ? 'text-healthBlue-600 font-medium' : 'text-gray-600'} hover:text-healthBlue-600 transition-colors`}>
                  <FileText className="h-4 w-4 mr-1" /> 
                  Records
                </Link>
                <Link to="/profile" className={`flex items-center ${isActive('/profile') ? 'text-healthBlue-600 font-medium' : 'text-gray-600'} hover:text-healthBlue-600 transition-colors`}>
                  <User className="h-4 w-4 mr-1" /> 
                  Profile
                </Link>
              </nav>
            )}
          </div>
          
          <div className="flex items-center">
            {loading ? (
              <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse"></div>
            ) : user ? (
              <UserProfileDropdown />
            ) : (
              <Button onClick={() => navigate('/auth')} className="bg-healthBlue-600 hover:bg-healthBlue-700">
                <LogIn className="mr-2 h-4 w-4" />
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
