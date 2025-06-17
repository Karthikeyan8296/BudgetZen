import { firestore } from "@/config/firebase";
import { ResponseType, TransactionType, WalletType } from "@/types";
import { collection, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { uploadFileCloudinary } from "./imageService";

export const createOrUpdateTransaction = async (
  transactionData: Partial<TransactionType>
): Promise<ResponseType> => {
  try {
    //these data will be receving from the UI
    const { id, type, walletId, image, amount } = transactionData;
    //validation
    if (!amount || amount <= 0 || !walletId || !type) {
      return { success: false, msg: "Invalid Transaction data" };
    }

    //if we have the id, we'll update
    if (id) {
      //todo: udpate existing transaction
    } else {
      //update wallet for new transaction
      let res = await updateWalletForNewTransaction(
        walletId!,
        Number(amount!),
        type
      );
      if (!res.success) return res;
    }

    //image upload
    if (image) {
      const imageUploadRes = await uploadFileCloudinary(image, "transaction");

      if (!imageUploadRes.success) {
        return {
          success: false,
          msg: imageUploadRes.msg || "Failed to upload receipt",
        };
      }
      //if image uploaded
      transactionData.image = imageUploadRes.data;
    }

    //creating the transaction
    const transactionRef = id
      ? doc(firestore, "transaction", id)
      : doc(collection(firestore, "transaction"));

    await setDoc(transactionRef, transactionData, { merge: true });

    return {
      success: true,
      data: { ...transactionData, id: transactionRef.id },
    };
  } catch (error: any) {
    console.log("error in creating or updating the transaction", error);
    return { success: false, msg: error.message };
  }
};

//updating the wallet
const updateWalletForNewTransaction = async (
  walletId: string,
  amount: number,
  type: string
) => {
  try {
    const walletRef = doc(firestore, "wallets", walletId);
    const walletSnapshot = await getDoc(walletRef);

    if (!walletSnapshot.exists()) {
      console.log("error updating wallet for new transaction: ");
      return { success: false, msg: "wallet not fount" };
    }

    const walletData = walletSnapshot.data() as WalletType;

    if (type == "expense" && walletData.amount! - amount < 0) {
      return {
        success: false,
        msg: "Selected wallent don't have enough balance",
      };
    }

    const updateType = type == "income" ? "totalIncome" : "totalExpenses";
    const updateWalletAmount =
      type == "income"
        ? Number(walletData.amount) + amount
        : Number(walletData.amount) - amount;

    const updatedTotals =
      type == "income"
        ? Number(walletData.totalIncome) + amount
        : Number(walletData.totalExpenses) + amount;

    await updateDoc(walletRef, {
      amount: updateWalletAmount,
      [updateType]: updatedTotals,
    });

    return { success: true };
  } catch (error: any) {
    console.log("error in updating the wallet for new transaction", error);
    return { success: false, msg: error.message };
  }
};
