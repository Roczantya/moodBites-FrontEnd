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

// 1. Interceptor untuk Request (Pasang Token)
apiClient.interceptors.request.use(
  async (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// 2. 🔥 DI SINI TEMPAT PASANG SWITCH ERROR-NYA (Response Interceptor)
apiClient.interceptors.response.use(
  (response) => {
    // Jika request sukses (status 200-299), langsung teruskan datanya
    return response;
  },
  (error) => {
    // Jika request gagal, kita saring kodenya di sini
    let customErrorMessage =
      "Terjadi kesalahan sistem. Mohon coba beberapa saat lagi.";

    if (error.response) {
      const status = error.response.status;
      const backendMessage = error.response.data?.message;

      switch (status) {
        case 400:
          customErrorMessage =
            backendMessage ||
            "Permintaan tidak valid. Periksa kembali data kamu.";
          break;
        case 401:
          customErrorMessage = "Sesi kamu telah berakhir. Yuk, login ulang.";
          // TENTATIVE: Kamu bisa panggil fungsi logout global di sini jika perlu
          break;
        case 403:
          customErrorMessage =
            "Kamu tidak memiliki akses untuk menu atau tindakan ini.";
          break;
        case 404:
          customErrorMessage =
            "Wah, data atau halaman yang kamu cari tidak ditemukan.";
          break;
        case 422:
          customErrorMessage =
            backendMessage || "Format data yang kamu masukkan salah.";
          break;
        case 500:
          customErrorMessage =
            "Server kami sedang mengalami kendala internal. Tunggu sebentar ya.";
          break;
        case 502:
        case 503:
        case 504:
          customErrorMessage =
            "Koneksi ke server gagal atau drop. Server kami mungkin sedang ramai, coba lagi yuk!";
          break;
      }
    } else if (error.request) {
      // Request sudah dikirim dari HP tapi tidak ada respons sama sekali (Masalah jaringan/RTO)
      customErrorMessage =
        "Gagal terhubung ke server. Periksa kembali koneksi internetmu.";
    }

    // Bungkus pesan custom ini ke dalam object baru agar seragam saat di-catch di Screen UI
    return Promise.reject({
      message: customErrorMessage,
      originalError: error,
    });
  },
);

export default apiClient;
