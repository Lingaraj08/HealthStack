
import React from 'react';
import Header from './Header';
import Footer from './Footer';
import FloatingChatBot from '../ai/FloatingChatBot';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-grow pt-4 pb-12">
        {children}
      </main>
      <FloatingChatBot />
      <Footer />
    </div>
  );
};

export default Layout;
