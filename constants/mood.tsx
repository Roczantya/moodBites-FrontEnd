// Jangan lupa import tipe datanya agar TypeScript tidak error
import { MoodSection } from "./surveystate";

export const MOOD_SECTIONS: MoodSection[] = [
  {
    key: "sad",
    title: "Sedang SEDIH / GALAU 🌧️",
    desc: "Makanan apa yang paling kamu cari?",
  },
  {
    key: "angry",
    title: "Sedang MARAH / KESAL 😡",
    desc: "Pengen pelampiasan makan apa?",
  },
  { key: "happy", title: "Sedang SENANG 😄", desc: "Lagi good mood banget?" },
  { key: "neutral", title: "Sedang BIASA SAJA 😐", desc: "Mood lagi standar?" },
];

export const FLAVORS = [
  "Manis",
  "Pedas",
  "Asin / Gurih",
  "Asam / Segar",
  "Pahit",
];

export const MENU_CATEGORIES = [
  "Nasi Goreng Merah",
  "Mie Goreng Jakarta",
  "Mie Kering / Titi",
  "Paket Ayam Geprek",
  "Paket Telur Gimbal",
  "Beef Teriyaki",
  "Beef Patty",
  "Kentang Goreng",
  "Ubi Goreng",
  "Aneka Indomie",
  "Nasi Ayam Panggang",
  "Nasi Ayam Lengkuas",
  "Mie Nyemek",
  "Nasi Goreng Jakarta",
  "Mie Bakso",
  "Mie Goreng Jawa",
  "Nasi Gila",
  "Yamien",
  "Tahu Crispy",
  "Pisang Goreng",
  "Bakso Kuah",
];
