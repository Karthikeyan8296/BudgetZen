import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { ImageUploadProps } from "@/types";
import Ionicons from "@expo/vector-icons/Ionicons";
import { scale, verticalScale } from "@/utils/styling";
import { colors, radius } from "@/constants/theme";
import Typo from "./Typo";
import { Image } from "expo-image";
import { getFilePath } from "@/services/imageService";
import * as ImagePicker from "expo-image-picker";

const ImageUpload = ({
  file = null,
  onSelect,
  onClear,
  containerStyle,
  imageStyle,
  placeholder = "",
}: ImageUploadProps) => {
  //pic image from the library
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsEditing: false,
      aspect: [1, 1],
      quality: 0.5,
    });

    console.log(result);

    if (!result.canceled) {
      onSelect(result.assets[0]);
    }
  };

  return (
    <View>
      {!file && (
        <TouchableOpacity
          style={[styles.inputContainer, containerStyle && containerStyle]}
          onPress={pickImage}
        >
          <Ionicons
            name={"cloud-upload-outline"}
            size={verticalScale(24)}
            color={colors.neutral200}
          />
          {placeholder && <Typo size={15}>{placeholder}</Typo>}
        </TouchableOpacity>
      )}
      {file && (
        <View style={[styles.image, imageStyle && imageStyle]}>
          <Image
            style={{ flex: 1 }}
            source={getFilePath(file)}
            contentFit="cover"
            transition={100}
          />
          <TouchableOpacity
            className="absolute right-2 top-2 items-center justify-center"
            style={{
              shadowOffset: { width: 0, height: 5 },
              shadowColor: colors.black,
              shadowOpacity: 1,
              shadowRadius: 16,
            }}
            onPress={onClear}
          >
            <Ionicons
              name={"trash"}
              size={verticalScale(26)}
              color={colors.white}
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default ImageUpload;

const styles = StyleSheet.create({
  inputContainer: {
    backgroundColor: colors.neutral700,
    borderRadius: radius._15,
    padding: 10,
    gap: 10,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    borderWidth: 1,
    borderColor: colors.neutral600,
    borderStyle: "dashed",
    height: verticalScale(54),
  },
  image: {
    width: scale(150),
    height: scale(150),
    borderRadius: radius._15,
    borderCurve: "continuous",
    overflow: "hidden",
  },
});
