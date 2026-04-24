import { useState, useEffect } from 'react'
import { adminAPI } from '../../services/api'
import toast from 'react-hot-toast'
import { FiTrash2, FiSearch, FiUser, FiBriefcase, FiMail, FiCalendar } from 'react-icons/fi'
import { formatDistanceToNow } from 'date-fns'

export default function ManageUsers() {
  const [users, setUsers] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')

  useEffect(() => {
    adminAPI.getUsers().then(res => { setUsers(res.data); setFiltered(res.data) }).finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    let result = users
    if (search) result = result.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()))
    if (roleFilter !== 'all') result = result.filter(u => u.role === roleFilter)
    setFiltered(result)
  }, [search, roleFilter, users])

  const handleDelete = async (id) => {
    if (!confirm('Delete this user? This cannot be undone.')) return
    try {
      await adminAPI.deleteUser(id)
      setUsers(prev => prev.filter(u => u._id !== id))
      toast.success('User deleted')
    } catch { toast.error('Failed to delete user') }
  }

  return (
    <div className="min-h-screen pt-20 px-4 pb-12 bg-slate-50 dark:bg-[#060912]">
      <div className="max-w-6xl mx-auto">
        <div className="py-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Manage Users</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">{filtered.length} of {users.length} users</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={16} />
            <input className="input-field pl-10" placeholder="Search by name or email..."
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="flex gap-2">
            {['all', 'user', 'employer'].map(r => (
              <button key={r} onClick={() => setRoleFilter(r)}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all capitalize ${roleFilter === r ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'}`}>
                {r === 'all' ? 'All' : r === 'user' ? 'Seekers' : 'Employers'}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="space-y-3">{[1,2,3,4,5].map(i => <div key={i} className="skeleton h-20 rounded-2xl" />)}</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">👥</div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white">No users found</h3>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(u => (
              <div key={u._id} className="card flex items-center justify-between gap-4 flex-wrap hover:scale-[1.005] transition-all animate-slide-up">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500/30 to-purple-500/30 border border-indigo-500/20 flex items-center justify-center font-bold overflow-hidden flex-shrink-0">
                    {u.name?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-slate-900 dark:text-white">{u.name}</p>
                      <span className={`badge text-xs ${u.role === 'employer' ? 'badge-purple' : 'badge-blue'}`}>
                        {u.role === 'employer' ? <><FiBriefcase size={10} className="mr-1" />Employer</> : <><FiUser size={10} className="mr-1" />Seeker</>}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-slate-500 dark:text-slate-500">
                      <span className="flex items-center gap-1"><FiMail size={11} />{u.email}</span>
                      <span className="flex items-center gap-1"><FiCalendar size={11} />{formatDistanceToNow(new Date(u.createdAt), { addSuffix: true })}</span>
                    </div>
                  </div>
                </div>
                <button onClick={() => handleDelete(u._id)}
                  className="p-2.5 rounded-xl text-slate-500 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all">
                  <FiTrash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
