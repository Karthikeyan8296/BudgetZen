import { Text, TextStyle } from "react-native";
import React from "react";
import { colors } from "@/constants/theme";
import { TypoProps } from "@/types";
import { verticalScale } from "@/utils/styling";

const Typo = ({
  size,
  color = colors.text,
  fontWeight = "400",
  children,
  style,
  className,
  textProps = {}, //this will have all the text props
}: TypoProps) => {
  //text style
  const textStyle: TextStyle = {
    fontSize: size ? verticalScale(size) : verticalScale(18),
    color,
    fontWeight,
  };
  return (
    <Text className={className} style={[textStyle, style]} {...textProps}>
      {children}
    </Text>
  );
};

export default Typo;
