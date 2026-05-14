import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ResultsProvider } from './context/ResultsContext';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import Home from './pages/Home';
import Intro from './pages/Intro';
import About from './pages/About';
import Login from './pages/Login';
import AdminLogin from './pages/AdminLogin';
import Customize from './pages/Customize';
import ParseResume from './pages/ParseResume';
import ResumeDetails from './pages/ResumeDetails';
import ParseJob from './pages/ParseJob';
import JobDetails from './pages/JobDetails';
import Rank from './pages/Rank';
import Results from './pages/Results';
import ViewDetails from './pages/ViewDetails';
import Onboarding from './pages/Onboarding';
import './App.css';

/**
 * Protects app routes:
 * - Not logged in  → redirect to landing page (/)
 * - Logged in, no profile → redirect to onboarding
 * - Logged in, has profile → show the app
 */
function AppGuard({ children }) {
  const { user, hasProfile, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/" replace />;
  if (!hasProfile) return <Navigate to="/onboarding" replace />;
  return children;
}

/** Layout wrapper: sidebar + main content */
function AppLayout({ children }) {
  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content-wrapper">
        <div className="fade-content show">
          {children}
          <Footer />
        </div>
      </div>
    </div>
  );
}

function AppRoutes() {
  return (
    <Routes>
      {/* ── Public routes (no sidebar) ── */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/onboarding" element={<Onboarding />} />

      {/* ── Protected app routes (with sidebar) ── */}
      <Route path="/dashboard" element={<AppGuard><AppLayout><Home /></AppLayout></AppGuard>} />
      <Route path="/intro"     element={<AppGuard><AppLayout><Intro /></AppLayout></AppGuard>} />
      <Route path="/about"     element={<AppGuard><AppLayout><About /></AppLayout></AppGuard>} />
      <Route path="/login"     element={<AppGuard><AppLayout><Login /></AppLayout></AppGuard>} />
      <Route path="/admin-login"    element={<AppGuard><AppLayout><AdminLogin /></AppLayout></AppGuard>} />
      <Route path="/customize"      element={<AppGuard><AppLayout><Customize /></AppLayout></AppGuard>} />
      <Route path="/parse-resume"   element={<AppGuard><AppLayout><ParseResume /></AppLayout></AppGuard>} />
      <Route path="/resume-details" element={<AppGuard><AppLayout><ResumeDetails /></AppLayout></AppGuard>} />
      <Route path="/parse-job"      element={<AppGuard><AppLayout><ParseJob /></AppLayout></AppGuard>} />
      <Route path="/job-details"    element={<AppGuard><AppLayout><JobDetails /></AppLayout></AppGuard>} />
      <Route path="/rank"           element={<AppGuard><AppLayout><Rank /></AppLayout></AppGuard>} />
      <Route path="/results"        element={<AppGuard><AppLayout><Results /></AppLayout></AppGuard>} />
      <Route path="/view-details"   element={<AppGuard><AppLayout><ViewDetails /></AppLayout></AppGuard>} />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <ResultsProvider>
        <Router>
          <AppRoutes />
        </Router>
      </ResultsProvider>
    </AuthProvider>
  );
}

export default App;
