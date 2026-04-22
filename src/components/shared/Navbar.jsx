import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { useState } from 'react'
import { FiBriefcase, FiMenu, FiX, FiUser, FiLogOut, FiSun, FiMoon } from 'react-icons/fi'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropOpen, setDropOpen] = useState(false)

  const handleLogout = () => { logout(); navigate('/') }

  const navLinks = user?.role === 'employer'
    ? [{ to: '/employer/dashboard', label: 'Dashboard' }, { to: '/employer/jobs', label: 'My Jobs' }, { to: '/posts', label: 'Feed' }]
    : user?.role === 'admin'
    ? [{ to: '/admin/dashboard', label: 'Dashboard' }]
    : [{ to: '/jobs', label: 'Find Jobs' }, { to: '/features', label: '✨ AI Features' }, { to: '/posts', label: 'Feed' }]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-dark border-b dark:border-gray-800/50 border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-xl">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
              <FiBriefcase className="text-white text-sm" />
            </div>
            <span className="text-gradient">JobPortal</span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(l => (
              <Link key={l.to} to={l.to}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  location.pathname === l.to
                    ? 'dark:text-white dark:bg-white/10 text-primary-700 bg-primary-50'
                    : 'dark:text-gray-400 dark:hover:text-white dark:hover:bg-white/5 text-gray-600 hover:text-gray-900 hover:bg-slate-100'
                }`}>
                {l.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200
                         dark:text-gray-400 dark:hover:text-white dark:hover:bg-white/10
                         text-gray-500 hover:text-gray-900 hover:bg-slate-100">
              {theme === 'dark' ? <FiSun size={18} /> : <FiMoon size={18} />}
            </button>

            {user ? (
              <div className="relative">
                <button onClick={() => setDropOpen(!dropOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl transition-all
                             dark:hover:bg-white/5 hover:bg-slate-100">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-sm font-bold overflow-hidden">
                    {user.avatar
                      ? <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                      : user.name?.[0]?.toUpperCase()}
                  </div>
                  <span className="hidden md:block text-sm font-medium dark:text-gray-300 text-gray-700">{user.name}</span>
                </button>
                {dropOpen && (
                  <div className="absolute right-0 mt-2 w-48 glass-dark rounded-xl shadow-xl dark:border-gray-700 border-slate-200 py-1 animate-fade-in">
                    <Link
                      to={user.role === 'employer' ? '/employer/profile' : user.role === 'admin' ? '/admin/dashboard' : '/profile'}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm dark:text-gray-300 dark:hover:text-white dark:hover:bg-white/5 text-gray-700 hover:text-gray-900 hover:bg-slate-100 transition-all"
                      onClick={() => setDropOpen(false)}>
                      <FiUser size={14} /> Profile
                    </Link>
                    <button onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-500/10 transition-all">
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

            <button className="md:hidden dark:text-gray-400 text-gray-600" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden glass-dark dark:border-t dark:border-gray-800 border-t border-slate-200 px-4 py-3 space-y-1 animate-fade-in">
          {navLinks.map(l => (
            <Link key={l.to} to={l.to} onClick={() => setMenuOpen(false)}
              className="block px-4 py-2.5 rounded-lg dark:text-gray-300 dark:hover:text-white dark:hover:bg-white/5 text-gray-700 hover:text-gray-900 hover:bg-slate-100 transition-all">
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}
