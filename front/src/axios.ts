import axios from "axios";
import type { AxiosInstance } from "axios";

// Use Vite env variable for the API base URL
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const axiosInstance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 300000, // 300 seconds
  headers: {
    'Content-Type': 'application/json',
    // Add other default headers here
  },
});

// Optional: Add interceptors for request/response if needed
// axiosInstance.interceptors.request.use(
//   (config: AxiosRequestConfig) => {
//     // You can add auth tokens here
//     return config;
//   },
//   (error: AxiosError) => Promise.reject(error)
// );

// axiosInstance.interceptors.response.use(
//   (response: AxiosResponse) => response,
//   (error: AxiosError) => {
//     // Handle errors globally
//     return Promise.reject(error);
//   }
// );

export default axiosInstance;
