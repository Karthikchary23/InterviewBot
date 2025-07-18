"use client";
import React, { useState, useEffect, useRef } from "react";
import Switch from "./Micspeech"; // Custom UI toggle switch
import axios from "axios";
import Resumebutton from "./Buttontemplete"; // Custom button component

export default function Speech() {
  const [transcript, setTranscript] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [uid, setUid] = useState(null);
  const recognitionRef = useRef(null);
  const [resumeText, setResumeText] = useState("");
  let reply=" "

  useEffect(() => {
    const storedText = localStorage.getItem("resemetext");
    if (storedText) {
      setResumeText(storedText);
      console.log("Resume text from localStorage:", storedText);
    } else {
      console.log("No resume text found in localStorage.");
    }
  }, [resumeText]);

  const toggleRecording = () => {
    isRecording ? stopRecording() : startRecording();
  };

  const startRecording = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.lang = "en-US";
    recognition.interimResults = true;

    recognition.onstart = () => {
      console.log("🎙️ Mic on. Speak now...");
      setIsRecording(true);
    };

    recognition.onresult = (event) => {
      let finalTranscript = "";
      let interimTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const segment = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += segment;
        } else {
          interimTranscript += segment;
        }
      }

      if (finalTranscript) {
        console.log("✅ Final Transcript:", finalTranscript);
        setTranscript((prev) => prev + "\n🧑 " + finalTranscript);

        
        callOllama(finalTranscript);
      }

      if (interimTranscript) {
        console.log("⏳ Interim:", interimTranscript);
      }
    };

    recognition.onerror = (event) => {
      console.error("❌ Mic error:", event.error);
      setIsRecording(false);
    };

    recognition.onend = () => {
      console.log("🛑 Mic stopped.");
      setIsRecording(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  
  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

 
  useEffect(() => {
    const useruid = localStorage.getItem("uid");
    setUid(useruid);
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const callOllama = async (userInput) => {
    // alert(userInput);
    try {
      const res = await axios.post(
        "http://localhost:5000/api/chat-with-ollama",
        {
          prompt: userInput,
        }
      );

      reply = res.data.response;
      console.log("🤖 Ollama:", reply);

      setTranscript((prev) => prev + "\n🤖 " + reply);

      const utterance = new SpeechSynthesisUtterance(reply);
      speechSynthesis.speak(utterance);
    } catch (err) {
      console.error(" Ollama API error:", err);
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <Switch isChecked={!isRecording} onToggle={toggleRecording} />

        <button
          onClick={() => {
            const prompt = `${resumeText}+
You are acting as a professional interviewer conducting a technical interview based on my resume.

 RULES:
1. Ask ONE question at a time. Wait for my response before asking the next.
2. Do NOT ask multiple questions at once.
3. After each of my responses, ask a follow-up or the next question based on my resume.
4. You can ask about my introduction, experience, skills (like Python, Java, Docker, Kubernetes,js,html,css)see resume skills and ask, projects, certifications, education, and personal background.
5. Feel like a real interviewer — challenge me with scenario-based and behavioral questions too.
6. Be professional and precise in your tone.
7.Give fast response
8.once you get this prompy just stay on interview mode dont, just ask questions randomly based on resume think you are interviewer

Begin by introducing yourself and ask your **first question** only.
`;

            

            callOllama(prompt); // ✅ Pass input here
          }}
        >
          <Resumebutton />
        </button>
      </div>

      <p className="mt-4 whitespace-pre-wrap">
        <strong>Conversation:</strong>{" "}
        {transcript || (isRecording ? "Listening..." : "Click mic to start...")}
      </p>
    </div>
  );
}
