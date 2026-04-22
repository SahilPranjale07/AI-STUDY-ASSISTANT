# 📚 AI Study Assistant

An AI-powered student productivity platform that transforms raw study materials into intelligent learning tools. Upload PDFs, notes, or textbooks and get instant summaries, simplified explanations, and AI-generated quizzes.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB?logo=react)
![Node](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-339933?logo=node.js)
![Supabase](https://img.shields.io/badge/Database-Supabase-3ECF8E?logo=supabase)
![AI](https://img.shields.io/badge/AI-Grok%20(xAI)-black?logo=x)

---

## 🧠 Core Features

- **📄 Smart Summaries**: Automatically convert long PDFs into concise, actionable bullet points.
- **🧒 Explain Like I'm 10**: Simplifies complex academic jargon into beginner-friendly analogies.
- **❓ AI Quiz Generator**: Create custom multiple-choice quizzes from your study material to test your knowledge.
- **💬 AI Doubt Chat**: Ask questions directly to your uploaded documents for instant clarification.
- **📊 Personalized Dashboard**: Track your study time, daily streaks, and learning progress in real-time.
- **📚 Saved Notes Library**: Organize and revisit all your AI-processed notes anytime.

---

## 💻 Tech Stack

### Frontend
- **React 18** + **Vite** (for blazing fast UI)
- **Tailwind CSS** (for modern, premium aesthetics)
- **Lucide React** (for beautiful iconography)
- **Framer Motion** (for smooth animations)
- **Supabase Auth** (for secure user management)

### Backend
- **Node.js** + **Express.js**
- **Multer** (for file handling)
- **PDF-Parse** (for text extraction from documents)
- **Grok API (xAI)** (for advanced LLM processing)

### Database & Storage
- **Supabase** (PostgreSQL database + Storage buckets for notes)

---

## 🎨 Design Excellence
The UI was meticulously designed in **Figma** with a focus on modern, dark-themed aesthetics, glassmorphism, and high interaction responsiveness to provide a premium user experience.

---

## 🚀 Getting Started

### Prerequisites
- Node.js installed
- Supabase account
- Grok (xAI) API Key

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/SahilPranjale07/AI-STUDY-ASSISTANT.git
   cd AI-STUDY-ASSISTANT
   ```

2. **Frontend Setup:**
   ```bash
   npm install
   ```
   Create a `.env` in the root:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. **Backend Setup:**
   ```bash
   cd server
   npm install
   ```
   Create a `.env` in the `server` folder:
   ```env
   GROK_API_KEY=your_xai_api_key
   SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role
   PORT=5000
   ```

### Running the Project

1. **Start Backend Server:**
   ```bash
   cd server
   node index.js
   ```

2. **Start Frontend:**
   ```bash
   cd ..
   npm run dev
   ```

---

## 📂 Project Structure

```bash
AI-STUDY-ASSISTANT/
├── src/                # Frontend React code
│   ├── app/            # Main screens and logic
│   ├── components/     # Reusable UI components
│   └── lib/            # Supabase client config
├── server/             # Node.js backend
│   ├── uploads/        # Temporary file storage
│   └── index.js        # Main API logic
├── public/             # Static assets
└── .env                # Global configuration
```

---

## 🌐 Deployment

- **Frontend**: Recommended deployment on **Vercel**.
- **Backend**: Recommended deployment on **Render** or **Railway**.
- **Database**: Hosted on **Supabase**.

---

## 🤝 Contributing
Feel free to fork this project, open issues, or submit PRs to help improve the learning experience for students worldwide!

---

## 📄 License
This project is licensed under the MIT License.