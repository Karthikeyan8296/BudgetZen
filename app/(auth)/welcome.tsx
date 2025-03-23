import { View, Text } from "react-native";
import React from "react";
import ScreenWrapper from "@/components/ScreenWrapper";

const welcome = () => {
  return (
    <ScreenWrapper className="flex-1 items-center justify-center bg-neutral-900">
      <Text>welcome</Text>
    </ScreenWrapper>
  );
};

export default welcome;
