import { router } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  FlatList,
  StatusBar,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import OnboardingItem from "@/components/onboarding/onboardingItem";
import OnboardingPagination from "@/components/onboarding/onboardpagination";
import { onboardingData } from "@/constants/onBoarding";
import { useThemeFonts } from "@/hooks/useThemeFonts";
import storageService from "@/services/storageService";

// Menahan splash screen sampai pengecekan sesi selesai
SplashScreen.preventAutoHideAsync();

export default function Index() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [checkingSession, setCheckingSession] = useState(true);

  const { width, height } = useWindowDimensions();
  const { fontsLoaded, fontError } = useThemeFonts();
  const insets = useSafeAreaInsets();

  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    const checkAppState = async () => {
      try {
        const onboardingDone = await storageService.getOnboardingDone();
        const userId = await storageService.getUserId();
        const isSurveyDone = await storageService.getSurveyDone();

        // Sembunyikan Splash Screen karena loading pengecekan data sudah selesai
        await SplashScreen.hideAsync();

        if (onboardingDone) {
          if (userId) {
            if (isSurveyDone === "true") {
              router.replace("/dashboard/home");
            } else {
              router.replace("/auth/firstsurvey");
            }
            return;
          }

          router.replace("/auth");
          return;
        }

        // Jika belum onboarding, matikan flag checking untuk merender halaman Onboarding
        setCheckingSession(false);
      } catch (error) {
        console.error("Gagal mengecek App State:", error);
        await SplashScreen.hideAsync(); // Pastikan tetap di-hide meski error
        setCheckingSession(false);
      }
    };

    if (fontsLoaded || fontError) {
      checkAppState();
    }
  }, [fontsLoaded, fontError]);

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

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems && viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index || 0);
    }
  }).current;

  const viewabilityConfig = useRef({
    viewAreaCoveragePercentThreshold: 50,
  }).current;

  const getItemLayout = (_: any, index: number) => ({
    length: width,
    offset: width * index,
    index,
  });

  if (checkingSession || (!fontsLoaded && !fontError)) return null;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar translucent={true} backgroundColor="black" />
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
    bottom: "5%",
    left: 0,
    right: 0,
    alignItems: "center",
  },
});
