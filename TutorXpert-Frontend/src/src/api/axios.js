// src/api/axios.js
import axios from 'axios'

const api = axios.create({
  baseURL:
    import.meta.env.MODE === 'development'
      ? 'http://localhost:10000'
      : 'https://tutorxpert-backend-9qxd.onrender.com',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
})


export default api
