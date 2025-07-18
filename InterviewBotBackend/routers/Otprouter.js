import { Router } from "express";
import {sendOtpEmail} from "../Controller/Otpcontroller.js"
const router = Router();
router.post('/send-otp', sendOtpEmail);

export default router;