import { motion } from 'framer-motion'

const Skeleton = ({ 
  className = '', 
  variant = 'default',
  animate = true,
  ...props 
}) => {
  const baseClasses = 'skeleton'
  
  const variants = {
    default: 'h-4',
    text: 'h-4',
    title: 'h-6',
    button: 'h-10',
    avatar: 'w-10 h-10 rounded-full',
    card: 'h-32',
    image: 'aspect-video'
  }

  const Component = animate ? motion.div : 'div'
  const motionProps = animate ? {
    animate: { opacity: [0.5, 1, 0.5] },
    transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
  } : {}

  return (
    <Component
      className={`${baseClasses} ${variants[variant]} ${className}`}
      {...motionProps}
      {...props}
    />
  )
}

// Skeleton compositions
const SkeletonCard = ({ className = '' }) => (
  <div className={`card space-y-4 ${className}`}>
    <div className="flex items-start gap-4">
      <Skeleton variant="avatar" />
      <div className="flex-1 space-y-2">
        <Skeleton variant="title" className="w-3/4" />
        <Skeleton variant="text" className="w-1/2" />
      </div>
      <Skeleton className="w-20 h-6 rounded-full" />
    </div>
    <div className="space-y-2">
      <Skeleton variant="text" />
      <Skeleton variant="text" className="w-4/5" />
    </div>
    <div className="flex gap-2">
      <Skeleton className="w-16 h-6 rounded-lg" />
      <Skeleton className="w-20 h-6 rounded-lg" />
      <Skeleton className="w-14 h-6 rounded-lg" />
    </div>
  </div>
)

const SkeletonList = ({ count = 3, className = '' }) => (
  <div className={`space-y-4 ${className}`}>
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
)

const SkeletonTable = ({ rows = 5, cols = 4, className = '' }) => (
  <div className={`table-container ${className}`}>
    <table className="table">
      <thead>
        <tr>
          {Array.from({ length: cols }).map((_, i) => (
            <th key={i}>
              <Skeleton className="w-20 h-4" />
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: rows }).map((_, i) => (
          <tr key={i}>
            {Array.from({ length: cols }).map((_, j) => (
              <td key={j}>
                <Skeleton className="w-24 h-4" />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)

Skeleton.Card = SkeletonCard
Skeleton.List = SkeletonList
Skeleton.Table = SkeletonTable

export default Skeleton