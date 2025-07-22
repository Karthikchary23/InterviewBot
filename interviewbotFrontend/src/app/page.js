"use client";

import React, { use, useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { Menu, Transition } from "@headlessui/react";
import Link from "next/link";
import Image from "next/image";
import { useUser } from "../../src/context/context/UserContext";

const Navbar = () => {
  const { uid, setUid } = useUser();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [file, setFile] = useState(null);
  const [text, setText] = useState("");
  const [startcall, setStartcall] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = Cookies.get("token");

      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const res = await axios.get(
          "https://interviewbot-1n5j.onrender.com/api/userdata/userdetails",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUser(res.data);
        console.log("User data fetched:", res.data);
        localStorage.setItem("photourl", res.data.picture);
        // console.log("User data fetched:", res.data);
        setIsLoading(false);
      } catch (error) {
        Cookies.remove("token");
        router.push("/login");
      }
    };
    
      

    fetchUserData();
  }, [router]);

useEffect(() => {
  const callhandle= async () => { 
    console.log("Fetching start call data for user:", user?.uid);
    try
    {
      console.log("User ID for start call:", user?.uid);
      const response = await axios.get(
        "https://interviewbot-1n5j.onrender.com/api/startcall",
        {
          params: { userId: user.uid },
          
        }
      );
      console.log("Start call response:", response.data);
      if (response.data.resumeId) {
        setStartcall(true);
      } else {
        setStartcall(false);
      }
      }
    catch (error) {
      setStartcall(false);
    }
  };
  if (user) {
    callhandle();
  }
  
}, [user])
  

  const handleSignOut = () => {
    Cookies.remove("token");
    router.push("/login");
  };
  // console.log("User data in Navbar:", user);
  const Resumeseubmit = async () => {
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);
    formData.append("userId", user.uid);

    try {
      console.log("User ID:", user.uid);
      const response = await axios.post(
        "https://interviewbot-1n5j.onrender.com/api/upload-resume",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );
      console.log("Resume uploaded successfully:", response.data);
      setFile(null); // Clear the file input after upload
      setText(response.data.data || "No text extracted from resume.");
      console.log("Resume text:", response.data.data);
      localStorage.setItem("resemetext", response.data.data);
      setStartcall(true);
    } catch (error) {
      console.error("Error uploading resume:", error);
      alert("Failed to upload resume. Please try again.");
    }
  };
useEffect(() => {
  if (user?.uid) {
    setUid(user.uid);
  }
}, [user, setUid]);  // ✅ Add dependencies properly

  return (
    <>
      <div>
        <nav className="  sticky top-0 z-50 shadow-md shadow-white bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <Link
                href="/"
                className="text-shadow-black font-bold text-2xl tracking-wide"
              >
                InterviewBot
              </Link>

              {/* Search */}
              <div className="hidden md:flex flex-1 mx-6">
                <div className="w-full max-w-md relative">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-full py-2 pl-10 pr-4 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-700"
                  />
                  <svg
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 21l-4.35-4.35m1.85-5.65a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>

   
              <div className="flex items-center gap-4">
                <Menu as="div" className="relative inline-block text-left">
                  <Menu.Button>
                    <Image
                      src={
                        user?.picture ??
                        "https://cdn.flyonui.com/fy-assets/avatar/avatar-1.png"
                      }
                      alt="Profile"
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  </Menu.Button>

                  <Transition
                    enter="transition ease-out duration-100"
                    enterFrom="transform scale-95 opacity-0"
                    enterTo="transform scale-100 opacity-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform scale-100 opacity-100"
                    leaveTo="transform scale-95 opacity-0"
                  >
                    <Menu.Items className="absolute right-0 mt-2 w-64 origin-top-right bg-white rounded-lg shadow-lg focus:outline-none z-50">
                      {isLoading ? (
                        <div className="px-4 py-3 text-gray-500 text-center">
                          Loading...
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-3 px-1 py-3 border-b">
                            <Image
                              src={
                                user?.picture ??
                                "https://cdn.flyonui.com/fy-assets/avatar/avatar-1.png"
                              }
                              alt="Profile"
                              width={40}
                              height={40}
                              className="rounded-full"
                            />
                            <div>
                              <p className="text-gray-900 font-medium">
                                {user?.name}
                              </p>
                              <p className="text-sm text-gray-500">
                                {user?.email}
                              </p>
                              {/* <p className="text-sm text-gray-500">{user?.uid}</p> */}

                              <span className="text-xs text-indigo-500 capitalize">
                                {user?.role || "User"}
                              </span>
                            </div>
                          </div>

                          <Menu.Item>
                            {({ active }) => (
                              <Link
                                href="/profile"
                                className={`block px-4 py-2 text-sm ${
                                  active ? "bg-gray-100" : ""
                                }`}
                              >
                                👤 My Profile
                              </Link>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <Link
                                href="/settings"
                                className={`block px-4 py-2 text-sm ${
                                  active ? "bg-gray-100" : ""
                                }`}
                              >
                                ⚙️ Settings
                              </Link>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <Link
                                href="/help"
                                className={`block px-4 py-2 text-sm ${
                                  active ? "bg-gray-100" : ""
                                }`}
                              >
                                ❓ Help & Support
                              </Link>
                            )}
                          </Menu.Item>
                          <div className="border-t my-1"></div>
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                onClick={handleSignOut}
                                className={`w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 ${
                                  active ? "bg-red-50" : ""
                                }`}
                              >
                                🔓 Logout
                              </button>
                            )}
                          </Menu.Item>
                        </>
                      )}
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>
        </nav>
      </div>
      <div className="min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center flex-col gap-6 p-4">
        <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
          <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">
            Upload Your Resume
          </h1>
          <p className="text-gray-600 mb-6 text-center">
            Please upload your resume in PDF or Word format (max 5MB).
          </p>
          <label
            htmlFor="resume-upload"
            className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg
                className="w-10 h-10 mb-3 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 16V8m0 0l-4 4m4-4l4 4m6-4v8m-5-4h10"
                ></path>
              </svg>
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Click to upload</span> or drag
                and drop
              </p>
              <p className="text-xs text-gray-500">PDF or DOCX (MAX. 5MB)</p>
            </div>
            <input
              id="resume-upload"
              type="file"
              accept=".pdf,.docx"
              onChange={(event) => {
                const file = event.target.files[0];
                if (file) {
                  setFile(file);
                  // Add your upload logic here (e.g., API call)
                }
              }}
              className="hidden"
            />
          </label>
          <p className="text-gray-600 text-center ">
            file name {file ? file.name : "Upload file"}
          </p>

          <button
            className="mt-6 w-full bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-700 transition"
            onClick={Resumeseubmit}
          >
            Submit
          </button>
        </div>
        <div>
          {startcall ? (
            <Link href="/interview" className="flex justify-center">
                        <button className="Btn">Start Interview</button>

            </Link>
          ) : (
            <p>upload you resume for interview Preparation</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
