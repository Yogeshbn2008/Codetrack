import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
const API_URL = `${BASE_URL}/api/problems`
const AUTH_URL = `${BASE_URL}/api/auth`

const getAuthHeader = () => {
  const token = localStorage.getItem('token')
  return { headers: { Authorization: `Bearer ${token}` } }
}

export const getProblems = async (filters = {}) => {
  const params = new URLSearchParams(filters).toString()
  const res = await axios.get(`${API_URL}?${params}`, getAuthHeader())
  return res.data
}

export const addProblem = async (problem) => {
  const res = await axios.post(API_URL, problem, getAuthHeader())
  return res.data
}

export const updateProblem = async (id, updatedData) => {
  const res = await axios.put(`${API_URL}/${id}`, updatedData, getAuthHeader())
  return res.data
}

export const deleteProblem = async (id) => {
  await axios.delete(`${API_URL}/${id}`, getAuthHeader())
}

export const registerUser = async (userData) => {
  const res = await axios.post(`${AUTH_URL}/register`, userData)
  return res.data
}

export const loginUser = async (credentials) => {
  const res = await axios.post(`${AUTH_URL}/login`, credentials)
  return res.data
}
export const getStats = async () => {
  const res = await axios.get(`${API_URL}/stats/summary`, getAuthHeader())
  return res.data
}
export const fetchProblemMeta = async (link) => {
  const res = await axios.post(`${API_URL}/fetch-meta`, { link }, getAuthHeader())
  return res.data
}
export const markRevised = async (id) => {
  const res = await axios.patch(`${API_URL}/${id}/revise`, {}, getAuthHeader())
  return res.data
}