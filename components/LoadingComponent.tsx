import {
  View,
  Text,
  ActivityIndicatorProps,
  ActivityIndicator,
} from "react-native";
import Typo from "./Typo";
import React from "react";
import { colors } from "@/constants/theme";

const LoadingComponent = ({
  size = "large",
  color = colors.black,
}: ActivityIndicatorProps) => {
  return (
    <View className="flex-1 flex-row items-center justify-center w-full bg-primary rounded-15">
      <ActivityIndicator size={size} color={color} />
    </View>
  );
};

export default LoadingComponent;
