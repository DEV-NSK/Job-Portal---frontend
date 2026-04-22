import axios from 'axios'

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL })

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

API.interceptors.response.use(
  (res) => res,
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
  delete: (id) => API.delete(`/jobs/${id}`)
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
  getApplications: () => API.get('/employer/applications')
}

export const adminAPI = {
  getStats: () => API.get('/admin/stats'),
  getUsers: () => API.get('/admin/users'),
  deleteUser: (id) => API.delete(`/admin/users/${id}`),
  getJobs: () => API.get('/admin/jobs'),
  getPosts: () => API.get('/admin/posts'),
  deletePost: (id) => API.delete(`/admin/post/${id}`)
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
