import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiMenu, FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { useLocation } from 'react-router-dom'

const Sidebar = ({ 
  children, 
  collapsed = false, 
  onCollapse,
  className = '',
  overlay = true // Show overlay on mobile
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(collapsed)
  const location = useLocation()

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setIsOpen(false)
  }, [location.pathname])

  // Handle collapse
  const handleCollapse = () => {
    const newCollapsed = !isCollapsed
    setIsCollapsed(newCollapsed)
    onCollapse?.(newCollapsed)
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <motion.button
        className="fixed top-20 left-4 z-50 lg:hidden w-10 h-10 rounded-xl glass flex items-center justify-center dark:text-slate-400 text-slate-600"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isOpen ? <FiX size={18} /> : <FiMenu size={18} />}
      </motion.button>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && overlay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          x: isOpen ? 0 : '-100%',
          width: isCollapsed ? '80px' : '280px'
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`
          fixed top-16 left-0 bottom-0 z-50 glass border-r dark:border-slate-800/50 border-slate-200/60
          lg:translate-x-0 lg:static lg:z-auto
          ${className}
        `}
      >
        {/* Collapse Button (Desktop) */}
        <motion.button
          onClick={handleCollapse}
          className="hidden lg:flex absolute -right-3 top-6 w-6 h-6 rounded-full glass border dark:border-slate-800/50 border-slate-200/60 items-center justify-center dark:text-slate-400 text-slate-600 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {isCollapsed ? <FiChevronRight size={12} /> : <FiChevronLeft size={12} />}
        </motion.button>

        {/* Sidebar Content */}
        <div className="flex flex-col h-full p-4">
          {children}
        </div>
      </motion.aside>
    </>
  )
}

// Sidebar sub-components
const SidebarHeader = ({ children, className = '' }) => (
  <div className={`mb-6 ${className}`}>
    {children}
  </div>
)

const SidebarSection = ({ title, children, className = '' }) => (
  <div className={`mb-6 ${className}`}>
    {title && (
      <h3 className="text-xs font-semibold uppercase tracking-wider dark:text-slate-500 text-slate-400 mb-3 px-3">
        {title}
      </h3>
    )}
    <nav className="space-y-1">
      {children}
    </nav>
  </div>
)

const SidebarLink = ({ 
  children, 
  active = false, 
  icon, 
  badge,
  className = '',
  ...props 
}) => (
  <motion.a
    className={`
      nav-link group relative
      ${active ? 'active' : ''}
      ${className}
    `}
    whileHover={{ x: 2 }}
    whileTap={{ scale: 0.98 }}
    {...props}
  >
    {icon && (
      <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
        {icon}
      </span>
    )}
    <span className="flex-1 truncate">
      {children}
    </span>
    {badge && (
      <span className="flex-shrink-0">
        {badge}
      </span>
    )}
  </motion.a>
)

const SidebarFooter = ({ children, className = '' }) => (
  <div className={`mt-auto pt-4 border-t dark:border-slate-800/50 border-slate-200/60 ${className}`}>
    {children}
  </div>
)

Sidebar.Header = SidebarHeader
Sidebar.Section = SidebarSection
Sidebar.Link = SidebarLink
Sidebar.Footer = SidebarFooter

export default Sidebar