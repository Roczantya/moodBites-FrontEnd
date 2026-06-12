import { NotificationData } from "@/components/notification/notificationitem";
import NotificationsUI from "@/components/notification/notificationsui";
import React, { useEffect, useState } from "react";

export default function NotificationsScreen() {
  // Logic: State untuk menyimpan data notifikasi
  const [notifications, setNotifications] = useState<NotificationData[]>([]);

  // Logic: Simulasi pengambilan data (fetch API)
  useEffect(() => {
    // Mock data berdasarkan gambar referensi
    const mockData: NotificationData[] = [
      {
        id: "1",
        userName: "Gabriella Spencer",
        avatarUrl:
          "https://api.dicebear.com/7.x/avataaars/png?seed=Gabriella&backgroundColor=ffb6c1",
        message: 'accepted the invitation for "Karaoke night 🎤".',
        timeAgo: "4m ago",
        type: "accepted",
        isUnread: true,
      },
      {
        id: "2",
        userName: "Kate Johnson",
        avatarUrl:
          "https://api.dicebear.com/7.x/avataaars/png?seed=Kate&backgroundColor=e6e6fa",
        message: 'invited you to join "Michael\'s birthday 🎁".',
        timeAgo: "8m ago",
        type: "invited",
        isUnread: true,
      },
    ];

    setNotifications(mockData);
  }, []);

  // Return komponen UI murni dan berikan datanya sebagai props
  return <NotificationsUI notifications={notifications} />;
}
