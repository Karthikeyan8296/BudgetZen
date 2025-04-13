import { View, Text } from "react-native";
import React from "react";
import Button from "@/components/Button";
import Typo from "@/components/Typo";
import { signOut } from "firebase/auth";
import { auth } from "@/config/firebase";
import { useAuth } from "@/context/authContext";
import ScreenWrapper from "@/components/ScreenWrapper";

const Home = () => {
  const { user } = useAuth();
  const handleLogout = async () => {
    await signOut(auth);
  };
  console.log("user: ", user);

  return (
    <ScreenWrapper>
      <Text className="text-white">Home</Text>
      <Typo color="white" fontWeight={"600"}>
        {user?.name}
      </Typo>
      <Button onPress={handleLogout}>
        <Typo color="black" fontWeight={"500"}>
          Log out
        </Typo>
      </Button>
    </ScreenWrapper>
  );
};

export default Home;
