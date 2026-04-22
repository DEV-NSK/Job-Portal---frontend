import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { FiLoader } from 'react-icons/fi'

const Button = forwardRef(({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  loading = false, 
  disabled = false,
  icon,
  iconPosition = 'left',
  className = '',
  ...props 
}, ref) => {
  const baseClasses = 'inline-flex items-center justify-center font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden'
  
  const variants = {
    primary: 'btn-primary focus:ring-indigo-500/20',
    secondary: 'btn-secondary focus:ring-slate-500/20',
    ghost: 'btn-ghost focus:ring-slate-500/20',
    danger: 'btn-danger focus:ring-red-500/20',
    success: 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 focus:ring-emerald-500/20',
    warning: 'bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 focus:ring-amber-500/20'
  }
  
  const sizes = {
    sm: 'px-3 py-2 text-sm rounded-lg gap-1.5',
    md: 'px-6 py-3 text-sm rounded-xl gap-2',
    lg: 'px-8 py-4 text-base rounded-xl gap-2.5',
    xl: 'px-10 py-5 text-lg rounded-2xl gap-3'
  }

  const isDisabled = disabled || loading

  return (
    <motion.button
      ref={ref}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={isDisabled}
      whileHover={!isDisabled ? { scale: 1.02 } : {}}
      whileTap={!isDisabled ? { scale: 0.98 } : {}}
      {...props}
    >
      {loading && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <FiLoader className="animate-spin" size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />
        </motion.div>
      )}
      
      <div className={`flex items-center gap-2 ${loading ? 'opacity-0' : 'opacity-100'} transition-opacity`}>
        {icon && iconPosition === 'left' && (
          <span className="flex-shrink-0">{icon}</span>
        )}
        {children}
        {icon && iconPosition === 'right' && (
          <span className="flex-shrink-0">{icon}</span>
        )}
      </div>
    </motion.button>
  )
})

Button.displayName = 'Button'

export default Button