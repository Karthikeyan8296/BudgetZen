import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import Typo from "./Typo";
import { WalletType } from "@/types";
import { Router } from "expo-router";
import { verticalScale } from "@/utils/styling";
import { colors, radius } from "@/constants/theme";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import Animated, { FadeInDown } from "react-native-reanimated";

const WalletListItem = ({
  item,
  index,
  router,
}: {
  item: WalletType;
  index: number;
  router: Router;
}) => {
  // Function to open wallet details with these details
  const openWalletDetails = () => {
    router.push({
      pathname: "/(models)/walletModel",
      params: {
        id: item?.id,
        name: item?.name,
        Image: item?.image,
      },
    });
  };
  return (
    <Animated.View
      entering={FadeInDown.delay(index * 100)
        .springify()
        .damping(14)}
    >
      <TouchableOpacity
        className="flex-row items-center mb-4"
        onPress={openWalletDetails}
      >
        <View style={styles.imageConstainer}>
          <Image
            style={{ flex: 1 }}
            source={item?.image}
            contentFit="cover"
            transition={100}
          />
        </View>
        <View className="flex-1 gap-2 ml-3">
          <Typo size={16} fontWeight="500">
            {item?.name}
          </Typo>
          <Typo size={16} color={colors.neutral400} fontWeight="400">
            ${item?.amount}
          </Typo>
        </View>
        <Ionicons name="chevron-forward" size={22} color={colors.white} />
      </TouchableOpacity>
    </Animated.View>
  );
};

export default WalletListItem;

const styles = StyleSheet.create({
  imageConstainer: {
    height: verticalScale(45),
    width: verticalScale(45),
    borderWidth: 1,
    borderColor: colors.neutral600,
    borderRadius: radius._12,
    borderCurve: "continuous",
    overflow: "hidden",
  },
});
