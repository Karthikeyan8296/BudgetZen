import { View, Platform, Dimensions, StatusBar } from "react-native";
import React from "react";
import { ScreenWrapperProps } from "@/types";
import { colors } from "@/constants/theme";
import { SafeAreaView } from "react-native-safe-area-context";

const { height } = Dimensions.get("window");

const ScreenWrapper = ({ style, children, className }: ScreenWrapperProps) => {
  let paddingTop = Platform.OS === "android" ? height * 0.0005 : 0;
  //examples
  let paddingTopIOS = Platform.OS === "ios" ? height * 0.06 : 50;
  let paddingTopverion1 = Platform.OS === "ios" ? height * 0.06 : 0;
  return (
    <SafeAreaView
      className={className}
      style={[
        { paddingTop, flex: 1, backgroundColor: colors.neutral900 },
        style,
      ]}
    >
      <StatusBar barStyle="light-content" backgroundColor={colors.neutral900} />
      {children}
    </SafeAreaView>
  );
};

export default ScreenWrapper;
