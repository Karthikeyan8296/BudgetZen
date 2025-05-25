import { View, Text, Platform } from "react-native";
import React from "react";
import { colors, spacingY } from "@/constants/theme";
import { ModalWrapperProps } from "@/types";
import { SafeAreaView } from "react-native-safe-area-context";

const isIOS = Platform.OS === "ios";

const ModalWrapper = ({
  style,
  children,
  bg = colors.neutral900,
}: ModalWrapperProps) => {
  return (
    <SafeAreaView
      className="flex-1"
      style={[
        {
          backgroundColor: bg,
          paddingTop: isIOS ? spacingY._15 : 20,
          paddingBottom: isIOS ? spacingY._20 : 10,
        },
        style && style,
      ]}
    >
      {children}
    </SafeAreaView>
  );
};

export default ModalWrapper;
