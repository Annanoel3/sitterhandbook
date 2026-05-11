import React from 'react';
import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import Home from './pages/Home';
import CreateSheet from './pages/CreateSheet';
import ReviewSheet from './pages/ReviewSheet';
import MySheets from './pages/MySheets';
import Settings from './pages/Settings';
import AppLayout from './components/layout/AppLayout';
import ExampleSheet from './pages/ExampleSheet';
import HouseholdInfoPage from './pages/HouseholdInfo';

const RedirectToLogin = () => {
  const { navigateToLogin } = useAuth();
  React.useEffect(() => { navigateToLogin(); }, []);
  return null;
};

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
      if (authError.type === 'user_not_registered') {
        return <UserNotRegisteredError />;
      } else if (authError.type === 'auth_required') {
        // Allow home and review pages without auth; protect other routes
        return (
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/create" element={<CreateSheet />} />
              <Route path="/review" element={<ReviewSheet />} />
              <Route path="/example" element={<ExampleSheet />} />
              <Route path="*" element={<RedirectToLogin />} />
            </Route>
          </Routes>
        );
      }
    }

  // Render the main app
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<CreateSheet />} />
        <Route path="/review" element={<ReviewSheet />} />
        <Route path="/example" element={<ExampleSheet />} />
        <Route path="/sheets" element={<MySheets />} />
        <Route path="/household" element={<HouseholdInfoPage />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};


function App() {

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App