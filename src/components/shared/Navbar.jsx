import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiBriefcase, FiMenu, FiX, FiUser, FiLogOut,
  FiSun, FiMoon, FiChevronDown, FiSettings, FiBell
} from 'react-icons/fi'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropOpen, setDropOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const dropRef = useRef(null)

  const handleLogout = () => { logout(); navigate('/'); setDropOpen(false) }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const handler = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => { setMenuOpen(false) }, [location.pathname])

  const navLinks = user?.role === 'employer'
    ? [{ to: '/employer/dashboard', label: 'Dashboard' }, { to: '/employer/jobs', label: 'My Jobs' }, { to: '/employer/applicants', label: 'Applicants' }]
    : user?.role === 'admin'
    ? [{ to: '/admin/dashboard', label: 'Dashboard' }, { to: '/admin/users', label: 'Users' }, { to: '/admin/jobs', label: 'Jobs' }]
    : [{ to: '/jobs', label: 'Find Jobs' }, { to: '/features', label: 'AI Features' }, { to: '/posts', label: 'Community' }]

  const profileLink = user?.role === 'employer' ? '/employer/profile' : user?.role === 'admin' ? '/admin/dashboard' : '/profile'

  return (
    <motion.header
      initial={{ y: -64 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/90 dark:bg-[#060912]/90 backdrop-blur-xl border-b border-slate-200 dark:border-white/[0.06] shadow-sm'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:shadow-indigo-500/50 transition-shadow">
              <FiBriefcase className="text-white" size={15} />
            </div>
            <span className="text-[15px] font-bold text-gradient tracking-tight">JobPortal</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link key={link.to} to={link.to}
                className={`nav-link text-[13.5px] ${location.pathname.startsWith(link.to) ? 'active' : ''}`}>
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">

            {/* Theme toggle */}
            <button onClick={toggleTheme}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition-all"
              aria-label="Toggle theme">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div key={theme}
                  initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                  {theme === 'dark' ? <FiSun size={16} /> : <FiMoon size={16} />}
                </motion.div>
              </AnimatePresence>
            </button>

            {user ? (
              <>
                {/* Bell */}
                <button className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition-all relative">
                  <FiBell size={16} />
                  <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                </button>

                {/* User dropdown */}
                <div className="relative" ref={dropRef}>
                  <button onClick={() => setDropOpen(!dropOpen)}
                    className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-all">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white overflow-hidden flex-shrink-0">
                      {user.avatar ? <img src={user.avatar} alt="" className="w-full h-full object-cover" /> : user.name?.[0]?.toUpperCase()}
                    </div>
                    <div className="hidden md:block text-left">
                      <div className="text-[13px] font-semibold text-slate-800 dark:text-slate-200 leading-none">{user.name}</div>
                      <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 capitalize">{user.role}</div>
                    </div>
                    <motion.div animate={{ rotate: dropOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                      <FiChevronDown size={13} className="text-slate-400" />
                    </motion.div>
                  </button>

                  <AnimatePresence>
                    {dropOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-52 rounded-2xl overflow-hidden shadow-xl bg-white dark:bg-[#0d1117] border border-slate-200 dark:border-[#1e2d3d]"
                      >
                        {/* User info */}
                        <div className="px-4 py-3 border-b border-slate-100 dark:border-[#1e2d3d]">
                          <div className="text-[13px] font-semibold text-slate-800 dark:text-slate-200">{user.name}</div>
                          <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 truncate">{user.email}</div>
                        </div>
                        <div className="p-1.5">
                          <Link to={profileLink} onClick={() => setDropOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13px] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/5 transition-all">
                            <FiUser size={14} /> Profile
                          </Link>
                          <Link to={profileLink} onClick={() => setDropOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13px] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/5 transition-all">
                            <FiSettings size={14} /> Settings
                          </Link>
                        </div>
                        <div className="p-1.5 border-t border-slate-100 dark:border-[#1e2d3d]">
                          <button onClick={handleLogout}
                            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13px] text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all">
                            <FiLogOut size={14} /> Sign out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn-ghost text-[13.5px] py-2 px-4">Sign in</Link>
                <Link to="/register" className="btn-primary text-[13.5px] py-2 px-4">Get started</Link>
              </div>
            )}

            {/* Mobile toggle */}
            <button className="md:hidden w-9 h-9 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 transition-all"
              onClick={() => setMenuOpen(!menuOpen)}>
              <AnimatePresence mode="wait" initial={false}>
                <motion.div key={menuOpen ? 'x' : 'menu'}
                  initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                  {menuOpen ? <FiX size={18} /> : <FiMenu size={18} />}
                </motion.div>
              </AnimatePresence>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25 }}
            className="md:hidden overflow-hidden border-t border-slate-200 dark:border-white/[0.06] bg-white dark:bg-[#060912]">
            <div className="px-4 py-3 space-y-1">
              {navLinks.map((link, i) => (
                <motion.div key={link.to} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}>
                  <Link to={link.to}
                    className={`block px-4 py-2.5 rounded-xl text-[14px] font-medium transition-all ${
                      location.pathname.startsWith(link.to)
                        ? 'text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5'
                    }`}>
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
