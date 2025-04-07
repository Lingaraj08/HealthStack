
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import UserProfileDropdown from '@/components/profile/UserProfileDropdown';
import { useAuth } from '@/components/auth/AuthContext';
import { Home, FileText, Calendar, User, Stethoscope, LogIn, Bot, Menu, X, Sun, Moon } from 'lucide-react';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Function to check if a path is active
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
    setIsDarkMode(!isDarkMode);
    localStorage.setItem('darkMode', (!isDarkMode).toString());
  };

  // Check for saved dark mode preference
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    if (savedDarkMode) {
      document.documentElement.classList.add('dark');
      setIsDarkMode(true);
    }
  }, []);
  
  return (
    <header className="border-b border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-800">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-healthBlue-600 flex items-center justify-center text-white mr-2">
                <FileText className="h-5 w-5" />
              </div>
              <span className="ml-2 text-xl font-semibold text-gray-900 dark:text-white">HealthStack</span>
            </Link>
            
            {user && (
              <nav className="hidden md:ml-10 md:flex items-center space-x-6">
                <Link to="/" className={`flex items-center ${isActive('/') ? 'text-healthBlue-600 dark:text-healthBlue-400 font-medium' : 'text-gray-600 dark:text-gray-300'} hover:text-healthBlue-600 dark:hover:text-healthBlue-400 transition-colors`}>
                  <Home className="h-4 w-4 mr-1" /> 
                  Dashboard
                </Link>
                <Link to="/doctors" className={`flex items-center ${isActive('/doctors') ? 'text-healthBlue-600 dark:text-healthBlue-400 font-medium' : 'text-gray-600 dark:text-gray-300'} hover:text-healthBlue-600 dark:hover:text-healthBlue-400 transition-colors`}>
                  <Stethoscope className="h-4 w-4 mr-1" /> 
                  Doctors
                </Link>
                <Link to="/appointments" className={`flex items-center ${isActive('/appointments') ? 'text-healthBlue-600 dark:text-healthBlue-400 font-medium' : 'text-gray-600 dark:text-gray-300'} hover:text-healthBlue-600 dark:hover:text-healthBlue-400 transition-colors`}>
                  <Calendar className="h-4 w-4 mr-1" /> 
                  Appointments
                </Link>
                <Link to="/medical-records" className={`flex items-center ${isActive('/medical-records') ? 'text-healthBlue-600 dark:text-healthBlue-400 font-medium' : 'text-gray-600 dark:text-gray-300'} hover:text-healthBlue-600 dark:hover:text-healthBlue-400 transition-colors`}>
                  <FileText className="h-4 w-4 mr-1" /> 
                  Records
                </Link>
                <Link to="/profile" className={`flex items-center ${isActive('/profile') ? 'text-healthBlue-600 dark:text-healthBlue-400 font-medium' : 'text-gray-600 dark:text-gray-300'} hover:text-healthBlue-600 dark:hover:text-healthBlue-400 transition-colors`}>
                  <User className="h-4 w-4 mr-1" /> 
                  Profile
                </Link>
                <Link to="/ai-symptom-checker" className={`flex items-center ${isActive('/ai-symptom-checker') ? 'text-healthBlue-600 dark:text-healthBlue-400 font-medium' : 'text-gray-600 dark:text-gray-300'} hover:text-healthBlue-600 dark:hover:text-healthBlue-400 transition-colors`}>
                  <Bot className="h-4 w-4 mr-1" /> 
                  AI Symptom Checker
                </Link>
              </nav>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={toggleDarkMode}
              className="rounded-full"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            {loading ? (
              <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
            ) : user ? (
              <>
                <UserProfileDropdown />
                <Button 
                  className="md:hidden"
                  variant="ghost" 
                  size="icon"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
              </>
            ) : (
              <Button onClick={() => navigate('/auth')} className="bg-healthBlue-600 hover:bg-healthBlue-700 dark:bg-healthBlue-700 dark:hover:bg-healthBlue-800">
                <LogIn className="mr-2 h-4 w-4" />
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && user && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-4 px-6">
          <nav className="flex flex-col space-y-4">
            <Link to="/" className={`flex items-center ${isActive('/') ? 'text-healthBlue-600 dark:text-healthBlue-400 font-medium' : 'text-gray-600 dark:text-gray-300'}`} onClick={() => setMobileMenuOpen(false)}>
              <Home className="h-4 w-4 mr-2" /> 
              Dashboard
            </Link>
            <Link to="/doctors" className={`flex items-center ${isActive('/doctors') ? 'text-healthBlue-600 dark:text-healthBlue-400 font-medium' : 'text-gray-600 dark:text-gray-300'}`} onClick={() => setMobileMenuOpen(false)}>
              <Stethoscope className="h-4 w-4 mr-2" /> 
              Doctors
            </Link>
            <Link to="/appointments" className={`flex items-center ${isActive('/appointments') ? 'text-healthBlue-600 dark:text-healthBlue-400 font-medium' : 'text-gray-600 dark:text-gray-300'}`} onClick={() => setMobileMenuOpen(false)}>
              <Calendar className="h-4 w-4 mr-2" /> 
              Appointments
            </Link>
            <Link to="/medical-records" className={`flex items-center ${isActive('/medical-records') ? 'text-healthBlue-600 dark:text-healthBlue-400 font-medium' : 'text-gray-600 dark:text-gray-300'}`} onClick={() => setMobileMenuOpen(false)}>
              <FileText className="h-4 w-4 mr-2" /> 
              Records
            </Link>
            <Link to="/profile" className={`flex items-center ${isActive('/profile') ? 'text-healthBlue-600 dark:text-healthBlue-400 font-medium' : 'text-gray-600 dark:text-gray-300'}`} onClick={() => setMobileMenuOpen(false)}>
              <User className="h-4 w-4 mr-2" /> 
              Profile
            </Link>
            <Link to="/ai-symptom-checker" className={`flex items-center ${isActive('/ai-symptom-checker') ? 'text-healthBlue-600 dark:text-healthBlue-400 font-medium' : 'text-gray-600 dark:text-gray-300'}`} onClick={() => setMobileMenuOpen(false)}>
              <Bot className="h-4 w-4 mr-2" /> 
              AI Symptom Checker
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
