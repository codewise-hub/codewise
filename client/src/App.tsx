import { useState } from "react";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import { Navigation } from "@/components/Navigation";
import { AuthModal } from "@/components/AuthModal";
import { CodingLabModal } from "@/components/CodingLabModal";
import { NotificationToast } from "@/components/NotificationToast";
import { HomePage } from "@/pages/HomePage";
import { StudentDashboard } from "@/pages/StudentDashboard";
import { TeacherDashboard } from "@/pages/TeacherDashboard";
import { ParentDashboard } from "@/pages/ParentDashboard";
import { Footer } from "@/components/Footer";

function AppContent() {
  const { user, loading } = useAuth();
  const [currentView, setCurrentView] = useState<'dashboard'>('dashboard');
  const [authModal, setAuthModal] = useState<{
    isOpen: boolean;
    mode: 'signin' | 'signup';
    role?: string;
    ageGroup?: string;
  }>({
    isOpen: false,
    mode: 'signin'
  });
  const [codingLabOpen, setCodingLabOpen] = useState(false);
  const [notification, setNotification] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error' | 'info';
  }>({
    show: false,
    message: '',
    type: 'info'
  });

  const openAuthModal = (mode: 'signin' | 'signup', role?: string, ageGroup?: string) => {
    setAuthModal({ isOpen: true, mode, role, ageGroup });
  };

  const closeAuthModal = () => {
    setAuthModal(prev => ({ ...prev, isOpen: false }));
  };

  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setNotification({ show: true, message, type });
  };

  const hideNotification = () => {
    setNotification(prev => ({ ...prev, show: false }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading CodewiseHub...</p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    // Hide home content when users are logged in - show only dashboards
    if (!user) {
      return <HomePage onAuthModalOpen={openAuthModal} />;
    }
    
    // Logged in users only see their role-specific dashboard
    switch (user.role) {
      case 'student':
        return <StudentDashboard onCodingLabOpen={() => setCodingLabOpen(true)} />;
      case 'teacher':
        return <TeacherDashboard />;
      case 'parent':
        return <ParentDashboard />;
      case 'school_admin':
        return <SchoolAdminDashboard user={user} />;
      default:
        return <HomePage onAuthModalOpen={openAuthModal} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-poppins">
      {/* External Font Awesome and Scripts */}
      <link 
        rel="stylesheet" 
        href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" 
      />
      
      <Navigation 
        onAuthModalOpen={openAuthModal}
        onCodingLabOpen={() => setCodingLabOpen(true)}

      />
      
      {renderContent()}

      <AuthModal
        isOpen={authModal.isOpen}
        mode={authModal.mode}
        initialRole={authModal.role}
        initialAgeGroup={authModal.ageGroup}
        onClose={closeAuthModal}
        onSuccess={showNotification}
      />

      <CodingLabModal
        isOpen={codingLabOpen}
        onClose={() => setCodingLabOpen(false)}
      />

      <NotificationToast
        show={notification.show}
        message={notification.message}
        type={notification.type}
        onClose={hideNotification}
      />

      <Toaster />
      
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
