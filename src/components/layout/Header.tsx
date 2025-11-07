
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import UserProfileDropdown from '@/components/profile/UserProfileDropdown';
import { useAuth } from '@/components/auth/AuthContext';
import { Home, FileText, Calendar, User, Stethoscope, LogIn, Bot, Menu, X, Sun, Moon, Shield } from 'lucide-react';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // local placeholder flag to avoid an eternal loading pulse if auth stalls
  const [showAuthPlaceholder, setShowAuthPlaceholder] = useState(true);
  
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
    // If auth doesn't resolve quickly, hide the placeholder so the header doesn't look stuck
    const timer = setTimeout(() => setShowAuthPlaceholder(false), 1200);
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-r from-healthBlue-500 to-healthBlue-600 flex items-center justify-center text-white mr-2 shadow-sm">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 4H8C7.44772 4 7 4.44772 7 5V19C7 19.5523 7.44772 20 8 20H16C16.5523 20 17 19.5523 17 19V5C17 4.44772 16.5523 4 16 4Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 10V14" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M10 12H14" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="ml-1.5 text-xl font-semibold text-gray-900 dark:text-white font-poppins">HealthStack</span>
            </Link>
            
            {user && (
              <nav className="hidden md:ml-10 md:flex items-center space-x-6">
                <Link to="/" className={`flex items-center ${isActive('/') ? 'text-healthBlue-500 dark:text-healthBlue-400 font-medium' : 'text-gray-600 dark:text-gray-300'} hover:text-healthBlue-500 dark:hover:text-healthBlue-400 transition-colors`}>
                  <Home className="h-4 w-4 mr-1" /> 
                  Dashboard
                </Link>
                <Link to="/doctors" className={`flex items-center ${isActive('/doctors') ? 'text-healthBlue-500 dark:text-healthBlue-400 font-medium' : 'text-gray-600 dark:text-gray-300'} hover:text-healthBlue-500 dark:hover:text-healthBlue-400 transition-colors`}>
                  <Stethoscope className="h-4 w-4 mr-1" /> 
                  Doctors
                </Link>
                <Link to="/appointments" className={`flex items-center ${isActive('/appointments') ? 'text-healthBlue-500 dark:text-healthBlue-400 font-medium' : 'text-gray-600 dark:text-gray-300'} hover:text-healthBlue-500 dark:hover:text-healthBlue-400 transition-colors`}>
                  <Calendar className="h-4 w-4 mr-1" /> 
                  Appointments
                </Link>
                <Link to="/medical-records" className={`flex items-center ${isActive('/medical-records') ? 'text-healthBlue-500 dark:text-healthBlue-400 font-medium' : 'text-gray-600 dark:text-gray-300'} hover:text-healthBlue-500 dark:hover:text-healthBlue-400 transition-colors`}>
                  <FileText className="h-4 w-4 mr-1" /> 
                  Records
                </Link>
                <Link to="/health-schemes" className={`flex items-center ${isActive('/health-schemes') ? 'text-healthBlue-500 dark:text-healthBlue-400 font-medium' : 'text-gray-600 dark:text-gray-300'} hover:text-healthBlue-500 dark:hover:text-healthBlue-400 transition-colors`}>
                  <Shield className="h-4 w-4 mr-1" /> 
                  Health Schemes
                </Link>
                <Link to="/profile" className={`flex items-center ${isActive('/profile') ? 'text-healthBlue-500 dark:text-healthBlue-400 font-medium' : 'text-gray-600 dark:text-gray-300'} hover:text-healthBlue-500 dark:hover:text-healthBlue-400 transition-colors`}>
                  <User className="h-4 w-4 mr-1" /> 
                  Profile
                </Link>
                <Link to="/ai-symptom-checker" className={`flex items-center ${isActive('/ai-symptom-checker') ? 'text-healthBlue-500 dark:text-healthBlue-400 font-medium' : 'text-gray-600 dark:text-gray-300'} hover:text-healthBlue-500 dark:hover:text-healthBlue-400 transition-colors`}>
                  <Bot className="h-4 w-4 mr-1" /> 
                  AI Checker
                </Link>
              </nav>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={toggleDarkMode}
              className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <Sun className="h-5 w-5 text-yellow-400" /> : <Moon className="h-5 w-5 text-gray-700" />}
            </Button>

            {loading && showAuthPlaceholder ? (
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
              <Button 
                onClick={() => navigate('/auth')} 
                variant="health"
              >
                <LogIn className="mr-2 h-4 w-4" />
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && user && (
        <div className="md:hidden bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-4 px-6 shadow-md animate-fade-in">
          <nav className="flex flex-col space-y-4">
            <Link to="/" className={`flex items-center ${isActive('/') ? 'text-healthBlue-500 dark:text-healthBlue-400 font-medium' : 'text-gray-600 dark:text-gray-300'}`} onClick={() => setMobileMenuOpen(false)}>
              <Home className="h-5 w-5 mr-3" /> 
              Dashboard
            </Link>
            <Link to="/doctors" className={`flex items-center ${isActive('/doctors') ? 'text-healthBlue-500 dark:text-healthBlue-400 font-medium' : 'text-gray-600 dark:text-gray-300'}`} onClick={() => setMobileMenuOpen(false)}>
              <Stethoscope className="h-5 w-5 mr-3" /> 
              Doctors
            </Link>
            <Link to="/appointments" className={`flex items-center ${isActive('/appointments') ? 'text-healthBlue-500 dark:text-healthBlue-400 font-medium' : 'text-gray-600 dark:text-gray-300'}`} onClick={() => setMobileMenuOpen(false)}>
              <Calendar className="h-5 w-5 mr-3" /> 
              Appointments
            </Link>
            <Link to="/medical-records" className={`flex items-center ${isActive('/medical-records') ? 'text-healthBlue-500 dark:text-healthBlue-400 font-medium' : 'text-gray-600 dark:text-gray-300'}`} onClick={() => setMobileMenuOpen(false)}>
              <FileText className="h-5 w-5 mr-3" /> 
              Records
            </Link>
            <Link to="/health-schemes" className={`flex items-center ${isActive('/health-schemes') ? 'text-healthBlue-500 dark:text-healthBlue-400 font-medium' : 'text-gray-600 dark:text-gray-300'}`} onClick={() => setMobileMenuOpen(false)}>
              <Shield className="h-5 w-5 mr-3" /> 
              Health Schemes
            </Link>
            <Link to="/profile" className={`flex items-center ${isActive('/profile') ? 'text-healthBlue-500 dark:text-healthBlue-400 font-medium' : 'text-gray-600 dark:text-gray-300'}`} onClick={() => setMobileMenuOpen(false)}>
              <User className="h-5 w-5 mr-3" /> 
              Profile
            </Link>
            <Link to="/ai-symptom-checker" className={`flex items-center ${isActive('/ai-symptom-checker') ? 'text-healthBlue-500 dark:text-healthBlue-400 font-medium' : 'text-gray-600 dark:text-gray-300'}`} onClick={() => setMobileMenuOpen(false)}>
              <Bot className="h-5 w-5 mr-3" /> 
              AI Symptom Checker
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
