import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { useNotifications } from '../../context/NotificationContext'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiBriefcase, FiMenu, FiX, FiUser, FiLogOut,
  FiSun, FiMoon, FiChevronDown, FiSettings, FiBell,
  FiCheck, FiCheckCircle, FiTrash2, FiMoreVertical, FiEye
} from 'react-icons/fi'

const typeIcon = {
  application_received: '📩',
  application_status: '📋',
  employer_pending: '🏢',
  employer_approved: '✅',
  employer_rejected: '❌'
}

export default function Navbar() {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const { notifications, unreadCount, markRead, markAllRead, deleteNotification, deleteAllRead, clearAll } = useNotifications()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropOpen, setDropOpen] = useState(false)
  const [bellOpen, setBellOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const dropRef = useRef(null)
  const bellRef = useRef(null)

  const handleLogout = () => { logout(); navigate('/'); setDropOpen(false) }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false)
      if (bellRef.current && !bellRef.current.contains(e.target)) setBellOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => { setMenuOpen(false) }, [location.pathname])

  const handleNotifClick = (notif) => {
    if (!notif.isRead) markRead(notif._id)
    if (notif.link) navigate(notif.link)
    setBellOpen(false)
  }

  const navLinks = user?.role === 'employer'
    ? [
        { to: '/employer/dashboard', label: 'Dashboard' },
        { to: '/employer/jobs', label: 'My Jobs' },
        { to: '/employer/applicants', label: 'Applicants' },
        { to: '/employer/recruiter', label: '🚀 Recruiter AI' },
        { to: '/micro-internships', label: 'Tasks' }
      ]
    : user?.role === 'admin'
    ? [
        { to: '/admin/dashboard', label: 'Dashboard' },
        { to: '/admin/users', label: 'Users' },
        { to: '/admin/jobs', label: 'Jobs' },
        { to: '/admin/employers', label: 'Employers' }
      ]
    : [{ to: '/jobs', label: 'Find Jobs' }, { to: '/features', label: 'AI Features' }, { to: '/micro-internships', label: 'Tasks' }, { to: '/posts', label: 'Community' }]

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
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 dark:from-blue-500 dark:to-blue-600 flex items-center justify-center shadow-lg shadow-orange-500/30 dark:shadow-blue-500/30 group-hover:shadow-orange-500/50 dark:group-hover:shadow-blue-500/50 transition-shadow">
              <FiBriefcase className="text-white" size={15} />
            </div>
            <span className="text-[15px] font-bold text-gradient tracking-tight">HIRA</span>
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
                {/* Notification Bell */}
                <div className="relative" ref={bellRef}>
                  <button
                    onClick={() => setBellOpen(!bellOpen)}
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition-all relative"
                    aria-label="Notifications"
                  >
                    <FiBell size={16} />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 min-w-[16px] h-4 bg-orange-500 dark:bg-blue-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center px-0.5">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>

                  <AnimatePresence>
                    {bellOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-80 rounded-2xl overflow-hidden shadow-xl bg-white dark:bg-[#0d1117] border border-slate-200 dark:border-[#1e2d3d]"
                      >
                        {/* Header */}
                        <div className="px-4 py-3 border-b border-slate-100 dark:border-[#1e2d3d]">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[13px] font-semibold text-slate-800 dark:text-slate-200">
                              Notifications {unreadCount > 0 && <span className="ml-1 text-orange-600 dark:text-blue-400">({unreadCount})</span>}
                            </span>
                            <div className="flex items-center gap-1">
                              {unreadCount > 0 && (
                                <button
                                  onClick={markAllRead}
                                  className="flex items-center gap-1 px-2 py-1 text-[10px] text-orange-600 dark:text-blue-400 hover:text-orange-700 dark:hover:text-blue-300 hover:bg-orange-50 dark:hover:bg-blue-500/10 rounded-md transition-all"
                                  title="Mark all as read"
                                >
                                  <FiCheckCircle size={11} /> Read All
                                </button>
                              )}
                              {notifications.length > 0 && (
                                <div className="relative group">
                                  <button className="flex items-center justify-center w-6 h-6 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 rounded-md transition-all">
                                    <FiMoreVertical size={12} />
                                  </button>
                                  <div className="absolute right-0 top-full mt-1 w-40 bg-white dark:bg-[#0d1117] border border-slate-200 dark:border-[#1e2d3d] rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                                    <button
                                      onClick={deleteAllRead}
                                      className="w-full text-left px-3 py-2 text-[11px] text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors flex items-center gap-2"
                                    >
                                      <FiTrash2 size={10} /> Delete Read
                                    </button>
                                    <button
                                      onClick={clearAll}
                                      className="w-full text-left px-3 py-2 text-[11px] text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors flex items-center gap-2"
                                    >
                                      <FiTrash2 size={10} /> Clear All
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* List */}
                        <div className="max-h-80 overflow-y-auto">
                          {notifications.length === 0 ? (
                            <div className="py-8 text-center text-slate-400 dark:text-slate-600 text-[13px]">
                              No notifications yet
                            </div>
                          ) : (
                            notifications.slice(0, 15).map(notif => (
                              <div
                                key={notif._id}
                                className={`group relative flex gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors border-b border-slate-50 dark:border-white/[0.03] last:border-0 ${
                                  !notif.isRead ? 'bg-orange-50/50 dark:bg-blue-500/5' : ''
                                }`}
                              >
                                <button
                                  onClick={() => handleNotifClick(notif)}
                                  className="flex gap-3 flex-1 min-w-0 text-left"
                                >
                                  <span className="text-lg flex-shrink-0 mt-0.5">{typeIcon[notif.type] || '🔔'}</span>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2">
                                      <p className="text-[12.5px] font-semibold text-slate-800 dark:text-slate-200 leading-tight">
                                        {notif.title}
                                      </p>
                                      {!notif.isRead && (
                                        <span className="w-2 h-2 rounded-full bg-orange-500 dark:bg-blue-500 flex-shrink-0 mt-1" />
                                      )}
                                    </div>
                                    <p className="text-[11.5px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug line-clamp-2">
                                      {notif.message}
                                    </p>
                                    <p className="text-[10.5px] text-slate-400 dark:text-slate-600 mt-1">
                                      {new Date(notif.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                  </div>
                                </button>

                                {/* Individual notification actions */}
                                <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  {!notif.isRead && (
                                    <button
                                      onClick={(e) => { e.stopPropagation(); markRead(notif._id) }}
                                      className="w-6 h-6 rounded-md flex items-center justify-center text-slate-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-500/10 transition-all"
                                      title="Mark as read"
                                    >
                                      <FiCheck size={12} />
                                    </button>
                                  )}
                                  <button
                                    onClick={(e) => { e.stopPropagation(); deleteNotification(notif._id) }}
                                    className="w-6 h-6 rounded-md flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
                                    title="Delete notification"
                                  >
                                    <FiTrash2 size={11} />
                                  </button>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* User dropdown */}
                <div className="relative" ref={dropRef}>
                  <button onClick={() => setDropOpen(!dropOpen)}
                    className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-all">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 dark:from-blue-500 dark:to-blue-600 flex items-center justify-center text-xs font-bold text-white overflow-hidden flex-shrink-0">
                      {user.name?.[0]?.toUpperCase()}
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
                        ? 'text-orange-700 dark:text-blue-400 bg-orange-50 dark:bg-blue-500/10'
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
