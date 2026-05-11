import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import CreateSheet from '@/pages/CreateSheet';
import Privacy from '@/pages/Privacy';
import OriginalHome from '@/pages/OriginalHome';
import { SettingsProvider } from '@/lib/SettingsContext';
import { initAdMob, maybeShowAdOnOpen } from '@/lib/admob';
import { useEffect } from 'react';

const PUBLIC_ROUTES = ['/privacy'];

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();
  const location = useLocation();

  // Allow public routes without auth
  if (PUBLIC_ROUTES.includes(location.pathname)) {
    return (
      <Routes>
        <Route path="/privacy" element={<Privacy />} />
      </Routes>
    );
  }

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
      // Redirect to login automatically
      navigateToLogin();
      return null;
    }
  }

  // Render the main app
  return (
    <Routes>
      <Route path="/" element={<OriginalHome />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};


function App() {
  useEffect(() => {
    // Track app opens and suppress ads on first launch
    const appOpenCount = parseInt(localStorage.getItem('app_open_count') || '0') + 1;
    localStorage.setItem('app_open_count', String(appOpenCount));

    // Only initialize ads if not first launch
    if (appOpenCount >= 2) {
      initAdMob().then(() => maybeShowAdOnOpen());
    }
  }, []);

  return (
    <SettingsProvider>
      <AuthProvider>
        <QueryClientProvider client={queryClientInstance}>
          <Router>
            <AuthenticatedApp />
          </Router>
          <Toaster />
        </QueryClientProvider>
      </AuthProvider>
    </SettingsProvider>
  )
}

export default App