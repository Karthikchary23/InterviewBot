// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCnl9v-y16EczozPoeApDb9P31sDHzmFnc",
  authDomain: "interviewbot-b423e.firebaseapp.com",
  projectId: "interviewbot-b423e",
  storageBucket: "interviewbot-b423e.appspot.com",
  messagingSenderId: "604930628500",
  appId: "1:604930628500:web:34623b980d50af55cc0d81",
  measurementId: "G-RLEY3G2S84"
};

const app = initializeApp(firebaseConfig);

// ✅ Export only if window is defined
let analytics;
if (typeof window !== "undefined") {
  const { getAnalytics } = await import("firebase/analytics");
  analytics = getAnalytics(app);
}

export { app, analytics };
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
