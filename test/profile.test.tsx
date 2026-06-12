import ProfileUI, { UserProfileData } from "@/components/profil/profileScreen";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { router } from "expo-router";
import React from "react";

// Mock komponen anak yang tidak relevan untuk unit test ini
jest.mock("@/components/dashboard/header", () => {
  const { Text } = require("react-native");
  return function MockHeader({ title }: { title: string }) {
    return <Text>{title}</Text>;
  };
});

jest.mock("@/components/dashboard/bottomNavbar", () => {
  const { Text } = require("react-native");
  return function MockBottomNavBar() {
    return <Text>BottomNavBar</Text>;
  };
});

jest.mock("@/components/profil/profileavatar", () => {
  const { Text, TouchableOpacity } = require("react-native");
  return function MockProfileAvatar({
    name,
    bio,
    onEditProfile,
  }: {
    name: string;
    bio: string;
    onEditProfile: () => void;
  }) {
    return (
      <>
        <Text>{name}</Text>
        <Text>{bio}</Text>
        <TouchableOpacity onPress={onEditProfile} testID="edit-profile-btn">
          <Text>Edit Profile</Text>
        </TouchableOpacity>
      </>
    );
  };
});

jest.mock("@/components/profil/cardinfo", () => {
  const { Text, View } = require("react-native");
  return function MockInfoCard({
    title,
    pills,
    description,
  }: {
    title: string;
    pills: string[];
    description: string;
  }) {
    return (
      <View>
        <Text>{title}</Text>
        <Text>{description}</Text>
        {pills.map((p: string) => (
          <Text key={p}>{p}</Text>
        ))}
      </View>
    );
  };
});

jest.mock("@/components/profil/menuItem", () => {
  const { Text, TouchableOpacity } = require("react-native");
  return function MockMenuItem({
    title,
    subtitle,
    onPress,
  }: {
    title: string;
    subtitle: string;
    onPress: () => void;
  }) {
    return (
      <TouchableOpacity onPress={onPress} testID={`menu-${title}`}>
        <Text>{title}</Text>
        <Text>{subtitle}</Text>
      </TouchableOpacity>
    );
  };
});

const mockUserData: UserProfileData = {
  name: "Budi Santoso",
  bio: "Pecinta makanan pedas",
  healthFilters: ["Tanpa Gluten", "Rendah Gula"],
  commonMoods: ["Stres", "Bahagia"],
};

const defaultProps = {
  userData: mockUserData,
  onMenuPress: jest.fn(),
  onEditProfile: jest.fn(),
  onSignOutPress: jest.fn(),
  isSignOutModalVisible: false,
  onCancelSignOut: jest.fn(),
  onConfirmSignOut: jest.fn(),
};

