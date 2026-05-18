import apiClient from "./apiClient";

// --- 1. DEFINISIKAN INTERFACE PAYLOAD (Biar TypeScript-nya Pro) ---
export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  fcmToken: string;
}

export interface VerifyOtpPayload {
  loginId: string;
  code: string;
}

// --- 2. LOGIC SERVICE LAYER ---
const authService = {
  /**
   * Hit endpoint Register User baru
   * POST /api/v1/auth/register
   */
  register: async (data: RegisterPayload) => {
    try {
      const response = await apiClient.post("/auth/register", data);
      return response.data; // Ekspektasi balikin data termasuk loginId
    } catch (error: any) {
      // Lempar error message dari backend, kalau gak ada pake error default
      throw error.response?.data || { message: "Gagal terhubung ke server" };
    }
  },

  /**
   * Hit endpoint Verifikasi OTP
   * POST /api/v1/auth/register/verify
   */
  verifyOtp: async (data: VerifyOtpPayload) => {
    try {
      const response = await apiClient.post("/auth/register/verify", data);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: "Gagal memverifikasi OTP" };
    }
  },

  /**
   * Hit endpoint Kirim Ulang / Refresh OTP (Menggunakan Path Parameter)
   * POST /api/v1/auth/refreshOtp/{loginId}
   */
  refreshOtp: async (loginId: string) => {
    try {
      const response = await apiClient.post(`/auth/refreshOtp/${loginId}`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: "Gagal mengirim ulang OTP" };
    }
  },
};

export default authService;
