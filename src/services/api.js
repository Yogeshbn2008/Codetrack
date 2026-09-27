import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://codetrack-server.onrender.com';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Request Interceptor: Attach token dynamically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor: Catch expired tokens globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login' && window.location.pathname !== '/') {
        window.location.href = '/login?expired=true';
      }
    }
    return Promise.reject(error);
  }
);

// --- API Functions ---
export const getProblems = async (filters = {}) => {
  const params = new URLSearchParams(filters).toString();
  const res = await api.get(`/api/problems?${params}`);
  return res.data;
};

export const addProblem = async (problem) => {
  const res = await api.post('/api/problems', problem);
  return res.data;
};

export const updateProblem = async (id, updatedData) => {
  const res = await api.put(`/api/problems/${id}`, updatedData);
  return res.data;
};

export const deleteProblem = async (id) => {
  await api.delete(`/api/problems/${id}`);
};

export const registerUser = async (userData) => {
  const res = await api.post('/api/auth/register', userData);
  return res.data;
};

export const loginUser = async (credentials) => {
  const res = await api.post('/api/auth/login', credentials);
  return res.data;
};

export const getStats = async () => {
  const res = await api.get('/api/problems/stats/summary');
  return res.data;
};

export const fetchProblemMeta = async (link) => {
  const res = await api.post('/api/problems/fetch-meta', { link });
  return res.data;
};

export const markRevised = async (id) => {
  const res = await api.patch(`/api/problems/${id}/revise`, {});
  return res.data;
};

export const getFilterOptions = async () => {
  const res = await api.get('/api/problems/meta/options');
  return res.data;
};

// --- Daily Goals API ---
export const getDailyGoalsOverview = async (today, tomorrow) => {
  const params = new URLSearchParams();
  if (today) params.append('today', today);
  if (tomorrow) params.append('tomorrow', tomorrow);
  const res = await api.get(`/api/goals/daily-overview?${params.toString()}`);
  return res.data;
};

export const addGoal = async (goalData) => {
  const res = await api.post('/api/goals', goalData);
  return res.data;
};

export const toggleGoal = async (id) => {
  const res = await api.patch(`/api/goals/${id}/toggle`, {});
  return res.data;
};

export const updateGoal = async (id, updatedData) => {
  const res = await api.put(`/api/goals/${id}`, updatedData);
  return res.data;
};

export const deleteGoal = async (id) => {
  const res = await api.delete(`/api/goals/${id}`);
  return res.data;
};

export const rolloverGoals = async (today) => {
  const res = await api.post('/api/goals/rollover', { today });
  return res.data;
};

export default api;