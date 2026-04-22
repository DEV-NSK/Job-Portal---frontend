import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useState } from 'react'
import { FiBriefcase, FiMenu, FiX, FiUser, FiLogOut, FiSettings } from 'react-icons/fi'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropOpen, setDropOpen] = useState(false)

  const handleLogout = () => { logout(); navigate('/') }

  const navLinks = user?.role === 'employer'
    ? [{ to: '/employer/dashboard', label: 'Dashboard' }, { to: '/employer/jobs', label: 'My Jobs' }, { to: '/posts', label: 'Feed' }]
    : user?.role === 'admin'
    ? [{ to: '/admin/dashboard', label: 'Dashboard' }]
    : [{ to: '/jobs', label: 'Find Jobs' }, { to: '/posts', label: 'Feed' }]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-dark border-b border-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
              <FiBriefcase className="text-white text-sm" />
            </div>
            <span className="text-gradient">JobPortal</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(l => (
              <Link key={l.to} to={l.to}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${location.pathname === l.to ? 'text-white bg-white/10' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                {l.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button onClick={() => setDropOpen(!dropOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/5 transition-all">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-sm font-bold overflow-hidden">
                    {user.avatar ? <img src={user.avatar} alt="" className="w-full h-full object-cover" /> : user.name?.[0]?.toUpperCase()}
                  </div>
                  <span className="hidden md:block text-sm font-medium text-gray-300">{user.name}</span>
                </button>
                {dropOpen && (
                  <div className="absolute right-0 mt-2 w-48 glass-dark rounded-xl shadow-xl border border-gray-700 py-1 animate-fade-in">
                    <Link to={user.role === 'employer' ? '/employer/profile' : user.role === 'admin' ? '/admin/dashboard' : '/profile'}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-all"
                      onClick={() => setDropOpen(false)}>
                      <FiUser size={14} /> Profile
                    </Link>
                    <button onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all">
                      <FiLogOut size={14} /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn-secondary text-sm py-2 px-4">Login</Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-4">Sign Up</Link>
              </div>
            )}
            <button className="md:hidden text-gray-400" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden glass-dark border-t border-gray-800 px-4 py-3 space-y-1 animate-fade-in">
          {navLinks.map(l => (
            <Link key={l.to} to={l.to} onClick={() => setMenuOpen(false)}
              className="block px-4 py-2.5 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 transition-all">
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}
