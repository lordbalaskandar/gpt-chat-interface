import axios from 'axios';

const baseURL = "https://13.43.178.119";
const API_KEY =
  "2f4bf66aabfe9daa63025902bcf73060e20c3796b053cabf7989038a8263936c";

const api = axios.create({
  baseURL, // replace with your API base URL
  headers: {
    'x-api-key': API_KEY,
    'Content-Type': 'application/json',
  },
});

export default api;
