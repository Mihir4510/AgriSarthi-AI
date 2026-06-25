# AgriSathi AI - Agentic Farming Decision Assistant

AgriSathi AI is a state-of-the-art **Agentic Farming Decision Assistant** built to empower farmers and agricultural coordinators with real-time, highly localized, and context-specific agricultural decisions. By integrating advanced generative models with specialized local intelligence, AgriSathi AI helps optimize crop yields, detect plant diseases, analyze market trends, track weather changes, and match farmers to relevant government schemes.

---

## 🌟 Key Features & Agentic Modules

AgriSathi AI acts as an ensemble of specialized agricultural agents, coordinated through an intelligent backend orchestrator:

1. **🌱 Farm Planner Agent** (`/api/farm-plan`)
   - Generates a customized, comprehensive **10-week farming action plan** based on location, acreage, soil type, budget, water level, season, and farming goals.
   - Provides expected yields, cashflow estimates (seeds, fertilizers, irrigation, labor costs, estimated revenue, and profit margins), and risk mitigation lists.

2. **🍂 Crop Advisor Agent** (`/api/crop-advisor`)
   - Evaluates environmental conditions to recommend the **top 3 optimal crops** for a given district, state, soil type, and season.
   - Ranks suitability, yield potential, water demands, and profit outlooks.

3. **🔍 Disease Detection Agent** (`/api/disease-detect`)
   - Diagnoses leaf diseases (such as *Common Leaf Rust* or *Early Blight*) from plant photographs or files.
   - Outputs confidence scores, detailed symptoms, step-by-step treatment plans (featuring both chemical dosages and organic alternatives), and prevention advice.

4. **🌧️ Weather Intelligence Agent** (`/api/weather`)
   - Generates location-based forecasts and translates them into **actionable agricultural directives** (e.g., *"Heavy rain expected; postpone urea application and clear field drainage"* instead of just *"Rain forecast"*).

5. **📈 Market Intelligence Agent** (`/api/market`)
   - Tracks crop mandi price trends with a 6-month historical overview.
   - Displays real-time price comparisons across regional mandis and generates data-driven advice on how much harvest to sell immediately versus storage guidelines.

6. **🏛️ Government Schemes Agent** (`/api/schemes`)
   - Matches a farmer's demographic profile (state, land size, category) to relevant Indian agricultural welfare schemes (like PM-KISAN, PMFBY, and micro-irrigation subsidies).
   - Details required documents and provides step-by-step registration instructions.

7. **🎙️ Bilingual Voice Assistant**
   - Incorporates a speech-enabled interface supporting both **Hindi (हिन्दी)** and **English**.
   - Enables hands-free operation in the field by taking spoken queries (e.g., *"मेरे पास २ एकड़ जमीन है, क्या लगाएं?"* or *"What is the rate of Soybean?"*), fetching API decisions, and reading responses back audibly.

---

## 🛠️ Architecture: Fail-safe Dual-Execution

AgriSathi AI is built to operate reliably in low-connectivity, remote rural environments:

```
                  ┌───────────────────────────────┐
                  │        User Request           │
                  └───────────────┬───────────────┘
                                  │
                                  ▼
                  ┌───────────────────────────────┐
                  │      Server Orchestrator      │
                  └───────────────┬───────────────┘
                                  │
                  ┌───────────────┴───────────────┐
                  │   Is Gemini API Key Configed? │
                  └───────┬───────────────┬───────┘
                          │ Yes           │ No / Fails
                          ▼               ▼
                  ┌───────────────┐┌───────────────┐
                  │   Gemini AI   ││  Local Rule   │
                  │  (1.5-Flash)  ││    Engine     │
                  └───────────────┘└───────────────┘
                          │               │
                          └───────┬───────┘
                                  ▼
                  ┌───────────────────────────────┐
                  │       Mongoose MongoDB        │
                  │   (Memory Fallback if Down)   │
                  └───────────────────────────────┘
```

* **AI Mode**: Integrates with Google's `gemini-1.5-flash` model for dynamic reasoning, adaptive plans, and semantic processing.
* **Local Rule Engine Mode**: A deterministic, rule-based expert agricultural system that takes over automatically if no API key is set or network requests fail.
* **Database Fail-safe**: Connected to MongoDB for historical plan logging and logging diagnostics. If MongoDB is unavailable, the backend automatically falls back to an in-memory storage system without crashing.

---

## 💻 Tech Stack

### Frontend (Client)
* **Framework**: React.js (via Vite)
* **Styling**: Tailwind CSS
* **Icons**: Lucide React
* **Network Client**: Axios
* **Voice**: HTML5 Web Speech API (SpeechRecognition & SpeechSynthesis)

### Backend (Server)
* **Runtime**: Node.js & Express
* **AI SDK**: `@google/generative-ai` (Gemini API)
* **Database**: MongoDB & Mongoose
* **Environment Management**: dotenv
* **Process Monitor**: Nodemon (Development)

---

## 🚀 Getting Started

### Prerequisites
* **Node.js** (v18 or higher recommended)
* **MongoDB** (optional; the app falls back to in-memory mode if MongoDB is not running)

### Installation

Clone the repository and run the setup script in the root directory:

```bash
# Clone the repository
git clone https://github.com/Mihir4510/AgriSarthi-AI.git
cd AgriSarthi-AI

# Install dependencies for both client and server automatically
npm run install-all
```

### Environment Setup

Create a `.env` file in the `/server` directory to customize configurations:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/agrisathi
GEMINI_API_KEY=your_gemini_api_key_here
```
*(Note: If you do not supply a `GEMINI_API_KEY` on the server, the app will run in **Demo System** mode utilizing the local Expert Rule Engine. You can also supply a Gemini API Key directly through the **System Settings** panel in the frontend UI.)*

### Running the Application

In the root directory, start both the client and server concurrently:

```bash
npm run dev
```

* The **Frontend** will be available at: [http://localhost:5173](http://localhost:5173)
* The **Backend API** will run at: [http://localhost:5000](http://localhost:5000)

---

## 📁 Directory Structure

```
AgriSarthi-AI/
├── client/                     # React Frontend
│   ├── src/
│   │   ├── components/         # Agent Panels (Weather, Planner, Schemes, Voice, etc.)
│   │   ├── App.jsx             # Main Sidebar Layout & Navigation
│   │   ├── index.css           # Styling
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── server/                     # Express Backend
│   ├── src/
│   │   ├── config/             # DB & API Connections
│   │   ├── models/             # Mongoose Schemas & Fallbacks
│   │   ├── routes/             # Express API Endpoints
│   │   ├── services/           # Gemini Orchestrator & Expert Rule Engine
│   │   └── index.js            # App Entrypoint
│   ├── .env                    # Server Config
│   └── package.json
│
├── package.json                # Root Concurrently Orchestrator
└── README.md                   # Project Documentation
```

---

## 🤝 Contributing

Contributions are welcome! If you have suggestions or would like to add additional expert agricultural rules, please open an issue or submit a pull request.

## 📄 License

This project is licensed under the MIT License.
