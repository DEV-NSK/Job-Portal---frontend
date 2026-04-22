import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Editor from '@monaco-editor/react'
import { FiVideo, FiVideoOff, FiMic, FiMicOff, FiMonitor, FiCircle, FiSquare, FiUsers, FiMessageSquare, FiPenTool, FiClock, FiPlus, FiX, FiPhone } from 'react-icons/fi'
import { Link } from 'react-router-dom'

const MOCK_ROOMS = [
  { id: 'room-1', title: 'Frontend Interview Practice', host: 'Priya S.', scheduled: 'Today, 3:00 PM', status: 'upcoming' },
  { id: 'room-2', title: 'System Design Round', host: 'Rahul K.', scheduled: 'Apr 23, 10:00 AM', status: 'upcoming' },
  { id: 'room-3', title: 'Completed Session', host: 'Sneha P.', scheduled: 'Apr 20, 2:00 PM', status: 'completed' }
]

const STARTER_CODE = `// Two Sum - Collaborative Session
// Both participants can edit this code in real-time

var twoSum = function(nums, target) {
    const map = new Map();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        map.set(nums[i], i);
    }
};`

export default function InterviewRoom() {
  const [view, setView] = useState('lobby') // lobby | room | create
  const [activeRoom, setActiveRoom] = useState(null)
  const [videoOn, setVideoOn] = useState(true)
  const [micOn, setMicOn] = useState(true)
  const [recording, setRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [showWhiteboard, setShowWhiteboard] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: 'Interviewer', text: 'Welcome! Let\'s start with a warm-up problem.', time: '2:01 PM' },
    { id: 2, sender: 'You', text: 'Ready! Should I start with the brute force approach?', time: '2:02 PM' }
  ])
  const [chatInput, setChatInput] = useState('')
  const [timer, setTimer] = useState(0)
  const [timerActive, setTimerActive] = useState(false)
  const [newRoom, setNewRoom] = useState({ title: '', scheduled: '' })

  useEffect(() => {
    let interval
    if (timerActive) interval = setInterval(() => setTimer(t => t + 1), 1000)
    return () => clearInterval(interval)
  }, [timerActive])

  useEffect(() => {
    let interval
    if (recording) interval = setInterval(() => setRecordingTime(t => t + 1), 1000)
    return () => clearInterval(interval)
  }, [recording])

  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

  const joinRoom = (room) => {
    setActiveRoom(room)
    setView('room')
    setTimerActive(true)
  }

  const sendChat = () => {
    if (!chatInput.trim()) return
    setChatMessages(prev => [...prev, { id: Date.now(), sender: 'You', text: chatInput, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }])
    setChatInput('')
  }

  if (view === 'lobby') return (
    <div className="min-h-screen pt-20 px-4 pb-12">
      <div className="max-w-5xl mx-auto">
        <div className="py-8 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold dark:text-white text-gray-900 flex items-center gap-3">
              <FiVideo className="text-primary-400" size={28} /> Interview Rooms
            </h1>
            <p className="dark:text-gray-400 text-gray-500 mt-1">Live technical interviews with collaborative coding</p>
          </div>
          <button onClick={() => setView('create')} className="btn-primary flex items-center gap-2">
            <FiPlus size={16} /> Schedule Room
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {MOCK_ROOMS.map(room => (
            <motion.div key={room.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="card hover:scale-[1.02] transition-transform">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold dark:text-white text-gray-900">{room.title}</h3>
                  <p className="text-sm dark:text-gray-400 text-gray-500 mt-0.5">Host: {room.host}</p>
                </div>
                <span className={`badge ${room.status === 'upcoming' ? 'badge-green' : 'badge-blue'}`}>
                  {room.status}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm dark:text-gray-400 text-gray-500 flex items-center gap-1.5">
                  <FiClock size={13} />{room.scheduled}
                </span>
                {room.status === 'upcoming' ? (
                  <button onClick={() => joinRoom(room)} className="btn-primary text-sm py-2 flex items-center gap-1.5">
                    <FiVideo size={13} /> Join Room
                  </button>
                ) : (
                  <button className="btn-secondary text-sm py-2">View Report</button>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Features info */}
        <div className="grid sm:grid-cols-3 gap-4 mt-8">
          {[
            { icon: FiVideo, title: 'WebRTC Video', desc: 'Peer-to-peer video with TURN relay fallback' },
            { icon: FiMonitor, title: 'Shared Editor', desc: 'Real-time CRDT-synced Monaco editor' },
            { icon: FiCircle, title: 'Session Recording', desc: 'Encrypted recordings stored on S3' }
          ].map(f => (
            <div key={f.title} className="card text-center">
              <f.icon className="mx-auto text-primary-400 mb-3" size={24} />
              <p className="font-semibold dark:text-white text-gray-900 mb-1">{f.title}</p>
              <p className="text-sm dark:text-gray-400 text-gray-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  if (view === 'create') return (
    <div className="min-h-screen pt-20 px-4 pb-12">
      <div className="max-w-lg mx-auto">
        <div className="py-8">
          <button onClick={() => setView('lobby')} className="text-sm text-primary-400 hover:text-primary-300 mb-4 flex items-center gap-1">← Back</button>
          <h1 className="text-2xl font-bold dark:text-white text-gray-900">Schedule Interview Room</h1>
        </div>
        <div className="card space-y-4">
          <div>
            <label className="text-sm dark:text-gray-400 text-gray-500 mb-1 block">Room Title</label>
            <input className="input-field" placeholder="e.g. Frontend Interview Practice" value={newRoom.title}
              onChange={e => setNewRoom(p => ({ ...p, title: e.target.value }))} />
          </div>
          <div>
            <label className="text-sm dark:text-gray-400 text-gray-500 mb-1 block">Scheduled Time</label>
            <input type="datetime-local" className="input-field" value={newRoom.scheduled}
              onChange={e => setNewRoom(p => ({ ...p, scheduled: e.target.value }))} />
          </div>
          <div>
            <label className="text-sm dark:text-gray-400 text-gray-500 mb-1 block">Invite Interviewer (email)</label>
            <input className="input-field" placeholder="interviewer@company.com" />
          </div>
          <div className="flex gap-3">
            <button className="btn-primary flex-1" onClick={() => setView('lobby')}>Schedule Room</button>
            <button className="btn-secondary" onClick={() => setView('lobby')}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  )

  // Room view
  return (
    <div className="h-screen flex flex-col dark:bg-gray-950 bg-slate-100 pt-16">
      {/* Room Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 dark:bg-gray-900 bg-white border-b dark:border-gray-700 border-slate-200 flex-shrink-0">
        <div className="flex items-center gap-3">
          <span className="font-bold dark:text-white text-gray-900 text-sm">{activeRoom?.title}</span>
          {recording && (
            <div className="flex items-center gap-1.5 text-red-400 text-xs">
              <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
              REC {formatTime(recordingTime)}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 dark:bg-gray-800 bg-slate-100 px-2 py-1 rounded-lg text-sm">
            <FiClock size={12} className="dark:text-gray-400 text-gray-500" />
            <span className="font-mono dark:text-white text-gray-900 text-xs">{formatTime(timer)}</span>
          </div>
          <button onClick={() => setShowWhiteboard(!showWhiteboard)}
            className={`p-2 rounded-lg transition-colors ${showWhiteboard ? 'bg-primary-600 text-white' : 'dark:bg-gray-800 bg-slate-100 dark:text-gray-400 text-gray-500'}`}>
            <FiPenTool size={15} />
          </button>
          <button onClick={() => setShowChat(!showChat)}
            className={`p-2 rounded-lg transition-colors ${showChat ? 'bg-primary-600 text-white' : 'dark:bg-gray-800 bg-slate-100 dark:text-gray-400 text-gray-500'}`}>
            <FiMessageSquare size={15} />
          </button>
          <button onClick={() => setRecording(!recording)}
            className={`p-2 rounded-lg transition-colors ${recording ? 'bg-red-600 text-white' : 'dark:bg-gray-800 bg-slate-100 dark:text-gray-400 text-gray-500'}`}>
            {recording ? <FiSquare size={15} /> : <FiCircle size={15} />}
          </button>
          <button onClick={() => { setView('lobby'); setTimerActive(false) }}
            className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors">
            <FiPhone size={13} /> End
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Editor */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <Editor height="100%" language="javascript" defaultValue={STARTER_CODE} theme="vs-dark"
            options={{ fontSize: 14, minimap: { enabled: false }, scrollBeyondLastLine: false, padding: { top: 16 }, automaticLayout: true }} />
        </div>

        {/* Video feeds (PIP) */}
        <div className="absolute top-20 right-4 flex flex-col gap-2 z-10">
          {/* Interviewer (large) */}
          <div className="w-48 h-36 dark:bg-gray-800 bg-slate-200 rounded-xl overflow-hidden border-2 dark:border-gray-600 border-slate-300 flex items-center justify-center relative">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg mx-auto mb-1">P</div>
              <p className="text-xs dark:text-gray-300 text-gray-600">Priya (Interviewer)</p>
            </div>
            <div className="absolute bottom-2 left-2 flex gap-1">
              <div className="w-5 h-5 bg-green-500/80 rounded-full flex items-center justify-center"><FiMic size={10} className="text-white" /></div>
            </div>
          </div>
          {/* Self (small) */}
          <div className="w-28 h-20 dark:bg-gray-700 bg-slate-300 rounded-xl overflow-hidden border-2 dark:border-gray-500 border-slate-400 flex items-center justify-center relative self-end">
            {videoOn ? (
              <div className="text-center">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold text-sm mx-auto">Y</div>
                <p className="text-xs dark:text-gray-300 text-gray-600 mt-0.5">You</p>
              </div>
            ) : (
              <FiVideoOff className="dark:text-gray-400 text-gray-500" size={20} />
            )}
          </div>
        </div>

        {/* Controls bar */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 dark:bg-gray-900/90 bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-2xl border dark:border-gray-700 border-slate-200 shadow-xl z-10">
          <button onClick={() => setVideoOn(!videoOn)}
            className={`p-2.5 rounded-xl transition-colors ${videoOn ? 'dark:bg-gray-700 bg-slate-200' : 'bg-red-600'}`}>
            {videoOn ? <FiVideo size={16} className="dark:text-white text-gray-700" /> : <FiVideoOff size={16} className="text-white" />}
          </button>
          <button onClick={() => setMicOn(!micOn)}
            className={`p-2.5 rounded-xl transition-colors ${micOn ? 'dark:bg-gray-700 bg-slate-200' : 'bg-red-600'}`}>
            {micOn ? <FiMic size={16} className="dark:text-white text-gray-700" /> : <FiMicOff size={16} className="text-white" />}
          </button>
        </div>

        {/* Whiteboard overlay */}
        <AnimatePresence>
          {showWhiteboard && (
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              className="w-80 dark:bg-gray-900 bg-white border-l dark:border-gray-700 border-slate-200 flex flex-col flex-shrink-0">
              <div className="flex items-center justify-between p-3 border-b dark:border-gray-700 border-slate-200">
                <span className="font-semibold dark:text-white text-gray-900 text-sm">Whiteboard</span>
                <button onClick={() => setShowWhiteboard(false)}><FiX size={16} className="dark:text-gray-400 text-gray-500" /></button>
              </div>
              <div className="flex-1 dark:bg-gray-800 bg-slate-100 m-3 rounded-xl flex items-center justify-center">
                <p className="text-sm dark:text-gray-400 text-gray-500 text-center px-4">
                  🎨 Freehand whiteboard<br /><span className="text-xs">Canvas drawing enabled in production</span>
                </p>
              </div>
              <div className="p-3 flex gap-2">
                {['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ffffff'].map(c => (
                  <button key={c} className="w-6 h-6 rounded-full border-2 border-gray-600 hover:scale-110 transition-transform"
                    style={{ backgroundColor: c }} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chat panel */}
        <AnimatePresence>
          {showChat && (
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              className="w-72 dark:bg-gray-900 bg-white border-l dark:border-gray-700 border-slate-200 flex flex-col flex-shrink-0">
              <div className="flex items-center justify-between p-3 border-b dark:border-gray-700 border-slate-200">
                <span className="font-semibold dark:text-white text-gray-900 text-sm">Chat</span>
                <button onClick={() => setShowChat(false)}><FiX size={16} className="dark:text-gray-400 text-gray-500" /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {chatMessages.map(m => (
                  <div key={m.id} className={`${m.sender === 'You' ? 'text-right' : ''}`}>
                    <p className="text-xs dark:text-gray-500 text-gray-400 mb-0.5">{m.sender} · {m.time}</p>
                    <span className={`inline-block text-sm px-3 py-2 rounded-xl ${m.sender === 'You'
                      ? 'bg-gradient-to-r from-primary-600 to-accent-600 text-white'
                      : 'dark:bg-gray-800 bg-slate-100 dark:text-gray-200 text-gray-700'}`}>{m.text}</span>
                  </div>
                ))}
              </div>
              <div className="p-3 border-t dark:border-gray-700 border-slate-200 flex gap-2">
                <input className="input-field text-sm flex-1 py-2" placeholder="Message..."
                  value={chatInput} onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendChat()} />
                <button onClick={sendChat} className="btn-primary px-3 py-2 text-sm">→</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
