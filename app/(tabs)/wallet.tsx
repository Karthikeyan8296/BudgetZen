import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import React, { use } from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import Typo from "@/components/Typo";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import useFetchData from "@/hooks/useFetchData";
import { WalletType } from "@/types";
import { useAuth } from "@/context/authContext";
import { orderBy, where } from "firebase/firestore";
import LoadingComponent from "@/components/LoadingComponent";
import WalletListItem from "@/components/WalletListItem";

const Wallet = () => {
  const { user } = useAuth();

  // Fetch wallets data
  // Using a custom hook to fetch data from Firestore
  const {
    data: walletsData,
    error,
    loading,
  } = useFetchData<WalletType>("wallets", [
    where("uid", "==", user?.uid),
    orderBy("created", "desc"),
  ]);

  const getTotalBalance = () =>
    walletsData.reduce((total, item) => {
      total = total + (item.amount || 0);
      return total;
    }, 0);

  console.log("walletsData", walletsData.length);

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

          {loading && <LoadingComponent color={colors.green} />}
          <FlatList
            data={walletsData}
            renderItem={({ item, index }) => {
              return (
                <WalletListItem item={item} index={index} router={router} />
              );
            }}
            contentContainerStyle={styles.listStyle}
          />
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default Wallet;

const styles = StyleSheet.create({
  listStyle: {
    paddingVertical: spacingY._25,
    paddingTop: spacingY._15,
  },
});
