export type Mood = "happy" | "sad" | "neutral" | "angry";

export interface MoodOption {
  label: string;
  value: Mood;
  emoji: string;
  color: string;
}

export interface MenuItem {
  No: number;
  "Nama Menu": string;
  Manis: number;
  Pahit: number;
  Asin: number;
  Asam: number;
  Pedas: number;
  Kategori: string;
  Tipe_Makanan_Simplified: string;
  Vendor: number;
  final_score: number;
  match_pct: number;
}

export interface CondimentCategories {
  Karbo: MenuItem[];
  Lauk: MenuItem[];
  Sayur: MenuItem[];
  Lainnya: MenuItem[];
  Minuman: MenuItem[];
}

export interface VendorData {
  vendor_id: number;
  condiment_categories: CondimentCategories;
  standalone_menus: MenuItem[];
  evaluation: {
    precision: number;
    recall: number;
    f1_score: number;
  };
}

export interface RecommendationResponse {
  metadata: {
    mood: string;
    user_id: string;
    k_limit: number;
  };
  vendors: VendorData[];
}