import React from "react";
import { Stack } from "expo-router";

const _layout = () => {
  return (
    <Stack
      initialRouteName="(auth)/login"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="(auth)/welcome" />
      <Stack.Screen name="(auth)/login" />
      <Stack.Screen name="(auth)/register" />
    </Stack>
  );
};

export default _layout;
