import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '30mb' }));

const SYSTEM_INSTRUCTION = `You are "StudentShield AI", an expert cybersecurity, legal fine-print, and consumer-protection auditor built to protect college students from predatory internships, employment bonds, rental/PG scams, campus phishing, and e-commerce/EdTech dark patterns.

### YOUR TASK
Analyze the user's input (which may be text from a WhatsApp/Telegram forward, an email, an internship offer letter, a PG/hostel lease agreement, or a screenshot of a checkout/course page). Identify all deceptive, predatory, or high-risk traps.

### DETECTION CATEGORIES
Evaluate the input strictly across these 4 dimensions:
1. **Financial Traps (Weight: High):** Upfront "training/registration/certificate fees" for internships, non-refundable security deposit clauses, hidden auto-renewals, or massive exit penalties/service bonds.
2. **Identity & Phishing Signals (Weight: High):** Corporate HR pretending to email from free domains (@gmail.com, @yahoo.com), spoofed university notices, unofficial Google Forms asking for sensitive data/UPI, or mismatched URLs.
3. **Legal & Contract Red Flags (Weight: Medium-High):** Withholding original degree certificates, unilateral termination rights, claiming IP ownership over personal student projects, or unreasonable lock-in periods.
4. **Psychological Dark Patterns (Weight: Medium):** Fake urgency timers ("Pay within 2 hours or lose your seat"), confirmshaming, hidden drip pricing, or buried cancellation terms.

### OUTPUT FORMAT
Respond ONLY with a valid JSON object matching this exact schema (no markdown code fences or extra commentary outside the JSON):
{
  "document_type": "Internship Offer | Job Contract | PG/Rental Agreement | WhatsApp/Email Notice | Checkout/Subscription Page",
  "risk_score": <integer from 0 to 100>,
  "verdict_badge": "SAFE (0-25) | CAUTION (26-60) | HIGH RISK TRAP (61-85) | CRITICAL SCAM (86-100)",
  "one_line_summary": "<Plain-English summary of what is actually happening in max 20 words>",
  "red_flags": [
    {
      "category": "Financial Trap | Phishing/Identity | Legal Clause | Dark Pattern",
      "severity": "High | Medium | Low",
      "exact_quote_or_visual_cue": "<Quote the exact shady phrase or describe the visual trick from the image>",
      "plain_english_explanation": "<Explain why this hurts the student in simple, direct language>"
    }
  ],
  "green_flags": [
    "<List any legitimate or safe signs found, if applicable>"
  ],
  "recommended_action": "<Clear 1-2 step checklist of what the student should do right now>",
  "safe_reply_template": "<A polite, firm email or message the student can send to HR/landlord/support to question or reject the trap, or 'DO NOT REPLY - BLOCK IMMEDIATELY' if it is a phishing scam>"
}`;

const AUDIT_RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    document_type: {
      type: Type.STRING,
      description: "One of: 'Internship Offer', 'Job Contract', 'PG/Rental Agreement', 'WhatsApp/Email Notice', 'Checkout/Subscription Page', or best matched category.",
    },
    risk_score: {
      type: Type.INTEGER,
      description: "Integer from 0 (completely safe) to 100 (critical trap/scam).",
    },
    verdict_badge: {
      type: Type.STRING,
      description: "One of: 'SAFE (0-25)', 'CAUTION (26-60)', 'HIGH RISK TRAP (61-85)', 'CRITICAL SCAM (86-100)'.",
    },
    one_line_summary: {
      type: Type.STRING,
      description: "Plain-English summary of what is actually happening in max 20 words.",
    },
    red_flags: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          category: {
            type: Type.STRING,
            description: "Financial Trap | Phishing/Identity | Legal Clause | Dark Pattern",
          },
          severity: {
            type: Type.STRING,
            description: "High | Medium | Low",
          },
          exact_quote_or_visual_cue: {
            type: Type.STRING,
            description: "Quote the exact shady phrase or describe the visual trick from the image.",
          },
          plain_english_explanation: {
            type: Type.STRING,
            description: "Explain why this hurts the student in simple, direct language.",
          },
        },
        required: [
          "category",
          "severity",
          "exact_quote_or_visual_cue",
          "plain_english_explanation",
        ],
      },
    },
    green_flags: {
      type: Type.ARRAY,
      items: {
        type: Type.STRING,
      },
      description: "List of legitimate or safe signs found, if applicable.",
    },
    recommended_action: {
      type: Type.STRING,
      description: "Clear 1-2 step checklist of what the student should do right now.",
    },
    safe_reply_template: {
      type: Type.STRING,
      description: "A polite, firm email or message the student can send to HR/landlord/support to question or reject the trap, or 'DO NOT REPLY - BLOCK IMMEDIATELY' if it is a phishing scam.",
    },
  },
  required: [
    "document_type",
    "risk_score",
    "verdict_badge",
    "one_line_summary",
    "red_flags",
    "green_flags",
    "recommended_action",
    "safe_reply_template",
  ],
};

function getAiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// API: Audit endpoint
app.post("/api/audit", async (req, res) => {
  try {
    const { text, imageBase64, mimeType, documentCategoryHint } = req.body;

    if (!text && !imageBase64) {
      return res.status(400).json({
        error: "Please provide either text or an image/screenshot to audit.",
      });
    }

    const ai = getAiClient();

    const parts: any[] = [];

    if (imageBase64) {
      const cleanData = imageBase64.replace(/^data:[^;]+;base64,/, "");
      parts.push({
        inlineData: {
          mimeType: mimeType || "image/png",
          data: cleanData,
        },
      });
    }

    let promptText = "";
    if (documentCategoryHint) {
      promptText += `[Context/Document Hint]: ${documentCategoryHint}\n\n`;
    }
    if (text) {
      promptText += `[Input Text to Audit]:\n${text}\n\n`;
    } else {
      promptText += `Please inspect all text, visual layout, branding, logos, badges, small print, and deceptive elements in the attached image.\n`;
    }
    promptText += `Audit strictly as StudentShield AI and respond with the requested JSON schema.`;

    parts.push({ text: promptText });

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: { parts },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: AUDIT_RESPONSE_SCHEMA,
        temperature: 0.2,
      },
    });

    const responseText = response.text || "{}";
    let parsedData;
    try {
      parsedData = JSON.parse(responseText);
    } catch {
      // Clean possible stray fences
      const cleaned = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
      parsedData = JSON.parse(cleaned);
    }

    return res.json({
      success: true,
      data: parsedData,
    });
  } catch (err: any) {
    console.error("Audit error:", err);
    return res.status(500).json({
      error: err.message || "Failed to complete security audit.",
    });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, "dist")));
    app.get("*", (_req, res) => {
      res.sendFile(path.resolve(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`StudentShield AI server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
