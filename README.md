# 📚 AI Study Assistant

An AI-powered student productivity platform that transforms raw study materials into intelligent learning tools. Upload PDFs, notes, or textbooks and get instant summaries, simplified explanations, and AI-generated quizzes.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB?logo=react)
![Node](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-339933?logo=node.js)
![Supabase](https://img.shields.io/badge/Database-Supabase-3ECF8E?logo=supabase)
![AI](https://img.shields.io/badge/AI-Grok%20(xAI)-black?logo=x)

---

## 🧠 Core Features

- **📄 Smart Summaries**: Automatically convert long PDFs and documents into concise, actionable bullet points.
- **🔍 In-depth Explanations**: Comprehensive breakdowns of complex topics into easy-to-understand study notes.
- **❓ AI Quiz Generator**: Dynamically creates multiple-choice quizzes from your study material to reinforce learning.
- **💬 Interactive AI Chat**: A split-screen chat interface that allows you to ask questions directly to your documents with full context.
- **📊 Real-time Analytics**: Track your study hours, document mastery, and daily streaks through a personalized dashboard.
- **💾 Cloud Persistence**: Securely save and organize your study materials in a cloud-backed library powered by Supabase.

---

## 💻 Tech Stack

### Frontend
- **React 18** + **Vite** (Modern, fast UI development)
- **Tailwind CSS** (Premium styling and responsive layouts)
- **Lucide React** (Consistent, high-quality iconography)
- **Framer Motion** (Smooth transitions and interactive animations)
- **Supabase JS** (Direct database & authentication integration)

### Backend
- **Node.js** + **Express.js** (Robust API architecture)
- **Multer** (Efficient multi-format file handling)
- **PDF-Parse** (Advanced text extraction from study materials)
- **Grok API (xAI)** (State-of-the-art LLM for intelligent summaries and quizzes)

### Database & Security
- **Supabase (PostgreSQL)** (Relational data storage with Row-Level Security)
- **Supabase Auth** (Secure email-based user authentication)
- **Supabase Storage** (Safe storage for uploaded study documents)

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