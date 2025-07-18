// src/app/signup/page.js
"use client";

import React, { useState } from "react";
import axios from "axios";
import { signInWithPopup, createUserWithEmailAndPassword } from "firebase/auth";
import { auth, googleProvider } from "../../../firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode"; // ✅ correct import for v4.x


const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setotp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpverified, setOtpVerified] = useState(false);
  const[receivedotp, setReceivedOtp] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleGoogleSignup = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const token = await result.user.getIdToken();
      Cookies.set("token", token, { expires: 7 }); // Store token in cookies
      const decoded = jwtDecode(token); // ✅ correct usage
      console.log("Decoded token signup:", decoded);

      const data=axios.post("http://localhost:5000/api/signup", {
        email: decoded.email,
        uid:decoded.user_id,
        name: decoded.name,
        profile: decoded.picture,}
        
      ).then((response) => {
        console.log("User signed up successfully:", response.data);
        alert("Signed up with Google!");
        router.push("/");
      }).catch((error) => {
        console.error("Error signing up user:", error);
      });

      alert("Signed up with Google!");
      router.push("/");
    } catch (err) {
      setError("Google signup failed: " + err.message);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const userCred = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const token = await userCred.user.getIdToken();
      Cookies.set("token", token, { expires: 7 }); // Store token in cookies
 const decoded = jwtDecode(token); // ✅ correct usage
      console.log("Decoded token signup:", decoded);

      const data=axios.post("http://localhost:5000/api/signup", {
        email: decoded.email,
        uid:decoded.user_id,
        name: decoded.name,
        profile: decoded.picture,}
        
      ).then((response) => {
        console.log("User signed up successfully:", response.data);
        alert("Signed up with Google!");
        router.push("/");
      }).catch((error) => {
        console.error("Error signing up user:", error);
      });

      alert("Signed up with Google!");
      router.push("/");
    } catch (err) {
      setError("Signup failed: " + err.message);
    }
  };

  const sendotp = async (email) => {
  if (!email) {
    setError("Please enter your email.");
    return;
  }

  try {
    const response = await axios.post("http://localhost:5000/api/send-otp", { email });

    if (response.data.success) {
      setOtpSent(true);
      setReceivedOtp(response.data.otp); // Store the received OTP
      alert("OTP sent to your email!");
    } else {
      setError("Failed to send OTP: " + response.data.message);
    }
  } catch (err) {
    // If account exists, show message
    if (err.response && err.response.status === 409) {
      setError("Account already exists with this email.");
    } else {
      setError("Error sending OTP: " + err.message);
    }
  }
};


  const verifyOtp = async () => {
    if (!otp) {
      setError("Please enter the OTP.");
      return;
    }
    if (otp !== receivedotp) {
      setError("Invalid OTP. Please try again.");
      return;
    
    
    
    }
    setOtpVerified(true);
    alert("OTP verified successfully!");
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 relative overflow-hidden">
      {/* Background animation */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.1)_0%,_transparent_70%)] animate-pulse z-0"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="flex w-4/5 max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden z-10"
      >
        {/* Left Panel */}
        <div className="w-1/2 bg-gradient-to-b from-indigo-700 to-purple-700 text-white p-12 flex flex-col justify-center">
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h1 className="text-5xl font-extrabold mb-4">Join InterviewBot</h1>
            <p className="text-lg">
              Create your free account and get ready to level up your interview
              preparation journey.
            </p>
          </motion.div>
        </div>

        {/* Right Panel (Form) */}
        <div className="w-1/2 p-12 flex flex-col justify-center bg-gray-50">
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
            Create Account
          </h2>

          {error && (
            <p className="text-red-600 text-sm mb-4 text-center">{error}</p>
          )}

          <button
            type="button"
            onClick={handleGoogleSignup}
            className="flex items-center justify-center w-full mb-6 py-3 bg-white border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-6 h-6 mr-3"
            />
            <span className="text-gray-700 font-medium">
              Sign up with Google
            </span>
          </button>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-gray-50 px-2 text-gray-500">
                or continue with
              </span>
            </div>
          </div>

          <form onSubmit={handleSignup}>
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-3 mb-6 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div className="flex flex-col mb-6">
              <input
                type="text"
                placeholder="OTP"
                className="w-full px-4 py-3 mb-6 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={otp}
                onChange={(e) => setotp(e.target.value)}
                required
              />

              {!otpSent ? (
                <button
                  className="w-full mb-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                  type="button"
                  onClick={() => sendotp(email)}
                >
                  Send OTP
                </button>
              ) : (
                <button
                  className="w-full mb-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                  type="button"
                  onClick={verifyOtp}
                >
                  Verify OTP
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={!otpverified}
              className={`w-full py-3 rounded-lg transition 
    ${
      otpverified
        ? "bg-indigo-600 text-white hover:bg-indigo-700"
        : "bg-gray-400 text-gray-200 cursor-not-allowed"
    }`}
            >
              Sign In
            </button>
          </form>

          <p className="mt-6 text-center text-gray-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-indigo-600 hover:underline font-medium"
            >
              Login here
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
