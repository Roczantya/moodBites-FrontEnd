import apiClient from "./apiClient";

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
      console.log("Login response:", response.data); // Debug log
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
    try {
      const response = await apiClient.get("/auth/profile");
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },
  updateProfile: async (data: { name: string }) => {
    try {
      const response = await apiClient.patch("/auth/profile", data);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },
  checkToken: async () => {
    try {
      const response = await apiClient.get("/auth/check");
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },
  logout: async () => {
    try {
      const response = await apiClient.post("/auth/logout");
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },
};

export default authService;
