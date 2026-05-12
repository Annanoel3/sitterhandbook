import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import Privacy from '@/pages/Privacy';
import MySheets from '@/pages/MySheets';
import CreateSheet from '@/pages/CreateSheet';
import ReviewSheet from '@/pages/ReviewSheet';
import HouseholdInfo from '@/pages/HouseholdInfo';
import Settings from '@/pages/Settings';
import ExampleSheet from '@/pages/ExampleSheet';
import AppLayout from '@/components/layout/AppLayout';

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

  // Render the main app — all SitterHandbook pages under AppLayout (Navbar)
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<MySheets />} />
        <Route path="/sheets" element={<MySheets />} />
        <Route path="/create" element={<CreateSheet />} />
        <Route path="/review" element={<ReviewSheet />} />
        <Route path="/household" element={<HouseholdInfo />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/example" element={<ExampleSheet />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="*" element={<PageNotFound />} />
      </Route>
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
