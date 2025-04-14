import React from "react";
import { Stack } from "expo-router";
import { AuthProvider } from "@/context/authContext";
import { AlertNotificationRoot } from "react-native-alert-notification";

const StackLayout = () => {
  return (
    <Stack
      // initialRouteName="(auth)/welcome"
      screenOptions={{ headerShown: false }}
    >
      {/* <Stack.Screen name="(auth)/welcome" />
      <Stack.Screen name="(auth)/login" />
      <Stack.Screen name="(auth)/register" /> */}

      {/* To make it as model, we need to define in this stack */}
      <Stack.Screen
        name="(models)/profileModel"
        options={{ presentation: "modal" }}
      />
    </Stack>
  );
};

// This is the root layout for the app. It wraps the entire app in a provider
export default function RootLayout() {
  return (
    <AuthProvider>
      <AlertNotificationRoot>
        <StackLayout />
      </AlertNotificationRoot>
    </AuthProvider>
  );
}
