import {
  View,
  Text,
  ActivityIndicatorProps,
  ActivityIndicator,
} from "react-native";
import React from "react";
import { colors } from "@/constants/theme";

const LoadingComponent = ({
  size = "large",
  color = colors.primary,
}: ActivityIndicatorProps) => {
  return (
    <View className="flex-1 items-center justify-center">
      <ActivityIndicator size={size} color={color} />
    </View>
  );
};

export default LoadingComponent;
