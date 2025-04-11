import { Image } from "react-native";
import React, { useEffect } from "react";
import "@/global.css";
import { useRouter } from "expo-router";
import ScreenWrapper from "@/components/ScreenWrapper";

//splash screen
const index = () => {
  const route = useRouter();
  // useEffect(() => {
  //   setTimeout(() => {
  //     route.push("/(auth)/welcome");
  //   }, 2000);
  // }, []);

  return (
    <ScreenWrapper className="flex-1 items-center justify-center bg-neutral-900">
      <Image
        source={require("@/assets/images/splashImage.png")}
        className="h-[20%]"
        resizeMode="contain"
      />
    </ScreenWrapper>
  );
};

export default index;