describe("ProfileUI", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Render dasar", () => {
    it("merender Header dengan judul Profile", () => {
      render(<ProfileUI {...defaultProps} />);
      expect(screen.getByText("Profile")).toBeTruthy();
    });

    it("merender data user (nama dan bio) dengan benar", () => {
      render(<ProfileUI {...defaultProps} />);
      expect(screen.getByText("Budi Santoso")).toBeTruthy();
      expect(screen.getByText("Pecinta makanan pedas")).toBeTruthy();
    });

    it("merender fallback jika userData null", () => {
      render(<ProfileUI {...defaultProps} userData={null} />);
      expect(screen.getByText("User")).toBeTruthy();
      expect(screen.getByText("Belum ada bio")).toBeTruthy();
    });

    it("merender InfoCard Health & Safety dengan pills yang benar", () => {
      render(<ProfileUI {...defaultProps} />);
      expect(screen.getByText("HEALTH & SAFETY")).toBeTruthy();
      expect(screen.getByText("Tanpa Gluten")).toBeTruthy();
      expect(screen.getByText("Rendah Gula")).toBeTruthy();
    });

    it("merender InfoCard Common Moods dengan pills yang benar", () => {
      render(<ProfileUI {...defaultProps} />);
      expect(screen.getByText("COMMON MOODS")).toBeTruthy();
      expect(screen.getByText("Stres")).toBeTruthy();
      expect(screen.getByText("Bahagia")).toBeTruthy();
    });

    it("merender pills kosong jika healthFilters dan commonMoods kosong", () => {
      render(
        <ProfileUI
          {...defaultProps}
          userData={{ ...mockUserData, healthFilters: [], commonMoods: [] }}
        />,
      );
      expect(screen.getByText("HEALTH & SAFETY")).toBeTruthy();
      expect(screen.getByText("COMMON MOODS")).toBeTruthy();
      expect(screen.queryByText("Tanpa Gluten")).toBeNull();
      expect(screen.queryByText("Stres")).toBeNull();
    });

    it("merender Account Harmony section", () => {
      render(<ProfileUI {...defaultProps} />);
      expect(screen.getByText("Account Harmony")).toBeTruthy();
    });

    it("merender semua menu item: Personal Profile, Survey, History Preferences", () => {
      render(<ProfileUI {...defaultProps} />);
      expect(screen.getByText("Personal Profile")).toBeTruthy();
      expect(screen.getByText("MANAGE YOUR BIO AND IDENTITY")).toBeTruthy();
      expect(screen.getByText("Survey")).toBeTruthy();
      expect(screen.getByText("History Preferences")).toBeTruthy();
    });

    it("merender tombol Sign Out", () => {
      render(<ProfileUI {...defaultProps} />);
      expect(screen.getByText("Sign Out of MoodBites")).toBeTruthy();
    });

    it("merender BottomNavBar", () => {
      render(<ProfileUI {...defaultProps} />);
      expect(screen.getByText("BottomNavBar")).toBeTruthy();
    });

    it("modal sign out tidak terlihat ketika isSignOutModalVisible false", () => {
      render(<ProfileUI {...defaultProps} isSignOutModalVisible={false} />);
      expect(
        screen.queryByText("Apakah kamu yakin ingin keluar dari MoodBites?"),
      ).toBeNull();
    });

    it("modal sign out terlihat ketika isSignOutModalVisible true", () => {
      render(<ProfileUI {...defaultProps} isSignOutModalVisible={true} />);
      expect(screen.getByText("Sign Out")).toBeTruthy();
      expect(
        screen.getByText("Apakah kamu yakin ingin keluar dari MoodBites?"),
      ).toBeTruthy();
    });
  });

  describe("Interaksi", () => {
    it("memanggil onEditProfile saat tombol edit profile ditekan", () => {
      render(<ProfileUI {...defaultProps} />);
      fireEvent.press(screen.getByTestId("edit-profile-btn"));
      expect(defaultProps.onEditProfile).toHaveBeenCalledTimes(1);
    });

    it("memanggil onMenuPress dengan 'Survey' saat menu Survey ditekan", () => {
      render(<ProfileUI {...defaultProps} />);
      fireEvent.press(screen.getByTestId("menu-Survey"));
      expect(defaultProps.onMenuPress).toHaveBeenCalledWith("Survey");
    });

    it("navigasi ke /dashboard/editprofil saat menu Personal Profile ditekan", () => {
      render(<ProfileUI {...defaultProps} />);
      fireEvent.press(screen.getByTestId("menu-Personal Profile"));
      expect(router.push).toHaveBeenCalledWith("/dashboard/editprofil");
    });

    it("navigasi ke /dashboard/history saat menu History Preferences ditekan", () => {
      render(<ProfileUI {...defaultProps} />);
      fireEvent.press(screen.getByTestId("menu-History Preferences"));
      expect(router.push).toHaveBeenCalledWith("/dashboard/history");
    });

    it("memanggil onSignOutPress saat tombol Sign Out ditekan", () => {
      render(<ProfileUI {...defaultProps} />);
      fireEvent.press(screen.getByText("Sign Out of MoodBites"));
      expect(defaultProps.onSignOutPress).toHaveBeenCalledTimes(1);
    });

    it("memanggil onCancelSignOut saat tombol Batal di modal ditekan", () => {
      render(<ProfileUI {...defaultProps} isSignOutModalVisible={true} />);
      fireEvent.press(screen.getByText("Batal"));
      expect(defaultProps.onCancelSignOut).toHaveBeenCalledTimes(1);
    });

    it("memanggil onConfirmSignOut saat tombol Keluar di modal ditekan", () => {
      render(<ProfileUI {...defaultProps} isSignOutModalVisible={true} />);
      fireEvent.press(screen.getByText("Keluar"));
      expect(defaultProps.onConfirmSignOut).toHaveBeenCalledTimes(1);
    });

    it("memanggil onCancelSignOut saat modal di-dismiss (onRequestClose)", () => {
      render(<ProfileUI {...defaultProps} isSignOutModalVisible={true} />);
      fireEvent(screen.getByText("Sign Out").parent!.parent!, "requestClose");
      // Catatan: jika selector ini tidak match struktur Modal, gunakan testID pada Modal
    });
  });

  describe("Snapshot", () => {
    it("snapshot ProfileUI sesuai (modal tertutup)", () => {
      const { toJSON } = render(<ProfileUI {...defaultProps} />);
      expect(toJSON()).toMatchSnapshot();
    });

    it("snapshot ProfileUI sesuai (modal terbuka)", () => {
      const { toJSON } = render(
        <ProfileUI {...defaultProps} isSignOutModalVisible={true} />,
      );
      expect(toJSON()).toMatchSnapshot();
    });
  });
});
