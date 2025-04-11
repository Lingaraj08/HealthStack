
import React from "react";
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <Layout>
      <div className="min-h-[70vh] flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md px-4">
          <div className="inline-block p-8 bg-red-50 rounded-full mb-6">
            <h1 className="text-6xl font-bold text-healthBlue-600">404</h1>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Page Not Found</h2>
          <p className="text-gray-600 mb-8">
            We're sorry, the page you requested could not be found. Please check the URL or navigate back to the homepage.
          </p>
          <Button className="health-button-primary" asChild>
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Return to Home
            </Link>
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
