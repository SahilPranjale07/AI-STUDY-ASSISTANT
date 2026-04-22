// Production Ready AI Study Assistant Backend
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const pdf = require('pdf-parse');
const axios = require('axios');
const mammoth = require('mammoth');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Supabase Setup
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Multer for file uploads
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 } // 20MB limit
});

// Helper: Extract text from various formats
async function extractText(file) {
  const mimeType = file.mimetype;
  
  if (mimeType === 'application/pdf') {
    const data = await pdf(file.buffer);
    return data.text;
  } 
  
  if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    const result = await mammoth.extractRawText({ buffer: file.buffer });
    return result.value;
  }
  
  if (mimeType === 'text/plain') {
    return file.buffer.toString('utf-8');
  }
  
  throw new Error('Unsupported file format. Please upload PDF, DOCX, or TXT.');
}

// Routes
app.get('/', (req, res) => {
  res.json({ message: "AI Study Assistant Backend is Online 🚀" });
});

app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    const { user_id } = req.body;
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    console.log(`Processing file: ${req.file.originalname} for user: ${user_id}`);

    // 1. Extract Text
    let extractedText = "";
    try {
      extractedText = await extractText(req.file);
    } catch (err) {
      return res.status(422).json({ error: err.message });
    }

    if (!extractedText || extractedText.trim().length < 50) {
      return res.status(422).json({ 
        error: "No readable text found. This PDF might be a scanned image or empty." 
      });
    }

    // 2. Prepare for AI (Token management)
    const contentToAnalyze = extractedText.substring(0, 30000);
    const apiKey = process.env.GROK_API_KEY || process.env.GROQ_API_KEY;

    // 3. Call Groq AI
    const aiResponse = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: `You are an elite AI Study Tutor, expert educator, and structured learning assistant.
Your mission is to transform any raw study material into highly valuable, deeply detailed, and exam-ready learning resources.
You must provide a COMPREHENSIVE and DETAILED explanation. Avoid brief summaries; provide deep dives.

━━━━━━━━━━━━━━━━━━━━━━
🎯 CORE OBJECTIVES
━━━━━━━━━━━━━━━━━━━━━━
- Create extremely detailed study notes that cover every sub-topic in the source material.
- Provide a minimum of 8-10 sections for complex topics.
- Each section must have at least 5-7 detailed bullet points explaining the "how" and "why".
- Make explanations beginner-friendly but academically rigorous.

━━━━━━━━━━━━━━━━━━━━━━
🧠 EXPLANATION RULES
━━━━━━━━━━━━━━━━━━━━━━
1. DEEP DIVE: Don't just list facts; explain concepts in detail.
2. STRUCTURE: Use a logical flow from basics to advanced sub-topics.
3. READABILITY: Use clear headings and descriptive bullet points.
4. ENRICHMENT: Add definitions for technical terms and real-world examples.
5. EXAM FOCUS: Highlight what is most important for mastery.

━━━━━━━━━━━━━━━━━━━━━━
📘 explanationContent FORMAT
━━━━━━━━━━━━━━━━━━━━━━
Generate professional study notes that feel like a premium textbook or a world-class lecture.
Each section must contain:
- heading (descriptive and clear)
- points (at least 5-7 detailed explanations, sub-points, and context)
- keywords (technical terms used)
- example (a clear, practical example to illustrate the section)

━━━━━━━━━━━━━━━━━━━━━━
📝 KEY POINTS RULES
━━━━━━━━━━━━━━━━━━━━━━
Generate 10 powerful, high-impact revision takeaways.

━━━━━━━━━━━━━━━━━━━━━━
❓ QUIZ RULES
━━━━━━━━━━━━━━━━━━━━━━
Generate 10 high-quality MCQ questions with a mix of Easy, Medium, and Hard difficulty.

━━━━━━━━━━━━━━━━━━━━━━
⚠️ STRICT OUTPUT RULES
━━━━━━━━━━━━━━━━━━━━━━
- Return ONLY valid JSON.
- Ensure "explanationContent" is massive and detailed.
- No commentary or extra text.

━━━━━━━━━━━━━━━━━━━━━━
📦 STRICT JSON FORMAT
━━━━━━━━━━━━━━━━━━━━━━
{
  "explanationContent": {
    "title": "Comprehensive Topic Title",
    "difficulty": "Beginner / Intermediate / Advanced",
    "estimatedStudyTime": "20-30 min",
    "sections": [
      {
        "heading": "Detailed Section Name",
        "points": [
          "Deep dive explanation point 1 with context",
          "Deep dive explanation point 2 with technical details",
          "Deep dive explanation point 3 showing relationships between concepts",
          "Detailed sub-topic or process step",
          "Important note or common misconception addressed",
          "Advanced insight or exam-relevant detail"
        ],
        "keywords": ["key term 1", "key term 2"],
        "example": "A detailed real-world example explaining this specific section"
      }
    ]
  },
  "keyPoints": ["takeaway 1", "takeaway 2", "..."],
  "quiz": [
    {
      "question": "Q text?",
      "options": ["A", "B", "C", "D"],
      "answer": "A",
      "correctAnswer": 0,
      "explanation": "Detailed why A is correct"
    }
  ]
}`
          },
          {
            role: 'user',
            content: contentToAnalyze
          }
        ],
        response_format: { type: 'json_object' }
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const aiResult = JSON.parse(aiResponse.data.choices[0].message.content);

    // 4. Save to Supabase (Resilient Column Checks)
    // 4. Save to Supabase (Ultra-Resilient Insert)
    let saveError = null;
    let savedId = null;
    try {
      console.log("Saving to Supabase. Columns: user_id, title, summary, content");
      const { data: savedData, error } = await supabase
        .from('study_materials')
        .insert([{
          user_id,
          title: aiResult.explanationContent?.title || req.file.originalname,
          summary: JSON.stringify({
            explanation: aiResult.explanationContent,
            quiz: aiResult.quiz
          }),
          content: contentToAnalyze
        }])
        .select();
      
      saveError = error;
      if (savedData && savedData[0]) {
        savedId = savedData[0].id;
        console.log("✅ Save Success! ID:", savedId);
      } else {
        console.log("❌ Save Failed. Error:", error?.message || "Unknown Error");
      }
    } catch (e) {
      console.log("❌ Save Exception:", e.message);
      saveError = e;
    }

    // 5. Respond
    return res.json({
      ...aiResult,
      id: savedId,
      extracted_text: contentToAnalyze,
      db_saved: !saveError
    });

  } catch (error) {
    console.error('Server Error:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Failed to process notes', 
      details: error.message 
    });
  }
});

