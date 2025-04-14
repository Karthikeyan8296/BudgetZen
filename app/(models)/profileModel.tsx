import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import ModalWrapper from "@/components/ModalWrapper";
import Header from "@/components/Header";
import BackButon from "@/components/BackButon";
import { colors, spacingY } from "@/constants/theme";
import { Image } from "expo-image";
import { getProfileImage } from "@/services/imageService";
import { scale, verticalScale } from "@/utils/styling";
import Ionicons from "@expo/vector-icons/Ionicons";
import Typo from "@/components/Typo";
import Input from "@/components/Input";
import { UserDataType } from "@/types";
import Button from "@/components/Button";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import { useAuth } from "@/context/authContext";
import { updateUser } from "@/services/userService";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";

const profileModel = () => {
  const { user, updateUserData } = useAuth();

  //update user name and image
  const [userData, setUserData] = useState<UserDataType>({
    name: "",
    image: null,
  });

  const [loading, setLaoding] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setUserData({
      name: user?.name || "",
      image: user?.image || null,
    });
  }, [user]);

  const Submit = async () => {
    let { name, image } = userData;
    if (!name.trim()) {
      Toast.show({
        type: ALERT_TYPE.WARNING,
        title: "User",
        textBody: "Please fill all the fields",
      });
      return;
    }
    setLaoding(true);
    const res = await updateUser(user?.uid as string, userData);
    setLaoding(false);

    if (res.success) {
      //update the user and fetch
      updateUserData(user?.uid as string);
      router.back();
      Toast.show({
        type: ALERT_TYPE.SUCCESS,
        title: "User",
        textBody: res.msg,
      });
    } else {
      Toast.show({
        type: ALERT_TYPE.WARNING,
        title: "User",
        textBody: res.msg,
      });
    }
  };

  //image picker
  const onPickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsEditing: false,
      aspect: [1, 1],
      quality: 0.5,
    });

    console.log(result);

    if (!result.canceled) {
      setUserData({ ...userData, image: result.assets[0] });
    }
  };

  return (
    <ModalWrapper>
      <View className="flex-1 justify-between px-5">
        <Header
          title="Update Profile"
          leftIcon={<BackButon />}
          style={{ marginBottom: spacingY._10 }}
        />

        {/* form view */}
        <ScrollView
          contentContainerStyle={{ gap: spacingY._30, marginTop: spacingY._15 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="relative items-center">
            <Image
              style={{
                alignItems: "center",
                backgroundColor: colors.neutral300,
                height: verticalScale(134),
                width: verticalScale(134),
                borderRadius: 200,
              }}
              source={getProfileImage(userData.image)}
              contentFit="cover"
              transition={100}
            />

            <TouchableOpacity onPress={onPickImage} style={style.editIcon}>
              <Ionicons name="camera" size={20} color={colors.neutral800} />
            </TouchableOpacity>
          </View>

          {/* Name and Email */}
          <View className="gap-y-3">
            <Typo size={16} fontWeight={"500"} color={colors.neutral200}>
              Name
            </Typo>
            <Input
              placeholder="Enter your name"
              value={userData.name}
              onChangeText={(value) => {
                setUserData({ ...userData, name: value });
              }}
              containerStyle={{ marginBottom: spacingY._20 }}
            />
          </View>
        </ScrollView>
      </View>

      {/* Footer */}
      <View style={style.footer}>
        <Button loading={loading} onPress={Submit} style={{ flex: 1 }}>
          <Typo color="black" fontWeight={"600"}>
            Update
          </Typo>
        </Button>
      </View>
    </ModalWrapper>
  );
};

export default profileModel;

const style = StyleSheet.create({
  editIcon: {
    position: "absolute",
    bottom: spacingY._5,
    right: 118,
    backgroundColor: colors.neutral100,
    borderRadius: 100,
    padding: spacingY._7,
    elevation: 4,
    shadowColor: colors.neutral900,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  footer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: spacingY._20,
    gap: scale(12),
    paddingTop: spacingY._15,
    borderTopColor: colors.neutral700,
    marginBottom: spacingY._5,
    borderTopWidth: 1,
  },
});
