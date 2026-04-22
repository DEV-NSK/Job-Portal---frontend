import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX } from 'react-icons/fi'
import Button from './Button'

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true,
  className = ''
}) => {
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-7xl'
  }

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeOnOverlayClick ? onClose : undefined}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`
              relative w-full ${sizes[size]} glass-card
              ${className}
            `}
          >
            {/* Header */}
            {(title || showCloseButton) && (
              <div className="flex items-center justify-between p-6 pb-4">
                {title && (
                  <h2 className="text-xl font-semibold dark:text-slate-100 text-slate-900">
                    {title}
                  </h2>
                )}
                {showCloseButton && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    className="ml-auto -mr-2"
                    icon={<FiX size={16} />}
                  />
                )}
              </div>
            )}
            
            {/* Content */}
            <div className={title || showCloseButton ? 'px-6 pb-6' : 'p-6'}>
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

// Modal sub-components
const ModalHeader = ({ children, className = '' }) => (
  <div className={`mb-4 ${className}`}>
    {children}
  </div>
)

const ModalTitle = ({ children, className = '' }) => (
  <h3 className={`text-lg font-semibold dark:text-slate-100 text-slate-900 ${className}`}>
    {children}
  </h3>
)

const ModalDescription = ({ children, className = '' }) => (
  <p className={`text-sm dark:text-slate-400 text-slate-600 ${className}`}>
    {children}
  </p>
)

const ModalFooter = ({ children, className = '' }) => (
  <div className={`flex items-center justify-end gap-3 mt-6 pt-4 border-t dark:border-slate-800/50 border-slate-200/60 ${className}`}>
    {children}
  </div>
)

Modal.Header = ModalHeader
Modal.Title = ModalTitle
Modal.Description = ModalDescription
Modal.Footer = ModalFooter

export default Modal