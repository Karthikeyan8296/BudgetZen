import { ResponseType, WalletType } from "@/types";
import { uploadFileCloudinary } from "./imageService";
import { firestore } from "@/config/firebase";
import { collection, deleteDoc, doc, setDoc } from "firebase/firestore";

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

    //todo: delete all transactions related to this wallet
    return { success: true, msg: "Wallet deleted successfully" };
  } catch (error: any) {
    console.log("Got error in deleting wallet : ", error);
    return { success: false, msg: error.message || "Could not delete wallet" };
  }
};
