import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
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
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <div className="fade-content show">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/intro" element={<Intro />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/customize" element={<Customize />} />
            <Route path="/parse-resume" element={<ParseResume />} />
            <Route path="/resume-details" element={<ResumeDetails />} />
            <Route path="/parse-job" element={<ParseJob />} />
            <Route path="/job-details" element={<JobDetails />} />
            <Route path="/rank" element={<Rank />} />
            <Route path="/results" element={<Results />} />
            <Route path="/view-details" element={<ViewDetails />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
