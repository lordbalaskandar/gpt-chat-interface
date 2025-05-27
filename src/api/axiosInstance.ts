import axios from 'axios';

const baseURL = process.env['NEXT_PUBLIC_API_URL'];
const API_KEY = process.env['NEXT_PUBLIC_API_KEY']

const api = axios.create({
  baseURL,
  headers: {
    'x-api-key': API_KEY,
    'Content-Type': 'application/json',
  },
});

export default api;
