
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import PatientAuth from "./pages/PatientAuth";
import DoctorAuth from "./pages/DoctorAuth";
import Profile from "./pages/Profile";
import Doctors from "./pages/Doctors";
import DoctorDetail from "./pages/DoctorDetail";
import MedicalRecords from "./pages/MedicalRecords";
import Appointments from "./pages/Appointments";
import AiSymptomChecker from "./pages/AiSymptomChecker";
import Medications from "./pages/Medications";
import SosContacts from "./pages/SosContacts";
import IndiaStackTest from "./pages/IndiaStackTest";
import HealthSchemes from "./pages/HealthSchemes";
import DoctorDashboard from "./pages/DoctorDashboard";
import { AuthProvider } from "./components/auth/AuthContext";
import PrivateRoute from "./components/auth/PrivateRoute";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Partners from "./pages/Partners";
import AuthCallback from "./components/auth/AuthCallback";
import VideoConsultation from "./components/consultation/VideoConsultation";
import ChatConsultation from "./components/consultation/ChatConsultation";
import SosButton from "./components/sos/SosButton";
import MoodDetectionFeature from "./components/mood/MoodDetectionFeature";

// Create a client
const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/profile" element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              } />
              <Route path="/doctors" element={<Doctors />} />
              <Route path="/doctors/:doctorId" element={<DoctorDetail />} />
              <Route path="/medical-records" element={
                <PrivateRoute>
                  <MedicalRecords />
                </PrivateRoute>
              } />
              <Route path="/appointments" element={
                <PrivateRoute>
                  <Appointments />
                </PrivateRoute>
              } />
              <Route path="/ai-symptom-checker" element={
                <PrivateRoute>
                  <AiSymptomChecker />
                </PrivateRoute>
              } />
              <Route path="/medications" element={
                <PrivateRoute>
                  <Medications />
                </PrivateRoute>
              } />
              <Route path="/sos-contacts" element={
                <PrivateRoute>
                  <SosContacts />
                </PrivateRoute>
              } />
              <Route path="/india-stack-test" element={
                <PrivateRoute>
                  <IndiaStackTest />
                </PrivateRoute>
              } />
              <Route path="/health-schemes" element={<HealthSchemes />} />
              <Route path="/doctor-dashboard" element={
                <PrivateRoute>
                  <DoctorDashboard />
                </PrivateRoute>
              } />
              <Route path="/video-consultation/:appointmentId" element={
                <PrivateRoute>
                  <VideoConsultation />
                </PrivateRoute>
              } />
              <Route path="/chat-consultation/:appointmentId" element={
                <PrivateRoute>
                  <ChatConsultation />
                </PrivateRoute>
              } />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/partners" element={<Partners />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/patient-auth" element={<PatientAuth />} />
              <Route path="/doctor-auth" element={<DoctorAuth />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <SosButton />
            <MoodDetectionFeature />
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
