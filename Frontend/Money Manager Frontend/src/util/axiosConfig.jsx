import axios from "axios"
import {BASE_URL} from "./apiEndpoints.jsx"

const PUBLIC_ENDPOINTS = ["/login", "/register", "/activate", "/forgot-password", "/reset-password", "/status", "/health"]

const axiosConfig = axios.create({
  baseURL: BASE_URL,
  timeout: 60000, // free-tier hosts can take up to a minute to wake up
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
})

axiosConfig.interceptors.request.use((config) => {
  const isPublic = PUBLIC_ENDPOINTS.some(
      (endpoint) => config.url === endpoint || config.url?.startsWith(`${endpoint}?`),
  )
  if (!isPublic) {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

axiosConfig.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        localStorage.removeItem("token")
        if (!window.location.pathname.startsWith("/login")) {
          window.location.assign("/home")
        }
      }
      return Promise.reject(error)
    },
)

export default axiosConfig
