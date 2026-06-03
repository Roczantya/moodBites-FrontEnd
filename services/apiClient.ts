import axios from "axios";
import storageService from "./storageService";

const BASE_URL = "https://api.moodbites.qzz.io/api/v1";

// ─── 1. CLIENT UTAMA (Untuk API Internal Moodbites) ───
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    Accept: "application/json",
  },
});

// ─── 2. CLIENT EKSTERNAL (Untuk IP Baru) ───
// Jangan lupa di-export agar bisa dipanggil di file service
export const moodbitesExternalClient = axios.create({
  baseURL: "http://103.185.52.14:8067", // Pastikan IP sudah diganti
  timeout: 5000,
  headers: {
    Accept: "application/json", // Tambahkan header standar
  },
});

// ─── INTERCEPTORS CLIENT UTAMA ───
apiClient.interceptors.request.use(
  async (config) => {
    const token = await storageService.getToken();

    console.log("=== REQUEST ===");
    console.log("URL:", config.url);
    console.log("ISI TOKEN DI INTERCEPTOR:", token ? token : "KOSONG/NULL!");
    if (token) {
      config.headers["token"] = token;
    }

    return config;
  },
  (error) => Promise.reject(error),
);
moodbitesExternalClient.interceptors.request.use(
  async (config) => {
    const token = await storageService.getToken();

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    // Ini biar ketahuan di console URL lengkap & headernya
    console.log("=== REQUEST EXTERNAL ===");
    console.log("URL LENGKAP:", `${config.baseURL}${config.url}`);
    console.log("HASIL TOKEN:", token ? "Ada" : "Kosong");

    return config;
  },
  (error) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    let customErrorMessage =
      "Terjadi kesalahan. Mohon coba beberapa saat lagi.";
    let statusCode = 0;

    if (error.response) {
      statusCode = error.response.status;
      const backendMessage = [400, 409, 422].includes(statusCode)
        ? error.response.data?.message
        : null;

      switch (statusCode) {
        case 400:
          customErrorMessage =
            backendMessage ||
            "Data yang dikirim tidak sesuai. Coba periksa kembali.";
          break;
        case 401:
          customErrorMessage =
            "Sesi kamu telah berakhir. Silakan login kembali.";
          break;
        case 403:
          customErrorMessage = "Kamu tidak memiliki akses untuk melakukan ini.";
          break;
        case 404:
          customErrorMessage = "Data yang kamu cari tidak ditemukan.";
          break;
        case 405:
          customErrorMessage =
            "Terjadi kesalahan pada aplikasi. Coba lagi atau hubungi kami.";
          break;
        case 409:
          customErrorMessage =
            backendMessage ||
            "Data sudah terdaftar atau sedang konflik. Coba dengan data lain.";
          break;
        case 422:
          customErrorMessage =
            backendMessage || "Format data yang kamu masukkan tidak valid.";
          break;
        case 500:
        case 501:
          customErrorMessage =
            "Terjadi gangguan pada server kami. Tim kami sedang menanganinya, coba lagi nanti.";
          break;
        case 502:
        case 503:
        case 504:
          customErrorMessage =
            "Server sedang tidak dapat dihubungi. Periksa koneksimu dan coba beberapa saat lagi.";
          break;
        default:
          customErrorMessage =
            "Terjadi kesalahan yang tidak diketahui. Coba lagi.";
      }
    } else if (error.request) {
      customErrorMessage =
        "Gagal terhubung ke server. Periksa koneksi internetmu.";
    } else if (error.code === "ECONNABORTED") {
      customErrorMessage =
        "Koneksi terlalu lama. Periksa koneksimu dan coba lagi.";
    }

    return Promise.reject({
      message: customErrorMessage,
      statusCode,
      originalError: error,
    });
  },
);

// Export apiClient sebagai default
export default apiClient;
