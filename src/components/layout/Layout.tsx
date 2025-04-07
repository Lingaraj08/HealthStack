
import React from 'react';
import Header from './Header';
import Footer from './Footer';
import FloatingChatBot from '../ai/FloatingChatBot';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <FloatingChatBot />
      <Footer />
    </div>
  );
};

export default Layout;
