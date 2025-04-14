import { firestore } from "@/config/firebase";
import { ResponseType, UserDataType } from "@/types";
import { doc, updateDoc } from "firebase/firestore";

export const updateUser = async (
  uid: string,
  updatedDate: UserDataType
): Promise<ResponseType> => {
  try {
    //change the user data in the firestore doc
    const userRef = doc(firestore, "users", uid);
    await updateDoc(userRef, updatedDate);

    //fetch the user and udpate the user state
    //that function is in the authContext

    return { success: true, msg: "Updated successfully" };
  } catch (error: any) {
    console.log("Error updating user: ", error);
    return {
      success: false,
      msg: error?.message,
    };
  }
};
