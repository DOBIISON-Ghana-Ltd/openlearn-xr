import axios from 'axios'

export const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const serverError = error.response?.data
    if (serverError && serverError.status) {
      return Promise.reject(serverError)
    }
    return Promise.reject({
      status: 'error',
      message: error.message || 'An unexpected network error occurred.',
    })
  }
)
