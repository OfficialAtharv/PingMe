import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  setDoc,
  doc,
  collection,
  query,
} from "firebase/firestore";
import { toast } from "react-toastify";
import { sendPasswordResetEmail } from "firebase/auth";
import { where, getDocs } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCYtqJ4D0hqA-yb3WLHcuGixtw0QNdmHBY",
  authDomain: "pingme-5c885.firebaseapp.com",
  databaseURL: "https://pingme-5c885-default-rtdb.firebaseio.com",
  projectId: "pingme-5c885",
  storageBucket: "pingme-5c885.firebasestorage.app",
  messagingSenderId: "599810553244",
  appId: "1:599810553244:web:55e3886656cc79cf894459",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const signup = async (username, email, password) => {
  try {
    console.log("Trying to create user:", email);
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;

    console.log("User created successfully:", user);

    await setDoc(doc(db, "users", user.uid), {
      id: user.uid,
      username: username.toLowerCase(),
      email,
      name: "",
      avatar: "",
      bio: "Hey testing",
      lastseen: Date.now(),
    });
    console.log("User profile saved in Firestore");

    await setDoc(doc(db, "userChats", user.uid), {
      ChatsData: [],
    });
    console.log("Empty chats initialized in Firestore");
  } catch (err) {
    console.error(" Signup error:", err.code, err.message);
    toast.error(err.code.split("/")[1].split("-").join(" "));
  }
};
console.log("Current user in auth:", auth.currentUser);
const login = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    console.error("Login error:", err.code, err.message);
    toast.error(err.code.split("/")[1].split("-").join(" "));
  }
};
const logout = async () => {
  try {
    await signOut(auth);
  } catch (err) {
    toast.error(err.code.split("/")[1].split("-").join(" "));
  }
};

const resetpassword = async (email) => {
  try {
    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    await sendPasswordResetEmail(auth, email);
    toast.success("Password reset email sent successfully! Check your inbox.");
  } catch (err) {
    console.error("Error in password reset:", err);
    if (err.code === "auth/user-not-found") {
      toast.error("No account found with that email.");
    } else {
      toast.error(err.code.split("/")[1].split("-").join(" "));
    }
  }
};

export { signup, login, logout, auth, db, resetpassword };
