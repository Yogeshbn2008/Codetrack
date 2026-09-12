import axios from 'axios'

const API_URL = 'http://localhost:5000/api/problems'

export const getProblems = async () => {
  const res = await axios.get(API_URL)
  return res.data
}

export const addProblem = async (problem) => {
  const res = await axios.post(API_URL, problem)
  return res.data
}

export const updateProblem = async (id, updatedData) => {
  const res = await axios.put(`${API_URL}/${id}`, updatedData)
  return res.data
}

export const deleteProblem = async (id) => {
  await axios.delete(`${API_URL}/${id}`)
}