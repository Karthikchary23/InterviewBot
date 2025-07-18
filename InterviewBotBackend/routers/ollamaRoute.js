import express from "express";
import { Router } from "express";
const router = Router();


const GEMINI_API_KEY = process.env.GEMINI_API_KEY; 
console.log(GEMINI_API_KEY)

router.post("/chat-with-gemini", async (req, res) => {
  const { prompt, history } = req.body; 
  console.log("Received prompt for Gemini:", prompt);
  console.log("Current conversation history length:", history.length);

  const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

  try {
   
    const payload = {
     
      contents: [
        ...history,
        ...(prompt ? [{ role: "user", parts: [{ text: prompt }] }] : []),
      ],
      generationConfig: {
        temperature: 0.8, 
        maxOutputTokens: 500, 
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE",
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_MEDIUM_AND_ABOVE",
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE",
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE",
        },
      ],
    };

    // Make the request to the Gemini API
    const response = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Gemini API returned an error:", result);
      return res.status(response.status).json({
        error: result.error?.message || `Gemini API error with status ${response.status}`,
        details: result,
      });
    }

    if (
      result.candidates &&
      result.candidates.length > 0 &&
      result.candidates[0].content &&
      result.candidates[0].content.parts &&
      result.candidates[0].content.parts.length > 0
    ) {
      const generatedText = result.candidates[0].content.parts[0].text;
      res.status(200).send(generatedText); 
    } else {
      console.error("Unexpected Gemini API response structure or blocked content:", result);
      res.status(500).json({
        error: "Failed to get a valid response from Gemini. It might have been blocked or empty.",
        details: result,
      });
    }
  } catch (err) {
    console.error("Error contacting Gemini API:", err);
    res.status(500).json({ error: "Failed to contact Gemini API", details: err.message });
  }
});

export default router;