import axios from 'axios';
import API_URL from '../config/api';

const api = axios.create({
  baseURL: `${API_URL}/api`,
});

export default api;
