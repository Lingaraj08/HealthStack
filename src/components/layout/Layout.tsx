
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
        <div className="absolute top-20 right-0 w-[800px] h-[800px] rounded-full bg-healthBlue-200/20 dark:bg-healthBlue-900/20 blur-[100px]"></div>
        <div className="absolute bottom-20 left-0 w-[600px] h-[600px] rounded-full bg-healthGreen-200/20 dark:bg-healthGreen-900/20 blur-[80px]"></div>
        <img 
          src="/medical-transparent-bg.png" 
          alt="Medical Background" 
          className="absolute right-0 bottom-0 max-w-[800px] opacity-10 dark:opacity-5"
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
