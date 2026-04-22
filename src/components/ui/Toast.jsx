import { toast as hotToast } from 'react-hot-toast'
import { FiCheck, FiX, FiAlertCircle, FiInfo } from 'react-icons/fi'

const createToast = (message, type = 'default', options = {}) => {
  const icons = {
    success: <FiCheck className="text-emerald-500" size={16} />,
    error: <FiX className="text-red-500" size={16} />,
    warning: <FiAlertCircle className="text-amber-500" size={16} />,
    info: <FiInfo className="text-cyan-500" size={16} />
  }

  const defaultOptions = {
    duration: 4000,
    position: 'top-right',
    style: {
      background: 'rgba(15, 23, 42, 0.95)',
      backdropFilter: 'blur(12px)',
      border: '1px solid rgba(148, 163, 184, 0.1)',
      borderRadius: '12px',
      color: '#e2e8f0',
      padding: '12px 16px',
      fontSize: '14px',
      fontWeight: '500',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.05)'
    },
    ...options
  }

  // Light mode styles
  if (document.documentElement.classList.contains('light')) {
    defaultOptions.style = {
      ...defaultOptions.style,
      background: 'rgba(255, 255, 255, 0.95)',
      color: '#1e293b',
      border: '1px solid rgba(148, 163, 184, 0.2)',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(0, 0, 0, 0.05)'
    }
  }

  if (type === 'default') {
    return hotToast(message, defaultOptions)
  }

  return hotToast.custom(
    (t) => (
      <div
        className={`
          flex items-center gap-3 p-3 rounded-xl border transition-all duration-300
          ${t.visible ? 'animate-fade-in' : 'opacity-0'}
          dark:bg-slate-900/95 dark:border-slate-700/50 dark:text-slate-100
          bg-white/95 border-slate-200/60 text-slate-900
          backdrop-blur-xl shadow-lg
        `}
        style={defaultOptions.style}
      >
        {icons[type]}
        <span className="flex-1">{message}</span>
        <button
          onClick={() => hotToast.dismiss(t.id)}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
        >
          <FiX size={14} />
        </button>
      </div>
    ),
    defaultOptions
  )
}

const toast = {
  success: (message, options) => createToast(message, 'success', options),
  error: (message, options) => createToast(message, 'error', options),
  warning: (message, options) => createToast(message, 'warning', options),
  info: (message, options) => createToast(message, 'info', options),
  loading: (message, options) => hotToast.loading(message, {
    style: {
      background: 'rgba(15, 23, 42, 0.95)',
      backdropFilter: 'blur(12px)',
      border: '1px solid rgba(148, 163, 184, 0.1)',
      borderRadius: '12px',
      color: '#e2e8f0',
      padding: '12px 16px',
      fontSize: '14px',
      fontWeight: '500'
    },
    ...options
  }),
  promise: (promise, messages, options) => hotToast.promise(
    promise,
    {
      loading: messages.loading || 'Loading...',
      success: messages.success || 'Success!',
      error: messages.error || 'Error occurred'
    },
    {
      style: {
        background: 'rgba(15, 23, 42, 0.95)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(148, 163, 184, 0.1)',
        borderRadius: '12px',
        color: '#e2e8f0',
        padding: '12px 16px',
        fontSize: '14px',
        fontWeight: '500'
      },
      ...options
    }
  ),
  dismiss: hotToast.dismiss,
  remove: hotToast.remove
}

export default toast