import { View, Text, StyleSheet, ImageBackground } from "react-native";
import React from "react";
import Typo from "./Typo";
import { colors } from "@/constants/theme";
import Ionicons from "@expo/vector-icons/Ionicons";
import useFetchData from "@/hooks/useFetchData";
import { WalletType } from "@/types";
import { useAuth } from "@/context/authContext";
import { orderBy, where } from "firebase/firestore";
import { Balloon } from "phosphor-react-native";

const HomeCard = () => {
  const { user } = useAuth();

  const {
    data: walletsData,
    error,
    loading,
  } = useFetchData<WalletType>("wallets", [
    where("uid", "==", user?.uid),
    orderBy("created", "desc"),
  ]);

  const getTotals = () => {
    return walletsData.reduce(
      (totals: any, item: WalletType) => {
        totals.balance = totals.balance + Number(item.amount);
        totals.income = totals.income + Number(item.totalIncome);
        totals.expenses = totals.expenses + Number(item.totalExpenses);
        return totals;
      },
      { balance: 0, income: 0, expenses: 0 }
    );
  };

  return (
    <ImageBackground
      source={require("@/assets/images/card.png")}
      className="w-full h-64 rounded-lg overflow-hidden"
      resizeMode="stretch"
    >
      <View className="p-5 px-6 h-[87%] w-full justify-between">
        <View>
          {/* Total Balance */}
          <View className="flex-row justify-between items-center">
            <Typo color={colors.neutral800} size={16} fontWeight={"500"}>
              Total Balance
            </Typo>
            <Ionicons
              name="ellipsis-horizontal"
              color={colors.black}
              size={25}
            />
          </View>
          <Typo color={colors.black} size={36} fontWeight={"700"}>
            ${loading ? "---" : getTotals()?.balance?.toFixed(2)}
          </Typo>
        </View>
        {/* Total expense and income */}
        <View className="flex-row justify-between items-center">
          {/* Income */}
          <View className="gap-x-2">
            <View className="flex-row items-center gap-y-2">
              <View className="gap-1 p-1">
                <Ionicons
                  name="arrow-down-circle"
                  size={24}
                  color={colors.neutral700}
                />
              </View>
              <Typo size={16} color={colors.neutral700} fontWeight={500}>
                Income
              </Typo>
            </View>
            <View className="self-center">
              <Typo size={16} color={colors.green} fontWeight={600}>
                ${loading ? "---" : getTotals()?.income?.toFixed(2)}
              </Typo>
            </View>
          </View>

          {/* Expense */}
          <View className="gap-x-2">
            <View className="flex-row items-center gap-y-2">
              <View className="gap-1 p-1">
                <Ionicons
                  name="arrow-up-circle"
                  size={24}
                  color={colors.neutral700}
                />
              </View>
              <Typo size={16} color={colors.neutral700} fontWeight={500}>
                Expense
              </Typo>
            </View>
            <View className="self-center">
              <Typo size={16} color={colors.rose} fontWeight={600}>
                ${loading ? "---" : getTotals()?.expenses?.toFixed(2)}
              </Typo>
            </View>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

export default HomeCard;
