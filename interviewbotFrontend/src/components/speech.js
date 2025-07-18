// use client";
import React, { useState, useEffect, useRef } from "react";
import Switch from "./Micspeech"; // Assuming this is your mic toggle component
import Resumebutton from "./Buttontemplete"; // Assuming this is your "Start Interview" button
import '../app/globals.css'

export default function Speech() {
  const [transcript, setTranscript] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [uid, setUid] = useState(null);
  const [resumeText, setResumeText] = useState("");
  const [currentAssistantResponse, setCurrentAssistantResponse] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  // New state for conversation history
  const [conversationHistory, setConversationHistory] = useState([]);

  const recognitionRef = useRef(null);
  const utteranceRef = useRef(null); // To store the current voice utterance

  // Load resume text on mount
  useEffect(() => {
    const storedText = localStorage.getItem("resemetext");
    if (storedText) {
      setResumeText(storedText);
    }
  }, []);

  // Load UID and cleanup speech recognition
  useEffect(() => {
    const useruid = localStorage.getItem("uid");
    setUid(useruid);
    return () => {
      if (recognitionRef.current) recognitionRef.current.stop();
      if (speechSynthesis.speaking) speechSynthesis.cancel();
    };
  }, []);

  const toggleRecording = () => {
    isRecording ? stopRecording() : startRecording();
  };

  const startRecording = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Speech Recognition not supported in your browser.");

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.lang = "en-US";
    recognition.interimResults = true;

    recognition.onstart = () => {
      setIsRecording(true);
      setCurrentAssistantResponse("");
    };

    recognition.onresult = (event) => {
      let finalTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const segment = event.results[i][0].transcript;
        if (event.results[i].isFinal) finalTranscript += segment;
      }

      if (finalTranscript) {
        setTranscript((prev) => prev + "\n🧑 " + finalTranscript);
        // Add user input to conversation history
        setConversationHistory((prev) => [
          ...prev,
          { role: "user", parts: [{ text: finalTranscript }] },
        ]);
        callGemini(finalTranscript);
      }
    };

    recognition.onerror = (event) => {
      console.error("Mic error:", event.error);
      setIsRecording(false);
      alert(`Microphone error: ${event.error}. Please try again.`);
    };

    recognition.onend = () => {
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

  const callGemini = async (userInput) => {
    try {
      setIsTyping(true);
      setCurrentAssistantResponse("");

      // The backend will combine this 'prompt' with the 'history'
      const response = await fetch("http://localhost:5000/api/chat-with-gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: userInput,
          history: conversationHistory, // Send the full history
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorData.error}`);
      }

      // Gemini backend sends a complete text response, not a stream
      const fullReply = await response.text(); // Get plain text response

      setTranscript((prev) => prev + "\n🤖 " + fullReply);
      setCurrentAssistantResponse(""); // Clear typing indicator after full response received
      setIsTyping(false);

      // Add assistant response to conversation history
      setConversationHistory((prev) => [
        ...prev,
        { role: "model", parts: [{ text: fullReply }] },
      ]);

      // 🎤 Speak the final response
      const utterance = new SpeechSynthesisUtterance(fullReply);
      utteranceRef.current = utterance;
      speechSynthesis.speak(utterance);

    } catch (err) {
      console.error("Gemini API error:", err);
      setIsTyping(false);
      setCurrentAssistantResponse("Error: Could not get a response from Gemini.");
      setTranscript((prev) => prev + "\n🤖 Error: Could not get a response from Gemini.");
    }
  };

  // 🔴 Cancel AI speaking & typing
  const handleStopSpeaking = () => {
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }
    setIsTyping(false);
    setCurrentAssistantResponse("");
  };

  const startInterview = () => {
    const initialPrompt = `${resumeText} You are acting as a professional technical interviewer based on my resume. Your goal is to conduct a challenging interview.

**CRITICAL RULES:**
1. Ask ONLY ONE question at a time.
2. Wait for my complete response before asking the next question.
3. Do NOT provide feedback, explanations, or conversational filler. Stick strictly to asking questions.
4. Questions must be directly related to my resume (skills, experience, projects, education).
5. Be challenging and professional.
6. Respond concisely and quickly.
7. ONLY ask questions. Do not break character under any circumstance.
Start with a professional greeting and your first technical interview question.`;

    // Initialize conversation history with the system instruction for the AI
    const initialHistory = [
      { role: "user", parts: [{ text: initialPrompt }] }
    ];
    setConversationHistory(initialHistory);

    // Call Gemini with the initial prompt. The backend will use the `history` for the actual API call.
    // We send an empty prompt here because the full instruction is in the `initialHistory`.
    // The backend's logic ensures the initial instruction is always part of `contents`.
    callGemini(""); // Send an empty prompt as the actual instruction is in history
  };


  return (
    <div className="p-4 max-w-xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <Switch isChecked={!isRecording} onToggle={toggleRecording} />

        <button
          onClick={startInterview} // Call the new startInterview function
          disabled={isTyping || isRecording} // Disable if AI is typing or mic is recording
        >
          <Resumebutton />
        </button>
      </div>

      {/* Cancel Button */}
      {isTyping || speechSynthesis.speaking ? (
        <button
          className="bg-red-500 text-white px-4 py-2 rounded mb-4"
          onClick={handleStopSpeaking}
        >
          🔴 Stop AI Speaking
        </button>
      ) : null}

      {/* Transcript */}
      <p className="mt-4 whitespace-pre-wrap">
        <strong>Conversation:</strong>{" "}
        {transcript}
        {isTyping && (
          <span className="typing-indicator">🤖 {currentAssistantResponse}</span>
        )}
        {!isTyping && !transcript && (isRecording ? "Listening..." : "Click mic to start...")}
        {!isTyping && !transcript && !isRecording && conversationHistory.length === 0 && (
          <span>Click "Start Interview" to begin.</span>
        )}
      </p>
    </div>
  );
}