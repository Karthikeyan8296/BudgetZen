import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React from "react";
import Typo from "@/components/Typo";
import { signOut } from "firebase/auth";
import { auth } from "@/config/firebase";
import { useAuth } from "@/context/authContext";
import ScreenWrapper from "@/components/ScreenWrapper";
import { colors } from "@/constants/theme";
import Ionicons from "@expo/vector-icons/Ionicons";
import HomeCard from "@/components/HomeCard";
import TransactionList from "@/components/TransactionList";
import Button from "@/components/Button";
import { Icon } from "phosphor-react-native";
import { verticalScale } from "@/utils/styling";
import { useRouter } from "expo-router";
import { limit, orderBy, where } from "firebase/firestore";
import useFetchData from "@/hooks/useFetchData";
import { TransactionType, WalletType } from "@/types";

const Home = () => {
  const { user } = useAuth();
  const router = useRouter();

  const constraints = [
    where("uid", "==", user?.uid),
    orderBy("date", "desc"),
    limit(30),
  ];

  const {
    data: recenttransaction,
    error,
    loading: transactionLoading,
  } = useFetchData<TransactionType>("transaction", constraints);

  return (
    <ScreenWrapper>
      <View className="flex-1 px-5 mt-2">
        {/* Header */}
        <View className="flex-row justify-between items-center mb-3">
          <View className="gap-1">
            <Typo size={16} color={colors.neutral400}>
              Hello,
            </Typo>
            <Typo size={20} fontWeight={500}>
              {user?.name || "User"}
            </Typo>
          </View>
          <TouchableOpacity className="p-3 rounded-full bg-neutral-800">
            <Ionicons name="search" size={22} color={colors.neutral200} />
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Card */}
          <View>
            <HomeCard />
          </View>

          <TransactionList
            title="Recent Transactions"
            data={recenttransaction}
            loading={transactionLoading}
            emptyListMessage="No Transaction added yet."
          />
        </ScrollView>
        {/* Floating Action Button */}
        <Button
          style={styles.floatingButton}
          onPress={() => router.push("/(models)/TransactionModel")}
        >
          <Ionicons name="add" size={30} color={colors.black} />
        </Button>
      </View>
    </ScreenWrapper>
  );
};

export default Home;

const styles = StyleSheet.create({
  floatingButton: {
    height: verticalScale(50),
    width: verticalScale(50),
    borderRadius: 100,
    position: "absolute",
    bottom: verticalScale(30),
    right: verticalScale(30),
  },
});
