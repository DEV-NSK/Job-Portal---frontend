import axios from 'axios'

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL })

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Normalize objects from Django backend: add _id alias for id
const normalizeIds = (data) => {
  if (Array.isArray(data)) return data.map(normalizeIds)
  if (data && typeof data === 'object') {
    const out = {}
    for (const key of Object.keys(data)) {
      out[key] = normalizeIds(data[key])
    }
    // Add _id alias if id exists but _id doesn't
    if (out.id !== undefined && out._id === undefined) {
      out._id = String(out.id)
    }
    return out
  }
  return data
}

API.interceptors.response.use(
  (res) => {
    res.data = normalizeIds(res.data)
    return res
  },
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  getMe: () => API.get('/auth/me')
}

export const jobsAPI = {
  getAll: (params) => API.get('/jobs', { params }),
  getById: (id) => API.get(`/jobs/${id}`),
  create: (data) => API.post('/jobs', data),
  update: (id, data) => API.put(`/jobs/${id}`, data),
  delete: (id) => API.delete(`/jobs/${id}`),
  bookmark: (id) => API.post(`/jobs/${id}/bookmark`),
  unbookmark: (id) => API.delete(`/jobs/${id}/bookmark`),
  getBookmarked: () => API.get('/jobs/bookmarked')
}

export const applicationsAPI = {
  apply: (data) => API.post('/applications/apply', data),
  getUserApps: () => API.get('/applications/user'),
  getJobApps: (id) => API.get(`/applications/job/${id}`),
  updateStatus: (data) => API.put('/applications/status', data)
}

