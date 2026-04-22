import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { motion } from 'framer-motion'
import {
  FiSearch, FiBriefcase, FiUsers, FiTrendingUp, FiArrowRight,
  FiCheckCircle, FiZap, FiTarget, FiStar, FiCode,
  FiAward, FiShield, FiCpu
} from 'react-icons/fi'

const stats = [
  { label: 'Jobs Posted',  value: '10,000+', icon: FiBriefcase,    color: 'text-indigo-600 dark:text-indigo-400',  bg: 'bg-indigo-50 dark:bg-indigo-500/10 border-indigo-200 dark:border-indigo-500/20' },
  { label: 'Companies',   value: '2,500+',  icon: FiUsers,         color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20' },
  { label: 'Hired',       value: '50,000+', icon: FiCheckCircle,   color: 'text-amber-600 dark:text-amber-400',    bg: 'bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20' },
  { label: 'Success Rate',value: '94%',     icon: FiTrendingUp,    color: 'text-purple-600 dark:text-purple-400',  bg: 'bg-purple-50 dark:bg-purple-500/10 border-purple-200 dark:border-purple-500/20' },
]

const categories = [
  { name: 'Engineering', icon: FiCode,      count: '2,400', color: 'text-blue-600 dark:text-blue-400',   bg: 'bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20' },
  { name: 'Design',      icon: FiStar,      count: '890',   color: 'text-pink-600 dark:text-pink-400',   bg: 'bg-pink-50 dark:bg-pink-500/10 border-pink-200 dark:border-pink-500/20' },
  { name: 'Marketing',   icon: FiTrendingUp,count: '1,200', color: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-500/10 border-green-200 dark:border-green-500/20' },
  { name: 'Finance',     icon: FiShield,    count: '760',   color: 'text-yellow-600 dark:text-yellow-400',bg: 'bg-yellow-50 dark:bg-yellow-500/10 border-yellow-200 dark:border-yellow-500/20' },
  { name: 'AI / ML',     icon: FiCpu,       count: '1,100', color: 'text-purple-600 dark:text-purple-400',bg: 'bg-purple-50 dark:bg-purple-500/10 border-purple-200 dark:border-purple-500/20' },
  { name: 'Product',     icon: FiTarget,    count: '540',   color: 'text-orange-600 dark:text-orange-400',bg: 'bg-orange-50 dark:bg-orange-500/10 border-orange-200 dark:border-orange-500/20' },
]

const features = [
  { icon: FiZap,   title: 'AI-Powered Matching',    desc: 'Smart algorithms surface the right roles based on your skills, experience, and career goals.',       color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-500/10 border-indigo-200 dark:border-indigo-500/20' },
  { icon: FiAward, title: 'Profile Strength Score', desc: 'Get a real-time score and actionable tips to make your profile stand out to recruiters.',             color: 'text-amber-600 dark:text-amber-400',   bg: 'bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20' },
  { icon: FiTarget,title: 'Interview Prep',         desc: 'Practice with AI mock interviews, coding challenges, and real-time feedback before the big day.',     color: 'text-emerald-600 dark:text-emerald-400',bg: 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20' },
]

const companies = ['Stripe', 'Vercel', 'Linear', 'Notion', 'Figma', 'GitHub', 'Shopify', 'Atlassian']

const stagger = {
  container: { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } },
  item: { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } } },
}

export default function Home() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')

  const handleSearch = (e) => {
    e.preventDefault()
    navigate(`/jobs${search ? `?search=${encodeURIComponent(search)}` : ''}`)
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#060912]">

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center pt-16 overflow-hidden bg-slate-50 dark:bg-[#060912]">
        <div className="absolute inset-0 bg-grid" />

        {/* Blobs */}
        <motion.div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] rounded-full pointer-events-none opacity-40 dark:opacity-100"
          style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)' }}
          animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }} />
        <motion.div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] rounded-full pointer-events-none opacity-30 dark:opacity-100"
          style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.1) 0%, transparent 70%)' }}
          animate={{ scale: [1.1, 1, 1.1] }} transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 3 }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">
          <div className="max-w-3xl mx-auto text-center">

            {/* Badge */}
            <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-medium mb-8 border
                         text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-500/10 border-indigo-200 dark:border-indigo-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              1,200+ new jobs posted this week
            </motion.div>

            {/* Headline */}
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold text-slate-900 dark:text-white leading-[1.08] tracking-tight mb-6">
              Land your next{' '}
              <span className="text-gradient">dream role</span>
              <br />faster than ever
            </motion.h1>

            {/* Sub */}
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-slate-500 dark:text-slate-400 mb-10 max-w-xl mx-auto leading-relaxed">
              AI-powered job matching, interview prep, and career tools — all in one platform built for modern professionals.
            </motion.p>

            {/* Search */}
            <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
              onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto mb-8">
              <div className="relative flex-1">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input type="text" placeholder="Job title, company, or skill..."
                  value={search} onChange={e => setSearch(e.target.value)}
                  className="input-field pl-11 py-3.5 shadow-sm" />
              </div>
              <button type="submit" className="btn-primary px-6 py-3.5 flex-shrink-0">Search Jobs</button>
            </motion.form>

            {/* Tags */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
              className="flex flex-wrap items-center justify-center gap-2">
              <span className="text-[12px] text-slate-400 dark:text-slate-600">Popular:</span>
              {['React Developer', 'Product Manager', 'Data Scientist', 'UX Designer'].map(tag => (
                <Link key={tag} to={`/jobs?search=${encodeURIComponent(tag)}`}
                  className="text-[12px] px-3 py-1 rounded-full text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors
                             bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.07] hover:border-indigo-200 dark:hover:border-indigo-500/30">
                  {tag}
                </Link>
              ))}
            </motion.div>
          </div>

          {/* Trusted by */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="mt-20 text-center">
            <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-600 uppercase tracking-widest mb-6">Trusted by teams at</p>
            <div className="flex flex-wrap items-center justify-center gap-8">
              {companies.map(c => (
                <span key={c} className="text-[14px] font-semibold text-slate-300 dark:text-slate-700 cursor-default">{c}</span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── STATS ────────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-y border-slate-100 dark:border-[#1e2d3d] bg-white dark:bg-[#080d16]">
        <div className="max-w-7xl mx-auto">
          <motion.div variants={stagger.container} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map(s => (
              <motion.div key={s.label} variants={stagger.item}>
                <div className="stat-card group text-center">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${s.bg} ${s.color} mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                    <s.icon size={22} />
                  </div>
                  <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">{s.value}</div>
                  <div className="text-sm text-slate-500 dark:text-slate-500">{s.label}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CATEGORIES ───────────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-[#060912]">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-14">
            <div className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-3">Browse by category</div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-3">Explore every field</h2>
            <p className="text-slate-500 dark:text-slate-400 text-lg max-w-xl">From engineering to design, find opportunities across every industry.</p>
          </motion.div>

          <motion.div variants={stagger.container} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map(cat => (
              <motion.div key={cat.name} variants={stagger.item}>
                <Link to={`/jobs?search=${cat.name}`}
                  className="card card-hover group flex flex-col items-center text-center py-6 px-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${cat.bg} ${cat.color} mb-4 group-hover:scale-110 transition-transform`}>
                    <cat.icon size={20} />
                  </div>
                  <div className="text-[14px] font-semibold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mb-1">{cat.name}</div>
                  <div className="text-[12px] text-slate-400 dark:text-slate-600">{cat.count} jobs</div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 border-y border-slate-100 dark:border-[#1e2d3d] bg-white dark:bg-[#080d16]">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <div className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-3">Why JobPortal</div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-5 leading-tight">
                Everything you need to<br /><span className="text-gradient">accelerate your career</span>
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-lg mb-8 leading-relaxed">
                We combine AI-powered tools with a curated job marketplace to give you an unfair advantage in your job search.
              </p>
              <Link to={user ? '/features' : '/register'} className="btn-primary inline-flex gap-2">
                {user ? 'Explore AI Features' : 'Start for free'} <FiArrowRight size={16} />
              </Link>
            </motion.div>

            <motion.div variants={stagger.container} initial="hidden" whileInView="visible" viewport={{ once: true }} className="space-y-4">
              {features.map(f => (
                <motion.div key={f.title} variants={stagger.item}>
                  <div className="card flex items-start gap-4 group hover:border-indigo-200 dark:hover:border-indigo-500/20 transition-colors">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center border ${f.bg} ${f.color} flex-shrink-0 group-hover:scale-110 transition-transform`}>
                      <f.icon size={18} />
                    </div>
                    <div>
                      <div className="text-[15px] font-semibold text-slate-800 dark:text-slate-200 mb-1">{f.title}</div>
                      <div className="text-[13.5px] text-slate-500 dark:text-slate-500 leading-relaxed">{f.desc}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      {!user && (
        <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-[#060912]">
          <div className="max-w-4xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="relative overflow-hidden rounded-3xl p-12 text-center
                         bg-gradient-to-br from-indigo-600 to-purple-700
                         dark:from-[#1a1f35] dark:to-[#0f1628]
                         border-0 dark:border dark:border-indigo-500/20"
              style={{ boxShadow: '0 0 80px rgba(99,102,241,0.15)' }}>
              <div className="absolute inset-0 bg-grid opacity-20" />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-px bg-gradient-to-r from-transparent via-white/30 dark:via-indigo-500/50 to-transparent" />
              <div className="relative">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[12px] font-medium mb-6
                               text-white/90 dark:text-indigo-300 bg-white/10 dark:bg-indigo-500/10 border border-white/20 dark:border-indigo-500/20">
                  <FiZap size={12} /> Free to get started
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to find your next role?</h2>
                <p className="text-white/80 dark:text-slate-400 text-lg mb-8 max-w-lg mx-auto">
                  Join 50,000+ professionals who found their dream job through JobPortal.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link to="/register" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 text-[15px] font-semibold rounded-xl transition-all
                                                   bg-white text-indigo-700 hover:bg-indigo-50 dark:bg-indigo-600 dark:text-white dark:hover:bg-indigo-500">
                    Create free account <FiArrowRight size={16} />
                  </Link>
                  <Link to="/jobs" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 text-[15px] font-semibold rounded-xl transition-all
                                              border border-white/30 text-white hover:bg-white/10">
                    Browse jobs
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}
    </div>
  )
}
