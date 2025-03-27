import { View, TouchableOpacity } from "react-native";
import React from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { verticalScale } from "@/utils/styling";
import { colors, spacingY } from "@/constants/theme";
import Button from "@/components/Button";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { useRouter } from "expo-router";

const welcome = () => {
  const router = useRouter();

  return (
    <ScreenWrapper>
      <View className="flex-1 justify-between">
        {/* header */}
        <View>
          <TouchableOpacity
            onPress={() => router.push("/(auth)/login")}
            className="flex items-end mr-6"
          >
            <Typo fontWeight={"500"}>Sign in</Typo>
          </TouchableOpacity>

          <Animated.Image
            entering={FadeIn.duration(1000)}
            source={require("@/assets/images/welcome.png")}
            className="w-full items-auto"
            resizeMode="contain"
            //responsive height
            style={{ marginTop: verticalScale(100) }}
          />
        </View>

        {/* footer */}
        <View
          className="bg-neutral-950 items-center"
          style={{
            paddingTop: verticalScale(30),
            paddingBottom: verticalScale(45),
            shadowOffset: { width: 0, height: -10 },
            elevation: 10,
            shadowColor: "white",
            shadowRadius: 15,
            shadowOpacity: 0.25,
            gap: spacingY._10,
          }}
        >
          <Animated.View
            entering={FadeInDown.duration(1400).springify().damping(12)}
            className="items-center"
          >
            <Typo size={30} fontWeight={800} style={{ textAlign: "center" }}>
              Always take control {"\n"} of your finances
            </Typo>
          </Animated.View>
          <Animated.View
            entering={FadeInDown.duration(1400)
              .delay(100)
              .springify()
              .damping(12)}
            className="items-center"
          >
            <Typo
              size={16}
              color={colors.textLight}
              style={{ textAlign: "center" }}
            >
              Finances must be arranged to set a better {"\n"} life style in
              future
            </Typo>
          </Animated.View>

          {/* Button container */}
          <Animated.View
            entering={FadeInDown.duration(1400)
              .delay(200)
              .springify()
              .damping(12)}
            className="w-full"
            style={{ paddingHorizontal: 20, marginTop: 20 }}
          >
            <Button onPress={() => router.push("/(auth)/register")}>
              <Typo size={20} color={colors.neutral900} fontWeight={"600"}>
                Get Started
              </Typo>
            </Button>
          </Animated.View>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default welcome;
