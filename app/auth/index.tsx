import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
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

  // 1. STATE TOAST DINAMIS BARU
  const [toast, setToast] = useState({
    visible: false,
    message: "",
    type: "success", // 'success' atau 'error'
  });

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState({ name: "", email: "", password: "" });

  // Pake useRef untuk nge-track timer setTimeout biar aman dari memory leak
  //  PAKAI INI (Aman & Bebas Error)
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const redirectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Bersihkan semua timer kalau komponen unmount (pindah halaman)
  useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
      if (redirectTimer.current) clearTimeout(redirectTimer.current);
    };
  }, []);

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
    if (isLoading) return; // ← tambah ini

    if (!validate()) return;

    setIsLoading(true);
    // Tutup toast yang mungkin masih nyangkut sebelum mulai request baru
    setToast({ ...toast, visible: false });
    if (toastTimer.current) clearTimeout(toastTimer.current);

    try {
      if (isLogin) {
        // 2. PROSES LOGIN VIA AUTH SERVICE
        console.log("Proses Login...");
        const result = await authService.login({
          email,
          password,
          fcmToken: "dummy_fcm_123",
        });
        setIsLoading(false);

        // Munculin Toast Sukses Login
        setToast({
          visible: true,
          message: "✓ Login Berhasil! Memuat Hearth...",
          type: "success",
        });

        // Kasih jeda 1.5 detik biar user bisa baca toast-nya sebelum pindah halaman
        redirectTimer.current = setTimeout(() => {
          setToast((prev) => ({ ...prev, visible: false }));
          router.replace("/dashboard/home");
        }, 3000);
      } else {
        // 3. PROSES REGISTER VIA AUTH SERVICE
        const payload = { name, email, password, fcmToken: "dummy_fcm_123" };
        // console.log("DATA DARI FORM FE:", JSON.stringify(payload, null, 2));
        const result = await authService.register(payload);
        setIsLoading(false);

        // Munculin Toast Sukses Register
        setToast({
          visible: true,
          message: "✓ Registrasi Berhasil! Kode OTP sedang dikirim...",
          type: "success",
        });

        // Kasih jeda nunggu OTP 2.5 detik
        redirectTimer.current = setTimeout(() => {
          setToast((prev) => ({ ...prev, visible: false }));

          // ✅ Ganti loginId → userId
          const sessionId = result?.userId ?? result?.loginId ?? "";

          if (!sessionId) {
            setToast({
              visible: true,
              message: "✕ Gagal mendapat ID sesi.",
              type: "error",
            });
            return;
          }

          router.push({
            pathname: "/auth/otp",
            params: { email, loginId: sessionId }, // key tetap "loginId" biar otp.tsx tidak perlu diubah
          });
        }, 3000);
      }
    } catch (error: any) {
      // 4. PROSES ERROR (LOGIN / REGISTER) YANG SUDAH DISARING INTERCEPTOR AXIOS
      setIsLoading(false);

      // Munculin Toast Error (Merah) dengan pesan kustom dari interceptor
      setToast({
        visible: true,
        message: `✕ ${error?.message || "Terjadi kesalahan sistem."}`,
        type: "error",
      });

      // Otomatis tutup toast error setelah 3 detik
      toastTimer.current = setTimeout(() => {
        setToast((prev) => ({ ...prev, visible: false }));
      }, 3000);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* 5. UI TOAST DINAMIS */}
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
        keyboardShouldPersistTaps="handled"
      >
        <StatusBar hidden={true} />
        <View style={styles.card}>
          <AuthHeader />

          <AuthToggle
            isLogin={isLogin}
            onToggle={(val) => {
              setIsLogin(val);
              setErrors({ name: "", email: "", password: "" });
              setToast({ ...toast, visible: false }); // Sembunyiin toast kalau user pindah tab
              if (toastTimer.current) clearTimeout(toastTimer.current);
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
            {"By signing in, you agree to our "}
            <TextBold style={styles.linkText}>Terms</TextBold>
            {" and "}
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
    justifyContent: "flex-start",
    alignItems: "center",
    // 1. Menggunakan persentase agar selalu terlihat proporsional
    paddingTop: "10%",
    paddingVertical: "5%",
    paddingHorizontal: "5%",
  },
  card: {
    backgroundColor: Colors.white,
    width: "100%", // Membiarkan card mengambil lebar layar
    borderRadius: 50,
    // 2. Menggunakan persentase untuk padding internal card
    padding: "5%",
    alignItems: "center",
    elevation: 5,
  },
  footerText: {
    fontSize: 12,
    // 3. Mengganti 'top: 15' menjadi marginTop agar layout lebih stabil
    marginTop: 15,
    color: Colors.optionalAccent + "99",
    textAlign: "center",
    paddingHorizontal: "5%",
    fontFamily: "PlusJakartaSans-Medium",
    paddingBottom: 10,
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
