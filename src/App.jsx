import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
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
        <Toaster
          position="top-right"
          toastOptions={{
            style: { background: '#1f2937', color: '#f9fafb', border: '1px solid #374151' },
            success: { iconTheme: { primary: '#10b981', secondary: '#f9fafb' } },
            error: { iconTheme: { primary: '#ef4444', secondary: '#f9fafb' } }
          }}
        />
      </BrowserRouter>
    </AuthProvider>
  )
}
