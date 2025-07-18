// middleware/firebaseAuth.js
import admin from "../firebase.js"; // Ensure this path is correct based on your project structure

const verifyFirebaseToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  // console.log("Authorization header:", authHeader)

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
    // console.log("Token extracted:", token);

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken; // contains uid, email, etc.
    // console.log("Decoded token:", decodedToken);
    next();
  } catch (error) {
    console.error("Token verification failed", error);
    res.status(401).json({ error: "Invalid or expired token relogin again" });
  }
};

export default verifyFirebaseToken;
