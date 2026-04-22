import { motion } from 'framer-motion'

function SkeletonCard() {
  return (
    <div className="card space-y-4">
      <div className="flex items-start gap-3">
        <div className="skeleton w-12 h-12 rounded-xl flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="skeleton h-4 w-3/4 rounded-lg" />
          <div className="skeleton h-3 w-1/2 rounded-lg" />
        </div>
        <div className="skeleton h-5 w-16 rounded-full" />
      </div>
      <div className="flex gap-3">
        <div className="skeleton h-3 w-20 rounded-lg" />
        <div className="skeleton h-3 w-16 rounded-lg" />
        <div className="skeleton h-3 w-14 rounded-lg" />
      </div>
      <div className="flex gap-2">
        <div className="skeleton h-6 w-14 rounded-lg" />
        <div className="skeleton h-6 w-18 rounded-lg" />
        <div className="skeleton h-6 w-12 rounded-lg" />
      </div>
      <div className="flex justify-between pt-3 border-t border-slate-100 dark:border-[#1e2d3d]">
        <div className="skeleton h-3 w-20 rounded-lg" />
        <div className="skeleton h-3 w-16 rounded-lg" />
      </div>
    </div>
  )
}

export default function LoadingSkeleton({ count = 6, variant = 'grid' }) {
  return (
    <div className={variant === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5' : 'space-y-4'}>
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.05 }}
        >
          <SkeletonCard />
        </motion.div>
      ))}
    </div>
  )
}
