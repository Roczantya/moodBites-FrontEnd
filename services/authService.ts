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
  fcmToken: string;
}

const authService = {
  register: async (data: RegisterPayload) => {
    try {
      const response = await apiClient.post("/auth/register", data);

      return response.data;
    } catch (error: any) {
      throw error;
    }
  },
  login: async (data: LoginPayload) => {
    try {
      const response = await apiClient.post("/auth/login", data);
      return response.data; // Biasanya mengembalikan token (JWT) & data user
    } catch (error: any) {
      throw error;
    }
  },

  verifyOtp: async (data: VerifyOtpPayload) => {
    try {
      const response = await apiClient.post("/auth/register/verify", data);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  refreshOtp: async (userId: string) => {
    try {
      const response = await apiClient.post(`/auth/refreshOtp/${userId}`);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },
  getProfile: async () => {
    const response = await apiClient.get("/auth/profile");
    return response.data;
  },
  updateProfile: async (data: { name: string }) => {
    const response = await apiClient.patch("/auth/profile", data);
    return response.data;
  },
  logout: async () => {
    const response = await apiClient.post("/auth/logout");
    return response.data;
  },
};

export default authService;
