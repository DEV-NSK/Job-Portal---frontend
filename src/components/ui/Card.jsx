import { forwardRef } from 'react'
import { motion } from 'framer-motion'

const Card = forwardRef(({ 
  children, 
  variant = 'default',
  hover = false,
  className = '',
  ...props 
}, ref) => {
  const baseClasses = 'rounded-2xl p-6 transition-all duration-300 border'
  
  const variants = {
    default: 'card',
    glass: 'glass-card',
    elevated: 'card shadow-xl',
    flat: 'bg-transparent border-0 p-0'
  }

  const hoverClasses = hover ? 'card-hover cursor-pointer' : ''

  const Component = hover ? motion.div : 'div'
  const motionProps = hover ? {
    whileHover: { scale: 1.02, y: -4 },
    transition: { type: "spring", stiffness: 300, damping: 30 }
  } : {}

  return (
    <Component
      ref={ref}
      className={`${baseClasses} ${variants[variant]} ${hoverClasses} ${className}`}
      {...motionProps}
      {...props}
    >
      {children}
    </Component>
  )
})

Card.displayName = 'Card'

// Card sub-components
const CardHeader = ({ children, className = '' }) => (
  <div className={`mb-4 ${className}`}>
    {children}
  </div>
)

const CardTitle = ({ children, className = '' }) => (
  <h3 className={`text-lg font-semibold dark:text-slate-100 text-slate-900 ${className}`}>
    {children}
  </h3>
)

const CardDescription = ({ children, className = '' }) => (
  <p className={`text-sm dark:text-slate-400 text-slate-600 ${className}`}>
    {children}
  </p>
)

const CardContent = ({ children, className = '' }) => (
  <div className={className}>
    {children}
  </div>
)

const CardFooter = ({ children, className = '' }) => (
  <div className={`mt-4 pt-4 border-t dark:border-slate-800/50 border-slate-200/60 ${className}`}>
    {children}
  </div>
)

Card.Header = CardHeader
Card.Title = CardTitle
Card.Description = CardDescription
Card.Content = CardContent
Card.Footer = CardFooter

export default Card