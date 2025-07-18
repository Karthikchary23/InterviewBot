// backend/routes/ollamaRoute.js (or wherever you keep routes)

import express from "express";
import { Router } from "express";
const router = Router();
router.post("/chat-with-ollama", async (req, res) => {
  const { prompt } = req.body;
  console.log("Received prompt:", prompt);

  try {
    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "mistral",   // or your preferred model
        prompt,
        stream: false,     // keep false for now
      }),
    });

    const data = await response.json();
    console.log(data)
    res.json({ response: data.response });
  } catch (err) {
    console.error("Ollama API error:", err);
    res.status(500).json({ error: "Failed to contact Ollama" });
  }
});

export default router;
