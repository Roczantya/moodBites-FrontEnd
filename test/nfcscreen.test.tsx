import NfcScreen from "@/app/dashboard/nfc";
import hceService from "@/services/hceService";
import storageService from "@/services/storageService";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react-native";
import React from "react";
import NfcScanModal from "../components/nfc/nfcscanmodal";
import ScanScreen from "../components/nfc/scanscreen";

// Mock services
jest.mock("@/services/hceService", () => ({
  startHCE: jest.fn(),
  stopHCE: jest.fn(),
}));

jest.mock("@/services/storageService", () => ({
  getUserId: jest.fn(),
}));

// Mock komponen yang tidak relevan
jest.mock("@/components/dashboard/header", () => {
  const { Text } = require("react-native");
  return function MockHeader({ title }: { title: string }) {
    return <Text>{title}</Text>;
  };
});

jest.mock("@/components/dashboard/bottomNavbar", () => {
  const { Text } = require("react-native");
  return function MockBottomNavbar() {
    return <Text>BottomNavbar</Text>;
  };
});

jest.mock("@/components/nfc/successscreen", () => {
  const { Text, TouchableOpacity, View } = require("react-native");
  return function MockSuccessScreen({
    profileName,
    onDone,
    onScanAgain,
  }: {
    profileName: string;
    onDone: () => void;
    onScanAgain: () => void;
  }) {
    return (
      <View>
        <Text>Success: {profileName}</Text>
        <TouchableOpacity onPress={onDone} testID="done-btn">
          <Text>Done</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onScanAgain} testID="scan-again-btn">
          <Text>Scan Again</Text>
        </TouchableOpacity>
      </View>
    );
  };
});

describe("NfcScreen", () => {
  beforeEach(() => {
    (storageService.getUserId as jest.Mock).mockResolvedValue("user-123");
    (hceService.startHCE as jest.Mock).mockResolvedValue(undefined);
    (hceService.stopHCE as jest.Mock).mockResolvedValue(undefined);
    (global.alert as jest.Mock).mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("merender Header dengan judul NFC", async () => {
    render(<NfcScreen />);
    await waitFor(() => expect(screen.getByText("NFC")).toBeTruthy());
  });

  it("merender ScanScreen sebagai default view", async () => {
    render(<NfcScreen />);
    await waitFor(() =>
      expect(screen.getByText(/Tempelkan HP ke Kiosk untuk/i)).toBeTruthy(),
    );
  });

  it("merender BottomNavbar", async () => {
    render(<NfcScreen />);
    await waitFor(() => expect(screen.getByText("BottomNavbar")).toBeTruthy());
  });

  it("memanggil storageService.getUserId dan hceService.startHCE saat mount", async () => {
    render(<NfcScreen />);
    await waitFor(() => {
      expect(storageService.getUserId).toHaveBeenCalled();
      expect(hceService.startHCE).toHaveBeenCalledWith("user-123");
    });
  });

  it("menampilkan modal NFC scan setelah HCE berhasil diaktifkan", async () => {
    render(<NfcScreen />);
    await waitFor(() => {
      expect(screen.getByText("Mendeteksi Kiosk")).toBeTruthy();
    });
  });

  it("alert ditampilkan jika userId tidak ditemukan", async () => {
    (storageService.getUserId as jest.Mock).mockResolvedValueOnce(null);

    render(<NfcScreen />);

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith("User ID tidak ditemukan");
    });
    expect(hceService.startHCE).not.toHaveBeenCalled();
  });

  it("alert ditampilkan jika hceService.startHCE gagal", async () => {
    (hceService.startHCE as jest.Mock).mockRejectedValueOnce(
      new Error("HCE error"),
    );

    render(<NfcScreen />);

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith(
        expect.stringContaining("Gagal mengaktifkan NFC"),
      );
    });
  });

  it("menutup modal dan memanggil hceService.stopHCE saat modal di-cancel", async () => {
    render(<NfcScreen />);

    await waitFor(() => {
      expect(screen.getByText("Mendeteksi Kiosk")).toBeTruthy();
    });

    await act(async () => {
      fireEvent.press(screen.getByText("Batalkan"));
    });

    await waitFor(() => {
      expect(hceService.stopHCE).toHaveBeenCalled();
    });
    await waitFor(() => {
      expect(screen.queryByText("Mendeteksi Kiosk")).toBeNull();
    });
  });
});

describe("NfcScanModal", () => {
  const defaultProps = {
    visible: true,
    onClose: jest.fn(),
    onSuccess: jest.fn(),
    userId: "user-123",
  };

  beforeEach(() => {
    (hceService.startHCE as jest.Mock).mockResolvedValue(undefined);
    (hceService.stopHCE as jest.Mock).mockResolvedValue(undefined);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("tidak merender konten saat visible=false", () => {
    render(<NfcScanModal {...defaultProps} visible={false} />);
    expect(screen.queryByText("Mendeteksi Kiosk")).toBeNull();
  });

  it("merender judul dan subtitle saat visible=true", () => {
    render(<NfcScanModal {...defaultProps} />);
    expect(screen.getByText("Mendeteksi Kiosk")).toBeTruthy();
    expect(screen.getByText(/Tempelkan bagian belakang HP kamu/i)).toBeTruthy();
  });

  it("merender tip card", () => {
    render(<NfcScanModal {...defaultProps} />);
    expect(
      screen.getByText("Pastikan layar HP menyala dan NFC aktif"),
    ).toBeTruthy();
  });

  it("merender tombol Batalkan", () => {
    render(<NfcScanModal {...defaultProps} />);
    expect(screen.getByText("Batalkan")).toBeTruthy();
  });

  it("memanggil onClose saat tombol Batalkan ditekan", async () => {
    render(<NfcScanModal {...defaultProps} />);
    await act(async () => {
      fireEvent.press(screen.getByText("Batalkan"));
    });
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it("memanggil hceService.startHCE saat modal dibuka dengan userId valid", async () => {
    render(<NfcScanModal {...defaultProps} />);
    await waitFor(() => {
      expect(hceService.startHCE).toHaveBeenCalledWith("user-123");
    });
  });

  it("memanggil hceService.stopHCE saat modal ditutup (visible=false)", async () => {
    const { rerender } = render(
      <NfcScanModal {...defaultProps} visible={true} />,
    );
    await waitFor(() => expect(hceService.startHCE).toHaveBeenCalled());

    await act(async () => {
      rerender(<NfcScanModal {...defaultProps} visible={false} />);
    });

    await waitFor(() => {
      expect(hceService.stopHCE).toHaveBeenCalled();
    });
  });

  it("tidak memanggil hceService.startHCE jika userId kosong", async () => {
    render(<NfcScanModal {...defaultProps} userId="" />);
    await waitFor(() => {
      expect(hceService.startHCE).not.toHaveBeenCalled();
    });
  });
});

describe("ScanScreen", () => {
  it("merender subtitle utama", () => {
    render(<ScanScreen />);
    expect(screen.getByText(/Tempelkan HP ke Kiosk untuk/i)).toBeTruthy();
  });

  it("merender info card 'Pastikan NFC Aktif'", () => {
    render(<ScanScreen />);
    expect(screen.getByText("Pastikan NFC Aktif")).toBeTruthy();
  });

  it("merender teks instruksi NFC", () => {
    render(<ScanScreen />);
    expect(
      screen.getByText(/Buka pengaturan perangkat dan aktifkan/i),
    ).toBeTruthy();
  });

  it("snapshot ScanScreen sesuai", () => {
    const { toJSON } = render(<ScanScreen />);
    expect(toJSON()).toMatchSnapshot();
  });
});
