"use client";
import React, { useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../../firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import Cookies from "js-cookie";
import Image from "next/image";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const token = await result.user.getIdToken();
      Cookies.set("token", token, {
        secure: true, // only over HTTPS (essential in production)
        sameSite: "Strict", // prevents CSRF
        expires: 7, 
      }); 
      router.push("/");
    } catch (err) {
      setError("Login failed: " + err.message);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const token = await result.user.getIdToken();
      Cookies.set("token", token, {
        secure: true, 
        sameSite: "Strict", 
        expires: 7, 
      }); 
      router.push("/");
    } catch (err) {
      setError("Google login failed: " + err.message);
    }
  };

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
        <div className="w-1/2 bg-gradient-to-b from-blue-600 to-indigo-800 text-white p-12 flex flex-col justify-center">
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h1 className="text-5xl font-extrabold mb-4">Welcome Back</h1>
            <p className="text-lg">
              Step into a world of possibilities. Sign in to unlock your
              personalized experience and explore what awaits.
            </p>
          </motion.div>
        </div>

        {/* Right Panel (Form) */}
        <div className="w-1/2 p-12 flex flex-col justify-center bg-gray-50">
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
            Sign In
          </h2>

          {error && <p className="text-red-600 mb-4 text-center">{error}</p>}

          {/* Google Sign In */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="flex items-center justify-center w-full mb-6 py-3 bg-white border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition"
          >
            <Image
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-6 h-6 mr-3"
            />
            <span className="text-gray-700 font-medium">
              Sign in with Google
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

          {/* Login Form */}
          <form onSubmit={handleLogin}>
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

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition"
            >
              Sign In
            </button>
          </form>

          <p className="mt-6 text-center text-gray-600">
            Don’t have an account?{" "}
            <Link
              href="/signup"
              className="text-indigo-600 hover:underline font-medium"
            >
              Register here
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
