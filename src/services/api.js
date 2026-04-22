import axios from 'axios'

const baseURL = import.meta.env.PROD 
  ? 'https://job-portal-backend-idhsiwrwi-bathula-sai-kirans-projects.vercel.app/api'
  : '/api'

const API = axios.create({ baseURL })

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
