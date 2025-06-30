import { ResponseType, WalletType } from "@/types";
import { uploadFileCloudinary } from "./imageService";
import { firestore } from "@/config/firebase";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
  writeBatch,
} from "firebase/firestore";

export const createOrUpdateWallet = async (
  walletData: Partial<WalletType>
): Promise<ResponseType> => {
  try {
    let walletToSave = { ...walletData };

    //image update
    if (walletData.image) {
      const imageUploadRes = await uploadFileCloudinary(
        walletData.image,
        "wallets"
      );

      if (!imageUploadRes.success) {
        return {
          success: false,
          msg: imageUploadRes.msg || "Failed to upload wallet icon",
        };
      }
      walletToSave.image = imageUploadRes.data;
    }

    if (!walletData?.id) {
      //new wallet
      walletToSave.amount = 0;
      walletToSave.totalIncome = 0;
      walletToSave.totalExpenses = 0;
      walletToSave.created = new Date();
    }

    //check for the wallet id and then create or update
    const walletRef = walletData?.id
      ? doc(firestore, "wallets", walletData?.id)
      : doc(collection(firestore, "wallets"));

    await setDoc(walletRef, walletToSave, { merge: true }); //update only the data provided
    return {
      success: true,
      data: { ...walletToSave, id: walletRef.id },
      msg: "Wallet saved successfully",
    };
  } catch (error: any) {
    console.log("Got error in creating or updating wallet : ", error);
    return { success: false, msg: error.message || "Could not create wallet" };
  }
};

export const deleteWallet = async (walletId: string): Promise<ResponseType> => {
  try {
    const walletRef = doc(firestore, "wallets", walletId);
    await deleteDoc(walletRef);

    deleteTransactionByWalletId(walletId);
    return { success: true, msg: "Wallet deleted successfully" };
  } catch (error: any) {
    console.log("Got error in deleting wallet : ", error);
    return { success: false, msg: error.message || "Could not delete wallet" };
  }
};

export const deleteTransactionByWalletId = async (
  walletId: string
): Promise<ResponseType> => {
  try {
    let hasMoreTransaction = true;

    while (hasMoreTransaction) {
      const transactionQuery = query(
        collection(firestore, "transaction"),
        where("walletId", "==", walletId)
      );

      const transactionSnapshot = await getDocs(transactionQuery);
      if (transactionSnapshot.size == 0) {
        hasMoreTransaction = false;
        break;
      }

      const batch = writeBatch(firestore);
      transactionSnapshot.forEach((transactionDoc) => {
        batch.delete(transactionDoc.ref);
      });

      await batch.commit();
      console.log(
        `${transactionSnapshot.size} transactions deleted in this batch`
      );
    }
    return { success: true, msg: "All Transaction deleted successfully" };
  } catch (error: any) {
    console.log("Got error in deleting wallet : ", error);
    return { success: false, msg: error.message || "Could not delete wallet" };
  }
};
