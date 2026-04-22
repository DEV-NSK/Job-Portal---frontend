import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import { useTheme } from './context/ThemeContext'
import ProtectedRoute from './components/shared/ProtectedRoute'
import Navbar from './components/shared/Navbar'

// Public pages
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'

// User pages
import JobListings from './pages/user/JobListings'
import JobDetails from './pages/user/JobDetails'
import AppliedJobs from './pages/user/AppliedJobs'
import Profile from './pages/user/Profile'
import SocialFeed from './pages/user/SocialFeed'

// ── 14 AI Feature Pages ──────────────────────────────────────────────────────
import FeatureDashboard from './pages/user/FeatureDashboard'
import AICopilot from './pages/user/AICopilot'
import ProfileScore from './pages/user/ProfileScore'
import SkillGraph from './pages/user/SkillGraph'
import ResumeMatch from './pages/user/ResumeMatch'
import ConsistencyTracker from './pages/user/ConsistencyTracker'
import DailyCoding from './pages/user/DailyCoding'
import InterviewRoom from './pages/user/InterviewRoom'
import CodeQuality from './pages/user/CodeQuality'
import ProjectHiring from './pages/user/ProjectHiring'
import MockInterview from './pages/user/MockInterview'
import LearningPath from './pages/user/LearningPath'
import OpportunityScore from './pages/user/OpportunityScore'
import PeerCoding from './pages/user/PeerCoding'
import Reputation from './pages/user/Reputation'

// Employer pages
import EmployerDashboard from './pages/employer/EmployerDashboard'
import CreateJob from './pages/employer/CreateJob'
import ManageJobs from './pages/employer/ManageJobs'
import EditJob from './pages/employer/EditJob'
import Applicants from './pages/employer/Applicants'
import EmployerProfile from './pages/employer/EmployerProfile'

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard'
import ManageUsers from './pages/admin/ManageUsers'
import AdminManageJobs from './pages/admin/AdminManageJobs'
import AdminManagePosts from './pages/admin/AdminManagePosts'

export default function App() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/jobs" element={<JobListings />} />
          <Route path="/jobs/:id" element={<JobDetails />} />

          {/* User */}
          <Route path="/applied" element={<ProtectedRoute role="user"><AppliedJobs /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute role="user"><Profile /></ProtectedRoute>} />
          <Route path="/posts" element={<ProtectedRoute><SocialFeed /></ProtectedRoute>} />

          {/* ── 14 AI Feature Routes ─────────────────────────────────────── */}
          <Route path="/features" element={<ProtectedRoute role="user"><FeatureDashboard /></ProtectedRoute>} />
          <Route path="/copilot" element={<ProtectedRoute role="user"><AICopilot /></ProtectedRoute>} />
          <Route path="/profile-score" element={<ProtectedRoute role="user"><ProfileScore /></ProtectedRoute>} />
          <Route path="/skill-graph" element={<ProtectedRoute role="user"><SkillGraph /></ProtectedRoute>} />
          <Route path="/resume-match" element={<ProtectedRoute role="user"><ResumeMatch /></ProtectedRoute>} />
          <Route path="/consistency" element={<ProtectedRoute role="user"><ConsistencyTracker /></ProtectedRoute>} />
          <Route path="/coding" element={<ProtectedRoute role="user"><DailyCoding /></ProtectedRoute>} />
          <Route path="/interview-room" element={<ProtectedRoute role="user"><InterviewRoom /></ProtectedRoute>} />
          <Route path="/code-quality" element={<ProtectedRoute role="user"><CodeQuality /></ProtectedRoute>} />
          <Route path="/projects" element={<ProtectedRoute role="user"><ProjectHiring /></ProtectedRoute>} />
          <Route path="/mock-interview" element={<ProtectedRoute role="user"><MockInterview /></ProtectedRoute>} />
          <Route path="/learning-path" element={<ProtectedRoute role="user"><LearningPath /></ProtectedRoute>} />
          <Route path="/opportunity" element={<ProtectedRoute role="user"><OpportunityScore /></ProtectedRoute>} />
          <Route path="/peer-coding" element={<ProtectedRoute role="user"><PeerCoding /></ProtectedRoute>} />
          <Route path="/reputation" element={<ProtectedRoute role="user"><Reputation /></ProtectedRoute>} />

          {/* Employer */}
          <Route path="/employer/dashboard" element={<ProtectedRoute role="employer"><EmployerDashboard /></ProtectedRoute>} />
          <Route path="/employer/jobs" element={<ProtectedRoute role="employer"><ManageJobs /></ProtectedRoute>} />
          <Route path="/employer/jobs/create" element={<ProtectedRoute role="employer"><CreateJob /></ProtectedRoute>} />
          <Route path="/employer/jobs/edit/:id" element={<ProtectedRoute role="employer"><EditJob /></ProtectedRoute>} />
          <Route path="/employer/applicants" element={<ProtectedRoute role="employer"><Applicants /></ProtectedRoute>} />
          <Route path="/employer/applicants/:jobId" element={<ProtectedRoute role="employer"><Applicants /></ProtectedRoute>} />
          <Route path="/employer/profile" element={<ProtectedRoute role="employer"><EmployerProfile /></ProtectedRoute>} />

          {/* Admin */}
          <Route path="/admin/dashboard" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute role="admin"><ManageUsers /></ProtectedRoute>} />
          <Route path="/admin/jobs" element={<ProtectedRoute role="admin"><AdminManageJobs /></ProtectedRoute>} />
          <Route path="/admin/posts" element={<ProtectedRoute role="admin"><AdminManagePosts /></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        
        {/* Premium Toast Notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: isDark ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(12px)',
              border: isDark ? '1px solid rgba(148, 163, 184, 0.1)' : '1px solid rgba(148, 163, 184, 0.2)',
              borderRadius: '12px',
              color: isDark ? '#e2e8f0' : '#1e293b',
              padding: '12px 16px',
              fontSize: '14px',
              fontWeight: '500',
              boxShadow: isDark 
                ? '0 10px 25px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.05)'
                : '0 10px 25px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(0, 0, 0, 0.05)'
            },
            success: { 
              iconTheme: { 
                primary: '#10b981', 
                secondary: isDark ? '#f9fafb' : '#ffffff' 
              } 
            },
            error: { 
              iconTheme: { 
                primary: '#ef4444', 
                secondary: isDark ? '#f9fafb' : '#ffffff' 
              } 
            }
          }}
        />
      </BrowserRouter>
    </AuthProvider>
  )
}
