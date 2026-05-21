import axios from "axios";

const BASE_URL = "https://api.moodbites.qzz.io/api/v1";

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

apiClient.interceptors.request.use(
  async (config) => config,
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
      // Hanya ambil pesan backend untuk error yang relevan ke user (400, 409, 422)
      // Error server (5xx) jangan tampilkan pesan teknis dari backend
      const backendMessage = [400, 409, 422].includes(statusCode)
        ? error.response.data?.message
        : null;

      switch (statusCode) {
        // ─── 4xx: Kesalahan dari sisi user/client ───────────────────────────
        case 400:
          customErrorMessage =
            backendMessage ||
            "Data yang dikirim tidak sesuai. Coba periksa kembali.";
          break;

        case 401:
          // Jangan expose detail auth — cukup minta login ulang
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
          // User tidak perlu tahu soal HTTP method — tampilkan generik
          customErrorMessage =
            "Terjadi kesalahan pada aplikasi. Coba lagi atau hubungi kami.";
          break;

        case 409:
          // Conflict — biasanya email/username sudah terdaftar, pesan BE lebih spesifik
          customErrorMessage =
            backendMessage ||
            "Data sudah terdaftar atau sedang konflik. Coba dengan data lain.";
          break;

        case 422:
          customErrorMessage =
            backendMessage || "Format data yang kamu masukkan tidak valid.";
          break;

        // ─── 5xx: Kesalahan server — user tidak perlu tahu detail teknisnya ─
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
      // Request terkirim tapi tidak ada respons sama sekali (no internet / RTO)
      customErrorMessage =
        "Gagal terhubung ke server. Periksa koneksi internetmu.";
    } else if (error.code === "ECONNABORTED") {
      // Timeout dari axios
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

export default apiClient;
