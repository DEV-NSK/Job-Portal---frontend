import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { talentPoolAPI } from '../../services/api'
import toast from 'react-hot-toast'

export default function TalentPools() {
  const [pools, setPools] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedPool, setSelectedPool] = useState(null)
  const [members, setMembers] = useState([])
  const [showCreate, setShowCreate] = useState(false)
  const [newPool, setNewPool] = useState({ name: '', description: '', isTeamVisible: false })
  const [search, setSearch] = useState('')

  const loadPools = async () => {
    try {
      const res = await talentPoolAPI.getPools()
      setPools(res.data)
    } catch { toast.error('Failed to load pools') }
    finally { setLoading(false) }
  }

  useEffect(() => { loadPools() }, [])

  const selectPool = async (pool) => {
    setSelectedPool(pool)
    try {
      const res = await talentPoolAPI.getMembers(pool._id)
      setMembers(res.data)
    } catch { setMembers([]) }
  }

  const createPool = async () => {
    if (!newPool.name.trim()) return toast.error('Pool name required')
    try {
      await talentPoolAPI.create(newPool)
      toast.success('Pool created')
      setShowCreate(false)
      setNewPool({ name: '', description: '', isTeamVisible: false })
      loadPools()
    } catch { toast.error('Failed to create pool') }
  }

  const deletePool = async (id) => {
    if (!confirm('Delete this pool?')) return
    try {
      await talentPoolAPI.deletePool(id)
      toast.success('Pool deleted')
      if (selectedPool?._id === id) setSelectedPool(null)
      loadPools()
    } catch { toast.error('Failed') }
  }

  const removeMember = async (candidateId) => {
    try {
      await talentPoolAPI.removeMember(selectedPool._id, candidateId)
      setMembers(prev => prev.filter(m => m.candidate?._id !== candidateId))
      toast.success('Removed from pool')
    } catch { toast.error('Failed') }
  }

  const exportPool = async () => {
    try {
      const res = await talentPoolAPI.exportPool(selectedPool._id)
      const blob = new Blob([res.data], { type: 'text/csv' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url; a.download = `pool-${selectedPool.name}.csv`; a.click()
    } catch { toast.error('Export failed') }
  }

  const filtered = members.filter(m =>
    !search || m.candidate?.name?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen pt-20 pb-12 bg-slate-50 dark:bg-[#060912]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Talent Pools</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Your private candidate database</p>
          </div>
          <button onClick={() => setShowCreate(true)} className="btn-primary">+ New Pool</button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Pool List */}
          <div className="space-y-2">
            {loading ? (
              <div className="space-y-2">{[1,2,3].map(i => <div key={i} className="skeleton h-16 rounded-xl" />)}</div>
            ) : pools.length === 0 ? (
              <div className="card text-center py-10 text-slate-500 text-sm">No pools yet</div>
            ) : pools.map(pool => (
              <motion.div key={pool._id} whileHover={{ x: 2 }}
                onClick={() => selectPool(pool)}
                className={`card card-hover cursor-pointer p-4 ${selectedPool?._id === pool._id ? 'border-indigo-300 dark:border-indigo-500/40' : ''}`}>
                <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    <div className="font-semibold text-sm text-slate-800 dark:text-slate-100 truncate">{pool.name}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{pool.members?.length || 0} candidates</div>
                  </div>
                  <button onClick={e => { e.stopPropagation(); deletePool(pool._id) }}
                    className="text-slate-400 hover:text-red-500 transition-colors text-sm ml-2">🗑</button>
                </div>
                {pool.description && <p className="text-xs text-slate-500 mt-1.5 truncate">{pool.description}</p>}
              </motion.div>
            ))}
          </div>

          {/* Pool Detail */}
          <div className="md:col-span-2">
            {!selectedPool ? (
              <div className="card text-center py-16 text-slate-500">
                <div className="text-4xl mb-3">🗂</div>
                <p>Select a pool to view candidates</p>
              </div>
            ) : (
              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">{selectedPool.name}</h2>
                  <button onClick={exportPool} className="btn-secondary text-sm">Export CSV</button>
                </div>
                <input value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Search candidates..."
                  className="input-field mb-4" />
                {filtered.length === 0 ? (
                  <div className="text-center py-10 text-slate-500 text-sm">No candidates in this pool</div>
                ) : (
                  <div className="space-y-2">
                    {filtered.map(m => (
                      <div key={m._id} className="surface flex items-center gap-3 p-3 rounded-xl">
                        <div className="w-9 h-9 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-white text-sm flex-shrink-0">
                          {m.candidate?.name?.[0] || '?'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm text-slate-800 dark:text-slate-100 truncate">{m.candidate?.name}</div>
                          <div className="text-xs text-slate-500 truncate">{m.candidate?.email}</div>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {m.candidate?.skills?.slice(0, 3).map(s => (
                              <span key={s} className="badge badge-primary">{s}</span>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center gap-0.5 flex-shrink-0">
                          {[1,2,3,4,5].map(star => (
                            <span key={star} className={`text-sm ${star <= m.rating ? 'text-amber-400' : 'text-slate-300 dark:text-slate-600'}`}>★</span>
                          ))}
                        </div>
                        <button onClick={() => removeMember(m.candidate?._id)}
                          className="text-slate-400 hover:text-red-500 transition-colors text-sm ml-1">✕</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showCreate && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
            onClick={() => setShowCreate(false)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              className="card w-full max-w-md" onClick={e => e.stopPropagation()}>
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">Create Talent Pool</h2>
              <input value={newPool.name} onChange={e => setNewPool(p => ({ ...p, name: e.target.value }))}
                placeholder="Pool name (e.g. Frontend Experts)"
                className="input-field mb-3" />
              <textarea value={newPool.description} onChange={e => setNewPool(p => ({ ...p, description: e.target.value }))}
                placeholder="Description (optional)"
                className="input-field mb-3 h-20 resize-none" />
              <label className="flex items-center gap-2 mb-5 cursor-pointer">
                <input type="checkbox" checked={newPool.isTeamVisible}
                  onChange={e => setNewPool(p => ({ ...p, isTeamVisible: e.target.checked }))}
                  className="accent-indigo-500" />
                <span className="text-sm text-slate-600 dark:text-slate-300">Visible to team</span>
              </label>
              <div className="flex gap-3">
                <button onClick={createPool} className="btn-primary flex-1">Create</button>
                <button onClick={() => setShowCreate(false)} className="btn-secondary flex-1">Cancel</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
