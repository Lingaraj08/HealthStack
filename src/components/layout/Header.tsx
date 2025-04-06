
import React from 'react';
import { Link } from 'react-router-dom';
import UserProfileDropdown from '../profile/UserProfileDropdown';
import { useAuth } from '../auth/AuthContext';

const Header: React.FC = () => {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-10 bg-white shadow-md">
      <div className="container mx-auto flex items-center justify-between p-4">
        <Link to="/" className="flex items-center">
          <span className="text-2xl font-bold text-healthBlue-600">HealthStack</span>
        </Link>

        <nav className="hidden space-x-6 md:flex">
          <Link to="/" className="text-gray-700 hover:text-healthBlue-600">Home</Link>
          <Link to="/doctors" className="text-gray-700 hover:text-healthBlue-600">Find Doctors</Link>
          <Link to="/records" className="text-gray-700 hover:text-healthBlue-600">Medical Records</Link>
          <Link to="/appointments" className="text-gray-700 hover:text-healthBlue-600">Appointments</Link>
        </nav>

        <div className="flex items-center space-x-4">
          {user ? (
            <UserProfileDropdown />
          ) : (
            <Link 
              to="/auth" 
              className="rounded-md bg-healthBlue-600 px-4 py-2 text-sm font-medium text-white hover:bg-healthBlue-700"
            >
              Login / Sign Up
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
