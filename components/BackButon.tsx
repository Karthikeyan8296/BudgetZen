import { TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { BackButtonProps } from "@/types";
import { useRouter } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { verticalScale } from "@/utils/styling";
import { colors, radius } from "@/constants/theme";

const BackButon = ({ style, iconSize = 24, className }: BackButtonProps) => {
  const router = useRouter();
  return (
    <TouchableOpacity
      className={`self-start bg-neutral-800 rounded-12 px-[16px] py-2 ${className}`}
      onPress={() => router.back()}
      style={[style]}
    >
      <FontAwesome
        name="angle-left"
        size={verticalScale(iconSize)}
        color={colors.white}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    borderRadius: radius._12,
    borderCurve: "continuous",
    height: verticalScale(52),
  },
});

export default BackButon;
