require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const CostEstimate = require("./models/costestimate");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose
  .connect("mongodb://localhost:27017/construction-cost-estimator")
  .then(() => console.log(" MongoDB connected"))
  .catch((err) => console.error(" MongoDB error:", err));

app.post("/api/cost-estimates", async (req, res) => {
  try {
    console.log("🔥 POST HIT:", req.body);

    const costEstimate = new CostEstimate(req.body);
    await costEstimate.save();

    console.log(" SAVED TO DB");

    res.status(201).json(costEstimate);
  } catch (error) {
    console.error("❌ SAVE ERROR:", error.message);
    res.status(400).json({ message: error.message });
  }
});

app.get("/api/cost-estimates", async (req, res) => {
  try {
    const data = await CostEstimate.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (error) {
    console.error("FETCH ERROR:", error);
    res.status(500).json({ message: error.message });
  }
});

app.put("/api/cost-estimates/:id", async (req, res) => {
  try {
    const updated = await CostEstimate.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Not found" });
    }

    res.json(updated);
  } catch (error) {
    console.error("UPDATE ERROR:", error);
    res.status(500).json({ message: error.message });
  }
});

app.post("/api/ai-suggestions", async (req, res) => {
  try {
    const {
      message = "",
      area = "unknown",
      bedrooms = "unknown",
      washrooms = "unknown",
      quality = "standard",
      location = "India",
      totalCost = "unknown",
    } = req.body;

    let prompt = "";

    if (message && message.trim() !== "") {
      prompt = `
You are a smart AI assistant.

Answer clearly and relevantly.

PROJECT:
Area: ${area}
Bedrooms: ${bedrooms}
Washrooms: ${washrooms}
Quality: ${quality}
Location: ${location}
Budget: ₹${totalCost}

Question:
${message}
`;
    } else {
      prompt = `
You are a house contractor in India.

Give 5 short cost-saving tips.

Area: ${area}
Bedrooms: ${bedrooms}
Washrooms: ${washrooms}
Quality: ${quality}
Budget: ₹${totalCost}
`;
    }

    const ollamaRes = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "phi3",
        prompt: prompt,
        stream: false,
      }),
    });

    const data = await ollamaRes.json();

    let aiText = data?.response?.trim();

    if (!aiText) {
      aiText = `
• Reduce area
• Use local materials
• Avoid luxury finishes
• Optimize layout
• Compare labour
      `;
    }

    res.json({ suggestion: aiText });

  } catch (error) {
    res.json({
      suggestion: `
• Reduce area  
• Use local materials  
• Avoid luxury finishes  
• Optimize structure  
• Compare labour
      `,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});