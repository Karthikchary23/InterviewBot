import nodemailer from "nodemailer";
import User from "../models/Userschema.js"; 

function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function sendOtpEmail(req, res) {
    const { email } = req.body;

    console.log("Sending OTP to:", email);

    if (!email) {
        return res.status(400).json({ success: false, message: "Email is required." });
    }

    try {
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({ success: false, message: "Account already exists with this email." });
        }

        const otp = generateOTP();
        console.log("Generated OTP:", otp);

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "hackerantharababu@gmail.com",
                pass: "dfcv bbqd qucv shnq", 
            },
        });

        const mailOptions = {
            from: "hackerantharababu@gmail.com",
            to: email,
            subject: "Your OTP Code",
            text: `Your OTP code is: ${otp}`,
        };

        await transporter.sendMail(mailOptions);
        console.log("OTP sent to:", email);

        return res.status(200).json({
            success: true,
            message: "OTP sent successfully",
            otp, 
        });
    } catch (error) {
        console.error("Error sending OTP:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to send OTP",
            error: error.message,
        });
    }
}

export default sendOtpEmail;
