import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Editor from '@monaco-editor/react'
import { FiPlus, FiUsers, FiMic, FiMicOff, FiMessageSquare, FiX, FiStar, FiCode } from 'react-icons/fi'
import { mockPeerRooms } from '../../data/mockData'

const DIFF_COLORS = { Easy: 'badge-green', Medium: 'badge-yellow', Hard: 'badge-red' }

const CURSOR_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444']
const PARTICIPANTS = [
  { name: 'You', avatar: 'Y', role: 'Driver', color: CURSOR_COLORS[0], muted: false },
  { name: 'Priya S.', avatar: 'PS', role: 'Navigator', color: CURSOR_COLORS[1], muted: false },
  { name: 'Rahul K.', avatar: 'RK', role: 'Observer', color: CURSOR_COLORS[2], muted: true }
]

const STARTER = `// Dynamic Programming - Longest Common Subsequence
// Driver: You | Navigator: Priya S.

function longestCommonSubsequence(text1, text2) {
    // TODO: Implement LCS using DP
    // Hint from Navigator: Consider a 2D DP table
    
}`

export default function PeerCoding() {
  const [view, setView] = useState('lobby') // lobby | room | create
  const [activeRoom, setActiveRoom] = useState(null)
  const [micOn, setMicOn] = useState(true)
  const [showChat, setShowChat] = useState(false)
  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: 'Priya S.', text: 'Let\'s start with the base cases first', time: '3:01 PM' },
    { id: 2, sender: 'You', text: 'Good idea, dp[0][j] = dp[i][0] = 0', time: '3:02 PM' }
  ])
  const [chatInput, setChatInput] = useState('')
  const [showRating, setShowRating] = useState(false)
  const [rating, setRating] = useState(0)
  const [newRoom, setNewRoom] = useState({ name: '', topic: '', language: 'JavaScript', difficulty: 'Medium', isPublic: true })

  const joinRoom = (room) => { setActiveRoom(room); setView('room') }

  const sendChat = () => {
    if (!chatInput.trim()) return
    setChatMessages(prev => [...prev, { id: Date.now(), sender: 'You', text: chatInput, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }])
    setChatInput('')
  }

  const leaveRoom = () => { setView('lobby'); setShowRating(true) }

  if (view === 'lobby') return (
    <div className="min-h-screen pt-20 px-4 pb-12">
      <div className="max-w-5xl mx-auto">
        <div className="py-8 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold dark:text-white text-gray-900 flex items-center gap-3">
              <FiUsers className="text-primary-400" size={28} /> Peer Coding Rooms
            </h1>
            <p className="dark:text-gray-400 text-gray-500 mt-1">Collaborative coding with real-time sync and voice</p>
          </div>
          <button onClick={() => setView('create')} className="btn-primary flex items-center gap-2">
            <FiPlus size={16} /> Create Room
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockPeerRooms.map((room, i) => (
            <motion.div key={room.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="card hover:scale-[1.02] transition-transform">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold dark:text-white text-gray-900">{room.name}</h3>
                  <p className="text-sm dark:text-gray-400 text-gray-500 mt-0.5">Host: {room.host}</p>
                </div>
                <span className={`badge ${DIFF_COLORS[room.difficulty]}`}>{room.difficulty}</span>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                <span className="badge badge-blue">{room.topic}</span>
                <span className="badge badge-purple">{room.language}</span>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1.5">
                  <div className="flex -space-x-1">
                    {Array.from({ length: room.participants }).map((_, pi) => (
                      <div key={pi} className="w-6 h-6 rounded-full border-2 dark:border-gray-800 border-white flex items-center justify-center text-xs font-bold text-white"
                        style={{ backgroundColor: CURSOR_COLORS[pi] }}>
                        {pi + 1}
                      </div>
                    ))}
                  </div>
                  <span className="text-sm dark:text-gray-400 text-gray-500">{room.participants}/{room.maxParticipants}</span>
                </div>
                <div className="flex gap-1">
                  {Array.from({ length: room.maxParticipants }).map((_, pi) => (
                    <div key={pi} className={`w-2 h-2 rounded-full ${pi < room.participants ? 'bg-green-400' : 'dark:bg-gray-700 bg-slate-300'}`} />
                  ))}
                </div>
              </div>

              <button onClick={() => joinRoom(room)} disabled={room.participants >= room.maxParticipants}
                className="btn-primary w-full text-sm py-2 disabled:opacity-50 disabled:cursor-not-allowed">
                {room.participants >= room.maxParticipants ? 'Room Full' : 'Join Room'}
              </button>
            </motion.div>
          ))}
        </div>

        {/* Rating modal */}
        <AnimatePresence>
          {showRating && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
              <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
                className="dark:bg-gray-900 bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
                <h3 className="font-bold dark:text-white text-gray-900 text-lg mb-2">Rate Your Session</h3>
                <p className="text-sm dark:text-gray-400 text-gray-500 mb-4">Anonymous rating — helps improve the community</p>
                <div className="flex justify-center gap-2 mb-6">
                  {[1, 2, 3, 4, 5].map(s => (
                    <button key={s} onClick={() => setRating(s)}>
                      <FiStar size={28} className={s <= rating ? 'text-yellow-400 fill-yellow-400' : 'dark:text-gray-600 text-slate-300'} />
                    </button>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setShowRating(false)} className="btn-primary flex-1" disabled={!rating}>Submit Rating</button>
                  <button onClick={() => setShowRating(false)} className="btn-secondary">Skip</button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )

  if (view === 'create') return (
    <div className="min-h-screen pt-20 px-4 pb-12">
      <div className="max-w-lg mx-auto">
        <div className="py-8">
          <button onClick={() => setView('lobby')} className="text-sm text-primary-400 hover:text-primary-300 mb-4 flex items-center gap-1">← Back</button>
          <h1 className="text-2xl font-bold dark:text-white text-gray-900">Create Coding Room</h1>
        </div>
        <div className="card space-y-4">
          {[['Room Name', 'name', 'text', 'e.g. LeetCode Hard Grind'], ['Topic', 'topic', 'text', 'e.g. Dynamic Programming']].map(([label, key, type, placeholder]) => (
            <div key={key}>
              <label className="text-sm dark:text-gray-400 text-gray-500 mb-1 block">{label}</label>
              <input type={type} className="input-field" placeholder={placeholder} value={newRoom[key]}
                onChange={e => setNewRoom(p => ({ ...p, [key]: e.target.value }))} />
            </div>
          ))}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm dark:text-gray-400 text-gray-500 mb-1 block">Language</label>
              <select className="input-field" value={newRoom.language} onChange={e => setNewRoom(p => ({ ...p, language: e.target.value }))}>
                {['JavaScript', 'Python', 'Java', 'C++', 'Any'].map(l => <option key={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm dark:text-gray-400 text-gray-500 mb-1 block">Difficulty</label>
              <select className="input-field" value={newRoom.difficulty} onChange={e => setNewRoom(p => ({ ...p, difficulty: e.target.value }))}>
                {['Easy', 'Medium', 'Hard'].map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setNewRoom(p => ({ ...p, isPublic: !p.isPublic }))}
              className={`relative w-10 h-5 rounded-full transition-colors ${newRoom.isPublic ? 'bg-primary-500' : 'dark:bg-gray-700 bg-slate-300'}`}>
              <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${newRoom.isPublic ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </button>
            <span className="text-sm dark:text-gray-300 text-gray-600">Public room (visible in lobby)</span>
          </div>
          <div className="flex gap-3">
            <button className="btn-primary flex-1" onClick={() => { setActiveRoom({ ...newRoom, id: 'new', participants: 1, maxParticipants: 4, host: 'You' }); setView('room') }}>
              Create & Join
            </button>
            <button className="btn-secondary" onClick={() => setView('lobby')}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  )

  // Room view
  return (
    <div className="h-screen flex flex-col pt-16 dark:bg-gray-950 bg-slate-100">
      <div className="flex items-center justify-between px-4 py-2 dark:bg-gray-900 bg-white border-b dark:border-gray-700 border-slate-200 flex-shrink-0">
        <div className="flex items-center gap-3">
          <span className="font-bold dark:text-white text-gray-900 text-sm">{activeRoom?.name || 'Coding Room'}</span>
          <div className="flex -space-x-1">
            {PARTICIPANTS.map((p, i) => (
              <div key={i} title={`${p.name} (${p.role})`}
                className="w-7 h-7 rounded-full border-2 dark:border-gray-800 border-white flex items-center justify-center text-xs font-bold text-white"
                style={{ backgroundColor: p.color }}>
                {p.avatar.slice(0, 1)}
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setMicOn(!micOn)}
            className={`p-2 rounded-lg transition-colors ${micOn ? 'dark:bg-gray-800 bg-slate-100' : 'bg-red-600'}`}>
            {micOn ? <FiMic size={15} className="dark:text-white text-gray-700" /> : <FiMicOff size={15} className="text-white" />}
          </button>
          <button onClick={() => setShowChat(!showChat)}
            className={`p-2 rounded-lg transition-colors ${showChat ? 'bg-primary-600 text-white' : 'dark:bg-gray-800 bg-slate-100 dark:text-gray-400 text-gray-500'}`}>
            <FiMessageSquare size={15} />
          </button>
          <button onClick={leaveRoom} className="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors">
            Leave
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Participants sidebar */}
        <div className="w-44 dark:bg-gray-900 bg-white border-r dark:border-gray-700 border-slate-200 p-3 flex-shrink-0">
          <p className="text-xs font-semibold uppercase tracking-wider dark:text-gray-400 text-gray-500 mb-3">Participants</p>
          <div className="space-y-2">
            {PARTICIPANTS.map((p, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                  style={{ backgroundColor: p.color }}>
                  {p.avatar.slice(0, 1)}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium dark:text-white text-gray-900 truncate">{p.name}</p>
                  <p className="text-xs dark:text-gray-500 text-gray-400">{p.role}</p>
                </div>
                {p.muted && <FiMicOff size={10} className="text-red-400 flex-shrink-0" />}
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t dark:border-gray-700 border-slate-200">
            <p className="text-xs font-semibold uppercase tracking-wider dark:text-gray-400 text-gray-500 mb-2">Voice</p>
            {PARTICIPANTS.filter(p => !p.muted).map((p, i) => (
              <div key={i} className="flex items-center gap-1.5 mb-1.5">
                <div className="flex gap-0.5">
                  {Array(4).fill(0).map((_, j) => (
                    <div key={j} className="w-0.5 rounded-full animate-pulse" style={{ height: `${4 + Math.random() * 8}px`, backgroundColor: p.color, animationDelay: `${j * 0.1}s` }} />
                  ))}
                </div>
                <span className="text-xs dark:text-gray-400 text-gray-500">{p.name.split(' ')[0]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Editor */}
        <div className="flex-1 overflow-hidden">
          <Editor height="100%" language="javascript" defaultValue={STARTER} theme="vs-dark"
            options={{ fontSize: 13, minimap: { enabled: false }, scrollBeyondLastLine: false, padding: { top: 12 }, automaticLayout: true }} />
        </div>

        {/* Chat */}
        <AnimatePresence>
          {showChat && (
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              className="w-64 dark:bg-gray-900 bg-white border-l dark:border-gray-700 border-slate-200 flex flex-col flex-shrink-0">
              <div className="flex items-center justify-between p-3 border-b dark:border-gray-700 border-slate-200">
                <span className="font-semibold dark:text-white text-gray-900 text-sm">Chat</span>
                <button onClick={() => setShowChat(false)}><FiX size={14} className="dark:text-gray-400 text-gray-500" /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {chatMessages.map(m => (
                  <div key={m.id} className={m.sender === 'You' ? 'text-right' : ''}>
                    <p className="text-xs dark:text-gray-500 text-gray-400 mb-0.5">{m.sender}</p>
                    <span className={`inline-block text-xs px-3 py-2 rounded-xl ${m.sender === 'You' ? 'bg-gradient-to-r from-primary-600 to-accent-600 text-white' : 'dark:bg-gray-800 bg-slate-100 dark:text-gray-200 text-gray-700'}`}>{m.text}</span>
                  </div>
                ))}
              </div>
              <div className="p-3 border-t dark:border-gray-700 border-slate-200 flex gap-2">
                <input className="input-field text-xs flex-1 py-2" placeholder="Message..."
                  value={chatInput} onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendChat()} />
                <button onClick={sendChat} className="btn-primary px-2 py-2 text-xs">→</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
