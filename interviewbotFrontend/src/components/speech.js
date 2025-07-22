// use client";
import React, { useState, useEffect, useRef } from "react";
import Switch from "./Micspeech"; // Assuming this is your mic toggle component
import Resumebutton from "./Buttontemplete"; // Assuming this is your "Start Interview" button
import "../app/globals.css"; // Your global Tailwind CSS import

export default function Speech() {
  const [isRecording, setIsRecording] = useState(false);
  const [resumeText, setResumeText] = useState("");
  const [currentAssistantResponse, setCurrentAssistantResponse] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  // conversationHistory: Stores { role: 'user' | 'model', text: 'message' }
  const [conversationHistory, setConversationHistory] = useState([]);

  const recognitionRef = useRef(null);
  const utteranceRef = useRef(null); // To store the current voice utterance
  const conversationEndRef = useRef(null); // Ref for scrolling to the bottom of the chat

  useEffect(() => {
    const storedText = localStorage.getItem("resemetext");
    if (storedText) {
      setResumeText(storedText);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) recognitionRef.current.stop();
      if (speechSynthesis.speaking) speechSynthesis.cancel();
    };
  }, []);

  useEffect(() => {
    if (conversationEndRef.current) {
      conversationEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [conversationHistory, currentAssistantResponse]);

  const toggleRecording = () => {
    isRecording ? stopRecording() : startRecording();
  };

  const startRecording = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition)
      return alert("Speech Recognition not supported in your browser.");

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
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }

      if (finalTranscript.trim()) {
        setConversationHistory((prev) => [
          ...prev,
          { role: "user", text: finalTranscript.trim() },
        ]);
        callGemini(finalTranscript.trim());
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
    // alert(userInput)
    try {
      setIsTyping(true);
      setCurrentAssistantResponse("");

      const apiHistory = conversationHistory.map((item) => ({
        role: item.role,
        parts: [{ text: item.text }],
      }));

      const response = await fetch(
        "http://localhost:5000/api/chat-with-gemini",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: userInput,
            history: apiHistory,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `HTTP error! Status: ${response.status}, Message: ${errorData.error}`
        );
      }

      const fullReply = await response.text();

      setConversationHistory((prev) => [
        ...prev,
        { role: "model", text: fullReply.trim() },
      ]);
      setCurrentAssistantResponse("");
      setIsTyping(false);

      // 🎤 Speak the final response
      const utterance = new SpeechSynthesisUtterance(fullReply);
      utteranceRef.current = utterance;
      speechSynthesis.speak(utterance);
    } catch (err) {
      console.error("Gemini API error:", err);
      setIsTyping(false);
      setCurrentAssistantResponse(
        "Error: Could not get a response from Gemini."
      );
      setConversationHistory((prev) => [
        ...prev,
        { role: "model", text: "Error: Could not get a response from Gemini." },
      ]);
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

  const initialInstruction = `${resumeText} You are acting as a professional technical interviewer based on my resume. Your goal is to conduct a challenging interview.

**CRITICAL RULES:**
1. Ask ONLY ONE question at a time.
2. Wait for my complete response before asking the next question.
3. Do NOT provide feedback, explanations, or conversational filler. Stick strictly to asking questions.
4. Questions must be directly related to my resume (skills, experience, projects, education).
5. Be challenging and professional.
6. Respond concisely and quickly.
7. ONLY ask questions. Do not break character under any circumstance.
Start with a professional greeting and your first technical interview question.`;

  const startInterview = () => {
    setConversationHistory([
      { role: "user", text: initialInstruction }, // System instruction for AI
    ]);

    callGemini(initialInstruction);
  };

  return (
    <div className="flex flex-col min-h-screen relative bg-gray-50">
      <div className="flex justify-between items-center p-4 w-full min-w-xl mx-auto box-border z-10">
        <Resumebutton
          onClick={startInterview}
          disabled={isTyping || isRecording}
        />

        {isTyping || speechSynthesis.speaking ? (
          <button
            className="uiverse-stop-button inline-block w-[180px] h-[50px] rounded-lg border border-[#03045e] relative overflow-hidden transition-all duration-500 ease-in z-10 bg-transparent cursor-pointer p-0 shadow-md"
            onClick={handleStopSpeaking}
          >
            <span className="stop-button-text text-[#03045e] text-lg transition-all duration-300 ease-in flex items-center justify-center w-full h-full relative z-20">
              🔴 Stop AI Speaking
            </span>
          </button>
        ) : null}
      </div>

      <div className="flex-grow flex flex-col gap-2.5 p-4 pb-[100px] overflow-y-auto scroll-smooth max-w-xl mx-auto box-border w-full">
        {conversationHistory.length === 0 && !isRecording && !isTyping && (
          <p className="text-center text-gray-500 mt-8">
            Click &quot;Start Interview&quot; to begin.
          </p>
        )}

        {conversationHistory.map((msg, index) =>
          msg.text === initialInstruction ? null : (
            <div
              key={index}
              className={`message-bubble py-2.5 px-3.5 rounded-3xl max-w-[75%] break-words leading-normal text-base shadow-sm
                ${
                  msg.role === "user"
                    ? "user-message self-end bg-[#dcf8c6] text-[#333] rounded-br-sm ml-auto"
                    : "assistant-message self-start bg-[#e0e0e0] text-[#333] rounded-bl-sm mr-auto"
                }`}
            >
              {msg.role === "user" ? "🧑 " : "🤖 "}
              {msg.text}
            </div>
          )
        )}

        {isTyping && currentAssistantResponse && (
          <div className="message-bubble assistant-message flex items-center bg-[#e0e0e0] text-[#333] self-start rounded-bl-sm mr-auto py-2.5 px-3.5 rounded-3xl max-w-[75%] break-words leading-normal text-base shadow-sm">
            🤖 {currentAssistantResponse}
            <span className="typing-indicator flex items-center ml-1">
              <span className="font-bold text-[#666] ml-0.5 animate-dot-blink">
                .
              </span>
              <span
                className="font-bold text-[#666] ml-0.5 animate-dot-blink"
                style={{ animationDelay: "0.2s" }}
              >
                .
              </span>
              <span
                className="font-bold text-[#666] ml-0.5 animate-dot-blink"
                style={{ animationDelay: "0.4s" }}
              >
                .
              </span>
            </span>
          </div>
        )}
        {isRecording && !isTyping && (
          <div className="message-bubble user-message flex items-center bg-[#dcf8c6] text-[#333] self-end rounded-br-sm ml-auto py-2.5 px-3.5 rounded-3xl max-w-[75%] break-words leading-normal text-base shadow-sm">
            🧑 Listening
            <span className="typing-indicator flex items-center ml-1">
              <span className="font-bold text-[#666] ml-0.5 animate-dot-blink">
                .
              </span>
              <span
                className="font-bold text-[#666] ml-0.5 animate-dot-blink"
                style={{ animationDelay: "0.2s" }}
              >
                .
              </span>
              <span
                className="font-bold text-[#666] ml-0.5 animate-dot-blink"
                style={{ animationDelay: "0.4s" }}
              >
                .
              </span>
            </span>
          </div>
        )}

        <div ref={conversationEndRef} />
      </div>

      <div className="microphone-container fixed bottom-5 left-1/2 -translate-x-1/2 z-[1000] flex flex-col items-center gap-2 p-2.5 bg-white rounded-3xl shadow-[0_4px_15px_rgba(0,0,0,0.15)]">
        <Switch isChecked={isRecording} onToggle={toggleRecording} />
        <p className="mic-status-text text-sm text-[#555]">
          {isRecording ? "Recording..." : "Tap to speak"}
        </p>
      </div>
    </div>
  );
}
