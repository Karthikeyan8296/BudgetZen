import { View, Text, StyleSheet } from "react-native";
import React from "react";
import Typo from "./Typo";
import { HeaderProps } from "@/types";

const Header = ({ title = "", leftIcon, rightIcon, style }: HeaderProps) => {
  return (
    <View
      style={[
        {
          width: "100%",
          alignItems: "center",
          flexDirection: "row",
        },
        style,
      ]}
    >
      {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
      {title && (
        <Typo
          size={20}
          fontWeight={"600"}
          style={{ textAlign: "center", width: leftIcon ? "80%" : "100%" }}
        >
          {title}
        </Typo>
      )}
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  leftIcon: {
    alignSelf: "flex-start",
  },
});
