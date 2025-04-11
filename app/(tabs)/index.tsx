import { View, Text } from "react-native";
import React from "react";
import Button from "@/components/Button";
import Typo from "@/components/Typo";
import { signOut } from "firebase/auth";
import { auth } from "@/config/firebase";
import { useAuth } from "@/context/authContext";

const Home = () => {
  const { user } = useAuth();
  const handleLogout = async () => {
    await signOut(auth);
  };
  console.log("user: ", user);

  return (
    <View>
      <Text>Home</Text>
      <Typo color="black" fontWeight={"600"}>
        {user?.name}
      </Typo>
      <Button onPress={handleLogout}>
        <Typo color="black" fontWeight={"500"}>
          Log out
        </Typo>
      </Button>
    </View>
  );
};

export default Home;
