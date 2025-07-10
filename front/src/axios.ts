import axios from "axios";
import type { AxiosInstance } from "axios";

// You can change this baseURL to match your backend API endpoint
const BASE_URL = "http://localhost:9090";

const axiosInstance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // 10 seconds
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
