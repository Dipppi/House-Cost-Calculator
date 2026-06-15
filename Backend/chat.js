import express from "express";
import axios from "axios";

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const {
            message = "",
            area,
            bedrooms,
            washrooms,
            quality,
            location,
            totalCost
        } = req.body;

        if (!message || message.trim() === "") {
            return res.status(400).json({ reply: "Message is required" });
        }

        const prompt = `
You are a smart and helpful AI assistant.

Your job:
- Answer the user's question clearly
- Be relevant and accurate
- Do NOT give random construction tips
- If question is unrelated, answer normally

OPTIONAL CONTEXT (use only if relevant):
Area: ${area || "N/A"}
Bedrooms: ${bedrooms || "N/A"}
Washrooms: ${washrooms || "N/A"}
Quality: ${quality || "N/A"}
Location: ${location || "N/A"}
Budget: ₹${totalCost || "N/A"}

User question:
${message}
`;

        const response = await axios.post("http://localhost:11434/api/generate", {
            model: "phi3",
            prompt: prompt,
            stream: false
        });

        const reply = response?.data?.response?.trim();

        res.json({
            reply: reply || "No response from AI"
        });

    } catch (error) {
        console.error("❌ Ollama error:", error.message);

        res.status(500).json({
            reply: "AI not working"
        });
    }
});

export default router;