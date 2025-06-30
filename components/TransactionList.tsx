import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import {
  TransactionItemProps,
  TransactionListType,
  TransactionType,
} from "@/types";
import Typo from "./Typo";
import { FlashList } from "@shopify/flash-list";
import { colors, radius, spacingY } from "@/constants/theme";
import LoadingComponent from "./LoadingComponent";
import { verticalScale } from "@/utils/styling";
import { expenseCategories, incomeCategory } from "@/constants/data";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Timestamp } from "firebase/firestore";
import { useRouter } from "expo-router";

const TransactionList = ({
  data,
  title,
  loading,
  emptyListMessage,
}: TransactionListType) => {
  const router = useRouter();
  const handleClick = (item: TransactionType) => {
    router.push({
      pathname: "/(models)/TransactionModel",
      params: {
        id: item?.id,
        type: item?.type,
        amount: item?.amount?.toString(),
        category: item?.category,
        date: (item.date as Timestamp)?.toDate()?.toISOString(),
        description: item?.description,
        image: item?.image,
        uid: item.uid,
        walletId: item?.walletId,
      },
    });
  };
  return (
    <View className="gap-5 mt-5">
      {title && (
        <Typo size={20} fontWeight={500}>
          {title}
        </Typo>
      )}
      <View className="min-h-1">
        <FlashList
          data={data}
          renderItem={({ item, index }) => (
            <TransactionItem
              item={item}
              index={index}
              handleClick={handleClick}
            />
          )}
          estimatedItemSize={60}
        />
      </View>
      {!loading && data.length === 0 && (
        <Typo
          size={15}
          color={colors.neutral400}
          style={{ textAlign: "center", marginTop: spacingY._15 }}
        >
          {emptyListMessage}
        </Typo>
      )}

      {loading && <LoadingComponent color={colors.primary} />}
    </View>
  );
};

export default TransactionList;

const TransactionItem = ({
  item,
  index,
  handleClick,
}: TransactionItemProps) => {
  let category =
    item?.type == "income" ? incomeCategory : expenseCategories[item.category!];

  const IconComponent = category.icon;

  //date util function
  const date = (item?.date as Timestamp)
    ?.toDate()
    ?.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
    });

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 80)
        .springify()
        .damping(14)}
    >
      <TouchableOpacity
        onPress={() => handleClick(item)}
        className="flex-row justify-between items-center 
      gap-3 mb-3 bg-neutral-800 p-4 rounded-2xl"
      >
        <View
          style={{
            height: verticalScale(44),
            aspectRatio: 1,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: radius._12,
            borderCurve: "continuous",
            backgroundColor: category.bgColor,
          }}
        >
          {IconComponent && (
            <IconComponent
              size={verticalScale(25)}
              weight="fill"
              color={colors.white}
            />
          )}
        </View>

        <View className="flex-1 gap-1">
          <Typo size={16} fontWeight={500} color={colors.white}>
            {category.label}
          </Typo>
          <Typo
            size={12}
            fontWeight={500}
            color={colors.neutral400}
            textProps={{ numberOfLines: 1 }}
          >
            {item?.description || "No description provided"}
          </Typo>
        </View>
        <View className="flex-col gap-1">
          <Typo
            size={14}
            color={item?.type == "income" ? colors.primary : colors.rose}
            fontWeight={500}
          >
            {`${item?.type == "income" ? "+ $" : "- $"}${item?.amount} `}
          </Typo>
          <Typo size={12} color={colors.neutral500} fontWeight={500}>
            {date}
          </Typo>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};
