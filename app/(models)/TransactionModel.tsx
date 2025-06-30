import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  Pressable,
  Platform,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import ModalWrapper from "@/components/ModalWrapper";
import Header from "@/components/Header";
import BackButon from "@/components/BackButon";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { scale, verticalScale } from "@/utils/styling";
import Typo from "@/components/Typo";
import DateTimePicker from "@react-native-community/datetimepicker";
import { TransactionType, WalletType } from "@/types";
import Button from "@/components/Button";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import { useAuth } from "@/context/authContext";
import { useLocalSearchParams, useRouter } from "expo-router";
import ImageUpload from "@/components/ImageUpload";
import { Dropdown } from "react-native-element-dropdown";
import Ionicons from "@expo/vector-icons/Ionicons";
import { expenseCategories, transactionTypes } from "@/constants/data";
import useFetchData from "@/hooks/useFetchData";
import { orderBy, where } from "firebase/firestore";
import Input from "@/components/Input";
import {
  createOrUpdateTransaction,
  deleteTransaction,
} from "@/services/transactionService";

const TransactionModel = () => {
  const { user } = useAuth();

  //update user name and image
  const [Transaction, setTransaction] = useState<TransactionType>({
    type: "expense",
    amount: 0,
    category: "rent",
    date: new Date(),
    description: "",
    image: null,
    walletId: "",
  });

  const [loading, setLaoding] = useState(false);
  const router = useRouter();
  const [showDatePicker, setShowDatePicker] = useState(false);

  type paramType = {
    id: string;
    type: string;
    amount: string;
    category?: string;
    date: string;
    description?: string;
    image?: any;
    uid?: string;
    walletId: string;
  };

  //get old wallet data if we are editing
  const oldTransaction: paramType = useLocalSearchParams();

  useEffect(() => {
    if (oldTransaction?.id) {
      setTransaction({
        type: oldTransaction?.type,
        amount: Number(oldTransaction.amount),
        description: oldTransaction.description || "",
        category: oldTransaction.category || "",
        date: new Date(oldTransaction.date),
        walletId: oldTransaction.walletId,
        image: oldTransaction?.image,
      });
    }
  }, []);

  const onDateChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate || Transaction.date;
    setTransaction({ ...Transaction, date: currentDate });
    setShowDatePicker(Platform.OS == "ios" ? true : false);
  };

  const Submit = async () => {
    const { type, amount, description, category, date, walletId, image } =
      Transaction;

    if (!walletId || !date || !amount || (type == "expense" && !category)) {
      Toast.show({
        type: ALERT_TYPE.WARNING,
        title: "Transaction",
        textBody: "Fill All the fields",
      });
      return;
    }
    console.log("good to go");

    let transactionData: TransactionType = {
      type,
      amount,
      category,
      date,
      description,
      walletId,
      image: image ? image : null,
      uid: user?.uid,
    };

    console.log("Transaction data: ", transactionData);

    if (oldTransaction?.id) transactionData.id = oldTransaction.id;

    setLaoding(true);
    const res = await createOrUpdateTransaction(transactionData);
    setLaoding(false);
    if (res.success) {
      router.back();
    } else {
      Toast.show({
        type: ALERT_TYPE.WARNING,
        title: "Transaction",
        textBody: res.msg,
      });
    }
  };

  const onDeleteWallet = async () => {
    if (!oldTransaction?.id) return;
    setLaoding(true);
    const res = await deleteTransaction(
      oldTransaction?.id,
      oldTransaction.walletId
    );
    setLaoding(false);
    if (res.success) {
      router.back();
      Toast.show({
        type: ALERT_TYPE.SUCCESS,
        title: "Transaction",
        textBody: res.msg,
      });
    } else {
      Toast.show({
        type: ALERT_TYPE.WARNING,
        title: "Transaction",
        textBody: res.msg,
      });
    }
  };

  const showDeleteAlert = () => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this transaction?",
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

  const {
    data: walletsData,
    error: walletError,
    loading: walletLoading,
  } = useFetchData<WalletType>("wallets", [
    where("uid", "==", user?.uid),
    orderBy("created", "desc"),
  ]);

  return (
    <ModalWrapper>
      <View className="flex-1 justify-between px-5">
        <Header
          title={oldTransaction?.id ? "Edit Transaction" : "Add Transaction"}
          leftIcon={<BackButon />}
          style={{ marginBottom: spacingY._10 }}
        />

        {/* form view */}
        <ScrollView
          contentContainerStyle={{
            gap: spacingY._30,
            marginTop: spacingY._15,
            paddingBottom: spacingY._60,
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Type */}
          <View className="gap-y-3">
            <Typo size={16} fontWeight={"500"} color={colors.neutral200}>
              Type
            </Typo>
            {/* DropDown */}
            <Dropdown
              style={[styles.dropdown]}
              activeColor={colors.neutral700}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              iconStyle={styles.iconStyle}
              data={transactionTypes}
              maxHeight={300}
              labelField="label"
              valueField="value"
              itemTextStyle={styles.dropdownItemText}
              itemContainerStyle={styles.dropdownItemContainer}
              containerStyle={styles.dropDownListContainer}
              // placeholder={!isFocus ? "Select item" : "..."}
              value={Transaction.type}
              onChange={(item) => {
                setTransaction({ ...Transaction, type: item.value });
              }}
            />
            {/* <Input
              placeholder="Salary"
              value={Transaction.name}
              onChangeText={(value) => {
                setTransaction({ ...Transaction, name: value });
              }}
              containerStyle={{ marginBottom: spacingY._20 }}
            /> */}
          </View>

          {/* Wallet Items */}
          <View className="gap-y-3">
            <Typo size={16} fontWeight={"500"} color={colors.neutral200}>
              Wallet
            </Typo>
            {/* DropDown */}
            <Dropdown
              style={[styles.dropdown]}
              activeColor={colors.neutral700}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              iconStyle={styles.iconStyle}
              data={walletsData.map((wallet) => ({
                label: `${wallet?.name} ($${wallet.amount})`,
                value: wallet?.id,
              }))}
              maxHeight={300}
              labelField="label"
              valueField="value"
              itemTextStyle={styles.dropdownItemText}
              itemContainerStyle={styles.dropdownItemContainer}
              containerStyle={styles.dropDownListContainer}
              placeholder={"Select wallet"}
              value={Transaction.walletId}
              onChange={(item) => {
                setTransaction({ ...Transaction, walletId: item.value });
              }}
            />
          </View>

          {/* Expense Categories */}
          {Transaction.type == "expense" && (
            <View className="gap-y-3">
              <Typo size={16} fontWeight={"500"} color={colors.neutral200}>
                Expense Category
              </Typo>
              {/* DropDown */}
              <Dropdown
                style={[styles.dropdown]}
                activeColor={colors.neutral700}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                iconStyle={styles.iconStyle}
                data={Object.values(expenseCategories)}
                maxHeight={300}
                labelField="label"
                valueField="value"
                itemTextStyle={styles.dropdownItemText}
                itemContainerStyle={styles.dropdownItemContainer}
                containerStyle={styles.dropDownListContainer}
                placeholder={"Select category"}
                value={Transaction.category}
                onChange={(item) => {
                  setTransaction({ ...Transaction, category: item.value });
                }}
              />
            </View>
          )}

          {/* Date Categories */}
          <View className="gap-y-3">
            <Typo size={16} fontWeight={"500"} color={colors.neutral200}>
              Date
            </Typo>
            {!showDatePicker && (
              <Pressable
                style={styles.dropdown}
                onPress={() => setShowDatePicker(true)}
              >
                <Typo size={14}>
                  {(Transaction.date as Date).toLocaleDateString()}
                </Typo>
              </Pressable>
            )}
            {showDatePicker && (
              //we can style different on ios and android like this
              <View style={Platform.OS == "ios" && styles.iosDatePicker}>
                <DateTimePicker
                  themeVariant="dark"
                  value={Transaction.date as Date}
                  textColor={colors.white}
                  mode="date"
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  onChange={onDateChange}
                />
                {Platform.OS == "ios" && (
                  <TouchableOpacity
                    style={{}}
                    onPress={() => setShowDatePicker(false)}
                  >
                    <Typo size={15} fontWeight={500}>
                      Confirm
                    </Typo>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>

          {/* Amount */}
          <View className="gap-y-3">
            <Typo size={16} fontWeight={"500"} color={colors.neutral200}>
              Amount
            </Typo>
            <Input
              keyboardType="numeric"
              value={Transaction?.amount?.toString()}
              onChangeText={(value) => {
                setTransaction({
                  ...Transaction,
                  amount: Number(value.replace(/[^0-9]/g, "")),
                });
              }}
              containerStyle={{ marginBottom: spacingY._20 }}
            />
          </View>

          {/* Description */}
          <View className="gap-y-3">
            <View className="flex-row items-baseline gap-x-1">
              <Typo size={16} fontWeight={"500"} color={colors.neutral200}>
                Description
              </Typo>
              <Typo size={13} fontWeight={"500"} color={colors.neutral500}>
                (optional)
              </Typo>
            </View>
            <Input
              value={Transaction.description}
              multiline
              containerStyle={{
                flexDirection: "row",
                height: verticalScale(599),
                alignItems: "flex-start",
                paddingVertical: 15,
              }}
              onChangeText={(value) =>
                setTransaction({
                  ...Transaction,
                  description: value,
                })
              }
            />
          </View>

          {/* Receipt icon */}
          <View className="gap-y-3">
            <View className="flex-row items-baseline gap-x-1">
              <Typo size={16} fontWeight={"500"} color={colors.neutral200}>
                Receipt
              </Typo>
              <Typo size={13} fontWeight={"500"} color={colors.neutral500}>
                (optional)
              </Typo>
            </View>
            {/* image Input */}
            <ImageUpload
              file={Transaction.image}
              onSelect={(file) =>
                setTransaction({ ...Transaction, image: file })
              }
              onClear={() => setTransaction({ ...Transaction, image: null })}
              placeholder="Upload Image"
            />
          </View>
        </ScrollView>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        {oldTransaction?.id && !loading && (
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
            {oldTransaction?.id ? "Update" : "Submit"}
          </Typo>
        </Button>
      </View>
    </ModalWrapper>
  );
};

export default TransactionModel;

const styles = StyleSheet.create({
  iosDatePicker: {},
  container: {
    backgroundColor: "white",
    padding: 16,
  },
  dropdown: {
    height: verticalScale(54),
    borderColor: colors.neutral400,
    borderWidth: 1,
    borderRadius: radius._15,
    paddingHorizontal: spacingX._15,
    borderCurve: "continuous",
    justifyContent: "center",
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: "absolute",
    backgroundColor: "white",
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    color: colors.white,
  },
  dropdownItemText: {
    color: colors.white,
  },
  dropdownItemContainer: {
    borderRadius: radius._15,
    marginHorizontal: spacingX._7,
  },
  dropDownListContainer: {
    backgroundColor: colors.neutral900,
    borderRadius: radius._15,
    borderCurve: "continuous",
    paddingVertical: spacingY._7,
    top: 5,
    borderColor: colors.neutral500,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 15,
    elevation: 5,
  },
  selectedTextStyle: {
    color: colors.white,
    fontSize: verticalScale(14),
  },
  iconStyle: {
    tintColor: colors.neutral300,
    height: verticalScale(30),
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },

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
