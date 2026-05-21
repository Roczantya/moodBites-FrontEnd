import { useState } from "react";
import { MoodKey } from "@/constants/surveystate";

// Mendefinisikan tipe data yang diperbolehkan untuk Mood

// Interface untuk struktur data Makanan
export interface FoodItem {
  id: string;
  title: string;
  desc: string;
  time: string;
  cal: string;
  image: string;
}

export const usePreferensiLogic = () => {
  const [currentMood, setCurrentMood] = useState<MoodKey>("happy");
  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const [tempMood, setTempMood] = useState<MoodKey>("happy");
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  // Data dummy makanan
  const foods: FoodItem[] = [
    {
      id: "1",
      title: "Nasi Goreng Jakarta",
      desc: "Nasi goreng, is a Southeast Asian rice dish that people usually eat it everywhere, this would be fit in your mood right now.",
      time: "15 mnt",
      cal: "up to 300-600 kkal",
      image:
        "https://via.placeholder.com/350x150/EFEFEF/999999?text=Nasi+Goreng",
    },
    {
      id: "2",
      title: "Mie Goreng Jawa",
      desc: 'Mie Goreng Jawa is a Java authentic food, this would be fit in your mood, because the spicy, the "nyemek", and if you add kerupuk.',
      time: "15-20 mnt",
      cal: "up to 400-670 kkal",
      image:
        "https://via.placeholder.com/350x150/EFEFEF/999999?text=Mie+Goreng",
    },
  ];

  const handleOpenMoodSelector = () => {
    setTempMood(currentMood);
    setModalVisible(true);
  };

  const handleCloseMoodSelector = () => {
    setModalVisible(false);
  };

  const handleApplyMood = () => {
    setCurrentMood(tempMood);
    setModalVisible(false);

    // Simulasi loading update rekomendasi
    setIsUpdating(true);
    setTimeout(() => {
      setIsUpdating(false);
    }, 1500);
  };

  return {
    currentMood,
    tempMood,
    isModalVisible,
    isUpdating,
    foods,
    setTempMood,
    handleOpenMoodSelector,
    handleCloseMoodSelector,
    handleApplyMood,
  };
};
