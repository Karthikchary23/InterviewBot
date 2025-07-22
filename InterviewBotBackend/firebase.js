import admin from "firebase-admin";
// import serviceAccount from "./firebaseServiceAccount.json" with { type: "json" };
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;
