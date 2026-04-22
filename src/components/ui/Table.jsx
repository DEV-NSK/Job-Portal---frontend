import { motion } from 'framer-motion'
import { forwardRef } from 'react'

const Table = forwardRef(({ 
  children, 
  className = '',
  ...props 
}, ref) => (
  <div className={`table-container ${className}`}>
    <table ref={ref} className="table" {...props}>
      {children}
    </table>
  </div>
))

const TableHeader = ({ children, className = '' }) => (
  <thead className={className}>
    {children}
  </thead>
)

const TableBody = ({ children, className = '' }) => (
  <tbody className={className}>
    {children}
  </tbody>
)

const TableRow = ({ children, className = '', animate = false, index = 0, ...props }) => {
  const Component = animate ? motion.tr : 'tr'
  const motionProps = animate ? {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { delay: index * 0.05, duration: 0.3 }
  } : {}

  return (
    <Component className={className} {...motionProps} {...props}>
      {children}
    </Component>
  )
}

const TableHead = ({ children, className = '', sortable = false, onSort, sortDirection, ...props }) => (
  <th 
    className={`
      ${className} 
      ${sortable ? 'cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800/50 select-none' : ''}
    `}
    onClick={sortable ? onSort : undefined}
    {...props}
  >
    <div className="flex items-center gap-2">
      {children}
      {sortable && (
        <div className="flex flex-col">
          <div className={`w-0 h-0 border-l-[3px] border-r-[3px] border-b-[4px] border-transparent ${
            sortDirection === 'asc' ? 'border-b-slate-400' : 'border-b-slate-300 dark:border-b-slate-600'
          }`} />
          <div className={`w-0 h-0 border-l-[3px] border-r-[3px] border-t-[4px] border-transparent mt-0.5 ${
            sortDirection === 'desc' ? 'border-t-slate-400' : 'border-t-slate-300 dark:border-t-slate-600'
          }`} />
        </div>
      )}
    </div>
  </th>
)

const TableCell = ({ children, className = '', ...props }) => (
  <td className={className} {...props}>
    {children}
  </td>
)

// Status components for common table use cases
const StatusBadge = ({ status, variant = 'default' }) => {
  const variants = {
    success: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    danger: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
    info: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20',
    default: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20'
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${variants[variant]}`}>
      {status}
    </span>
  )
}

const ActionButton = ({ children, variant = 'ghost', size = 'sm', ...props }) => {
  const variants = {
    ghost: 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50',
    primary: 'text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-500/10',
    danger: 'text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-500/10'
  }

  const sizes = {
    sm: 'p-1.5 text-sm',
    md: 'p-2 text-sm'
  }

  return (
    <button 
      className={`rounded-lg transition-colors ${variants[variant]} ${sizes[size]}`}
      {...props}
    >
      {children}
    </button>
  )
}

Table.Header = TableHeader
Table.Body = TableBody
Table.Row = TableRow
Table.Head = TableHead
Table.Cell = TableCell
Table.StatusBadge = StatusBadge
Table.ActionButton = ActionButton

Table.displayName = 'Table'

export default Table