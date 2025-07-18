"use client";
import { useEffect, useState } from "react";
import { useUser } from "../../context/context/UserContext";
import Image from "next/image";
import Speech from "../../components/speech" ;

export default function InterviewPage() {
  const { uid } = useUser(); // Get uid from context
  const [resumeId, setResumeId] = useState(null);
  const [photoUrl, setPhotoUrl] = useState(null);

  useEffect(() => {
    const id = localStorage.getItem("uid");
    const photoid = localStorage.getItem("photourl");
    setPhotoUrl(photoid);
    console.log("Photo URL from localStorage:", photoid);
    setResumeId(id);
    console.log("Resume ID from localStorage:", id);
  }, []);

  useEffect(() => {
    if (uid) {
      console.log("UID found:", uid);
      setResumeId(uid);
      localStorage.setItem("uid", uid); // Store uid in localStorage
    } else {
      console.log("UID not found. Maybe user not logged in.");
    }
  }, [uid]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 flex flex-col items-center gap-8 p-6">
      <div className="w-full max-w-4xl bg-opacity-10 backdrop-blur-lg rounded-xl shadow-xl p-8 flex flex-row justify-between items-center">
        <h1 className="text-lg  text-white tracking-tight">Interview Dashboard</h1>
        <p className="text-md text-white font-medium">
          Resume ID: <span className="font-mono">{resumeId ? resumeId : "Loading..."}</span>
        </p>
      </div>

      <div className="flex flex-row justify-center gap-12">
        
        <div className="flex flex-col items-center group">
          <div className="relative">
            <Image
              src="https://imgs.search.brave.com/Hyti_Ar6Lx6HMhtEZ7v7g-4lTY5FbKCQcaWuoH9iQPY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/ZnJlZS12ZWN0b3Iv/Y2FydG9vbi1zdHls/ZS1yb2JvdC12ZWN0/b3JhcnRfNzgzNzAt/NDEwMy5qcGc_c2Vt/dD1haXNfaHlicmlk/Jnc9NzQw"
              alt="AI Bot Photo"
              width={200}
              height={200}
              className="w-48 h-48 rounded-full object-cover border-4 border-white shadow-lg transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 rounded-full border-4 border-transparent group-hover:border-purple-300 transition-all duration-300"></div>
          </div>
          <p className="text-white text-xl font-semibold mt-4">AI Assistant</p>
        </div>
        <div className="flex flex-col items-center group">
          <div className="relative">
            <Image
              src={photoUrl ? photoUrl : "https://via.placeholder.com/200?text=User"}
              alt="User Photo"
              width={200}
              height={200}
              className="w-48 h-48 rounded-full object-cover border-4 border-white shadow-lg transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 rounded-full border-4 border-transparent group-hover:border-indigo-300 transition-all duration-300"></div>
          </div>
          <p className="text-white text-xl font-semibold mt-4">User</p>
        </div>
      </div>
      <Speech/>
    </div>
  );
}