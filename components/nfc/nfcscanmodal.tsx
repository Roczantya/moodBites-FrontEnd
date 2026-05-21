import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors } from "../../constants/colors"; // Sesuaikan path-nya

interface NfcScanModalProps {
  visible: boolean;
  onCancel: () => void;
}

export default function NfcScanModal({ visible, onCancel }: NfcScanModalProps) {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.iconGlowOuter}>
            <MaterialCommunityIcons
              name="nfc"
              size={50}
              color={Colors.accent}
            />
          </View>

          <ActivityIndicator
            size="large"
            color={Colors.accent}
            style={{ marginTop: 20 }}
          />

          <Text style={styles.modalTitle}>Ready to Scan</Text>
          <Text style={styles.modalSubtitle}>
            Dekatkan bagian belakang HP Anda ke stiker NFC yang ada di meja.
          </Text>

          <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
            <Text style={styles.cancelButtonText}>Batal</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  iconGlowOuter: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: Colors.primary, // Pastikan ini warna abu/soft
    justifyContent: "center",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: "PlusJakartaSans-Bold",
    color: Colors.textPrimary,
    marginTop: 20,
  },
  modalSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: "center",
    marginTop: 10,
    paddingHorizontal: 20,
    lineHeight: 20,
  },
  cancelButton: {
    marginTop: 25,
    backgroundColor: Colors.secondary,
    paddingVertical: 12,
    paddingHorizontal: 60,
    borderRadius: 20,
    width: "100%",
    alignItems: "center",
  },
  cancelButtonText: {
    color: Colors.textAccent,
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 16,
  },
});
