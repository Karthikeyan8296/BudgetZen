import React from "react";
import { View } from "react-native";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import BackButon from "@/components/BackButon";

const Login = () => {
  return (
    <ScreenWrapper>
      <View className="flex-row">
        <BackButon />
        <Typo fontWeight={"500"}>Login</Typo>
      </View>
    </ScreenWrapper>
  );
};

export default Login;
