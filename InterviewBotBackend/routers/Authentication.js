// routes/userRoutes.js


import { Router } from "express";
const router = Router();
import verifyFirebaseToken from "../middleware/firebaseAuth.js";

router.get("/userdetails", verifyFirebaseToken, (req, res) => {
    // console.log("User data request received:", req.user);
  res.json({
    message: "Authenticated",
    uid: req.user.uid,
    email: req.user.email,
    name: req.user.name,
    picture: req.user.picture,
  });
});

export default router;
