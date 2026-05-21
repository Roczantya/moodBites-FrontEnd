// Jangan lupa import tipe datanya agar TypeScript tidak error
import { MoodSection } from "./surveystate";

export const MOOD_SECTIONS: MoodSection[] = [
  {
    key: "Sad",
    title: "Sedang SEDIH / GALAU 🌧️",
    desc: "Makanan apa yang paling kamu cari?",
  },
  {
    key: "Angry",
    title: "Sedang MARAH / KESAL 😡",
    desc: "Pengen pelampiasan makan apa?",
  },
  { key: "Happy", title: "Sedang SENANG 😄", desc: "Lagi good mood banget?" },
  { key: "Neutral", title: "Sedang BIASA SAJA 😐", desc: "Mood lagi standar?" },
];

export const FLAVORS = [
  "Manis",
  "Pedas",
  "Asin / Gurih",
  "Asam / Segar",
  "Pahit",
];

export const MENU_CATEGORIES = [
  "Nasi Ayam (Goreng / Panggang)",
  "Nasi Goreng / Nasi Gila",
  "Olahan Mie (Mie Kuah / Goreng / Yamien)",
  "Bakso Kuah",
  "Cemilan Kentang Goreng / Nugget",
  "Cemilan Gurih (Tahu / Jamur Crispy)",
  "Cemilan Manis (Pisang / Ubi / Bakara Goreng)",
  "Puding / Dessert Manis",
  "Air Mineral",
  "Es Teh / Teh Kemasan",
  "Kopi Kemasan",
  "Minuman Soda",
  "Minuman Susu / Coklat",
  "Minuman Rasa Buah",
  "Minuman Vitamin C / Asam Segar",
  "Minuman Isotonik",
];
