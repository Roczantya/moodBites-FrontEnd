import React, { useState, useEffect, useRef } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  useWindowDimensions,
  Animated,
} from "react-native";
import { router } from "expo-router";
import * as SplashScreen from "expo-splash-screen";

import storageService from "@/services/storageService";

import OnboardingItem from "@/components/onboarding/onboardingItem";
import OnboardingPagination from "@/components/onboarding/onboardpagination";
import { onboardingData } from "@/constants/onBoarding";
import { useThemeFonts } from "@/hooks/useThemeFonts";

SplashScreen.preventAutoHideAsync();

export default function Index() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [checkingSession, setCheckingSession] =
  useState(true);
  const { width, height } = useWindowDimensions();
  const { fontsLoaded, fontError } = useThemeFonts();

  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

//   useEffect(() => {

//   const checkAppState = async () => {

//     const onboardingDone =
//       await storageService.getOnboardingDone();

//     const userId =
//       await storageService.getUserId();

//     // onboarding sudah pernah
//     if (onboardingDone) {

//       // user masih login
//       if (userId) {

//         router.replace("/dashboard/home");
//         return;
//       }

//       // belum login
//       router.replace("/auth");
//       return;
//     }

//     setCheckingSession(false);
//   };

//   checkAppState();

// }, []);

  // Fungsi navigasi ke halaman berikutnya
  const handleNext = async () => {
    if (currentIndex < onboardingData.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      await storageService.saveOnboardingDone();

      router.replace("/auth");
    }
  };

  // Pastikan referensi fungsi ini statis agar tidak error
  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems && viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index || 0);
    }
  }).current;

  const viewabilityConfig = useRef({
    viewAreaCoveragePercentThreshold: 50,
  }).current;

  // WAJIB: Supaya scrollToIndex tahu lebar tiap halaman
  const getItemLayout = (_: any, index: number) => ({
    length: width,
    offset: width * index,
    index,
  });

  // if (checkingSession) return null;

  if (!fontsLoaded && !fontError) return null;

  

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={onboardingData}
        horizontal
        pagingEnabled
        bounces={false}
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false },
        )}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        getItemLayout={getItemLayout}
        renderItem={({ item, index }) => (
          // View ini dipaksa setinggi layar penuh
          <View style={{ width, height }}>
            <OnboardingItem
              {...item}
              onNext={handleNext}
              isLast={index === onboardingData.length - 1}
            />
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />

      {/* pointerEvents="box-none" agar klik tembus ke tombol di bawahnya */}
      <View style={styles.footer} pointerEvents="box-none">
        <OnboardingPagination data={onboardingData} scrollX={scrollX} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FDF6ED",
  },
  footer: {
    position: "absolute",
    bottom: 50, // Turunkan posisi sedikit
    left: 0,
    right: 0,
    alignItems: "center",
  },
});
