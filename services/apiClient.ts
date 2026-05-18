import axios from "axios";

// ⚠️ Ganti dengan URL API Backend Moodbites lu ya, Say
const BASE_URL = "https://api.moodbites.qzz.io";

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // Batas nunggu server 10 detik
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Nanti kalau udah ada token login, lu bisa pasang interceptor di sini
apiClient.interceptors.request.use(
  async (config) => {
    // Contoh: config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default apiClient;
