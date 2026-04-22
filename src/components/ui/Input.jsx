import { forwardRef, useState } from 'react'
import { motion } from 'framer-motion'
import { FiEye, FiEyeOff } from 'react-icons/fi'

const Input = forwardRef(({ 
  type = 'text',
  label,
  error,
  icon,
  iconPosition = 'left',
  className = '',
  containerClassName = '',
  ...props 
}, ref) => {
  const [showPassword, setShowPassword] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

  const inputType = type === 'password' && showPassword ? 'text' : type
  const hasIcon = icon || type === 'password'
  const iconLeft = iconPosition === 'left' && icon
  const iconRight = iconPosition === 'right' && icon

  return (
    <div className={`space-y-2 ${containerClassName}`}>
      {label && (
        <label className="block text-sm font-medium dark:text-slate-200 text-slate-700">
          {label}
        </label>
      )}
      
      <div className="relative">
        {iconLeft && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            {icon}
          </div>
        )}
        
        <motion.input
          ref={ref}
          type={inputType}
          className={`
            input-field focus-ring
            ${iconLeft ? 'pl-10' : ''}
            ${iconRight || type === 'password' ? 'pr-10' : ''}
            ${error ? 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20' : ''}
            ${className}
          `}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          animate={{ scale: isFocused ? 1.01 : 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          {...props}
        />
        
        {iconRight && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            {icon}
          </div>
        )}
        
        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          >
            {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
          </button>
        )}
      </div>
      
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-red-500"
        >
          {error}
        </motion.p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export default Input