// --- CHAT ENDPOINT ---
app.post('/api/chat', async (req, res) => {
  const { material_id, message, fallback_context } = req.body;

  try {
    let context = fallback_context;
    let title = "Study Material";

    // 1. Try to fetch document context if ID is real
    if (material_id && material_id !== 'latest') {
      const { data } = await supabase
        .from('study_materials')
        .select('content, title')
        .eq('id', material_id)
        .single();

      if (data) {
        context = data.content;
        title = data.title;
      }
    }

    if (!context) {
      throw new Error('No study context available. Please try uploading again.');
    }

    // 2. Call Groq
    const apiKey = process.env.GROQ_API_KEY || process.env.GROK_API_KEY;
    const aiResponse = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: `You are an elite study assistant helping with notes titled: "${title}". 
            Your goal is to be CONCISE and HELPFUL. 
            - Keep answers short and direct.
            - Use bullet points for readability.
            - Use bold text for key terms.
            - Do not write long paragraphs unless specifically asked.
            
            Use the provided context to answer accurately.
            
            CONTEXT:
            ${context}`
          },
          { role: 'user', content: message }
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    res.json({ answer: aiResponse.data.choices[0].message.content });
  } catch (err) {
    console.error('Chat error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server is active on http://localhost:${PORT}`);
});
