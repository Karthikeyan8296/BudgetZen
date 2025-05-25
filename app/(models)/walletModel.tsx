import { View, StyleSheet, ScrollView } from "react-native";
import React, { useState } from "react";
import ModalWrapper from "@/components/ModalWrapper";
import Header from "@/components/Header";
import BackButon from "@/components/BackButon";
import { colors, spacingY } from "@/constants/theme";
import { scale } from "@/utils/styling";
import Typo from "@/components/Typo";
import Input from "@/components/Input";
import { UserDataType, WalletType } from "@/types";
import Button from "@/components/Button";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import { useAuth } from "@/context/authContext";
import { useRouter } from "expo-router";
import ImageUpload from "@/components/ImageUpload";
import { createOrUpdateWallet } from "@/services/walletService";

const walletModel = () => {
  const { user, updateUserData } = useAuth();

  //update user name and image
  const [wallet, setWallet] = useState<WalletType>({
    name: "",
    image: null,
  });

  const [loading, setLaoding] = useState(false);
  const router = useRouter();

  const Submit = async () => {
    let { name, image } = wallet;

    //we need name as well as image
    if (!name.trim() || !image) {
      Toast.show({
        type: ALERT_TYPE.WARNING,
        title: "Wallet",
        textBody: "Please fill all the fields",
      });
      return;
    }

    const data: WalletType = {
      name,
      image,
      uid: user?.uid,
    };

    //todo: include wallet id if it is already present(update)

    setLaoding(true);
    const res = await createOrUpdateWallet(data);
    setLaoding(false);

    console.log("result : ", res);

    if (res.success) {
      router.back();
      Toast.show({
        type: ALERT_TYPE.SUCCESS,
        title: "Wallet",
        textBody: res.msg,
      });
    } else {
      Toast.show({
        type: ALERT_TYPE.WARNING,
        title: "Wallet",
        textBody: res.msg,
      });
    }
  };

  return (
    <ModalWrapper>
      <View className="flex-1 justify-between px-5">
        <Header
          title="New Wallet"
          leftIcon={<BackButon />}
          style={{ marginBottom: spacingY._10 }}
        />

        {/* form view */}
        <ScrollView
          contentContainerStyle={{ gap: spacingY._30, marginTop: spacingY._15 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Name */}
          <View className="gap-y-3">
            <Typo size={16} fontWeight={"500"} color={colors.neutral200}>
              Wallet Name
            </Typo>
            <Input
              placeholder="Salary"
              value={wallet.name}
              onChangeText={(value) => {
                setWallet({ ...wallet, name: value });
              }}
              containerStyle={{ marginBottom: spacingY._20 }}
            />
          </View>

          {/* Image */}
          <View className="gap-y-3">
            <Typo size={16} fontWeight={"500"} color={colors.neutral200}>
              Wallet Icon
            </Typo>
            {/* image Input */}
            <ImageUpload
              file={wallet.image}
              onSelect={(file) => setWallet({ ...wallet, image: file })}
              onClear={() => setWallet({ ...wallet, image: null })}
              placeholder="Upload Image"
            />
          </View>
        </ScrollView>
      </View>

      {/* Footer */}
      <View style={style.footer}>
        <Button loading={loading} onPress={Submit} style={{ flex: 1 }}>
          <Typo color="black" fontWeight={"600"}>
            Add Wallet
          </Typo>
        </Button>
      </View>
    </ModalWrapper>
  );
};

export default walletModel;

const style = StyleSheet.create({
  editIcon: {
    position: "absolute",
    bottom: spacingY._5,
    right: 118,
    backgroundColor: colors.neutral100,
    borderRadius: 100,
    padding: spacingY._7,
    elevation: 4,
    shadowColor: colors.neutral900,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  footer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: spacingY._20,
    gap: scale(12),
    paddingTop: spacingY._15,
    borderTopColor: colors.neutral700,
    marginBottom: spacingY._5,
    borderTopWidth: 1,
  },
});
