import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
const API_URL = process.env.BACKEND_URL || 'http://localhost:5000/api';

const instance = axios.create({ baseURL: API_URL });

// attach token
instance.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('access');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default instance;
