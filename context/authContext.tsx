import { auth, firestore } from "@/config/firebase";
import { AuthContextType, UserType } from "@/types";
import { useRouter } from "expo-router";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserType>(null);
  const router = useRouter();

  //useEffect to check if user is logged in or not
  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser?.uid,
          email: firebaseUser?.email,
          name: firebaseUser?.displayName,
        });
        updateUserData(firebaseUser.uid);
        //user is logged in
        router.replace("/(tabs)");
      } else {
        //no user is logged in
        setUser(null);
        router.replace("/(auth)/welcome");
      }
    });
    return () => unSubscribe();
  }, []);

  //login function
  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (error: any) {
      let msg = error.message;
      console.log("login error message: ", msg);
      if (msg.includes("(auth/invalid-credential)")) msg = "Wrong credentials";
      if (msg.includes("(auth/invalid-email)")) msg = "Invalid email";
      if (msg.includes("(auth/network-request-failed)"))
        msg = "Too many requests, please try again later";
      return { success: false, msg };
    }
  };

  //register function
  const register = async (name: string, email: string, password: string) => {
    try {
      let response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await setDoc(doc(firestore, "users", response?.user.uid), {
        name,
        email,
        uid: response?.user.uid,
      });
      return { success: true };
    } catch (error: any) {
      let msg = error.message;
      console.log("register error message: ", msg);
      if (msg.includes("(auth/invalid-credential)")) msg = "Wrong credentials";
      if (msg.includes("(auth/invalid-email)")) msg = "Invalid email";
      if (msg.includes("(auth/network-request-failed)"))
        msg = "Too many requests, please try again later";
      if (msg.includes("(auth/email-already-in-use)"))
        msg = "Email already in use";
      if (
        msg.includes(
          "Firebase: Password should be at least 6 characters (auth/weak-password)"
        )
      )
        msg = "Password should be at least 6 characters";
      return { success: false, msg };
    }
  };

  //update user function
  const updateUserData = async (uid: string) => {
    try {
      const docRef = doc(firestore, "users", uid);
      const docSnapshot = await getDoc(docRef);

      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        const userData: UserType = {
          name: data.name || null,
          email: data.email || null,
          image: data.image || null,
          uid: data?.uid,
        };
        setUser({ ...userData });
      }
    } catch (error: any) {
      let msg = error.message;
      // return { success: false, msg };
      console.log("error: ", msg);
    }
  };

  //now context value
  const contextValue: AuthContextType = {
    user,
    setUser,
    login,
    register,
    updateUserData,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

//to create a custom hook to use the auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  // Check if the context is null and throw an error if it is
  if (context === null) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
