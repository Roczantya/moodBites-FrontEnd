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

export interface LoginPayload {
  email: string;
  password: string;
  fcmToken?: string; // Opsional, tergantung apakah backend minta FCM token saat login
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
      // Interceptor di apiClient sudah membungkus error menjadi { message: "..." }
      throw error;
    }
  },

  /**
   * Hit endpoint Login User
   * POST /api/v1/auth/login
   */
  login: async (data: LoginPayload) => {
    try {
      const response = await apiClient.post("/auth/login", data);
      return response.data; // Biasanya mengembalikan token (JWT) & data user
    } catch (error: any) {
      throw error;
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
      throw error;
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
      throw error;
    }
  },
};

export default authService;
