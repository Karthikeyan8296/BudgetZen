import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { TransactionItemProps, TransactionListType } from "@/types";
import Typo from "./Typo";
import { FlashList } from "@shopify/flash-list";
import { colors, radius, spacingY } from "@/constants/theme";
import LoadingComponent from "./LoadingComponent";
import { verticalScale } from "@/utils/styling";
import { expenseCategories, incomeCategory } from "@/constants/data";
import Animated, { FadeInDown } from "react-native-reanimated";

const TransactionList = ({
  data,
  title,
  loading,
  emptyListMessage,
}: TransactionListType) => {
  const handleClick = () => {
    //open transaction details in model
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
  let category = incomeCategory;
  // console.log(category);

  const IconComponent = category.icon;

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 80)
        .springify()
        .damping(14)}
    >
      <TouchableOpacity
        onPress={handleClick(item)}
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
            {item.description || "No description provided"}
          </Typo>
        </View>
        <View className="flex-col gap-1">
          <Typo size={14} color={colors.primary} fontWeight={500}>
            + $24
          </Typo>
          <Typo size={12} color={colors.neutral500} fontWeight={500}>
            14 Jun
          </Typo>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};
