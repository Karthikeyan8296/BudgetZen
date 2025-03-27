import { View, Platform, Dimensions, StatusBar } from "react-native";
import React from "react";
import { ScreenWrapperProps } from "@/types";
import { colors } from "@/constants/theme";

const { height } = Dimensions.get("window");

const ScreenWrapper = ({ style, children, className }: ScreenWrapperProps) => {
  let paddingTop = Platform.OS === "android" ? height * 0.015 : 0;
  return (
    <View
      className={className}
      style={[
        { paddingTop, flex: 1, backgroundColor: colors.neutral900 },
        style,
      ]}
    >
      <StatusBar barStyle="light-content" backgroundColor={colors.neutral900} />
      {children}
    </View>
  );
};

export default ScreenWrapper;
