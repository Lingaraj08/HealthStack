
import React from 'react';
import Header from './Header';
import Footer from './Footer';
import FloatingChatBot from '../ai/FloatingChatBot';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground relative">
      {/* Background decor elements */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-[900px] h-[900px] rounded-full bg-healthBlue-100/20 dark:bg-healthBlue-800/20 blur-[120px] transform -translate-y-1/4 translate-x-1/4"></div>
        <div className="absolute bottom-0 left-0 w-[800px] h-[800px] rounded-full bg-healthGreen-100/20 dark:bg-healthGreen-800/20 blur-[100px] transform translate-y-1/4 -translate-x-1/4"></div>
        
        {/* Healthcare pattern overlay */}
        <div className="absolute inset-0 bg-[url('/healthcare-pattern.png')] bg-repeat opacity-[0.03] dark:opacity-[0.02]"></div>
        
        {/* Transparent doctor image */}
        <img 
          src="/doctor-transparent.png" 
          alt="Healthcare Professional" 
          className="absolute right-0 bottom-0 max-w-[500px] max-h-[700px] object-contain opacity-10 dark:opacity-5 z-0"
        />
        
        {/* Health icons pattern */}
        <img 
          src="/health-icons-pattern.png"
          alt="Health Icons"
          className="absolute left-0 top-0 max-w-[400px] opacity-5 dark:opacity-3 z-0"
        />
      </div>
      
      <Header />
      
      <main className="flex-grow pt-4 pb-12 relative z-10">
        {children}
      </main>
      
      <FloatingChatBot />
      <Footer />
    </div>
  );
};

export default Layout;
