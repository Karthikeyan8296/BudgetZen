import { firestore } from "@/config/firebase";
import { ResponseType, TransactionType, WalletType } from "@/types";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  Timestamp,
  Transaction,
  updateDoc,
  where,
} from "firebase/firestore";
import { uploadFileCloudinary } from "./imageService";
import { createOrUpdateWallet } from "./walletService";
import { transactionTypes } from "@/constants/data";
import { getLast7Days } from "@/utils/common";
import { colors } from "@/constants/theme";
import { scale } from "@/utils/styling";

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
      const oldTransactionSnapshot = await getDoc(
        doc(firestore, "transaction", id)
      );
      const oldTransaction = oldTransactionSnapshot.data() as TransactionType;
      const shouldRevertOrignal =
        oldTransaction.type != type ||
        oldTransaction.amount != amount ||
        oldTransaction.walletId != walletId;
      if (shouldRevertOrignal) {
        let res = await revertAndUpdateWallet(
          oldTransaction,
          Number(amount),
          type,
          walletId
        );
        if (!res.success) return res;
      }
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

const revertAndUpdateWallet = async (
  oldTransaction: TransactionType,
  newTransactionAmount: number,
  newTransactionType: string,
  newWalletId: string
) => {
  try {
    const orignalWalletSnapshot = await getDoc(
      doc(firestore, "wallets", oldTransaction.walletId)
    );

    const orignalWallet = orignalWalletSnapshot.data() as WalletType;

    let newWalletSnapshot = await getDoc(
      doc(firestore, "wallets", newWalletId)
    );

    let newWallet = newWalletSnapshot.data() as WalletType;

    const revertType =
      oldTransaction.type == "income" ? "totalIncome" : "totalExpenses";

    const revertIncomeExpense: number =
      oldTransaction.type == "income"
        ? -Number(oldTransaction.amount)
        : Number(oldTransaction.amount);

    const revertedWalletAmount =
      Number(orignalWallet.amount) + revertIncomeExpense;

    const revertedIncomeExpenseAmount =
      Number(orignalWallet[revertType]) - Number(oldTransaction.amount);

    if (newTransactionType == "expense") {
      //if user tries to convert income to expense on the same Wallet
      //hande errors
      if (
        oldTransaction.walletId == newWalletId &&
        revertedWalletAmount < newTransactionAmount
      ) {
        return {
          success: false,
          msg: "The selected wallet dont't have enough balance",
        };
      }
    }

    if (newWallet.amount! < newTransactionAmount) {
      return {
        success: false,
        msg: "The selected wallet dont't have enough balance",
      };
    }

    await createOrUpdateWallet({
      id: oldTransaction.walletId,
      amount: revertedWalletAmount,
      [revertType]: revertedIncomeExpenseAmount,
    });

    /////////////////////////////////////////////////////////////////////////////

    //refetch the newWallet because we may have just updated it
    newWalletSnapshot = await getDoc(doc(firestore, "wallets", newWalletId));

    newWallet = newWalletSnapshot.data() as WalletType;

    const updateType =
      newTransactionType == "income" ? "totalIncome" : "totalExpenses";

    const updatedTransactionAmount: number =
      newTransactionType == "income"
        ? Number(newTransactionAmount)
        : -Number(newTransactionAmount);

    const newWalletAmount = Number(newWallet.amount) + updatedTransactionAmount;

    const newIncomeExpenseAmount = Number(
      newWallet[updateType]! + Number(newTransactionAmount)
    );

    await createOrUpdateWallet({
      id: newWalletId,
      amount: newWalletAmount,
      [updateType]: newIncomeExpenseAmount,
    });
    return { success: true };
  } catch (error: any) {
    console.log("error in updating the wallet for new transaction", error);
    return { success: false, msg: error.message };
  }
};

export const deleteTransaction = async (
  transactionId: string,
  wallentId: string
) => {
  try {
    const transactionRef = doc(firestore, "transaction", transactionId);
    const transactionSnapshot = await getDoc(transactionRef);
    const transactionData = transactionSnapshot.data() as TransactionType;

    if (!transactionSnapshot.exists()) {
      return { success: false, msg: "Transaction Not found" };
    }

    const transactionType = transactionData?.type;
    const transactionAmount = transactionData?.amount;

    //fetch wallet to update amount, totalIncome or totalExpenses
    const walletSnapshot = await getDoc(doc(firestore, "wallets", wallentId));
    const walletDate = walletSnapshot.data() as WalletType;

    //check the fields to be updated based on transation type
    const updateType =
      transactionType == "income" ? "totalIncome" : "totalExpenses";

    const newWalletAmount =
      walletDate?.amount! -
      (transactionType == "income" ? transactionAmount : -transactionAmount);

    const newIncomeExpenseAmount = walletDate[updateType]! - transactionAmount;

    if (transactionType == "expense" && newWalletAmount < 0) {
      return { success: false, msg: "You cannot delete this transaction" };
    }

    await createOrUpdateWallet({
      id: wallentId,
      amount: newWalletAmount,
      [updateType]: newIncomeExpenseAmount,
    });

    await deleteDoc(transactionRef);

    return { success: true };
  } catch (err: any) {
    console.log("error in deleting the transactions");
    return { success: false, msg: err.message };
  }
};


export const fetchWeeklyStats = async (uid: string): Promise<ResponseType> => {
  try {
    const db = firestore;
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);

    const transactionQuery = query(
      collection(db, "transaction"),
      where("date", ">=", Timestamp.fromDate(sevenDaysAgo)),
      where("date", "<=", Timestamp.fromDate(today)),
      orderBy("date", "desc"),
      where("uid", "==", uid)
    );

    const querySnapshot = await getDocs(transactionQuery);

    const weeklyData = getLast7Days();
    const transactions: TransactionType[] = [];

    //mapping each transaction
    querySnapshot.forEach((doc) => {
      const transaction = doc.data() as TransactionType;
      transaction.id = doc.id;
      transactions.push(transaction);

      const transactionDate = (transaction.date as Timestamp)
        .toDate()
        .toISOString()
        .split("T")[0];

      const dayData = weeklyData.find((day) => day.date == transactionDate);

      if (dayData) {
        if (transaction.type == "income") {
          dayData.income += transaction.amount;
        } else if (transaction.type == "expense") {
          dayData.expense += transaction.amount;
        }
      }
    });

    const stats = weeklyData.flatMap((day) => [
      {
        value: day.income,
        label: day.date,
        spacing: scale(4),
        labelWidth: scale(30),
        frontColor: colors.primary,
      },
      {
        value: day.expense,
        frontColor: colors.rose,
      },
    ]);

    return {
      success: true,
      data: {
        stats,
        transactions,
      },
    };
  } catch (err: any) {
    console.log("error in deleting the transactions");
    return { success: false, msg: err.message };
  }
};
