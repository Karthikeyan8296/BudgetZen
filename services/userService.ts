import { firestore } from "@/config/firebase";
import { ResponseType, UserDataType } from "@/types";
import { doc, updateDoc } from "firebase/firestore";
import { uploadFileCloudinary } from "./imageService";

export const updateUser = async (
  uid: string,
  updatedDate: UserDataType
): Promise<ResponseType> => {
  try {
    //image update
    if (updatedDate.image && updatedDate?.image?.uri) {
      const imageUploadRes = await uploadFileCloudinary(
        updatedDate.image,
        "users"
      );

      if (!imageUploadRes.success) {
        return {
          success: false,
          msg: imageUploadRes.msg || "Failed to upload image",
        };
      }

      //if image uploaded
      updatedDate.image = imageUploadRes.data;
    }

    //username update
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
