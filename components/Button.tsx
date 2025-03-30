import { View, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { CustomButtonProps } from "@/types";
import { colors, radius } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import LoadingComponent from "./LoadingComponent";

const Button = ({
  style,
  onPress,
  loading = false,
  children,
}: CustomButtonProps) => {
  if (loading) {
    return (
      <View
        className="bg-primary rounded-15 items-center justify-center"
        style={[styles.button, style, { backgroundColor: "transparent" }]}
      >
        {/* Loading component */}
        <LoadingComponent />
      </View>
    );
  } else
    return (
      <TouchableOpacity
        onPress={onPress}
        style={[styles.button, style]}
        className="bg-primary rounded-15 items-center justify-center"
      >
        {children}
      </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    borderRadius: radius._12,
    borderCurve: "continuous",
    height: verticalScale(52),
  },
});

export default Button;
