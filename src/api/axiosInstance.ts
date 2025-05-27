import axios from 'axios';

const baseURL = process.env['URL'];
const API_KEY = process.env['API_KEY']

const api = axios.create({
  baseURL,
  headers: {
    'x-api-key': API_KEY,
    'Content-Type': 'application/json',
  },
});

export default api;
