import ScreenWrapper from "@/components/ScreenWrapper";
import { View } from "react-native";
import Typo from "@/components/Typo";
import React from "react";

const Register = () => {
  return (
    <ScreenWrapper>
      <View className="flex-1 space-y-28 space-x-20 gap-y-32">
        <Typo fontWeight={"500"}>Login</Typo>
      </View>
    </ScreenWrapper>
  );
};

export default Register;
