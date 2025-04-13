import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import { colors, spacingX, spacingY } from "@/constants/theme";
import Header from "@/components/Header";
import BackButon from "@/components/BackButon";
import Typo from "@/components/Typo";
import { verticalScale } from "@/utils/styling";
import { useAuth } from "@/context/authContext";
import { Image } from "expo-image";
import { getProfileImage } from "@/services/imageService";
import { accountOptionType } from "@/types";
import Ionicons from "@expo/vector-icons/Ionicons";

const Profile = () => {
  const { user } = useAuth();

  const accountOptions: accountOptionType[] = [
    {
      title: "Edit Profile",
      icon: <Ionicons name="person" size={24} color={colors.white} />,
      bgColor: "#6366f1",
      routeName: "/(models)/profileModel",
    },
    {
      title: "Settings",
      icon: <Ionicons name="settings" size={24} color={colors.white} />,
      bgColor: "#059669",
      // routeName: "/(models)/profileModel",
    },
    {
      title: "Privacy Policy",
      icon: <Ionicons name="bag" size={24} color={colors.white} />,
      bgColor: colors.neutral600,
      // routeName: "/(models)/profileModel",
    },
    {
      title: "Logout",
      icon: <Ionicons name="log-out" size={24} color={colors.white} />,
      bgColor: "#e11d48",
      // routeName: "/(models)/profileModel",
    },
  ];

  return (
    <ScreenWrapper>
      <View className="flex-1" style={{ paddingHorizontal: spacingX._20 }}>
        {/* Header */}
        <Header title="Profile" leftIcon={<BackButon />} />
        {/* UserInfo */}
        <View
          className="items-center gap-y-3"
          style={{ marginTop: verticalScale(30) }}
        >
          {/* UserProfile */}
          <View>
            {/* User Image */}
            <Image
              source={getProfileImage(user?.image)}
              style={{
                alignItems: "center",
                backgroundColor: colors.neutral300,
                height: verticalScale(134),
                width: verticalScale(134),
                borderRadius: 200,
              }}
              contentFit="cover"
              transition={100}
            />
          </View>
          {/* Name and Email */}
          <View className="gap-y-1 items-center">
            <Typo size={22} fontWeight={"600"} color={colors.neutral100}>
              {user?.name}
            </Typo>
            <Typo size={14} fontWeight={"400"} color={colors.neutral400}>
              {user?.email}
            </Typo>
          </View>
        </View>

        {/* Account Options */}
        <View style={{ marginTop: spacingY._35 }}>
          {accountOptions.map((item, index) => {
            return (
              <View style={{ marginBottom: spacingY._35 }}>
                <TouchableOpacity className="flex-row items-center gap-x-3">
                  {/* Icon View */}
                  <View
                    className="bg-neutral-700 items-center justify-center rounded-15"
                    style={{
                      height: verticalScale(44),
                      width: verticalScale(44),
                      backgroundColor: item.bgColor,
                    }}
                  >
                    {item.icon && item.icon}
                  </View>
                  {/* Title View */}
                  <Typo
                    size={16}
                    className="pl-2"
                    style={{ flex: 1 }}
                    fontWeight={"400"}
                  >
                    {item.title}
                  </Typo>
                  {/* Forward Icon View */}
                  <Ionicons
                    name="chevron-forward"
                    size={24}
                    color={colors.neutral350}
                  />
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default Profile;
