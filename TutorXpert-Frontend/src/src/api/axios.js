// src/api/axios.js
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8000',  // 你 FastAPI 后端的地址
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
})

export default api
