import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import { colors, radius, spacingX } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import Typo from "@/components/Typo";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";

const Wallet = () => {
  const getTotalBalance = () => {
    return 356;
  };

  const router = useRouter();

  return (
    <ScreenWrapper style={{ backgroundColor: colors.black }}>
      <View className="flex-1 justify-between">
        {/* Balance View */}
        <View
          className="bg-black items-center justify-center"
          style={{ height: verticalScale(160) }}
        >
          <View className="items-center">
            <Typo size={45} fontWeight="500">
              ${getTotalBalance()?.toFixed(2)}
            </Typo>
            <Typo size={16} color={colors.neutral300}>
              Total balanace
            </Typo>
          </View>
        </View>

        {/* Wallets */}
        <View
          className="flex-1 bg-neutral-900"
          style={{
            borderTopRightRadius: radius._30,
            borderTopLeftRadius: radius._30,
            padding: spacingX._20,
            paddingTop: spacingX._25,
          }}
        >
          {/* Header */}
          <View className="flex-row justify-between items-center mb-3">
            <Typo size={20} fontWeight={500}>
              My Wallets
            </Typo>
            <TouchableOpacity
              onPress={() => router.push("/(models)/walletModel")}
            >
              <Ionicons
                name={"add-circle-outline"}
                size={verticalScale(24)}
                color={colors.primary}
              />
            </TouchableOpacity>
          </View>
          {/* Wallets List */}
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default Wallet;
