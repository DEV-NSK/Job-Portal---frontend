import { motion } from 'framer-motion'

const Badge = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  className = '',
  animate = false,
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center font-semibold border'
  
  const variants = {
    primary: 'badge-primary',
    secondary: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20',
    success: 'badge-success',
    warning: 'badge-warning',
    danger: 'badge-danger',
    info: 'badge-info',
    // Legacy support
    blue: 'badge-primary',
    green: 'badge-success',
    yellow: 'badge-warning',
    red: 'badge-danger',
    purple: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20'
  }
  
  const sizes = {
    sm: 'px-2 py-0.5 text-xs rounded-md',
    md: 'px-3 py-1 text-xs rounded-full',
    lg: 'px-4 py-1.5 text-sm rounded-full'
  }

  const Component = animate ? motion.span : 'span'
  const motionProps = animate ? {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    transition: { type: "spring", stiffness: 500, damping: 30 }
  } : {}

  return (
    <Component
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...motionProps}
      {...props}
    >
      {children}
    </Component>
  )
}

export default Badge