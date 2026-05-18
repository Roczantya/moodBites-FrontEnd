import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  useWindowDimensions,
  FlatList,
  ListRenderItem, // Ganti ScrollView jadi FlatList
} from "react-native";
import { Colors } from "../../constants/colors";
import { FOOD_DATA, FoodItem } from "../../constants/food_item";
export default function RecommendationList() {
  const { width } = useWindowDimensions();

  // Logika Kolom
  const numColumns = width > 768 ? 4 : width > 480 ? 3 : 2;
  const paddingHorizontal = 24;
  const gap = 16;

  // Hitung lebar kartu agar pas dengan gap
  const cardWidth =
    (width - paddingHorizontal * 2 - gap * (numColumns - 1)) / numColumns;

  // Komponen Header (Judul & Subtitle)
  const renderHeader = () => (
    <View>
      <View style={styles.header}>
        <Text style={styles.title}>Recommendations for{"\n"}your Mood</Text>
        <TouchableOpacity>
          <Text style={styles.viewAll}>View{"\n"}All</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.subtitle}>
        Fuel your energy with vibrant{"\n"}nutrients
      </Text>
    </View>
  );

  // Komponen Item Satuan
  const renderItem: ListRenderItem<FoodItem> = ({ item }) => (
    <View style={[styles.card, { width: cardWidth, marginBottom: gap }]}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <Text style={styles.cardTitle} numberOfLines={1}>
        {item.name}
      </Text>
      <View style={[styles.tag, { backgroundColor: item.tagColor }]}>
        <Text style={[styles.tagText, { color: item.tagTextColor }]}>
          {item.moodTag}
        </Text>
      </View>
    </View>
  );

  return (
    <FlatList
      data={FOOD_DATA}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      numColumns={numColumns}
      key={numColumns}
      ListHeaderComponent={renderHeader}
      contentContainerStyle={styles.listContent}
      columnWrapperStyle={numColumns > 1 ? { gap: gap } : null}
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 100, // Ruang untuk bottom nav
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 22,
    fontFamily: "PlusJakartaSans-ExtraBold",
    color: Colors.optionalAccent,
  },
  viewAll: {
    color: Colors.accent,
    fontSize: 14,
    fontFamily: "PlusJakartaSans-Bold",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textPrimary,
    marginTop: 8,
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#FFEDD5",
    borderRadius: 20,
    padding: 12,
  },
  image: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 100,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 14,
    fontFamily: "PlusJakartaSans-SemiBold",
    color: Colors.optionalAccent,
    marginBottom: 8,
  },
  tag: {
    alignSelf: "flex-start",
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 10,
    fontFamily: "PlusJakartaSans-Bold",
  },
});
