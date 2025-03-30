import React, { useRef, useState } from "react";
import { View, Pressable, Alert } from "react-native";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import BackButon from "@/components/BackButon";
import { colors } from "@/constants/theme";
import Input from "@/components/Input";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Button from "@/components/Button";
import { useRouter } from "expo-router";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

const Register = () => {
  const router = useRouter();

  const nameRef = useRef("");
  const emailRef = useRef("");
  const passwordRef = useRef("");

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    //validation
    if (!emailRef.current || !passwordRef.current || !nameRef.current) {
      Alert.alert("Sign up", "Please fill all the fields");
    }
    console.log("name: ", nameRef.current);
    console.log("email: ", emailRef.current);
    console.log("password: ", passwordRef.current);
    console.log("good to go");
  };

  return (
    <ScreenWrapper>
      <View className="flex-1 px-5 gap-y-6">
        <BackButon />
        <View className="gap-1 mt-5">
          <Typo size={32} fontWeight={"800"}>
            Let's,
          </Typo>
          <Typo size={32} fontWeight={"800"}>
            Get Started
          </Typo>
        </View>

        {/* Login Form */}
        <View className="gap-y-5">
          <Typo size={16} color={colors.textLight}>
            Create your account to track all your expenses
          </Typo>
          <Input
            placeholder="Enter your name"
            onChangeText={(value) => (nameRef.current = value)}
            icon={<FontAwesome5 name="user" size={22} color="white" />}
          />
          <Input
            placeholder="Enter your email"
            onChangeText={(value) => (emailRef.current = value)}
            icon={<Entypo name="email" size={24} color="white" />}
          />
          <Input
            placeholder="Enter your password"
            secureTextEntry
            onChangeText={(value) => (passwordRef.current = value)}
            icon={<FontAwesome name="lock" size={24} color="white" />}
          />
          <Button loading={isLoading} onPress={handleSubmit}>
            <Typo color="black" fontWeight={"700"}>
              Sign up
            </Typo>
          </Button>
        </View>

        {/* Footer */}
        <View className="flex-row items-center justify-center gap-2">
          <Typo size={14} fontWeight={"400"}>
            Already have an account?
          </Typo>
          <Pressable onPress={() => router.push("/login")}>
            <Typo size={14} fontWeight={"500"} color={colors.primary}>
              Sign in
            </Typo>
          </Pressable>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default Register;
