import { View, Text, TextInput } from "react-native";
import React from "react";
import { InputProps } from "@/types";
import { colors } from "@/constants/theme";

const Input = (props: InputProps) => {
  return (
    <View
      className={`flex-row h-16 items-center justify-center border-[1px] border-neutral-400 rounded-17 px-4 gap-x-3 ${
        props.containerStyle && props.containerStyle
      }`}
    >
      {props.icon && props.icon}
      <TextInput
        className={` flex-1 text-white text-lg ${props.inputStyle}`}
        placeholderTextColor={colors.neutral400}
        ref={props.inputRef && props.inputRef}
        {...props}
      />
    </View>
  );
};

export default Input;
