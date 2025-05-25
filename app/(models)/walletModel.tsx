import { View, StyleSheet, ScrollView, Alert } from "react-native";
import React, { useEffect, useState } from "react";
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
import { useLocalSearchParams, useRouter } from "expo-router";
import ImageUpload from "@/components/ImageUpload";
import { createOrUpdateWallet, deleteWallet } from "@/services/walletService";
import Ionicons from "@expo/vector-icons/Ionicons";

const walletModel = () => {
  const { user, updateUserData } = useAuth();

  //update user name and image
  const [wallet, setWallet] = useState<WalletType>({
    name: "",
    image: null,
  });

  const [loading, setLaoding] = useState(false);
  const router = useRouter();

  //get old wallet data if we are editing
  const oldWalletData: { name: string; image: string; id: string } =
    useLocalSearchParams();

  useEffect(() => {
    if (oldWalletData?.id) {
      setWallet({
        name: oldWalletData?.name,
        image: oldWalletData?.image,
      });
    }
  }, []);

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

    //wallet delete
    if (oldWalletData?.id) {
      data.id = oldWalletData?.id; // if we are editing, we need to pass the id
    }

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

  const onDeleteWallet = async () => {
    if (!oldWalletData?.id) return;
    setLaoding(true);
    const res = await deleteWallet(oldWalletData?.id);
    setLaoding(false);

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

  const showDeleteAlert = () => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this wallet? \nThis action will remove all the transactions related to the wallet",
      [
        {
          text: "Cancel",
          onPress: () => {
            console.log("cancelled delete");
          }, // Cancel button;
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => onDeleteWallet(),
          style: "destructive", // Destructive button
        },
      ]
    );
  };

  return (
    <ModalWrapper>
      <View className="flex-1 justify-between px-5">
        <Header
          title={oldWalletData?.id ? "Edit Wallet" : "Add Wallet"}
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
        {oldWalletData?.id && !loading && (
          <Button
            style={{ backgroundColor: colors.rose }}
            onPress={showDeleteAlert}
          >
            <View className="m-5">
              <Ionicons name="trash" size={24} color={colors.white} />
            </View>
          </Button>
        )}
        <Button loading={loading} onPress={Submit} style={{ flex: 1 }}>
          <Typo color="black" fontWeight={"600"}>
            {oldWalletData?.id ? "Update Wallet" : "Add Wallet"}
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
