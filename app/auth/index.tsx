import React, { useState } from "react";
import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Colors } from "../../constants/colors";
import AuthHeader from "@/components/auth/authheader";
import AuthToggle from "../../components/auth/authtoggle";
import PrimaryButton from "../../components/Reuse/button";
import { TextBold, TextMedium, TextSemiBold } from "@/constants/customFont";
import { router } from "expo-router";

// IMPORT UI FORM YANG BARU KITA PISAH
import LoginForm from "@/components/auth/loginform";
import RegisterForm from "@/components/auth/registerform";
import authService from "@/services/authService";

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // 👇 1. STATE TOAST DINAMIS BARU
  const [toast, setToast] = useState({
    visible: false,
    message: "",
    type: "success", // 'success' atau 'error'
  });

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState({ name: "", email: "", password: "" });

  const validate = () => {
    let valid = true;
    let newErrors = { name: "", email: "", password: "" };

    if (!isLogin && name.trim().length < 2) {
      newErrors.name = "Nama minimal terdiri dari 2 karakter";
      valid = false;
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      newErrors.email = "Format email tidak valid";
      valid = false;
    }

    if (password.length < 6) {
      newErrors.password = "Password minimal harus 6 karakter";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setIsLoading(true);
    // Tutup toast yang mungkin masih nyangkut sebelum mulai request baru
    setToast({ ...toast, visible: false });

    try {
      if (isLogin) {
        // 👇 2. PROSES LOGIN
        console.log("Proses Login...");
        // Nanti buka komen ini kalau API login lu udah jadi:
        // const loginResult = await authService.login({ email, password });

        // Munculin Toast Sukses Login
        setToast({
          visible: true,
          message: "✓ Login Berhasil! Memuat Hearth...",
          type: "success",
        });

        // Kasih jeda 1.5 detik biar user bisa baca toast-nya sebelum pindah halaman
        setTimeout(() => {
          setToast((prev) => ({ ...prev, visible: false }));
          setIsLoading(false);
          router.push("/dashboard/home");
        }, 1500);
      } else {
        // 👇 3. PROSES REGISTER
        const payload = { name, email, password, fcmToken: "dummy_fcm_123" };
        const result = await authService.register(payload);

        // Munculin Toast Sukses Register
        setToast({
          visible: true,
          message: "✓ Registrasi Berhasil! Kode OTP sedang dikirim...",
          type: "success",
        });

        // Kasih jeda nunggu OTP 2.5 detik
        setTimeout(() => {
          setToast((prev) => ({ ...prev, visible: false }));
          setIsLoading(false);
          router.push({
            pathname: "/auth/otp",
            params: { email: email, loginId: result?.loginId || "" },
          });
        }, 2500);
      }
    } catch (error: any) {
      // 👇 4. PROSES ERROR (LOGIN / REGISTER)
      setIsLoading(false);

      // Munculin Toast Error (Merah)
      setToast({
        visible: true,
        message: `✕ ${error?.message || "Terjadi kesalahan sistem."}`,
        type: "error",
      });

      // Otomatis tutup toast error setelah 3 detik
      setTimeout(() => {
        setToast((prev) => ({ ...prev, visible: false }));
      }, 3000);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* 👇 5. UI TOAST DINAMIS */}
      {toast.visible && (
        <View
          style={[
            styles.toastContainer,
            {
              backgroundColor: toast.type === "success" ? "#A0D585" : "#FF9494",
            },
          ]}
        >
          <TextSemiBold
            style={[
              styles.toastText,
              {
                color: toast.type === "success" ? Colors.textAccent : "#FFFFFF",
              },
            ]}
          >
            {toast.message}
          </TextSemiBold>
        </View>
      )}

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <AuthHeader />

          <AuthToggle
            isLogin={isLogin}
            onToggle={(val) => {
              setIsLogin(val);
              setErrors({ name: "", email: "", password: "" });
              setToast({ ...toast, visible: false }); // Sembunyiin toast kalau user pindah tab
            }}
          />

          {isLogin ? (
            <LoginForm
              email={email}
              onChangeEmail={setEmail}
              password={password}
              onChangePassword={setPassword}
              errors={errors}
              isLoading={isLoading}
            />
          ) : (
            <RegisterForm
              name={name}
              onChangeName={setName}
              email={email}
              onChangeEmail={setEmail}
              password={password}
              onChangePassword={setPassword}
              errors={errors}
              isLoading={isLoading}
            />
          )}

          <PrimaryButton
            label={
              isLoading
                ? "Loading..."
                : isLogin
                  ? "Enter the Hearth"
                  : "Join the Hearth"
            }
            onPress={handleSubmit}
            disabled={isLoading}
          />

          <TextMedium style={styles.footerText}>
            By signing in, you agree to our{" "}
            <TextBold style={styles.linkText}>Terms</TextBold> and{" "}
            <TextBold style={styles.linkText}>Privacy Policy</TextBold>
          </TextMedium>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: Colors.white,
    width: "100%",
    borderRadius: 50,
    padding: 25,
    alignItems: "center",
    elevation: 5,
  },
  footerText: {
    fontSize: 12,
    top: 15,
    color: Colors.optionalAccent + "99",
    textAlign: "center",
    paddingHorizontal: 20,
    fontFamily: "PlusJakartaSans-Medium",
  },
  linkText: {
    fontSize: 12,
    color: Colors.optionalAccent,
    fontFamily: "PlusJakartaSans-Bold",
  },
  toastContainer: {
    position: "absolute",
    bottom: 30,
    left: 20,
    right: 20,
    padding: 15,
    borderRadius: 5,
    zIndex: 100,
    elevation: 10,
  },
  toastText: {
    textAlign: "center",
    fontSize: 12,
    fontFamily: "PlusJakartaSans-SemiBold",
  },
});