export const postsAPI = {
  getAll: (params) => API.get('/posts', { params }),
  create: (data) => API.post('/posts', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => API.delete(`/posts/${id}`),
  like: (id) => API.post(`/posts/${id}/like`),
  addComment: (id, data) => API.post(`/posts/${id}/comment`, data),
  getComments: (id) => API.get(`/posts/${id}/comments`),
  deleteComment: (id) => API.delete(`/posts/comments/${id}`)
}

export const employerAPI = {
  getJobs: () => API.get('/employer/jobs'),
  getApplications: () => API.get('/employer/applications'),
  getEmployerProfile: (employerId) => API.get(`/employer/profile/${employerId}`)
}

export const jobAPI = {
  getEmployerJobs: (employerId) => API.get(`/jobs/employer/${employerId}`)
}

export const adminAPI = {
  getStats: () => API.get('/admin/stats'),
  getUsers: () => API.get('/admin/users'),
  deleteUser: (id) => API.delete(`/admin/users/${id}`),
  getJobs: () => API.get('/admin/jobs'),
  getPosts: () => API.get('/admin/posts'),
  deletePost: (id) => API.delete(`/admin/post/${id}`)
}

export const notificationsAPI = {
  getAll: () => API.get('/notifications'),
  getUnreadCount: () => API.get('/notifications/unread-count'),
  markRead: (id) => API.put(`/notifications/${id}/read`),
  markAllRead: () => API.put('/notifications/mark-all-read'),
  delete: (id) => API.delete(`/notifications/${id}`),
  deleteAllRead: () => API.delete('/notifications/read'),
  clearAll: () => API.delete('/notifications'),
  getPendingEmployers: () => API.get('/notifications/admin/pending-employers'),
  handleEmployerApproval: (data) => API.post('/notifications/admin/employer-approval', data)
}

export const userAPI = {
  getProfile: (id) => id ? API.get(`/users/profile/${id}`) : API.get('/users/profile'),
  updateProfile: (data) => API.put('/users/profile', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  uploadResume: (data) => API.put('/users/resume', data, { headers: { 'Content-Type': 'multipart/form-data' } })
}

export default API

// ─── Feature API stubs (ready for real backend integration) ──────────────────

export const copilotAPI = {
  getReadinessScore: () => API.get('/copilot/readiness'),
  getDailyBriefing: () => API.get('/copilot/briefing'),
  getGoals: () => API.get('/copilot/goals'),
  setGoals: (data) => API.put('/copilot/goals', data),
  chat: (message) => API.post('/copilot/chat', { message }),
  getChatHistory: () => API.get('/copilot/chat/history'),
  rateResponse: (id, rating) => API.post(`/copilot/chat/${id}/rate`, { rating }),
  getScoreHistory: () => API.get('/copilot/score-history')
}

export const profileScoreAPI = {
  getScore: () => API.get('/profile-score'),
  getHistory: () => API.get('/profile-score/history'),
  getImprovements: () => API.get('/profile-score/improvements')
}

export const skillGraphAPI = {
  getGraph: () => API.get('/skill-graph'),
  getSkillDetail: (skillId) => API.get(`/skill-graph/${skillId}`)
}

export const resumeMatchAPI = {
  analyze: (data) => API.post('/resume-match/analyze', data),
  getSaved: () => API.get('/resume-match/saved'),
  updateNotes: (id, notes) => API.put(`/resume-match/${id}/notes`, { notes }),
  delete: (id) => API.delete(`/resume-match/${id}`)
}

export const consistencyAPI = {
  getHeatmap: () => API.get('/consistency/heatmap'),
  getStreak: () => API.get('/consistency/streak'),
  setGoal: (goal) => API.put('/consistency/goal', { goal })
}

export const codingAPI = {
  getDailyProblems: () => API.get('/coding/daily'),
  getProblems: (params) => API.get('/coding/problems', { params }),
  getProblem: (id) => API.get(`/coding/problems/${id}`),
  submitSolution: (id, data) => API.post(`/coding/problems/${id}/submit`, data),
  getLeaderboard: () => API.get('/coding/leaderboard'),
  getXP: () => API.get('/coding/xp'),
  getStats: () => API.get('/coding/stats')
}

export const interviewRoomAPI = {
  getRooms: () => API.get('/interview-rooms'),
  createRoom: (data) => API.post('/interview-rooms', data),
  getRoom: (id) => API.get(`/interview-rooms/${id}`),
  updateStatus: (id, status) => API.put(`/interview-rooms/${id}/status`, { status }),
  saveReport: (id, data) => API.post(`/interview-rooms/${id}/report`, data),
  sendChat: (id, text) => API.post(`/interview-rooms/${id}/chat`, { text })
}

export const codeQualityAPI = {
  analyze: (data) => API.post('/code-quality/analyze', data),
  getHistory: () => API.get('/code-quality/history')
}

export const projectsAPI = {
  getAll: (params) => API.get('/projects', { params }),
  getById: (id) => API.get(`/projects/${id}`),
  accept: (id) => API.post(`/projects/${id}/accept`),
  submit: (id, data) => API.post(`/projects/${id}/submit`, data),
  getMySubmissions: () => API.get('/projects/my-submissions'),
  create: (data) => API.post('/projects', data)
}

export const mockInterviewAPI = {
  getSessions: () => API.get('/mock-interview/sessions'),
  startSession: (data) => API.post('/mock-interview/start', data),
  submitAnswer: (sessionId, data) => API.post(`/mock-interview/${sessionId}/answer`, data),
  endSession: (sessionId) => API.post(`/mock-interview/${sessionId}/end`),
  getReport: (sessionId) => API.get(`/mock-interview/${sessionId}/report`)
}

export const learningPathAPI = {
  getPath: () => API.get('/learning-path'),
  generate: (data) => API.post('/learning-path/generate', data),
  markComplete: (weekIndex, resourceIndex) => API.put(`/learning-path/resources/${weekIndex}/${resourceIndex}/complete`)
}

export const opportunityAPI = {
  getJobs: (params) => API.get('/opportunity/jobs', { params }),
  getScore: (jobId) => API.get(`/opportunity/jobs/${jobId}/score`)
}

export const peerRoomsAPI = {
  getLobby: () => API.get('/peer-rooms'),
  createRoom: (data) => API.post('/peer-rooms', data),
  joinRoom: (id) => API.post(`/peer-rooms/${id}/join`),
  leaveRoom: (id) => API.post(`/peer-rooms/${id}/leave`),
  sendChat: (id, text) => API.post(`/peer-rooms/${id}/chat`, { text }),
  rateSession: (id, data) => API.post(`/peer-rooms/${id}/rate`, data),
  switchRole: (id, role) => API.put(`/peer-rooms/${id}/role`, { role })
}

export const reputationAPI = {
  getReputation: () => API.get('/reputation'),
  getPublicProfile: (username) => API.get(`/reputation/profile/${username}`),
  connectGitHub: (username) => API.post('/reputation/connect/github', { username }),
  connectLeetCode: (username) => API.post('/reputation/connect/leetcode', { username }),
  requestEndorsement: (data) => API.post('/reputation/endorse', data)
}

// ─── Recruiter Super Dashboard APIs (Features 11–20) ─────────────────────────

export const hiringFunnelAPI = {
  getFunnel: (jobId, params) => API.get(`/recruiter/jobs/${jobId}/funnel`, { params }),
  getStageCandidates: (jobId, stage) => API.get(`/recruiter/jobs/${jobId}/funnel/${stage}/candidates`),
  updateStage: (appId, stage) => API.patch(`/recruiter/applications/${appId}/stage`, { stage }),
  exportFunnel: (jobId) => API.get(`/recruiter/jobs/${jobId}/funnel/export`)
}

export const candidateRankingAPI = {
  getRanked: (jobId) => API.get(`/recruiter/jobs/${jobId}/applicants/ranked`),
  pin: (data) => API.post('/recruiter/pins', data),
  unpin: (jobId, candidateId) => API.delete(`/recruiter/pins/${jobId}/${candidateId}`)
}

export const autoShortlistAPI = {
  generate: (data) => API.post('/recruiter/shortlist', data),
  approve: (data) => API.post('/recruiter/shortlist/approve', data)
}

export const candidateTimelineAPI = {
  getTimeline: (appId) => API.get(`/recruiter/applications/${appId}/timeline`),
  addNote: (appId, content) => API.post(`/recruiter/applications/${appId}/timeline/note`, { content })
}

export const blindHiringAPI = {
  toggle: (jobId, enabled) => API.post(`/recruiter/jobs/${jobId}/blind-mode`, { enabled }),
  reveal: (jobId, candidateId) => API.post('/recruiter/blind/reveal', { jobId, candidateId })
}

export const skillJobAPI = {
  findMatches: (data) => API.post('/recruiter/jobs/skill-match', data),
  quickApply: (jobId) => API.post('/marketplace/quick-apply', { jobId })
}

export const jobHealthAPI = {
  getHealth: (jobId) => API.get(`/recruiter/jobs/${jobId}/health`),
  overrideTier: (jobId, data) => API.patch(`/recruiter/jobs/${jobId}/tier`, data),
  getOverview: () => API.get('/recruiter/jobs/health-overview')
}

export const talentPoolAPI = {
  getPools: () => API.get('/recruiter/talent-pools'),
  create: (data) => API.post('/recruiter/talent-pools', data),
  getMembers: (id) => API.get(`/recruiter/talent-pools/${id}/members`),
  addMember: (id, data) => API.post(`/recruiter/talent-pools/${id}/members`, data),
  removeMember: (id, candidateId) => API.delete(`/recruiter/talent-pools/${id}/members/${candidateId}`),
  deletePool: (id) => API.delete(`/recruiter/talent-pools/${id}`),
  exportPool: (id) => API.get(`/recruiter/talent-pools/${id}/export`)
}

export const microInternshipAPI = {
  getMarketplace: (params) => API.get('/marketplace/micro-internships', { params }),
  create: (data) => API.post('/marketplace/micro-internships', data),
  getMy: () => API.get('/marketplace/micro-internships/my'),
  apply: (id) => API.post(`/marketplace/micro-internships/${id}/apply`),
  accept: (id, candidateId) => API.post(`/marketplace/micro-internships/${id}/accept/${candidateId}`),
  submit: (id, data) => API.post(`/marketplace/micro-internships/${id}/submit`, data),
  getSubmissions: (id) => API.get(`/marketplace/micro-internships/${id}/submissions`),
  evaluate: (id, submissionId, data) => API.post(`/marketplace/micro-internships/${id}/evaluate/${submissionId}`, data),
  fastTrack: (id, candidateId) => API.post(`/marketplace/micro-internships/${id}/fast-track/${candidateId}`)
}
